# Orava — Dental Care Store

A premium dental products storefront built with Next.js 15 (App Router), TypeScript and
Tailwind CSS. Orders are placed over WhatsApp; there is no online payment and no admin panel.

Live: https://orava-dental-store.vercel.app

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Where things live

```
src/
  data/
    site.ts          brand, contact numbers, shipping thresholds, currency
    products.ts      THE PRODUCT CATALOGUE — edit this to add or change products
    categories.ts    the six categories
  components/        reusable UI (header, footer, cart drawer, product cards, art)
  lib/
    cart.tsx         cart state + localStorage persistence
    whatsapp.ts      WhatsApp message composition and links
  app/               routes
```

## Adding a product

Open `src/data/products.ts` and append an object to the `products` array:

```ts
{
  slug: "enamel-mint-toothpaste",       // URL: /product/enamel-mint-toothpaste
  name: "Enamel Mint Toothpaste",
  subtitle: "1,450 ppm fluoride",
  category: "clinical",                  // whitening | brushes | rinses | clinical | kids | ortho
  price: 399,                            // INR, whole rupees
  compareAt: 499,                        // optional "was" price
  size: "100 g",
  shortDescription: "One line for cards.",
  description: "The full paragraph shown on the product page.",
  highlights: ["Point one", "Point two"],
  specs: [{ label: "Fluoride", value: "1,450 ppm" }],
  stock: 40,
  rating: 4.5,
  reviewCount: 12,
  visual: "gel",                         // placeholder art key — see ProductVisual
  image: "/products/enamel-mint.jpg",    // optional: use a real photo instead
}
```

Nothing else needs editing. The product appears in the shop, its category page, search,
filters and the sitemap automatically.

### Using real photographs

1. Put the file in `public/products/`.
2. Add `image: "/products/<file>.jpg"` to that product.

`ProductArt` renders the drawn placeholder only when no `image` is set.

## Contact details

All numbers, the email address and the free-shipping threshold live in
`src/data/site.ts`. Change them there, not in components.

## Deploy

Connected to Vercel; pushing to `main` deploys automatically.
