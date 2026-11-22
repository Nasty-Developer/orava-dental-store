# Image rights report: the original 344 products

Generated 2026-11-22 from `staging/listing-manifest.json` plus the live catalogue.
Per-product detail: `docs/IMAGE-RIGHTS-AUDIT.csv` (344 rows).

## Headline

Every published product photograph in the store is an asset from a competing
retailer's CDN, used without permission. This is not a gap in the records; the
records are complete and they say so.

## Where the 339 photographs actually come from

| Image host | Rows |
| --- | --- |
| r2dkmedia.dentalkart.com | 325 |
| dentalkart-catalog-products.s3.ap-south-1.amazonaws.com | 14 |
| no image | 5 |

All 339 source pages are `www.dentalkart.com`. Provenance was recovered in full
for every one of them: each row in the CSV carries the exact listing page and the
exact image URL, so nothing here is guessed.

## What the recorded permission actually says

| Field | Value | Rows |
| --- | --- | --- |
| recorded permission | `owner-approved` | 339 |
| brand written permission | none | 339 |

`owner-approved` means Tanvi authorised publication. It does not mean any brand,
and it does not mean Dentalkart, agreed to anything. The two must never be
conflated, and the audit CSV keeps them in separate columns.

## Why this is a problem beyond a technicality

Two separate rights issues sit on top of each other:

1. **The retailer.** The files are served from Dentalkart's own media host. Copying
   a competitor's product images is precisely what the sourcing rule forbids.
2. **The underlying photograph.** Even with Dentalkart's blessing, the retailer may
   not own the picture. Many of these are manufacturer pack shots the retailer
   rehosted, so the real rights holder is likely the brand.

So a permission from Dentalkart alone would not necessarily settle it.

## Recommendation

| Priority | Action |
| --- | --- |
| 1 | Approach the manufacturers for the products that matter commercially, asking for a written commercial website licence and a supplied image set. This is the only route that produces a defensible catalogue. |
| 2 | Where a brand supplies an official image pack, replace the retailer asset file-for-file. Nothing else on the site changes. |
| 3 | Treat the current 339 as temporary and replaceable. Do not extend the same sourcing pattern to the expansion rows. |
| 4 | For brands that never respond, keep the product but show the drawn illustration rather than a borrowed photograph. |

## Status of the 43 expansion rows

Zero have an image. That is deliberate: no permission exists for any of them, so
under the approval rule they stay in the proposal. Their `imagePermission` field
reads `none` and the publish gate refuses them.

## Not yet done

Official image URLs have not been collected for the 43 yet, and no manufacturer has
been approached. Both need the next pass. Approaching a manufacturer requires an
email route and Tanvi's approval of the wording before anything is sent.

## Action taken 2026-11-22: photographs withheld from the live site

All product photographs are disabled on the live site pending rights. The switch
is `PRODUCT_PHOTOS_LIVE` in `src/data/image-rights.ts`, currently `false`. It is
applied in one place, `src/data/catalogue/index.ts`, plus the category tiles in
`src/data/category-images.ts`.

Nothing was deleted. The 344 catalogue records are intact, the original image
URLs remain in `staging/listing-manifest.json`, and this report and
`docs/IMAGE-RIGHTS-AUDIT.csv` are unchanged, so every held photograph can be
traced and restored or replaced individually.

Product cards and product pages now fall back to the drawn illustrations, and the
23 category tiles fall back the same way. To restore a specific brand once written
permission is on file, add a per-product rights flag rather than reopening the
whole set.
