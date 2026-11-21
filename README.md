# SOMIL Dental Products

A premium dental care storefront. Browsing is fully online; every order is composed
into a WhatsApp message and confirmed by a person.

Live: https://somil-dental-products.vercel.app
Repo: https://github.com/Nasty-Developer/orava-dental-store

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion.
Fully static/SSG, so it deploys to Vercel with no server or database.
No payment gateway, no admin panel.

## Editing content

Everything customer-facing lives in three files.

| What | Where |
| --- | --- |
| Brand name, phone numbers, email, address, shipping rules, notices | `src/data/site.ts` |
| Products (name, price, stock, description, specs, images) | `src/data/products.ts` |
| Categories | `src/data/categories.ts` |

### Add a product

Append an object to the `products` array in `src/data/products.ts`. The slug becomes
the URL (`/product/<slug>`). Nothing else needs to change: the shop grid, category
pages, search, related products and the sitemap all read from that array.

```ts
{
  slug: "enamel-repair-gel",
  name: "Enamel Repair Gel",
  category: "clinical",
  price: 1299,
  compareAt: 1599,          // optional, shows a strikethrough
  size: "50 ml",
  shortDescription: "One line shown on cards.",
  description: "Full paragraph shown on the product page.",
  highlights: ["…", "…"],
  specs: [{ label: "Volume", value: "50 ml" }],
  stock: 24,                 // 0 shows Sold out
  featured: true,            // appears on the homepage
  popular: true,             // appears in "Popular this week"
  rating: 4.8,
  reviewCount: 128,
  visual: "gel",             // placeholder art key
  image: "/products/enamel-repair-gel.jpg",  // optional real photo
}
```

### Real product photography

Drop files into `public/products/` and add `image: "/products/<file>.jpg"` to a
product. Anything without an `image` keeps the drawn SVG placeholder from
`src/components/product-art.tsx`, so the catalogue never looks broken while you
photograph the range.

### Brand

The name, descriptor and legal name are in `src/data/site.ts` (`name`, `shortName`,
`descriptor`, `legalName`). The header, footer, loading screen, page titles, JSON-LD
and order messages all read from those values.

## Orders

`src/lib/whatsapp.ts` builds the order message: customer, phone, address, every line
with quantity and unit price, subtotal, shipping, total and notes, then opens it
against `site.whatsapp.number`. Orders are never marked paid or confirmed on the site.

## Loading screen

`src/components/loading-screen.tsx` renders in the server HTML, so it is painted on
first frame rather than popping in after hydration. It shows once per page load and
is skipped on client-side navigation, respects `prefers-reduced-motion`, and hides
itself if JavaScript is unavailable.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Phase 2 (not wired)

`db/schema.sql` holds a Supabase (PostgreSQL) schema for products, orders and
enquiries with row-level security, ready for when the database is provisioned. The
storefront does not read from it yet.
