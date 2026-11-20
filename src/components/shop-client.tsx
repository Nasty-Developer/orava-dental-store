"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { products, priceRange, formatPrice } from "@/data/products";
import { categories, categoryMap, type CategorySlug } from "@/data/categories";
import { ProductCard } from "@/components/product-card";
import { IconSearch, IconClose, IconChevronDown } from "@/components/icons";

type SortKey = "featured" | "popular" | "price-asc" | "price-desc" | "name" | "rating";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "popular", label: "Most popular" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "rating", label: "Top rated" },
  { key: "name", label: "Name A–Z" },
];

const PAGE_SIZE = 12;

export function ShopClient({ initialCategory }: { initialCategory?: string }) {
  const params = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [activeCats, setActiveCats] = useState<string[]>(
    initialCategory ? [initialCategory] : params.get("category") ? [params.get("category")!] : [],
  );
  const [sort, setSort] = useState<SortKey>((params.get("sort") as SortKey) ?? "featured");
  const [maxPrice, setMaxPrice] = useState(priceRange.max);
  const [onlyStock, setOnlyStock] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  // keep the URL shareable
  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    if (activeCats.length === 1) next.set("category", activeCats[0]);
    if (sort !== "featured") next.set("sort", sort);
    const qs = next.toString();
    router.replace(`/shop${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [query, activeCats, sort, router]);

  useEffect(() => setVisible(PAGE_SIZE), [query, activeCats, sort, maxPrice, onlyStock]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (activeCats.length && !activeCats.includes(p.category)) return false;
      if (p.price > maxPrice) return false;
      if (onlyStock && p.stock === 0) return false;
      if (!term) return true;
      const haystack = [
        p.name,
        p.subtitle,
        p.shortDescription,
        p.description,
        categoryMap[p.category]?.name ?? "",
        ...(p.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        case "popular":
          return b.reviewCount - a.reviewCount;
        default:
          return Number(!!b.featured) - Number(!!a.featured) || a.price - b.price;
      }
    });

    return list;
  }, [query, activeCats, sort, maxPrice, onlyStock]);

  const toggleCat = (slug: string) =>
    setActiveCats((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );

  const clearAll = () => {
    setQuery("");
    setActiveCats([]);
    setMaxPrice(priceRange.max);
    setOnlyStock(false);
    setSort("featured");
  };

  const hasFilters =
    query.trim() !== "" || activeCats.length > 0 || maxPrice < priceRange.max || onlyStock;

  return (
    <div className="shell py-10 md:py-12">
      <div className="grid gap-10 lg:grid-cols-[248px_1fr] lg:gap-14">
        {/* ── filters ── */}
        <aside className="lg:sticky lg:top-[100px] lg:self-start">
          <div className="flex items-center gap-2 border-b border-line-strong pb-2">
            <IconSearch size={16} className="text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="w-full bg-transparent py-1.5 text-[13.5px] outline-none placeholder:text-ink-faint"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search" className="text-ink-faint hover:text-ink">
                <IconClose size={14} />
              </button>
            )}
          </div>

          <div className="mt-7">
            <p className="eyebrow">Category</p>
            <ul className="mt-3.5 space-y-0.5">
              {categories.map((c) => {
                const active = activeCats.includes(c.slug);
                const n = products.filter((p) => p.category === c.slug).length;
                return (
                  <li key={c.slug}>
                    <button
                      onClick={() => toggleCat(c.slug)}
                      className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-[13px] transition-colors ${
                        active ? "bg-canvas-tint text-ink" : "text-ink-mute hover:text-ink"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={`h-3 w-3 rounded-[3px] border transition-colors ${
                            active ? "border-clinic-600 bg-clinic-600" : "border-line-strong"
                          }`}
                        >
                          {active && (
                            <svg viewBox="0 0 12 12" className="h-full w-full p-[2px] text-white" fill="none">
                              <path d="m2.5 6.2 2.3 2.3L9.5 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                          )}
                        </span>
                        {c.shortName}
                      </span>
                      <span className="text-[11px] tabular-nums text-ink-faint">{n}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-7 border-t border-line pt-6">
            <div className="flex items-baseline justify-between">
              <p className="eyebrow">Max price</p>
              <span className="text-[12.5px] tabular-nums text-ink">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label="Maximum price"
              className="mt-4 w-full accent-clinic-600"
            />
            <div className="mt-1 flex justify-between text-[10.5px] tabular-nums text-ink-faint">
              <span>{formatPrice(priceRange.min)}</span>
              <span>{formatPrice(priceRange.max)}</span>
            </div>
          </div>

          <div className="mt-6 border-t border-line pt-5">
            <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-ink-mute">
              <input
                type="checkbox"
                checked={onlyStock}
                onChange={(e) => setOnlyStock(e.target.checked)}
                className="h-3.5 w-3.5 accent-clinic-600"
              />
              In stock only
            </label>
          </div>

          {hasFilters && (
            <button
              onClick={clearAll}
              className="mt-6 text-[12px] text-clinic-700 underline underline-offset-4 hover:text-ink"
            >
              Clear all filters
            </button>
          )}
        </aside>

        {/* ── results ── */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
            <p className="text-[12.5px] text-ink-mute">
              <span className="tabular-nums text-ink">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "product" : "products"}
              {activeCats.length === 1 && (
                <span className="text-ink-faint"> in {categoryMap[activeCats[0] as CategorySlug]?.shortName}</span>
              )}
            </p>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort products"
                className="appearance-none rounded-full border border-line-strong bg-white py-2 pl-4 pr-9 text-[12.5px] text-ink outline-none transition-colors hover:border-ink/25"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
              <IconChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            </div>
          </div>

          {activeCats.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {activeCats.map((slug) => (
                <button
                  key={slug}
                  onClick={() => toggleCat(slug)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-canvas-tint px-3 py-1.5 text-[11.5px] text-ink-soft"
                >
                  {categoryMap[slug as CategorySlug]?.shortName}
                  <IconClose size={12} />
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-display text-[24px] tracking-[-0.02em] text-ink">
                Nothing matches that.
              </p>
              <p className="mt-2 max-w-[320px] text-[13.5px] leading-relaxed text-ink-mute">
                Try a different word, or clear the filters to see the full shelf.
              </p>
              <button onClick={clearAll} className="btn-ghost mt-6">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <motion.div
                layout
                className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.slice(0, visible).map((p) => (
                    <motion.div
                      key={p.slug}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {visible < filtered.length && (
                <div className="mt-14 flex justify-center">
                  <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-ghost">
                    Show more ({filtered.length - visible} left)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
