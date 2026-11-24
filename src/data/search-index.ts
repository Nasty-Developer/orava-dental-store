import { products } from "./products";
import type { SearchIndexItem } from "./types";

/**
 * The static search index.
 *
 * The header search and the cart fallback both need to look a product up by
 * name or slug, but neither may import the catalogue: that module is ~320 KB
 * of JavaScript today and would be megabytes at 3,000 products, on every page.
 *
 * Instead this slim projection is prerendered once to /search-index.json and
 * fetched on demand — the first time someone focuses the search box, or when a
 * cart saved before this index existed only holds slugs.
 *
 * Keep this list to the fields a result row actually renders. Anything added
 * here is paid for by every visitor who searches.
 */
export const searchIndex: SearchIndexItem[] = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  category: p.category,
  subcategory: p.subcategory,
  packaging: p.packaging,
  summary: p.summary,
  price: p.price,
  visual: p.visual,
  image: p.image,
}));
