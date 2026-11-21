import { catalogue } from "./catalogue";
import { categories, categoryMap, type CategorySlug } from "./categories";
import type { Product } from "./types";

export type { Product, ProductVisual, ProductImage, CategorySlug } from "./types";

/**
 * The whole catalogue. Products live in src/data/catalogue/<area>.ts —
 * add a product by appending an object to the array for its clinical area.
 * Nothing else needs to change: cards, filters, search and the sitemap all
 * read from here.
 */
export const products: Product[] = catalogue;

export const productMap = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<
  string,
  Product
>;

export const getProduct = (slug: string) => productMap[slug];

export const productsByCategory = (slug: CategorySlug) =>
  products.filter((p) => p.category === slug);

export const productsByBrand = (brand: string) =>
  products.filter((p) => p.brand === brand);

export const featuredProducts = products.filter((p) => p.featured);
export const popularProducts = products.filter((p) => p.popular);

/** Brands with at least one product, most-stocked first. */
export const brands = Object.entries(
  products.reduce<Record<string, number>>((acc, p) => {
    acc[p.brand] = (acc[p.brand] ?? 0) + 1;
    return acc;
  }, {}),
)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([name, count]) => ({ name, count }));

export const brandNames = brands.map((b) => b.name);

/** Subcategories present in one category, alphabetically. */
export const subcategoriesFor = (slug: CategorySlug) =>
  Array.from(new Set(productsByCategory(slug).map((p) => p.subcategory))).sort();

export const countByCategory = categories.reduce<Record<string, number>>((acc, c) => {
  acc[c.slug] = products.filter((p) => p.category === c.slug).length;
  return acc;
}, {});

const priced = products.filter((p) => p.price !== null).map((p) => p.price as number);
export const priceRange = {
  min: Math.min(...priced),
  max: Math.max(...priced),
};

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

/** Simple weighted search over name, brand, subcategory and category. */
export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  const terms = q.split(/\s+/).filter(Boolean);
  return products
    .map((p) => {
      const cat = categoryMap[p.category];
      const haystack = [p.name, p.brand, p.subcategory, cat?.name ?? "", p.summary]
        .join(" ")
        .toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (p.name.toLowerCase().includes(t)) score += 4;
        if (p.brand.toLowerCase().includes(t)) score += 3;
        if (haystack.includes(t)) score += 1;
      }
      return { p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.p);
}
