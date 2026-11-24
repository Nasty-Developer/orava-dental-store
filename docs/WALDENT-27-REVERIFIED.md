# Waldent 27 — re-verification

**Re-verified:** 2026-11-24  
**Scope:** the 27 Waldent photographs withdrawn to `staging/product-photos/waldent/`, one photograph per product, sourced from Waldent's own product pages on 2026-11-21 and staged on 2026-11-21.  
**Nothing was published, nothing was moved out of staging, nothing was sent to Waldent.** `PRODUCT_PHOTOS_LIVE` stays `false`.

## Result

**27 of 27 photographs still match their product, model and variant.** 27 of 27 source pages returned HTTP 200 and none has been withdrawn, renamed to a different product, or re-photographed.

| | Count |
|---|---|
| Photographs re-verified | 27 |
| Source pages returning HTTP 200 | 27 |
| Product still exists and title still matches the catalogue product | 27 |
| **Photograph still matches the exact product, model and variant** | **27** |
| Failed (page gone, product changed, or photograph replaced) | 0 |
| Products now showing out of stock on Waldent's page | 3 |

## How each one was checked

1. The source URL recorded in `docs/sourcing/pending/waldent.json` was opened with `curl` using a normal desktop browser user-agent (`Mozilla/5.0 … Chrome/131`) and the real HTTP status recorded. All 27 answered **200** with the full product page (84–108 KB of HTML); none returned a challenge page, a bot block, a redirect or an error.
2. The same handle was read as structured data from Waldent's own product JSON endpoint (`/products/<handle>.json`) and from the page's `application/ld+json` `Product` block, giving the live title, the Waldent SKU, every variant and its stock state.
3. The live title was compared token-by-token with the catalogue product name, and the model code in the product name (K16/4, W-156, 10/107, 21 mm, …) was confirmed present in the live title.
4. The photograph itself was compared with the staged file: every image on the live product page was downloaded at 1600 px, flattened on white, resized to 64 × 64 greyscale and correlated with the staged WebP (Pearson r), plus a 16 × 16 difference-hash distance. A photograph is recorded as still matching only when r ≥ 0.99 against the page's own primary image — i.e. the same photograph, not merely a photograph of a similar product.
5. Every staged photograph was also compared against every other product's primary image to rule out one photograph silently standing in for a different product.

## Re-verification table

| # | Slug | Product name | Model | Source URL | HTTP | Photo still matches | Verified |
|---|---|---|---|---|---|---|---|
| 1 | `waldent-rubber-dam-clamps-kit-titanium-black-set-of-11-k16-4` | Rubber Dam Clamps Kit Titanium Black (Set of 11) (K16/4) | K16/4 | https://www.waldent.com/products/waldent-titaniumblack | 200 | Yes | 2026-11-24 |
| 2 | `waldent-pedo-rubber-dam-frame-small-16-139` | Pedo Rubber Dam Frame - Small (16/139) | 16/139 | https://www.waldent.com/products/waldent-pedo-rubber-dam-frame-small-16-139 | 200 | Yes | 2026-11-24 |
| 3 | `waldent-blz-intravue-900-ai-intraoral-scanner-tip-adult` | BLZ IntraVue 900 Ai Intraoral Scanner Tip - Adult | BLZ IntraVue 900 Ai (Adult tip) | https://www.waldent.com/products/waldent-blz-intravue-900-ai-intraoral-scanner-tip-adult | 200 | Yes | 2026-11-24 |
| 4 | `waldent-gutta-percha-obturator-bars-pack-of-50` | Gutta Percha Obturator Bars (Pack of 50) | — | https://www.waldent.com/products/waldent-gutta-percha-obturator-bars-pack-of-50 | 200 | Yes | 2026-11-24 |
| 5 | `waldent-flexiwave-reciprocating-files-25mm` | Flexiwave Reciprocating Files (25mm) | 25 mm | https://www.waldent.com/products/waldent-flexiwave-reciprocating-files-25mm | 200 | Yes | 2026-11-24 |
| 6 | `waldent-flexiwave-reciprocating-files-21mm` | Flexiwave Reciprocating Files (21mm) | 21 mm | https://www.waldent.com/products/waldent-flexiwave-reciprocating-files-21mm | 200 | Yes | 2026-11-24 |
| 7 | `waldent-ultrawave-maxpiezo-4-led-ultrasonic-scaler` | Ultrawave MaxPiezo 4 LED Ultrasonic Scaler | Ultrawave MaxPiezo 4 LED | https://www.waldent.com/products/waldent-ultrawave-maxpiezo-4-led-ultrasonic-scaler | 200 | Yes | 2026-11-24 |
| 8 | `waldent-max-piezo-2-ultrasonic-scaler` | Max Piezo 2 Ultrasonic Scaler | Max Piezo 2 | https://www.waldent.com/products/waldent-max-piezo-2-ultrasonic-scaler-5-scaler-tips-free | 200 | Yes | 2026-11-24 |
| 9 | `waldent-oil-free-dental-compressor-head-1-1hp` | Oil Free Dental Compressor Head 1.1HP | 1.1 HP | https://www.waldent.com/products/waldent-oil-free-dental-compressor-head-1-1hp | 200 | Yes | 2026-11-24 |
| 10 | `waldent-internal-water-spray-straight-handpiece-w-156` | Internal Water Spray Straight Handpiece (W-156) | W-156 | https://www.waldent.com/products/waldent-internal-water-spray-straight-handpiece-w-156 | 200 | Yes | 2026-11-24 |
| 11 | `waldent-internal-water-spray-contra-angle-handpiece-w-155` | Internal Water Spray Contra Angle Handpiece (W-155) | W-155 | https://www.waldent.com/products/waldent-internal-water-spray-contra-angle-handpiece-w-155 | 200 | Yes | 2026-11-24 |
| 12 | `waldent-intraoral-camera-usb-model-for-laptop` | Intraoral Camera USB Model ( For Laptop ) | USB model | https://www.waldent.com/products/waldent-intraoralcamera | 200 | Yes | 2026-11-24 |
| 13 | `waldent-intra-oral-camera-with-screen-ergo-10-mp` | Intra Oral Camera with Screen - Ergo (10 MP) | Ergo (10 MP) | https://www.waldent.com/products/waldent-iocamerawithmonitor-ergo | 200 | Yes | 2026-11-24 |
| 14 | `waldent-tooth-extraction-forcep-kit-set-of-12-anatomic-ultra-k1` | Tooth Extraction Forcep Kit set of 12 - Anatomic Ultra (K1/11) | K1/11 | https://www.waldent.com/products/waldent-tooth-extraction-forcep-kit-set-of-12-anatomic-ultra-k1-11 | 200 | Yes | 2026-11-24 |
| 15 | `waldent-composite-anterior-instrument-kit-blue-set-of-5-k14-5` | Composite Anterior Instrument Kit - Blue - Set of 5 (K14/5) | K14/5 | https://www.waldent.com/products/waldent-composite-anterior-instrument-kit-blue-set-of-5-k14-5 | 200 | Yes | 2026-11-24 |
| 16 | `waldent-p-k-thomas-wax-carvers-set-of-5-k15-8` | P.K Thomas Wax Carvers - Set of 5 (K15/8) | K15/8 | https://www.waldent.com/products/waldent-p-k-thomas-wax-carvers-set-of-5-k15-8 | 200 | Yes | 2026-11-24 |
| 17 | `waldent-oral-surgical-impaction-kit-set-of-21-k9-2` | Oral Surgical Impaction Kit Set of 21 (K9/2) | K9/2 | https://www.waldent.com/products/walse21 | 200 | Yes | 2026-11-24 |
| 18 | `waldent-hemostatic-liquid` | Hemostatic Liquid | — | https://www.waldent.com/products/waldent-hemostatic-liquid | 200 | Yes | 2026-11-24 |
| 19 | `waldent-orthodontic-tweed-loop-forming-pliers-10-107` | Orthodontic Tweed Loop Forming Pliers 10/107 | 10/107 | https://www.waldent.com/products/waldent-orthodontic-tweed | 200 | Yes | 2026-11-24 |
| 20 | `waldent-pedodontic-extraction-forceps-kit-premium-set-of-7-k1-9` | Pedodontic Extraction Forceps Kit - Premium (set of 7) K1/9 | K1/9 | https://www.waldent.com/products/waldent-pedodontic-extraction-forceps-kit-premium-set-of-7-k1-9 | 200 | Yes | 2026-11-24 |
| 21 | `waldent-caries-detector` | Caries Detector | — | https://www.waldent.com/products/waldent-caries-detector | 200 | Yes | 2026-11-24 |
| 22 | `waldent-fissureseal-pit-and-fissure-sealant-lc` | FissureSeal Pit & Fissure Sealant LC | — | https://www.waldent.com/products/waldent-fissureseal | 200 | Yes | 2026-11-24 |
| 23 | `waldent-crown-and-bridge-tooth-preparation-diamond-bur-kit-set` | Crown & Bridge Tooth Preparation Diamond Bur Kit (Set of 14) | — | https://www.waldent.com/products/waldent-crown-bridge-tooth-preparation-diamond-bur-kit-set-of-14 | 200 | Yes | 2026-11-24 |
| 24 | `waldent-nanofill-zirconium-composite-kit` | NanoFill Zirconium Composite Kit | — | https://www.waldent.com/products/waldent-nanofill-zirconium-composite-kit | 200 | Yes | 2026-11-24 |
| 25 | `waldent-implant-holding-tweezer-19-173` | Implant Holding Tweezer (19/173) | 19/173 | https://www.waldent.com/products/waldent-implant-holding-tweezers-19-173 | 200 | Yes | 2026-11-24 |
| 26 | `waldent-bestetch` | BESTEtch | — | https://www.waldent.com/products/waldent-bestetch | 200 | Yes | 2026-11-24 |
| 27 | `waldent-schuster-class-b-autoclave-23l` | Schuster Class B Autoclave 23L | 23 L | https://www.waldent.com/products/waldent-schuster-class-b-autoclave-23l | 200 | Yes | 2026-11-24 |

Model is the manufacturer's model or part code as it appears in the catalogue product name; `—` means the product carries no model code in its name and is identified by its Waldent SKU instead (see the evidence table).

## Evidence from the live page

| # | Live Waldent title | Waldent SKU | Variant(s) on the live page | Stock | Title / model match |
|---|---|---|---|---|---|
| 1 | Waldent Rubber Dam Clamps Kit Titanium Black (set of 11) (K16/4) | `WALXX00649` | Default Title | InStock | Exact |
| 2 | Waldent Pedo Rubber Dam Frame - Small (16/139) | `WALXX02170` | Default Title | OutOfStock | Exact |
| 3 | Waldent BLZ IntraVue 900 Ai Intraoral Scanner Tip - Adult | `WALXX01964` | Default Title | InStock | Exact |
| 4 | Waldent Gutta Percha Obturator Bars (Pack of 50) | `WALXX01995` | Default | InStock | Exact |
| 5 | Waldent Flexiwave Reciprocating Files  (25mm) | `WALXX01287` | Waldent Flexiwave Reciprocating Files 25mm RC50 (50/5%); Waldent Flexiwave Reciprocating Files 25mm RC40 (40/6%) | Mixed | Exact |
| 6 | Waldent Flexiwave Reciprocating Files (21mm) | `WALXX01283` | Waldent Flexiwave Reciprocating Files 21mm RC50 (50/5%); Waldent Flexiwave Reciprocating Files 21mm Assorted (RC25 - RC50) | InStock | Exact |
| 7 | Waldent Ultrawave MaxPiezo 4 LED Ultrasonic Scaler | `WALXX01292` | Default Title | InStock | Exact |
| 8 | Waldent Max Piezo 2 Ultrasonic Scaler ( 5 Scaler Tips Free ) | `WALXX00541` | Default Title | InStock | Exact |
| 9 | Waldent Oil Free Dental Compressor Head 1.1HP | `WALXX01842` | Default Title | InStock | Exact |
| 10 | Waldent Internal Water Spray Straight Handpiece (W-156) | `WALXX01075` | Default Title | InStock | Exact |
| 11 | Waldent Internal Water Spray Contra Angle Handpiece (W-155) | `WALXX01074` | Default Title | InStock | Exact |
| 12 | Waldent Intraoral Camera USB Model For ( For Laptop ) | `WALXX00531` | Default Title | InStock | Exact |
| 13 | Waldent Intra Oral Camera with Screen - Ergo (10 MP) | `WALXX00776` | Default Title | InStock | Exact |
| 14 | Waldent Tooth Extraction Forcep Kit set of 12 - Anatomic Ultra (K1/11) | `WALXX02070` | Default Title | InStock | Exact |
| 15 | Waldent Composite Anterior Instrument Kit - Blue - Set of 5 (K14/5) | `WALXX02072` | Default Title | OutOfStock | Exact |
| 16 | Waldent P.K Thomas Wax Carvers - Set of 5 (K15/8) | `WALXX02073` | Default Title | InStock | Exact |
| 17 | Waldent Oral Surgical Impaction Kit Set of 21 (K9/2) | `WALXX00163` | Default Title | InStock | Exact |
| 18 | Waldent Hemostatic Liquid | `WALXX01010` | Default Title | InStock | Exact |
| 19 | Waldent Orthodontic Tweed Loop Forming Pliers 10/107 | `WALXX00420` | Default Title | InStock | Exact |
| 20 | Waldent Pedodontic Extraction Forceps Kit - Premium (set of 7) K1/9 | `WALXX00430` | Default Title | OutOfStock | Exact |
| 21 | Waldent Caries Detector | `WALXX01000` | Default Title | InStock | Exact |
| 22 | Waldent FissureSeal Pit & Fissure Sealant LC | `WALXX01294` | Default Title | InStock | Exact |
| 23 | Waldent Crown & Bridge Tooth Preparation Diamond Bur Kit (Set of 14) | `WALXX01543` | Default Title | InStock | Exact |
| 24 | Waldent NanoFill Zirconium Composite Kit | `WALXX01089` | Default Title | InStock | Exact |
| 25 | Waldent Implant Holding Tweezers (19/173) | `WALXX02177` | Default Title | InStock | Exact |
| 26 | Waldent BESTEtch | `WALXX00525` | Default Title | InStock | Exact |
| 27 | Waldent Schuster Class B Autoclave 23L | `WALXX01530` | Default Title | InStock | Exact |

## Photograph match detail

| # | Staged file | Primary image still on the page | r | dHash | Verdict | Note |
|---|---|---|---|---|---|---|
| 1 | `staging/product-photos/waldent/waldent-rubber-dam-clamps-kit-titanium-black-set-of-11-k16-4.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/products/black-ruberdam.jpg?v=1571146072 | 0.9998 | 1/256 | Same photograph | — |
| 2 | `staging/product-photos/waldent/waldent-pedo-rubber-dam-frame-small-16-139.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/files/waldent-pedo-rubber-dam-frame-small-16139-1.jpg?v=1787037408 | 0.9998 | 2/256 | Same photograph | Page live; product currently OutOfStock (page still exists, so the photograph remains correct). |
| 3 | `staging/product-photos/waldent/waldent-blz-intravue-900-ai-intraoral-scanner-tip-adult.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/files/dddeefdd_1.jpg?v=1774853838 | 0.9998 | 7/256 | Same photograph | — |
| 4 | `staging/product-photos/waldent/waldent-gutta-percha-obturator-bars-pack-of-50.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/files/waldent-gutta-percha-obturator-4.jpg?v=1784007886 | 1.0000 | 4/256 | Same photograph | — |
| 5 | `staging/product-photos/waldent/waldent-flexiwave-reciprocating-files-25mm.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/files/dtyrtyukiul_2.jpg?v=1686912393 | 0.9995 | 1/256 | Same photograph | Waldent uses the same visual asset on both the 21 mm and 25 mm pages, so the photograph matches the page but does not itself distinguish length. |
| 6 | `staging/product-photos/waldent/waldent-flexiwave-reciprocating-files-21mm.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/files/dtyrtyukiul.jpg?v=1686891271 | 0.9995 | 1/256 | Same photograph | Waldent uses the same visual asset on both the 21 mm and 25 mm pages, so the photograph matches the page but does not itself distinguish length. |
| 7 | `staging/product-photos/waldent/waldent-ultrawave-maxpiezo-4-led-ultrasonic-scaler.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/files/base_image_3__1_1.jpg?v=1712125813 | 0.9999 | 4/256 | Same photograph | — |
| 8 | `staging/product-photos/waldent/waldent-max-piezo-2-ultrasonic-scaler.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/files/2020-09-14.jpg?v=1683956926 | 0.9996 | 2/256 | Same photograph | Live title adds the promotion '( 5 Scaler Tips Free )'; product identity unchanged. |
| 9 | `staging/product-photos/waldent/waldent-oil-free-dental-compressor-head-1-1hp.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/files/56_1_6_625a842f-9d10-40bc-aeb8-f90de1a2ea3b.jpg?v=1759930737 | 0.9998 | 1/256 | Same photograph | — |
| 10 | `staging/product-photos/waldent/waldent-internal-water-spray-straight-handpiece-w-156.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/products/z_2_3.jpg?v=1660292323 | 0.9998 | 0/256 | Same photograph | — |
| 11 | `staging/product-photos/waldent/waldent-internal-water-spray-contra-angle-handpiece-w-155.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/products/e_4.jpg?v=1665638084 | 0.9998 | 1/256 | Same photograph | — |
| 12 | `staging/product-photos/waldent/waldent-intraoral-camera-usb-model-for-laptop.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/products/products-_276.jpg?v=1571294815 | 0.9997 | 1/256 | Same photograph | — |
| 13 | `staging/product-photos/waldent/waldent-intra-oral-camera-with-screen-ergo-10-mp.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/products/ergo-2.jpg?v=1615808639 | 0.9998 | 2/256 | Same photograph | — |
| 14 | `staging/product-photos/waldent/waldent-tooth-extraction-forcep-kit-set-of-12-anatomic-ultra-k1.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/files/waldent-tooth-extraction-forcep-kit-set-of-12-anatomic-ultra-k111-5_4db2411d-fa47-4eba-b96f-43635c2677aa.jpg?v=1782122067 | 0.9998 | 1/256 | Same photograph | — |
| 15 | `staging/product-photos/waldent/waldent-composite-anterior-instrument-kit-blue-set-of-5-k14-5.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/files/985.jpg?v=1779790107 | 0.9999 | 5/256 | Same photograph | Page live; product currently OutOfStock (page still exists, so the photograph remains correct). |
| 16 | `staging/product-photos/waldent/waldent-p-k-thomas-wax-carvers-set-of-5-k15-8.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/files/waldent-pk-thomas-wax-carvers-set-of-5-k158-3-6e1a8a.jpg?v=1782115440 | 1.0000 | 0/256 | Same photograph | — |
| 17 | `staging/product-photos/waldent/waldent-oral-surgical-impaction-kit-set-of-21-k9-2.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/products/impaction-kit.jpg?v=1571146532 | 0.9998 | 7/256 | Same photograph | — |
| 18 | `staging/product-photos/waldent/waldent-hemostatic-liquid.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/products/waldent_hemos.jpg?v=1663310493 | 1.0000 | 4/256 | Same photograph | — |
| 19 | `staging/product-photos/waldent/waldent-orthodontic-tweed-loop-forming-pliers-10-107.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/products/tweed-loop-forming.jpg?v=1571146192 | 0.9999 | 1/256 | Same photograph | — |
| 20 | `staging/product-photos/waldent/waldent-pedodontic-extraction-forceps-kit-premium-set-of-7-k1-9.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/products/1artboard_17_1.jpg?v=1663316486 | 1.0000 | 0/256 | Same photograph | Page live; product currently OutOfStock (page still exists, so the photograph remains correct). |
| 21 | `staging/product-photos/waldent/waldent-caries-detector.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/products/product_caries_3_2.jpg?v=1640774940 | 1.0000 | 2/256 | Same photograph | — |
| 22 | `staging/product-photos/waldent/waldent-fissureseal-pit-and-fissure-sealant-lc.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/files/mockup_-_fissure_seal_1.jpg?v=1685946089 | 1.0000 | 1/256 | Same photograph | — |
| 23 | `staging/product-photos/waldent/waldent-crown-and-bridge-tooth-preparation-diamond-bur-kit-set.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/files/whatsapp_image_2024-11-12_at_4.15.16_pm_55507a3a-1d7d-4934-a46f-b5c168ab2e51.jpg?v=1752491340 | 1.0000 | 0/256 | Same photograph | — |
| 24 | `staging/product-photos/waldent/waldent-nanofill-zirconium-composite-kit.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/products/1_5__1.jpg?v=1664543254 | 0.9999 | 3/256 | Same photograph | — |
| 25 | `staging/product-photos/waldent/waldent-implant-holding-tweezer-19-173.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/files/waldent-implant-holding-tweezer-19173-3.jpg?v=1787050645 | 1.0000 | 1/256 | Same photograph | — |
| 26 | `staging/product-photos/waldent/waldent-bestetch.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/products/bestetch_2_2.jpg?v=1640766253 | 0.9999 | 3/256 | Same photograph | — |
| 27 | `staging/product-photos/waldent/waldent-schuster-class-b-autoclave-23l.webp` | https://cdn.shopify.com/s/files/1/0279/6591/5229/files/schuster_autocalve_2.jpg?v=1714541537 | 0.9998 | 21/256 | Same photograph | — |

`r` is the Pearson correlation between the staged WebP and the live primary image after both are flattened on white and reduced to 64 × 64 greyscale; 1.0000 is identical. dHash is the Hamming distance over a 256-bit difference hash (0 = identical).

## Caveats

- **Flexiwave 21 mm and 25 mm share one photograph.** Waldent serves two separate files (`dtyrtyukiul.jpg` and `dtyrtyukiul_2.jpg`) that are visually identical, and the two staged WebPs are byte-identical. The photograph therefore matches both pages but cannot evidence which length a customer receives; if either is ever published it needs a length-specific photograph or a caption that does not imply the length is shown.
- **3 products are live but currently out of stock on Waldent's own page**: `waldent-pedo-rubber-dam-frame-small-16-139`, `waldent-composite-anterior-instrument-kit-blue-set-of-5-k14-5`, `waldent-pedodontic-extraction-forceps-kit-premium-set-of-7-k1-9`. Out of stock is not withdrawn — the page, title, SKU and photograph are all unchanged, so each still matches.
- **Max Piezo 2** carries the promotion `( 5 Scaler Tips Free )` in its live title. It is the same product and model; the promotion is not part of the photograph.
- No page returned a bot challenge or block, so no result here is a false negative caused by Waldent refusing automated requests.

## What was deliberately not done

- No photograph was copied into `public/products/` and none was published.
- No file was moved out of `staging/product-photos/waldent/`.
- `src/data/image-rights.ts` was not touched; `PRODUCT_PHOTOS_LIVE` remains `false`.
- Nothing was sent to Waldent or to anyone else. Permission is still not on file, so every one of these 27 remains staged.

Re-running this check is a matter of opening the same 27 URLs and repeating steps 1–5; the machine-readable result of this pass is in `docs/WALDENT-27-REVERIFIED.json`.
