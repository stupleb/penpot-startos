# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

## This repo

- Never give the `frontend` daemon `PENPOT_PUBLIC_URI`. Its entrypoint writes the value into `config.js`, the app then sends every API call to that one address, and on every other address StartOS serves those calls are cross-origin and fail.
- Keep `adminApplied`, `adminProfileId` and `adminEmail` out of `main`'s reactive `storeJson` read. The `admin-account` oneshot writes them with `main`'s effects, and FileHelper refuses a write that changes a value read with `.const()` in the same context, so the oneshot would fail on every start.
- `startos/utils.ts` parses `manage.py`'s output (`Created: <email> / <id>`, `Updated`, `No profile found…`). Check those strings in `backend/scripts/manage.py` when bumping Penpot.
