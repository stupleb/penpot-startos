# Updating the upstream version

Upstream is Penpot's three official images on Docker Hub, `penpotapp/frontend`,
`penpotapp/backend` and `penpotapp/exporter`, all pinned by tag in
`startos/manifest/index.ts`. They are built from the same
[penpot/penpot](https://github.com/penpot/penpot) release and always move
together. The database (`postgres`) and cache (`valkey/valkey`) images are
pinned beside them and bumped on their own.

## Determining the upstream version

Penpot tags each release on GitHub and pushes the three images with the same
plain `X.Y.Z` tag:

```bash
gh release view -R penpot/penpot --json tagName -q .tagName
curl -s "https://hub.docker.com/v2/repositories/penpotapp/backend/tags?page_size=10&ordering=last_updated" \
  | jq -r '.results[].name'
```

Ignore `latest`, `main`, the `X.Y` aliases and `freeze-*`. Confirm all three
images carry both architectures:

```bash
for i in frontend backend exporter; do
  docker manifest inspect penpotapp/$i:X.Y.Z | jq -r '.manifests[].platform.architecture'
done
```

## Applying the bump

1. Read what changed for self-hosters before touching anything: the
   `Upgrade to …` sections of `docs/technical-guide/getting-started/docker.md`
   and the diff of `docker/images/docker-compose.yaml` between the two tags.
   A new required service or environment variable lands there first. The
   Admin Console (`penpotapp/admin-console`) is announced as becoming required
   in a future release; its source repository is private and the image
   declares no license, so a release that requires it needs a decision before
   it is packaged.
2. Check the interfaces the package depends on:
   - `docker/images/files/nginx-entrypoint.sh` still reads `PENPOT_BACKEND_URI`
     and `PENPOT_EXPORTER_URI`, and still writes `penpotPublicURI` only when
     `PENPOT_PUBLIC_URI` is set.
   - `backend/scripts/manage.py` still prints `Created: <email> / <id>`,
     `Updated` and `No profile found with email …`, which `startos/utils.ts`
     parses.
3. Set the three `images.*.source.dockerTag` values in
   `startos/manifest/index.ts` to `penpotapp/<name>:X.Y.Z`.
4. In `startos/versions/current.ts`, set `version` to `X.Y.Z:0` and rewrite
   the release notes, linking `https://github.com/penpot/penpot/releases/tag/X.Y.Z`.

Penpot migrates its own database when the backend starts. Its docs recommend
small steps between releases, so don't let the package fall many releases
behind.

## The database and cache images

A new `18.x` Postgres minor or `8.1.x` Valkey patch is a tag change only. A
new Postgres **major** is not: it changes the data directory
(`pgdataSubpath` in `startos/utils.ts`), and an existing install needs a
dump and restore in a migration. Don't raise it as part of a routine bump.
