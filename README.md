<p align="center">
  <img src="icon.png" alt="Penpot Logo" width="21%">
</p>

# Penpot on StartOS

> Everything not listed in this document should behave the same as upstream
> Penpot. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Penpot](https://github.com/penpot/penpot) is an open-source design and prototyping tool that runs in the browser. This package runs the whole Penpot stack on one server: the web frontend, the API backend, the exporter, and the PostgreSQL and Valkey services it needs.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Every image is used unmodified, for x86_64 and aarch64. Penpot's three images and PostgreSQL run their own entrypoints; Valkey runs `valkey-server` directly with persistence off. The five subcontainers share one network namespace and reach each other on `127.0.0.1`; only the frontend's port is exposed.

| Subcontainer | Image                | Role                                                                                                                                                                           |
| ------------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `frontend`   | `penpotapp/frontend` | nginx on port 8080: serves the web app, forwards `/api`, `/ws/notifications` and `/assets` to the backend and `/api/export` to the exporter, and proxies Google Fonts and Penpot's online templates |
| `backend`    | `penpotapp/backend`  | Penpot's API server on port 6060. Migrates the database on start, and runs Penpot's PREPL administration server on `localhost:6063`, which the package's account actions use          |
| `exporter`   | `penpotapp/exporter` | Headless Chromium on port 6061 that renders exports of layers and boards; it starts a browser when an export arrives and closes it again after ten idle seconds |
| `postgres`   | `postgres` (Alpine)  | The database, listening on `127.0.0.1` only                                                                                                                                     |
| `valkey`     | `valkey/valkey` (Alpine) | Cache and live-update messages, bound to `127.0.0.1`, nothing written to disk                                                                                              |

Two oneshots run before the daemons on every start: `pg-recover` removes a `postmaster.pid` left by an unclean stop, and `assets-owner` hands the uploads directory to the `penpot` user (uid 1001) that the backend and frontend run as. A third, `admin-account`, runs once the backend is ready; see [Installation and First-Run Flow](#installation-and-first-run-flow).

## Volume and Data Layout

Penpot's own data lives in two places: the database (teams, projects, files, comments, accounts) and the uploads directory (images, fonts, thumbnails and temporary export files).

| Volume    | Mounted at                                              | Contents                                                         |
| --------- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| `startos` | not mounted in any subcontainer                          | `store.json`, the package's own state                            |
| `assets`  | `/opt/data/assets` (`backend` read-write, `frontend` read-only) | Penpot's object storage (filesystem backend)                  |
| `db`      | `/var/lib/postgresql` (`postgres`)                      | The PostgreSQL cluster, in the image's default `PGDATA` beneath it |

## File Models

The package writes no Penpot configuration file. Penpot is configured entirely through environment variables that `main` derives from `store.json` on every start, so a change in `store.json` restarts Penpot with the new values.

`store.json` (JSON, `startos` volume):

| Key                                         | Set by                                                                            |
| ------------------------------------------- | --------------------------------------------------------------------------------- |
| `secretKey`, `postgresPassword`             | Generated once at install. Never changed: sessions and invitation tokens derive from the secret key |
| `primaryUrl`                                | Seeded at install with the interface's `.local` address; changed by Set Primary URL |
| `smtp`                                      | Configure SMTP                                                                    |
| `signups`                                   | Enable/Disable Signups                                                            |
| `adminPassword`                             | Set Admin Password                                                                |
| `adminApplied`, `adminProfileId`, `adminEmail` | The `admin-account` oneshot: a hash of the last applied admin password, the admin account's id, and its email when last applied |

Environment variables re-asserted on every start: `PENPOT_FLAGS` (signups, SMTP and email verification, the PREPL server), `PENPOT_PUBLIC_URI` (backend and exporter only), `PENPOT_SECRET_KEY`, the database and Redis connection settings, `PENPOT_OBJECTS_STORAGE_*`, `PENPOT_TELEMETRY_ENABLED=false`, and the `PENPOT_SMTP_*` settings when email is configured.

Everything set inside Penpot — accounts, teams, notification preferences, a password changed in the account settings — belongs to the user and is never re-asserted. The admin password in particular is applied only when Set Admin Password has produced a new one; a password the administrator changes inside Penpot stays.

## Dependencies

None.

## Network Access and Interfaces

One interface, `ui` (type `ui`), on port 8080 over HTTP, which StartOS serves with TLS. It carries the dashboard, the editor, view mode and share links, the API and the live-update websocket. The backend, exporter, PREPL server, PostgreSQL, Valkey and nginx's status page (port 8082) are not exposed.

The web app uses whichever address the browser is on, so it works at every address StartOS gives the interface. Share links and invitation links copied from the app carry the address you copied them on. Four things are built by the backend from the primary URL instead: export downloads, `.penpot` file downloads, font downloads, and links in emails. The downloads also need the login cookie of that address, so they only work while you use Penpot at the primary URL.

Outbound, the frontend fetches Google Fonts and Penpot's online libraries and templates when someone uses them. Telemetry is off.

## Installation and First-Run Flow

At install the package generates the secret key and database password, sets the primary URL to the `.local` address, and raises a critical task for Set Admin Password. Penpot cannot start until it has run.

On the first start the backend migrates the empty database, then the `admin-account` oneshot creates the administrator account `admin@penpot.local` through Penpot's own `manage.py`, using the stored password. The web interface waits for that step. Signups are off, so Penpot's login page offers only sign-in.

## Actions

**Set Admin Password** — run on first install (the critical task), or whenever the administrator password is lost. It writes a new random password to `store.json` and returns it with the admin account's email, read from the database while Penpot runs so a renamed account shows its current email. Penpot applies it on its next start: a stopped Penpot stays stopped, and a running Penpot restarts, which takes about a minute. The `admin-account` oneshot then sets the password on the account the package created, even if its email was changed inside Penpot, and recreates `admin@penpot.local` if that account was deleted. Each run replaces the previous password.

**Create or Reset Account** — run to give a collaborator or client a login, or to reset someone's forgotten password when email isn't set up. Penpot must be running. If an active account has the email, its password is replaced; otherwise a new account is created, already verified. It returns the email and a new random password and does not restart Penpot. Running it again for the same email issues another new password.

**Enable Signups / Disable Signups** — one toggle. Enabling lets anyone who can reach Penpot register from the login page; with email configured, new accounts must verify their address first. Disabling stops new registrations and leaves existing accounts alone. Either way Penpot restarts.

**Set Primary URL** — run when the downloads in [Network Access and Interfaces](#network-access-and-interfaces) should come from a different address, usually the one collaborators and clients reach. Penpot restarts.

**Configure SMTP** — off, StartOS's system SMTP, or a custom server. With email on, Penpot sends invitations, comment and mention notifications, password-recovery mail and signup verification. With it off, Penpot sends nothing and email verification is turned off. Penpot restarts.

## Tasks

**Set Admin Password** (critical) — raised when `store.json` holds no admin password, which on a normal install means only right after installation. Running the action clears it, and it does not come back.

**Set Primary URL** (important) — raised when the stored primary URL is no longer one of the interface's addresses, for example after a domain is removed. Penpot keeps running. It clears by itself when that address returns, or when the action picks a new one, and it can be raised again.

## Health Checks

Every check below tries three times, two seconds apart, before it reports a failure. StartOS stops everything that depends on a daemon the moment its check fails, so a single slow answer on a busy server would otherwise restart Penpot.

**Web Interface** — requests `/readyz` through nginx, which the backend answers after a query against the database. Success means the frontend, backend and database all work. Grace period two minutes. On the first start, or after an update, the backend's database migrations keep it starting for a while; if it never turns green, read the logs for the backend or the `admin-account` step.

**Exporter** — requests the exporter's `/readyz`. Grace period one minute. A failure breaks exports only; the web interface does not depend on it and keeps working.

Hidden checks gate the start order: `pg_isready` for PostgreSQL, `valkey-cli ping` for Valkey, and the backend's own `/readyz`.

## Backups and Restore

The database is dumped with `pg_dump` and replayed on restore; the files of the `db` volume are never copied. The `startos` and `assets` volumes are copied whole. On restore StartOS re-creates the cluster, replays the dump and sets the stored database password again, so a restored Penpot comes back with its accounts, files, comments, uploads, secret key and admin state. Nothing else is needed before use. Valkey holds nothing to keep.

## Limitations and Differences

1. Export downloads, `.penpot` file downloads, font downloads and email links use the primary URL, and the downloads only work while you are signed in at that address.
2. Commenting needs a Penpot account, even on a share link. With signups off, Penpot also refuses new accounts that arrive through an invitation link; use Create or Reset Account, or enable signups while people register.
3. Not included: Penpot's Admin Console (the Enterprise back office), its MCP server for AI tools, single sign-on (OIDC, LDAP, Google, GitHub, GitLab) and S3 object storage.
4. Telemetry is off.
5. Google Fonts and the online libraries and templates need the server to reach the internet.
6. The exporter waits at most ten seconds for its browser to start, and the first export after a pause has to start one. On a busy server that start can take longer, the export fails with an error, and exporting again works.

---

## Quick Reference for AI Consumers

```yaml
package_id: penpot
image: penpotapp/frontend, penpotapp/backend, penpotapp/exporter, postgres, valkey/valkey
architectures: [x86_64, aarch64]
subcontainers: [frontend, backend, exporter, postgres, valkey]
volumes:
  startos: (not mounted; store.json)
  assets: /opt/data/assets
  db: /var/lib/postgresql
file_models:
  - store.json
startos_managed_env_vars:
  - PENPOT_FLAGS
  - PENPOT_PUBLIC_URI
  - PENPOT_SECRET_KEY
  - PENPOT_DATABASE_URI
  - PENPOT_DATABASE_USERNAME
  - PENPOT_DATABASE_PASSWORD
  - PENPOT_REDIS_URI
  - PENPOT_OBJECTS_STORAGE_BACKEND
  - PENPOT_OBJECTS_STORAGE_FS_DIRECTORY
  - PENPOT_TELEMETRY_ENABLED
  - PENPOT_INTERNAL_URI
  - PENPOT_BACKEND_URI
  - PENPOT_EXPORTER_URI
  - PENPOT_SMTP_*
dependencies: none
interfaces:
  ui: { type: ui, port: 8080 }
actions:
  - set-admin-password
  - create-or-reset-account
  - toggle-signups
  - set-primary-url
  - manage-smtp
tasks:
  - { action: set-admin-password, severity: critical }
  - { action: set-primary-url, severity: important }
health_checks:
  - frontend
  - exporter
```
