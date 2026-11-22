# Real product photographs: progress

Last updated 2026-11-22.

| | Products |
|---|---|
| Catalogue total | 344 |
| Photograph live with written permission | **0** |
| Exact product photograph sourced, staged, awaiting permission | **342** |
| Illustration in use (temporary placeholder) | 2 |
| Incorrect or duplicate photographs | 0 |

342 of 344 now have their **exact** product photograph downloaded at 900 x 900 WebP
(8.5 MB total) in `staging/product-photos/listing/`, one file per slug, mapped in
`staging/listing-manifest.json`. Every one of the 23 clinical areas is covered.
They are staged, not published: the permission gate below still blocks them.

Full per-product detail: [PRODUCT-IMAGE-REGISTER.md](./PRODUCT-IMAGE-REGISTER.md) and
[PRODUCT-IMAGE-REGISTER.csv](./PRODUCT-IMAGE-REGISTER.csv). Permission requests:
[OUTREACH-MEDIA-KITS.md](./OUTREACH-MEDIA-KITS.md). Sourcing routes:
[IMAGE-SOURCING.md](./IMAGE-SOURCING.md).

## The rule now enforced in code

No manufacturer's copyrighted photograph is published without written permission.
That is not a note in a document, it is a gate:

- `ProductImage` carries `permission: "granted" | "pending"`.
- `npm run images:check` fails on any photograph that is not `permission: "granted"`, so an
  unpermitted image cannot reach a deploy.
- `tools/photo-permissions.mjs` withdraws unpermitted photographs to
  `staging/product-photos/<brand>/`, reports what is staged, and restores a brand once its
  written permission is on file:

  ```bash
  node tools/photo-permissions.mjs --grant "Waldent" --ref "Email from <name>, <date>"
  ```

## What changed on 2026-11-22

27 Waldent photographs were sourced from Waldent's own product pages and briefly published.
Tanvi then confirmed the rule: nothing copyrighted goes live without written permission. Those
27 are withdrawn to staging with their source pages and licence notes intact, and all 344
products are on their illustrations again.

They are not lost work. The matching, the optimised files and the per-product source records all
stand, and the six products whose brand listing did not match exactly were never included. One
written yes from Waldent's dealer team puts 27 photographs live with a single command.

## What is staged

| Brand | Staged | Source |
|---|---|---|
| Waldent | 27 of 33 listed | waldent.com product pages, one photograph per product, exact title match |

Six Waldent products were deliberately excluded because the brand's listing is a different
product:

| Product | Closest brand listing | Why excluded |
|---|---|---|
| New Dental Clinic Setup Kit | Dental Aspirating Syringe | a setup kit is not a syringe |
| Surgical Saw Handpiece - Reciprocating (DGZ-R) | "Surgical Handpiece" | generic listing, model cannot be confirmed |
| Dental X-Ray Film E-Speed (Pack Of 100) | "X-Ray Film IOPA (Pack Of 100)" | IOPA and E-Speed are different films |
| Crown & Bridge Holding Forceps With Rings - Curved (21/105) | Temporary Crown Removing Pliers (21/104) | adjacent catalogue number, different instrument |
| Schuster Class B Autoclave 23L Combo | Schuster autoclave with Foseal + Aqua combo | bundles differ, photo would misrepresent contents |
| Sun B-Class Autoclave + Distiller Combo | same Schuster combo | different autoclave brand |

## The remaining 317

130 brands. Only Waldent publishes a machine-readable catalogue with per-product images; the
rest are JS shells, PDF catalogues or dealer portals, so their photographs come from a media kit
or from Tanvi's own camera, not from scraping.

Media-kit requests are drafted for the seven largest brands (Waldent 33, GDC 21, Woodpecker 10,
Oracraft 8, Labodent 7, Ammdent 7, Maarc 6 = 92 products). Five have verified contact addresses;
Oracraft and Labodent need their contact confirming first. Nothing has been sent.

## Order of work

1. Tanvi approves the drafts in [OUTREACH-MEDIA-KITS.md](./OUTREACH-MEDIA-KITS.md).
2. Requests go out from the connected mailbox; replies are tracked per brand.
3. A written yes runs `--grant` for that brand, which publishes its photographs and records the
   permission reference.
4. Anything photographed on the shelf imports immediately with `npm run images:import`, no
   permission needed.
5. Re-run `npm run images:register` after every batch.
