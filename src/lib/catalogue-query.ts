import { categoryMap } from "@/data/categories";
import { priceRange, products } from "@/data/products";
import type { CategorySlug, Product } from "@/data/types";
import { NO_CEILING, PAGE_SIZE, type ShopParams, type SortKey } from "@/lib/shop-params";

/**
 * Server-side catalogue query for /shop.
 *
 * This module imports the full catalogue, so it must only ever be used from a
 * server component. The shop used to hand every product summary to the browser
 * as page props — fine at 344 rows, unworkable at 3,000. Filtering happens here
 * and only the visible page is serialised.
 *
 * The URL helpers live in `shop-params.ts`, which is client-safe.
 */

export { PAGE_SIZE, SORTS, parseShopParams, shopHref, toggleHref } from "@/lib/shop-params";
export type { ShopParams, SortKey } from "@/lib/shop-params";

export function matchesQuery(p: Product, terms: string[]): boolean {
  if (!terms.length) return true;
  const hay = [p.name, p.brand, p.subcategory, categoryMap[p.category]?.name ?? "", p.summary]
    .join(" ")
    .toLowerCase();
  return terms.every((t) => hay.includes(t));
}

function sortProducts(list: Product[], sort: SortKey): Product[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      break;
    case "price-desc":
      sorted.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "brand":
      sorted.sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
      break;
    default:
      sorted.sort(
        (a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          Number(Boolean(b.popular)) - Number(Boolean(a.popular)),
      );
  }
  return sorted;
}

export type ShopResult = {
  /** The products on the requested page only. */
  items: Product[];
  total: number;
  pageCount: number;
  page: number;
  /** Facet counts, each computed against the other active filters. */
  categoryCounts: Record<string, number>;
  brandCounts: Record<string, number>;
  subCounts: Record<string, number>;
  brandList: { name: string; count: number }[];
  subOptions: string[];
  activeCount: number;
  /** Highest real price in the catalogue, for the slider ceiling. */
  ceiling: number;
};

export function queryShop(params: ShopParams): ShopResult {
  const terms = params.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const hasCeiling = params.max > NO_CEILING;
  const cats = params.cats as CategorySlug[];

  // Everything matching the free-text query and the price ceiling. Facet counts
  // are derived from this pool so they narrow as the shopper types.
  const base = products.filter(
    (p) => matchesQuery(p, terms) && (!hasCeiling || p.price === null || p.price <= params.max),
  );

  const inCats = (p: Product) => !cats.length || cats.includes(p.category);
  const inBrands = (p: Product) => !params.brands.length || params.brands.includes(p.brand);
  const inSubs = (p: Product) => !params.subs.length || params.subs.includes(p.subcategory);

  const categoryCounts: Record<string, number> = {};
  const brandCounts: Record<string, number> = {};
  const subCounts: Record<string, number> = {};

  for (const p of base) {
    if (inBrands(p) && inSubs(p)) categoryCounts[p.category] = (categoryCounts[p.category] ?? 0) + 1;
    if (inCats(p) && inSubs(p)) brandCounts[p.brand] = (brandCounts[p.brand] ?? 0) + 1;
    if (inCats(p) && inBrands(p)) subCounts[p.subcategory] = (subCounts[p.subcategory] ?? 0) + 1;
  }

  const matched = base.filter((p) => inCats(p) && inBrands(p) && inSubs(p));
  const sorted = sortProducts(matched, params.sort);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, params.page), pageCount);
  const items = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const brandList = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));

  const subOptions = Object.keys(subCounts).sort((a, b) => a.localeCompare(b));

  const activeCount =
    cats.length + params.brands.length + params.subs.length + (params.q.trim() ? 1 : 0);

  return {
    items,
    total: sorted.length,
    pageCount,
    page,
    categoryCounts,
    brandCounts,
    subCounts,
    brandList,
    subOptions,
    activeCount,
    ceiling: priceRange.max,
  };
}
