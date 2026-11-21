# Real product photographs: progress

Last updated 2026-11-22.

| | Products |
|---|---|
| Catalogue total | 344 |
| Real photograph, verified match | **27** |
| Still on the placeholder illustration | 317 |
| Wrong or duplicate photographs | 0 |

`npm run images:check` validates every photograph before deploy. `npm run images:queue`
regenerates the waiting list. `docs/sourcing/*.json` records, per brand, what matched and what
did not.

## What is live

**Waldent, 27 of 33 products.** Sourced from Waldent's own storefront (waldent.com), one
photograph per product, matched by full product title, stored locally as 1200 × 1200 WebP under
250 KB, each with the exact product page recorded as its source.

Six Waldent products deliberately keep their illustration, because the brand's listing was not
the same product:

| Product | Why it was skipped |
|---|---|
| Dental X-Ray Film E-Speed (Pack Of 100) | Waldent lists IOPA film, not E-Speed |
| Surgical Saw Handpiece - Reciprocating | only a generic "Surgical Handpiece" exists |
| Schuster Class B Autoclave 23L Combo | combo includes a sealer and distiller; single-unit photo would misrepresent it |
| Sun B-Class Autoclave with Printer Combo | only the distiller in the combo is listed separately |
| Orthodontic Pliers / Impression Trays variants | no title-level match on the brand site |

## Why this is slow, honestly

Only one of the brands checked publishes a machine-readable catalogue (Waldent runs a Shopify
storefront with a product sitemap). GDC, Woodpecker, Oracraft, Ammdent, Labodent, Maarc,
Polydentia and Vishal Dentocare do not: their sites are JS shells, PDF catalogues or dealer-only
portals, so each product has to be found by hand or supplied by the brand.

129 brands remain. Two routes get there:

1. **Brand media kits.** One message per brand returns every SKU at once, with permission. This is
   the only route that scales to 344 and the only one that makes the rights position clean.
   Request template: [IMAGE-SOURCING.md](./IMAGE-SOURCING.md).
2. **Your own photographs.** Any number of products, no permission needed, and the best possible
   accuracy. Drop files anywhere and they import with one command.

## Rights position, stated plainly

Every sourced photograph carries the exact product page it came from. The licence field currently
reads:

> "Waldent official product image, www.waldent.com, sourced 2026-11-22; reseller permission
> requested, not yet confirmed"

That is an accurate description, not a permission. Brand product photography is the brand's
copyright, and using it without confirmation is a risk that sits with the store. The clean fix is
the media-kit request above; a written yes from Waldent's dealer team converts 27 records from
"requested" to "granted" in one edit. If any brand objects, the whole brand can be pulled in one
command and those products revert to their illustrations.

## Next

1. Send the media-kit request to Waldent (confirm the 27), then GDC, Woodpecker, Oracraft.
2. Photograph anything already on the shelf; import with `npm run images:import`.
3. Re-run `npm run images:check` and `npm run images:queue` after each batch.
