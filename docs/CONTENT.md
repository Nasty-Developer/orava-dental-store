# Editing content

Everything customer-facing that is not a component lives in three files.

## 1. `src/data/site.ts`

- Brand name, tagline, description
- WhatsApp order number and support number (digits only, country code first)
- Email, address, opening hours
- Free shipping threshold and flat shipping charge
- Currency

## 2. `src/data/products.ts`

The catalogue. Add, remove or edit objects in the array. See README for the field list.

## 3. `src/data/categories.ts`

The six categories. Each has a name, a short name (used in navigation), a one-line blurb,
a longer description for the category page, and a placeholder art key.

If you add a category you must also add its slug to the `CategorySlug` union at the top of
the file, and give it a tint in `categoryTint` inside `src/components/product-art.tsx`.

## Placeholder art

Product visuals are drawn SVGs (`src/components/product-art.tsx`), not stock photos, so the
catalogue stays visually consistent until real photography arrives. Available keys:

`serum`, `strips`, `kit`, `brush`, `floss`, `bottle`, `mist`, `gel`, `scaler`, `mirror`,
`kidbrush`, `aligner`, `wax`

## Sample content to replace

- Product descriptions, prices, stock levels, ratings and review counts are placeholders.
- Reviews are not displayed as a list yet; only the aggregate count and rating are shown.
  Replace them with real figures, or set `reviewCount` to 0.
