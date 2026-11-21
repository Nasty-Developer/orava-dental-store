# Real product photographs: how we get them, legally

The catalogue is 344 products across 130 brands and every one of them currently shows an
original illustration. Illustrations were chosen on purpose: they carry no rights problem and
they keep the grid honest. Replacing them with photographs is the next step, and the only
thing standing in the way is **permission**, not pixels.

There are two routes. Both end with a file in `public/products/` and an `image` block in the
catalogue. Neither involves saving anything from a competitor's website.

---

## Route A: photograph the stock you actually hold

The strongest option, and the only one that needs nobody's approval. If the product is on your
shelf, it is yours to photograph.

Shoot list: [IMAGE-QUEUE.md](./IMAGE-QUEUE.md), featured products first.

How to shoot so the grid stays even:

- One product per frame, centred, on plain white or very light grey. A sheet of white A3 card
  and window light is enough.
- Square framing, product filling roughly 80% of the frame, even margins on all four sides.
- 1200 × 1200 px minimum. Phone cameras are fine; keep them steady and avoid harsh shadows.
- Include the pack, not just the item, when the pack size is part of the listing (for example
  "Pack of 50"). Buyers compare pack shots.
- No clinic background, no hands, no logos of other shops in frame.

## Route B: the brand's own media kit, with permission in writing

Most Indian dental brands (Waldent, GDC, Woodpecker, Oracraft, Ammdent, Maarc, Polydentia and
the rest) supply product photography to their dealers. If you buy from them, ask. What counts
as permission is a written yes, on email or WhatsApp, from someone at the brand, saying you may
use their product images on your own store. Keep that message. It is the `license` value.

What does **not** count:

- images copied from Dentalkart, PinkBlue, Amazon, IndiaMART or any other shop
- images hotlinked from a brand site (a URL in `src` instead of a file in `public/`)
- "everyone uses these" or "it was on Google Images"
- a verbal yes you cannot show later

### Request message (copy, adjust the brand name)

> Hello [Brand] team,
>
> I run SOMIL Dental Products, an online store for dental clinics and laboratories in India. We
> stock [Brand] products and would like to list them with proper product photography.
>
> Could you share your product image pack for the items below, and confirm in writing that we may
> publish those images on our own store? We will credit [Brand] on each listing and will replace
> them immediately if you ever want us to.
>
> Items: [list the product names and pack sizes from IMAGE-QUEUE.md]
>
> Thank you,
> [Name], SOMIL Dental Products, [phone]

Send it per brand, not once to everyone: a dealer manager can usually say yes in a day, and one
yes unlocks a whole brand's range (Waldent alone is 33 products).

---

## Importing a photograph

```bash
node tools/import-product-image.mjs <slug> ~/photos/filtek.jpg \
  --source "3M ESPE distributor media kit" \
  --license "Written permission, 3M India, 2026-11-22" \
  --alt "Filtek Z350 XT syringe, A2 shade"
```

The tool flattens the photo onto white, fits it into a 1200 × 1200 square, saves it as
`public/products/<slug>.webp` under 250 KB, and rewrites that product's `image` block. It
refuses to run without `--source` and `--license`, because those two fields are the record of
why the photograph may be published.

Add `--dry-run` to see the catalogue block without writing anything.

Then:

```bash
npm run images:check   # validates every photograph in the catalogue
npm run images:queue   # regenerates the waiting list
```

## Rules the build should keep

- Square, at least 1200 × 1200 px, plain background, under 250 KB.
- `source` and `license` filled in honestly. If you cannot, leave `image: null`.
- Never a competitor's image, never a hotlink.
- When `image` is set, the photograph replaces the illustration on the homepage, cards,
  category grids, the product page, the cart and checkout. The "Illustration" chip and the
  placeholder caption disappear on their own.
- A photograph of one pack size must not be reused for a different pack size unless the pack
  is identical.

## Where the code lives

- `src/components/product-shot.tsx` decides photo or illustration, in one place.
- `src/data/catalogue/*.ts` holds the `image` block per product.
- `tools/import-product-image.mjs`, `tools/check-product-images.mjs`,
  `tools/product-image-queue.mjs`.
