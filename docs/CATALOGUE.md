# SOMIL Dental Store — Catalogue Guide

Everything about the product catalogue lives in plain TypeScript files. There is no admin panel
and no database. You edit a file, commit, and the site rebuilds.

- **344 products** across **23 clinical areas**
- **130 brands**
- One file per clinical area in `src/data/catalogue/`

---

## 1. Where everything lives

```
src/data/
  types.ts              the Product shape (edit only if you add a new field)
  categories.ts         the 23 clinical areas: names, blurbs, artwork
  products.ts           joins the catalogue together, derives brands / search / helpers
  catalogue/
    index.ts            the list of area files that make up the catalogue
    restorative.ts      15 products
    endodontics.ts      15
    prosthodontics.ts   15
    impression.ts       15
    instruments.ts      15
    burs.ts             15
    handpieces.ts       15
    orthodontics.ts     15
    implantology.ts     15
    oralSurgery.ts      15
    periodontics.ts     15
    pedodontics.ts      15
    laboratory.ts       15
    consumables.ts      15
    infectionControl.ts 15
    sterilization.ts    15
    equipment.ts        15
    imaging.ts          15
    preventive.ts       15
    whitening.ts        15
    digital.ts          15
    anaesthetics.ts     14
    clinicKits.ts       15
```

Nothing else needs touching to add a product. Cards, detail pages, filters, search, sorting and
the sitemap are all generated from these arrays at build time.

---

## 2. The product shape

Every entry is one object. Only `slug`, `name`, `brand`, `category`, `subcategory`, `summary` and
`visual` are required.

| Field | Type | What it does |
| --- | --- | --- |
| `slug` | `string` | The URL: `/product/<slug>`. Lowercase, hyphens, never change it after publishing. |
| `name` | `string` | Product name without the brand repeated. Shown as the title. |
| `brand` | `string` | Manufacturer or brand. Drives the brand filter and the card eyebrow. |
| `category` | `CategorySlug` | Must match a slug in `categories.ts`. |
| `subcategory` | `string` | Free text, e.g. `"Rotary Files"`. Shown under the brand. |
| `packaging` | `string \| null` | Pack size, e.g. `"Pack of 100"`, `"4 g syringe"`, `"Kit"`. |
| `summary` | `string` | One or two factual sentences. No marketing claims. |
| `specs` | `{ label, value }[]` | Rendered as the specification table. Any number of rows. |
| `price` | `number \| null` | Rupees, whole numbers. **`null` renders "Price on request".** |
| `visual` | `ProductVisual` | Which illustration to draw. See section 5. |
| `image` | `ProductImage \| null` | Real photograph, once you have one. See section 4. |
| `featured` | `boolean?` | Surfaces on the homepage. |
| `popular` | `boolean?` | Surfaces in the "Most asked for" rail. |
| `tags` | `string[]?` | Extra search keywords. |

### Adding a product

Open the file for the right clinical area and append an object to the array:

```ts
{
  slug: "3m-filtek-z350-xt-a2-4g",
  name: "Filtek Z350 XT Universal Restorative",
  brand: "3M ESPE",
  category: "restorative",
  subcategory: "Universal Composite",
  packaging: "4 g syringe",
  summary: "Nanofilled universal composite in a 4 g syringe for anterior and posterior restorations.",
  specs: [
    { label: "Shade", value: "A2" },
    { label: "Fillers", value: "Zirconia / silica, 78.5% by weight" },
  ],
  price: 4290,      // or null
  visual: "syringe",
  image: null,
},
```

Then `npm run build`. That is the whole workflow.

---

## 3. Prices — read this first

The catalogue never invents a price.

- A number in `price` means **you have confirmed that price**.
- `price: null` renders **"Price on request"** and swaps the add-to-cart button for a WhatsApp
  enquiry. The product still appears in filters, search and category pages.
- The 288 prices currently in the catalogue were observed on public retail listings in November
  2026 as a starting reference. **Replace them with your own selling prices before you take real
  orders.** They are a research starting point, not a rate card.
- To clear a price you are unsure about, set it to `null`. The store degrades gracefully.

The same rule applies to stock. There is no stock field. Nothing on the site says "in stock",
"only 2 left" or ships tomorrow, because none of that has been confirmed. Availability is
settled in the WhatsApp conversation, which is where it belongs.

---

## 4. Product photographs

Products currently use original illustrations, because no licensed photographs were available.
**No competitor images were copied and nothing is hotlinked.** Every product carries
`image: null` until you supply a file.

### Adding a real photograph

1. Put the file in `public/products/` — for example `public/products/filtek-z350-a2.jpg`.
2. Point the product at it and record where it came from:

```ts
image: {
  src: "/products/filtek-z350-a2.jpg",
  alt: "Filtek Z350 XT syringe, A2 shade",
  source: "3M ESPE distributor media kit",
  license: "Used with permission, 2026-11-22",
},
```

`source` and `license` are required by design: they are your record of why you are allowed to
publish the image. If you cannot fill both in honestly, leave `image: null` and keep the
illustration.

### Image rules

- Photograph square, at least 1200 × 1200 px, on a plain white or light background.
- Keep the product centred with even margins so the grid stays aligned.
- JPG or PNG. Aim for under 250 KB each.
- Prefer the manufacturer's own press or distributor media kit. Get written permission for
  anything you did not shoot yourself.
- Never save an image from a competitor's website into `public/`.

When `image` is set, the illustration is replaced everywhere: cards, category grids and the
detail page.

---

## 5. Illustrations (`visual`)

Sixteen original illustrations keep 344 SKUs visually consistent until photographs arrive.
Pick the closest one:

| Value | Looks like | Use for |
| --- | --- | --- |
| `syringe` | syringe with plunger | composites, cements, bonding agents, etchants |
| `bottle` | bottle with label | solutions, sealers, rinses, disinfectants |
| `tube` | crimped tube | pastes, gels, whitening products |
| `box` | carton | kits, packs, gloves, consumables, floss |
| `instrument` | mirror and handle | hand instruments, probes, forceps, scissors |
| `bur` | bur with shank | burs, discs, polishers |
| `handpiece` | handpiece body | air rotors, contra-angles, motors |
| `file` | endo file | files, reamers, gutta percha, paper points |
| `bracket` | bracket on a wire | brackets, wires, elastomerics, appliances |
| `implant` | implant with thread | implants, abutments, grafts, membranes |
| `suture` | needle and thread | sutures, needles |
| `carpule` | anaesthetic cartridge | cartridges, syringes, topical anaesthetic |
| `ppe` | face mask | gloves, masks, gowns, eye protection |
| `machine` | device with a screen | equipment, autoclaves, scalers, X-ray, scanners |
| `impression` | tub of material | alginates, silicones, putty, bite registration |
| `crown` | tooth with a crown | crowns, dentures, teeth sets, prosthetics |

The tile colour comes from the clinical area, so illustrations stay consistent automatically.

---

## 6. Adding a new clinical area

1. Create `src/data/catalogue/myArea.ts`:

```ts
import type { Product } from "../types";

export const myArea: Product[] = [
  // products…
];
```

2. Register it in `src/data/catalogue/index.ts`.
3. Add the area to `categories.ts` with a `slug`, `name`, `shortName`, `blurb`, `description`,
   `visual` and `order`.
4. Add the slug to the `CategorySlug` union in `src/data/types.ts`.

The category page, filter chip, homepage tile and sitemap entry all appear automatically.

---

## 7. Adding a brand

Just type it into `brand`. The brand filter is derived from the data, so a new brand appears in
the list on the next build with its product count. Keep spellings identical across products —
`3M ESPE`, not `3M` in one row and `3M ESPE` in another — or they become two filters.

---

## 8. Before you publish

- [ ] Every `price` you keep is one you would honour.
- [ ] Every `image` has a truthful `source` and `license`.
- [ ] No spec contains a claim you cannot support (no "clinically proven", no certification
      numbers you have not verified).
- [ ] Slugs are unique. `npm run build` fails loudly on a duplicate.
- [ ] `npm run build` passes before you push.

---

## 9. Commands

```bash
npm run dev      # local preview on http://localhost:3000
npm run build    # production build, validates every page
git add -A && git commit -m "catalogue: …" && git push
npx vercel deploy --prod
```
