# How the catalogue expansion is sourced

The store began with 344 products across 23 clinical areas. This document governs
how it grows beyond them, and why the growth is slower than a scraper would be.

## The rule that shapes everything

A competitor's catalogue is not a source of record. Dentalkart, PinkBlue, Dentzoo
and CaraKart are used to answer one question only: *which product families exist
in this market?* The moment we know a family exists, the facts come from somewhere
else.

| Tier | What it is | Used for |
| --- | --- | --- |
| 1 | Manufacturer site or manufacturer PDF | Name, brand, specifications, pack format. The source of record. |
| 2 | Authorised distributor's own product page | The same facts when the manufacturer publishes no page for India |
| 3 | Retailer listings | Discovery only. Never copied, never cited, never scraped. |

Tier 3 is explicitly excluded by `tools/check-expansion.mjs`, which rejects any row
whose `sourceUrl` resolves to a retailer or marketplace domain.

## What every proposed row must carry

- `name`, `brand`, `category`, `subcategory` as the manufacturer states them
- `specs`: three to eight factual fields, values as published
- `sourceUrl`: the exact page a researcher opened, not a search result
- `verifiedOn` and `verificationNote`: when it was checked and what was confirmed
- `imagePermission`: `none`, `granted`, or `owner-approved`
- `price`: always `null`. The store renders *Price on request*. No price is
  inferred from a competitor's listing, because their price is not our price.

Summaries are written by us in one neutral sentence. Marketing prose is not copied,
because product descriptions are the part of a listing that carries copyright.

## The two gates

```
node tools/check-expansion.mjs     # validates staging/expansion/parts/*.json
node tools/publish-expansion.mjs   # refuses to write without APPROVED.json
```

The first rejects duplicates against the live catalogue, retailer sources,
invented prices, unknown categories and untraceable rows. The second will not
touch `src/data/catalogue/` until `staging/expansion/APPROVED.json` names who
approved what, and when. A proposal cannot reach the store by accident.

## Photographs

Every new row starts at `imagePermission: "none"` and renders the drawn
placeholder. That is deliberate: an accurate illustration is honest, an
unlicensed photograph is not, and a competitor's photo is neither. Photographs are
attached per product once a permission state is recorded, exactly as the first
339 were.

## The arithmetic, stated plainly

| | Count |
| --- | --- |
| Live today | 344 |
| Target | 1,000 |
| Still required | 656 |

Reaching 1,000 with every row traceable to a manufacturer page is a multi-session
job, not a single pass. The work is batched into tranches of roughly 150 to 200
verified products. Each tranche is proposed, reviewed and approved before it
publishes. Padding the count with unverified rows would defeat the point of the
exercise, so the number grows only as fast as verification allows.

## A note on the original 344

The first 344 rows were harvested from a retailer listing early in the project,
before the no-duplication rule existed. They are live, they carry their own
photographs, and they are not being touched here. But they are a weaker provenance
class than everything added under this document, and that distinction is worth
knowing when the catalogue is audited.
