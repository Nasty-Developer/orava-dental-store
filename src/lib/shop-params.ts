/**
 * Shop URL parameters — client-safe.
 *
 * This module must never import the catalogue. It is used by the browser-side
 * controls, so anything reachable from here ends up in the JS bundle. The
 * filtering itself lives in `catalogue-query.ts`, which is server-only.
 */

export const PAGE_SIZE = 24;

/** `max: 0` means "no price ceiling". */
export const NO_CEILING = 0;

export type SortKey = "featured" | "price-asc" | "price-desc" | "name" | "brand";

export const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "brand", label: "Brand A–Z" },
  { key: "name", label: "Name A–Z" },
];

export type ShopParams = {
  q: string;
  cats: string[];
  brands: string[];
  subs: string[];
  sort: SortKey;
  /** 0 = no ceiling */
  max: number;
  page: number;
};

type RawParams = Record<string, string | string[] | undefined>;

/** Comma-separated list from a search param, de-duplicated and trimmed. */
function list(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const parts = Array.isArray(value) ? value : [value];
  const flat = parts.flatMap((p) => p.split(","));
  return [...new Set(flat.map((s) => s.trim()).filter(Boolean))];
}

export function parseShopParams(raw: RawParams): ShopParams {
  const validSorts = new Set(SORTS.map((s) => s.key));
  const sortRaw = typeof raw.sort === "string" ? raw.sort : "";
  const sort = (validSorts.has(sortRaw as SortKey) ? sortRaw : "featured") as SortKey;

  const maxRaw = Number(typeof raw.max === "string" ? raw.max : NaN);
  const max = Number.isFinite(maxRaw) && maxRaw > 0 ? Math.floor(maxRaw) : NO_CEILING;

  const pageRaw = Number(typeof raw.page === "string" ? raw.page : NaN);

  return {
    q: typeof raw.q === "string" ? raw.q : "",
    cats: list(raw.category),
    brands: list(raw.brand),
    subs: list(raw.sub),
    sort,
    max,
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1,
  };
}

/** Build a /shop URL from a partial parameter set. Empty values are dropped. */
export function shopHref(p: Partial<ShopParams>): string {
  const sp = new URLSearchParams();
  if (p.q?.trim()) sp.set("q", p.q.trim());
  if (p.cats?.length) sp.set("category", p.cats.join(","));
  if (p.brands?.length) sp.set("brand", p.brands.join(","));
  if (p.subs?.length) sp.set("sub", p.subs.join(","));
  if (p.sort && p.sort !== "featured") sp.set("sort", p.sort);
  if (p.max !== undefined && p.max > 0) sp.set("max", String(p.max));
  if (p.page !== undefined && p.page > 1) sp.set("page", String(p.page));
  const qs = sp.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

/** Toggle one value in a facet list, returning the new URL. */
export function toggleHref(
  params: ShopParams,
  key: "cats" | "brands" | "subs",
  value: string,
): string {
  const current = params[key];
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  return shopHref({ ...params, [key]: next, page: 1 });
}
