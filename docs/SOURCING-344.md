# Sourcing repair — the original 344 rows

Running log of the provenance repair of the 344 pre-existing catalogue rows in
`src/data/catalogue/*.ts`. The job is being done one brand at a time; this
document is appended to as each brand slice lands.

What "repaired" means here, on every row:

- `source` — the exact manufacturer product URL (never a retailer or
  marketplace, never a guessed or constructed URL).
- `verification.method` — how the URL was established and checked.
- `verification.checkedOn` — the date the page was opened.
- `verification.note` — HTTP status, the page title actually returned, the
  manufacturer SKU, and stock state where the page shows one.

Prices were not touched anywhere in this work, and no row was deleted, merged or
renamed.

## Progress by brand

| Brand slice | Rows in slice | Verified | Flagged | Status |
|---|---|---|---|---|
| Waldent (`Waldent`, `Waldent Disposable`, `Waldent Ortho`, `Waldent Spare Parts`) | 38 | 34 | 4 | done 2026-11-24 |
| all other brands | 306 | 0 | 0 | not started |

Catalogue total is unchanged at 344 rows. Waldent is the first completed slice;
the remaining 306 rows are still without provenance and are tracked here as
"not started", not as verified.

## Waldent slice — 2026-11-24

Scope: every row in `src/data/catalogue/*.ts` whose brand begins with
"Waldent" — 33 rows under the brand `Waldent` plus 5 sub-brand rows
(`Waldent Disposable` 1, `Waldent Spare Parts` 3, `Waldent Ortho` 1).

Starting points: `docs/sourcing/waldent.json` (27 matched URLs, 6 unmatched),
`waldent-disposable.json`, `waldent-ortho.json` and
`waldent-spare-parts.json` (no matches), and `docs/sourcing/pending/waldent.json`
for the 27 staged photographs.

Method: every one of the 27 recorded URLs was re-opened live and its
`og:title`, manufacturer SKU and stock state compared with the row. The 11 rows
with no recorded URL were resolved against Waldent's own product sitemap
(613 product URLs) and its Shopify search-suggest endpoint, then each candidate
page was opened and its title compared before being recorded.

Result: **34 of 38 verified**, 4 flagged. Of the 33 rows under the brand
`Waldent` itself, 29 are verified and 4 are flagged.

### Verified rows (34)

| # | Row | Brand | Manufacturer URL | Checked |
|---|-----|-------|------------------|---------|
| 1 | `waldent-new-dental-clinic-setup-kit` | Waldent | https://www.waldent.com/products/waldent-new-clinical-setup-kit | 2026-11-24 |
| 2 | `waldent-rubber-dam-clamps-kit-titanium-black-set-of-11-k16-4` | Waldent | https://www.waldent.com/products/waldent-titaniumblack | 2026-11-24 |
| 3 | `waldent-pedo-rubber-dam-frame-small-16-139` | Waldent | https://www.waldent.com/products/waldent-pedo-rubber-dam-frame-small-16-139 | 2026-11-24 |
| 4 | `waldent-nitrile-examination-gloves-black-pack-of-80` | Waldent Disposable | https://www.waldent.com/products/waldent-blackgloves1 | 2026-11-24 |
| 5 | `waldent-blz-intravue-900-ai-intraoral-scanner-tip-adult` | Waldent | https://www.waldent.com/products/waldent-blz-intravue-900-ai-intraoral-scanner-tip-adult | 2026-11-24 |
| 6 | `waldent-gutta-percha-obturator-bars-pack-of-50` | Waldent | https://www.waldent.com/products/waldent-gutta-percha-obturator-bars-pack-of-50 | 2026-11-24 |
| 7 | `waldent-flexiwave-reciprocating-files-25mm` | Waldent | https://www.waldent.com/products/waldent-flexiwave-reciprocating-files-25mm | 2026-11-24 |
| 8 | `waldent-flexiwave-reciprocating-files-21mm` | Waldent | https://www.waldent.com/products/waldent-flexiwave-reciprocating-files-21mm | 2026-11-24 |
| 9 | `waldent-ultrawave-maxpiezo-4-led-ultrasonic-scaler` | Waldent | https://www.waldent.com/products/waldent-ultrawave-maxpiezo-4-led-ultrasonic-scaler | 2026-11-24 |
| 10 | `waldent-max-piezo-2-ultrasonic-scaler` | Waldent | https://www.waldent.com/products/waldent-max-piezo-2-ultrasonic-scaler-5-scaler-tips-free | 2026-11-24 |
| 11 | `waldent-oil-free-dental-compressor-head-1-1hp` | Waldent | https://www.waldent.com/products/waldent-oil-free-dental-compressor-head-1-1hp | 2026-11-24 |
| 12 | `waldent-chair-light-for-eezee-portable-dental-chair` | Waldent Spare Parts | https://www.waldent.com/products/waldent-chair-light-for-eezee-portable-dental-chair | 2026-11-24 |
| 13 | `waldent-internal-water-spray-straight-handpiece-w-156` | Waldent | https://www.waldent.com/products/waldent-internal-water-spray-straight-handpiece-w-156 | 2026-11-24 |
| 14 | `waldent-internal-water-spray-contra-angle-handpiece-w-155` | Waldent | https://www.waldent.com/products/waldent-internal-water-spray-contra-angle-handpiece-w-155 | 2026-11-24 |
| 15 | `waldent-intraoral-camera-usb-model-for-laptop` | Waldent | https://www.waldent.com/products/waldent-intraoralcamera | 2026-11-24 |
| 16 | `waldent-intra-oral-camera-with-screen-ergo-10-mp` | Waldent | https://www.waldent.com/products/waldent-iocamerawithmonitor-ergo | 2026-11-24 |
| 17 | `waldent-intraoral-camera-monitor-clamp` | Waldent Spare Parts | https://www.waldent.com/products/waldent-camclamp1 | 2026-11-24 |
| 18 | `waldent-cord-for-intraoral-camera-smart-cam-with-pms` | Waldent Spare Parts | https://www.waldent.com/products/waldent-cord-for-intraoral-camera-smart-cam-with-pms | 2026-11-24 |
| 19 | `waldent-dental-x-ray-film-e-speed-pack-of-100` | Waldent | https://www.waldent.com/products/waldent-dental-x-ray-film-iopa-pack-of-100 | 2026-11-24 |
| 20 | `waldent-tooth-extraction-forcep-kit-set-of-12-anatomic-ultra-k1` | Waldent | https://www.waldent.com/products/waldent-tooth-extraction-forcep-kit-set-of-12-anatomic-ultra-k1-11 | 2026-11-24 |
| 21 | `waldent-composite-anterior-instrument-kit-blue-set-of-5-k14-5` | Waldent | https://www.waldent.com/products/waldent-composite-anterior-instrument-kit-blue-set-of-5-k14-5 | 2026-11-24 |
| 22 | `waldent-p-k-thomas-wax-carvers-set-of-5-k15-8` | Waldent | https://www.waldent.com/products/waldent-p-k-thomas-wax-carvers-set-of-5-k15-8 | 2026-11-24 |
| 23 | `waldent-oral-surgical-impaction-kit-set-of-21-k9-2` | Waldent | https://www.waldent.com/products/walse21 | 2026-11-24 |
| 24 | `waldent-hemostatic-liquid` | Waldent | https://www.waldent.com/products/waldent-hemostatic-liquid | 2026-11-24 |
| 25 | `waldent-orthodontic-tweed-loop-forming-pliers-10-107` | Waldent | https://www.waldent.com/products/waldent-orthodontic-tweed | 2026-11-24 |
| 26 | `waldent-ortho-self-ligating-brackets-mbt-0-022-hk-3-4-5` | Waldent Ortho | https://www.waldent.com/products/waldent-ortho-self-ligating-brackets-mbt-0-022-hk-3-4-5 | 2026-11-24 |
| 27 | `waldent-pedodontic-extraction-forceps-kit-premium-set-of-7-k1-9` | Waldent | https://www.waldent.com/products/waldent-pedodontic-extraction-forceps-kit-premium-set-of-7-k1-9 | 2026-11-24 |
| 28 | `waldent-caries-detector` | Waldent | https://www.waldent.com/products/waldent-caries-detector | 2026-11-24 |
| 29 | `waldent-fissureseal-pit-and-fissure-sealant-lc` | Waldent | https://www.waldent.com/products/waldent-fissureseal | 2026-11-24 |
| 30 | `waldent-crown-and-bridge-tooth-preparation-diamond-bur-kit-set` | Waldent | https://www.waldent.com/products/waldent-crown-bridge-tooth-preparation-diamond-bur-kit-set-of-14 | 2026-11-24 |
| 31 | `waldent-nanofill-zirconium-composite-kit` | Waldent | https://www.waldent.com/products/waldent-nanofill-zirconium-composite-kit | 2026-11-24 |
| 32 | `waldent-implant-holding-tweezer-19-173` | Waldent | https://www.waldent.com/products/waldent-implant-holding-tweezers-19-173 | 2026-11-24 |
| 33 | `waldent-bestetch` | Waldent | https://www.waldent.com/products/waldent-bestetch | 2026-11-24 |
| 34 | `waldent-schuster-class-b-autoclave-23l` | Waldent | https://www.waldent.com/products/waldent-schuster-class-b-autoclave-23l | 2026-11-24 |

### Flagged rows (4)

| # | Row | Brand | Reason |
|---|-----|-------|--------|
| 1 | `waldent-surgical-saw-handpiece-reciprocating-up-and-down` | Waldent | no waldent.com page for a reciprocating surgical saw handpiece (model DGZ-R). The only Waldent surgical handpiece on the manufacturer site is the implant surgical 20-degree handpiece, a different instrument, and a site search for 'saw handpiece' returns no saw. Source left blank rather than guessed. |
| 2 | `waldent-crown-and-bridge-holding-forceps-with-rings-curved-21` | Waldent | no waldent.com page for Crown & Bridge Holding Forceps with rings (21/105). The manufacturer sitemap and site search return only the Temporary Crown Removing Pliers (21/104), a different instrument. Source left blank rather than guessed. |
| 3 | `waldent-schuster-class-b-autoclave-23l-with-sterilization-reels` | Waldent | this row is a retailer-assembled bundle (autoclave + reels/pouches sealing machine + BST-007 distiller). Waldent sells the autoclave alone and a different combo (with Foseal sealing machine and Aqua distiller), so no manufacturer page documents this exact bundle. Source left blank rather than guessed. |
| 4 | `sun-b-class-autoclave-with-printer-waldent-water-distiller-bst` | Waldent | retailer-assembled combo of a Sun B-class autoclave with printer and a Waldent BST-007 distiller. Waldent's own page covers only the distiller, not the combined bundle, so no single manufacturer page documents this item. Source left blank rather than guessed. |

## Notes on the verified rows

- All 34 URLs are on `www.waldent.com`, the manufacturer's own store. No
  retailer or marketplace URL is used anywhere.
- All 34 returned HTTP 200 when opened on 2026-11-24.
- 3 of the 34 pages currently show the product as out of stock
  (`OutOfStock`): Pedo Rubber Dam Frame - Small (16/139), Composite Anterior
  Instrument Kit - Blue - Set of 5 (K14/5), and Pedodontic Extraction Forceps
  Kit - Premium (set of 7) K1/9. The other 31 are `InStock`. The page and its
  title still resolve, so the provenance stands; the stock state is recorded in
  each row's `verification.note` and was not turned into a stock claim on the
  storefront.
- `waldent-dental-x-ray-film-e-speed-pack-of-100` is recorded against
  `https://www.waldent.com/products/waldent-dental-x-ray-film-iopa-pack-of-100`.
  The page's own title is "Waldent Dental X-Ray Film IOPA (Pack Of 100)" but the
  page copy and the E-Speed variant describe E-speed film, so this is the same
  product under Waldent's naming rather than a different item.
- `waldent-new-dental-clinic-setup-kit` is recorded against
  `https://www.waldent.com/products/waldent-new-clinical-setup-kit`
  ("Waldent New Clinical Setup Kit") — Waldent's own name for the kit.

## Notes on the flagged rows

These 4 rows carry `verification.method: "unverified - no manufacturer page
found"` and no `source`. They are flagged rather than given a guessed URL.

1. **Surgical Saw Handpiece - Reciprocating (DGZ-R)** — Waldent publishes no
   reciprocating surgical saw handpiece. The only surgical handpiece on
   `waldent.com` is the implant surgical 20° handpiece, a different instrument,
   and a site search for "saw handpiece" returns no saw. Model code DGZ-R
   appears nowhere on the site.
2. **Crown & Bridge Holding Forceps With Rings - Curved (21/105)** — the
   manufacturer sitemap and site search return only the Temporary Crown
   Removing Pliers (21/104). 21/105 is not on the site.
3. **Schuster Class B Autoclave 23L With Sterilization Reels & Pouches Sealing
   Machine and Water Distiller BST-007 Combo** — a retailer-assembled bundle.
   Waldent sells the autoclave alone and a *different* combo (Foseal sealing
   machine + Aqua distiller), so no manufacturer page documents this exact
   bundle.
4. **Sun B-Class Autoclave with Printer + Waldent Water Distiller BST-007
   Combo** — also a retailer-assembled combo. Waldent's own page covers only
   the BST-007 distiller, not the combined item.

For 1 and 2 the catalogue row may describe an item Waldent no longer lists; for
3 and 4 the row is a bundle rather than a manufacturer product. Both cases need
a decision from the owner (drop the row, or keep it flagged as
retailer-sourced), which is why they are flagged rather than removed.

## Batch 2 progress (2026-11-25)

Commit `437ac1a`. The batch-2 worker timed out mid-run; its edits were salvaged from its
local clone, audited and pushed by the coordinator.

> Historical snapshot (2026-11-25, after the GDC batch). Current counts are in the
> per-brand table further down: 62 verified, 14 flagged, 268 not started.

| Brand | Rows | Verified | Flagged | Not started |
| --- | --- | --- | --- | --- |
| Waldent family | 38 | 34 | 4 | 0 |
| GDC | 21 | 19 | 2 | 0 |
| Ammdent | 7 | 0 | 0 | 7 |
| All other brands | 278 | 0 | 0 | 278 |
| **Total** | **344** | **53** | **6** | **285** |

Every one of the 19 GDC source URLs was re-fetched by the coordinator on 2026-11-25:
19 of 19 returned HTTP 200 and every page title matched its row. The two flagged GDC rows
are the clinic package configurations GDC does not document: the OPP package is supplied
with a trolley bag, so the without-trolley variant has no manufacturer page, and the
premium package's own trolley configuration is the only one listed.

Remaining: 285 rows still not started, 39 of them the rest of the original batch-2 scope
(now stage10), starting with Ammdent's 7.

## Batch 3 progress (2026-11-25)

Ammdent's 7 rows are done, written directly by the coordinator because three worker
attempts at this task stopped mid-run.

| Brand | Rows | Verified | Flagged | Not started |
| --- | --- | --- | --- | --- |
| Waldent family | 38 | 34 | 4 | 0 |
| GDC | 21 | 19 | 2 | 0 |
| Ammdent | 7 | 6 | 1 | 0 |
| Woodpecker | 10 | 3 | 7 | 0 |
| All other brands | 268 | 0 | 0 | 268 |
| **Total** | **344** | **62** | **14** | **268** |

Verified against ammdent.com, each page opened on 2026-11-25 at HTTP 200 with the
product name in the page title: Biocanal, Canalarge, LC Cal Excel, D-Sense, FluroSolve,
and Nano Fill (cited on the syringe-pack page, since AMMDENT prints no "refill" SKU;
the kit page is a separate presentation).

Flagged: Sterigem Hand Rub 500ml. The manufacturer's whole sitemap (95 URLs) has no
hand-rub, sanitizer or Sterigem page, and site search returns nothing, so no source is
recorded rather than a guessed one.


## Woodpecker slice (2026-11-25)

3 of 10 verified against the manufacturer, 7 flagged.

Verified on glwoodpecker.com (Guilin Woodpecker), each page opened in a real browser
and read: Endo Pace (`#/pcdetails?e=390`), E-COM (`#/pcdetails?e=336`),
Ai Ray (`#/pcdetails?e=380`). The site is a client-rendered single-page app, so a
plain HTTP fetch returns only the app shell; the product body and specification table
render in the browser. Each note records the specs seen on the page.

Flagged, no source invented: Star Pen, U-600 LED, UDS-J, RTA D1, RTA Endo Space,
Surgic Smart, Ultra Surgery X. glwoodpecker.com publishes no sitemap (404), no
server-side product URLs, and its JSON API rejected every documented route tried, so
the page for each of these exact models could not be located and confirmed. They stay
not started rather than guessed.
