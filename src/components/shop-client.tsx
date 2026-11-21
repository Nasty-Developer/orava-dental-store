"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { products, priceRange, formatPrice, brands } from "@/data/products";
import { categories, categoryMap, type CategorySlug } from "@/data/categories";
import { ProductCard } from "@/components/product-card";
import { IconSearch, IconClose, IconChevronDown, IconCheck } from "@/components/icons";

type SortKey = "featured" | "price-asc" | "price-desc" | "name" | "brand";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "brand", label: "Brand A–Z" },
  { key: "name", label: "Name A–Z" },
];

const PAGE_SIZE = 24;

function FilterSection({
  title,
  children,
  count,
}: {
  title: string;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <div className="border-b border-line py-5 first:pt-0">
      <p className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-ink-faint">
        {title}
        {typeof count === "number" && count > 0 && (
          <span className="rounded-full bg-clinic-50 px-1.5 py-0.5 text-[9.5px] tracking-normal text-clinic-700">
            {count}
          </span>
        )}
      </p>
      {children}
    </div>
  );
}

function CheckRow({
  label,
  meta,
  checked,
  onChange,
}: {
  label: string;
  meta?: string | number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      aria-pressed={checked}
      className="group flex w-full items-center gap-2.5 py-[5px] text-left"
    >
      <span
        className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
          checked ? "border-clinic-600 bg-clinic-600 text-white" : "border-line-strong bg-white"
        }`}
      >
        {checked && <IconCheck size={10} />}
      </span>
      <span
        className={`flex-1 truncate text-[12.5px] transition-colors ${
          checked ? "text-ink" : "text-ink-mute group-hover:text-ink"
        }`}
      >
        {label}
      </span>
      {meta !== undefined && <span className="text-[10.5px] text-ink-faint">{meta}</span>}
    </button>
  );
}

export function ShopClient({ initialCategory }: { initialCategory?: string }) {
  const params = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [activeCats, setActiveCats] = useState<string[]>(
    initialCategory ? [initialCategory] : params.get("category") ? [params.get("category")!] : [],
  );
  const [activeBrands, setActiveBrands] = useState<string[]>(
    params.get("brand") ? [params.get("brand")!] : [],
  );
  const [sort, setSort] = useState<SortKey>((params.get("sort") as SortKey) ?? "featured");
  const [maxPrice, setMaxPrice] = useState(priceRange.max);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [brandQuery, setBrandQuery] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // keep the URL shareable
  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    if (activeCats.length === 1) next.set("category", activeCats[0]);
    if (activeBrands.length === 1) next.set("brand", activeBrands[0]);
    if (sort !== "featured") next.set("sort", sort);
    const qs = next.toString();
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  }, [query, activeCats, activeBrands, sort, router]);

  useEffect(() => setVisible(PAGE_SIZE), [query, activeCats, activeBrands, sort, maxPrice]);

  const toggle = (list: string[], value: string, set: (v: string[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);

    const list = products.filter((p) => {
      if (activeCats.length && !activeCats.includes(p.category)) return false;
      if (activeBrands.length && !activeBrands.includes(p.brand)) return false;
      if (p.price !== null && p.price > maxPrice) return false;
      if (!terms.length) return true;
      const hay = [p.name, p.brand, p.subcategory, categoryMap[p.category]?.name ?? "", p.summary]
        .join(" ")
        .toLowerCase();
      return terms.every((t) => hay.includes(t));
    });

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
          (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
            Number(Boolean(b.popular)) - Number(Boolean(a.popular)),
        );
    }
    return sorted;
  }, [query, activeCats, activeBrands, sort, maxPrice]);

  const brandList = useMemo(() => {
    const q = brandQuery.trim().toLowerCase();
    return brands.filter((b) => !q || b.name.toLowerCase().includes(q));
  }, [brandQuery]);

  const shownBrands = showAllBrands || brandQuery ? brandList : brandList.slice(0, 12);
  const activeCount = activeCats.length + activeBrands.length + (query ? 1 : 0);

  const clearAll = () => {
    setQuery("");
    setActiveCats([]);
    setActiveBrands([]);
    setMaxPrice(priceRange.max);
    setSort("featured");
  };

  const filters = (
    <>
      <FilterSection title="Category" count={activeCats.length}>
        <div className="max-h-[260px] overflow-y-auto pr-1">
          {categories.map((c) => (
            <CheckRow
              key={c.slug}
              label={c.shortName}
              meta={products.filter((p) => p.category === c.slug).length}
              checked={activeCats.includes(c.slug)}
              onChange={() => toggle(activeCats, c.slug, setActiveCats)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Brand" count={activeBrands.length}>
        <div className="relative mb-2">
          <IconSearch size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={brandQuery}
            onChange={(e) => setBrandQuery(e.target.value)}
            placeholder="Find a brand"
            aria-label="Find a brand"
            className="w-full rounded-md border border-line bg-white py-1.5 pl-8 pr-2 text-[12.5px] outline-none transition-colors focus:border-clinic-400"
          />
        </div>
        <div className={showAllBrands || brandQuery ? "max-h-[240px] overflow-y-auto pr-1" : ""}>
          {shownBrands.map((b) => (
            <CheckRow
              key={b.name}
              label={b.name}
              meta={b.count}
              checked={activeBrands.includes(b.name)}
              onChange={() => toggle(activeBrands, b.name, setActiveBrands)}
            />
          ))}
          {shownBrands.length === 0 && (
            <p className="py-2 text-[12px] text-ink-faint">No brand matches “{brandQuery}”.</p>
          )}
        </div>
        {!brandQuery && brandList.length > 12 && (
          <button
            onClick={() => setShowAllBrands((v) => !v)}
            className="mt-2 text-[12px] text-clinic-700 underline decoration-line-strong underline-offset-4 hover:text-ink"
          >
            {showAllBrands ? "Show fewer" : `All ${brandList.length} brands`}
          </button>
        )}
      </FilterSection>

      <FilterSection title="Max price">
        <input
          type="range"
          min={0}
          max={priceRange.max}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price"
          className="w-full accent-[#0C6E8F]"
        />
        <div className="mt-1 flex justify-between text-[11.5px] text-ink-mute">
          <span>{formatPrice(0)}</span>
          <span className="tabular-nums text-ink">{formatPrice(maxPrice)}</span>
        </div>
      </FilterSection>

      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="mt-4 flex items-center gap-1.5 text-[12px] text-ink-mute transition-colors hover:text-ink"
        >
          <IconClose size={12} /> Clear all filters
        </button>
      )}
    </>
  );

  return (
    <div className="shell py-10 md:py-12">
      <div className="grid gap-10 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-14">
        {/* desktop filters */}
        <aside className="hidden lg:sticky lg:top-[100px] lg:block lg:self-start">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">Filters</p>
          </div>
          <div className="mt-4">{filters}</div>
        </aside>

        <div>
          {/* toolbar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
            <div className="relative min-w-0 flex-1">
              <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands, categories"
                aria-label="Search products"
                className="w-full rounded-full border border-line bg-white py-2.5 pl-9 pr-9 text-[13px] outline-none transition-colors placeholder:text-ink-faint focus:border-clinic-400"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
                >
                  <IconClose size={13} />
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2.5 text-[12.5px] lg:hidden"
            >
              Filters
              {activeCount > 0 && (
                <span className="rounded-full bg-clinic-600 px-1.5 py-0.5 text-[10px] text-white">
                  {activeCount}
                </span>
              )}
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort products"
                className="appearance-none rounded-full border border-line bg-white py-2.5 pl-3.5 pr-9 text-[12.5px] outline-none focus:border-clinic-400"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
              <IconChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            </div>
          </div>

          <p className="mt-4 text-[12px] text-ink-faint">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
            {activeCats.length === 1 && ` in ${categoryMap[activeCats[0] as CategorySlug]?.shortName}`}
            {activeBrands.length === 1 && ` · ${activeBrands[0]}`}
          </p>

          {/* grid */}
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-[24px] tracking-[-0.01em]">Nothing matches that.</p>
              <p className="mx-auto mt-2 max-w-[38ch] text-[13px] text-ink-mute">
                Try a wider price range or fewer filters. If you are looking for something specific, our
                team can source it.
              </p>
              <button onClick={clearAll} className="btn-ghost mt-6">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
                {filtered.slice(0, visible).map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
              {visible < filtered.length && (
                <div className="mt-12 flex justify-center">
                  <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-ghost">
                    Load more ({filtered.length - visible} left)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* mobile filter sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-ink/25 backdrop-blur-[2px] lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 bottom-0 z-[61] max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 lg:hidden"
              role="dialog"
              aria-label="Filters"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[13px] font-medium">Filters</p>
                <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
                  <IconClose size={18} className="text-ink-mute" />
                </button>
              </div>
              {filters}
              <button onClick={() => setMobileOpen(false)} className="btn-primary mt-6 w-full">
                Show {filtered.length} products
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
