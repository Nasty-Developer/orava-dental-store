# Staged product photographs

Photographs that have been sourced and optimised but whose rights holder has not yet
said yes in writing. Nothing in here is served by the site: each product in this folder
is showing its illustration until permission arrives.

- `waldent/`: 27 photographs, sourced from Waldent's own product pages on 2026-11-22.
- Manifest with slug, source URL and licence note per photo: `docs/sourcing/pending/`.

When a brand replies with written permission:

```bash
node tools/photo-permissions.mjs --grant "Waldent" --ref "Email from <name>, <date>"
```

That moves the files back into `public/products/`, writes `permission: "granted"` with the
permission reference into the catalogue, and `npm run images:check` will then pass.

`npm run images:check` refuses any photograph without `permission: "granted"`, so an
unpermitted image cannot reach a deploy.
