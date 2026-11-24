"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { IconCheck, IconChevronDown, IconSearch } from "@/components/icons";
import { formatINR } from "@/lib/whatsapp";
import {
  SORTS,
  shopHref,
  toggleHref,
  type ShopParams,
  type SortKey,
} from "@/lib/shop-params";

/**
 * Browser-side controls for /shop.
 *
 * Nothing here imports the catalogue: these components only build URLs. The
 * filtering itself runs on the server, which is what keeps a 3,000-product
 * catalogue out of the JS bundle.
 */

/**
 * The brand facet.
 *
 * The brand list is small enough to live in the client, which buys an instant
 * filter-as-you-type over the names. Selecting one is still a link.
 */
export function BrandFilter({
  params,
  brands,
}: {
  params: ShopParams;
  brands: { name: string; count: number }[];
}) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? brands.filter((b) => b.name.toLowerCase().includes(q)) : brands;
  }, [brands, query]);

  // A brand that is already selected must stay visible even if the pool narrows.
  const selected = params.brands;
  const visible = expanded || query ? filtered : filtered.slice(0, 10);
  const hiddenSelected = selected
    .filter((s) => !visible.some((b) => b.name === s))
    .map((name) => ({ name, count: 0 }));

  if (!brands.length && !selected.length) return null;

  return (
    <>
      <div className="relative mb-2">
        <IconSearch size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find a brand"
          aria-label="Find a brand"
          className="w-full rounded-md border border-line bg-white py-1.5 pl-8 pr-2 text-[12.5px] outline-none transition-colors focus:border-clinic-400"
        />
      </div>
      <div className={expanded || query ? "max-h-[240px] overflow-y-auto pr-1" : ""}>
        {[...hiddenSelected, ...visible].map((b) => {
          const checked = selected.includes(b.name);
          return (
            <Link
              key={b.name}
              href={toggleHref(params, "brands", b.name)}
              scroll={false}
              aria-pressed={checked}
              className="group flex w-full items-center gap-2.5 py-[5px] text-left"
            >
              <span
                className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
                  checked
                    ? "border-clinic-600 bg-clinic-600 text-white"
                    : "border-line-strong bg-white"
                }`}
              >
                {checked && <IconCheck size={10} />}
              </span>
              <span
                className={`flex-1 truncate text-[12.5px] transition-colors ${
                  checked ? "text-ink" : "text-ink-mute group-hover:text-ink"
                }`}
              >
                {b.name}
              </span>
              {b.count > 0 && <span className="text-[10.5px] text-ink-faint">{b.count}</span>}
            </Link>
          );
        })}
        {visible.length === 0 && query && (
          <p className="py-2 text-[12px] text-ink-faint">No brand matches “{query}”.</p>
        )}
      </div>
      {!query && filtered.length > 10 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-[12px] text-clinic-700 underline decoration-line-strong underline-offset-4 hover:text-ink"
        >
          {expanded ? "Show fewer" : `All ${filtered.length} brands`}
        </button>
      )}
    </>
  );
}

/**
 * Search box. Debounced so typing "composite" produces one navigation, not nine.
 */
export function ShopControls({ params }: { params: ShopParams }) {
  const [value, setValue] = useState(params.q);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the box in step when the URL changes underneath it (back button,
  // "clear all filters", a category link).
  useEffect(() => setValue(params.q), [params.q]);

  useEffect(() => {
    if (value === params.q) return;
    const id = setTimeout(() => {
      window.location.href = shopHref({ ...params, q: value, page: 1 });
    }, 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative min-w-0 flex-1">
      <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            window.location.href = shopHref({ ...params, q: value, page: 1 });
          }
        }}
        placeholder="Search products, brands, categories"
        aria-label="Search products"
        className="w-full rounded-full border border-line bg-white py-2.5 pl-9 pr-9 text-[13px] outline-none transition-colors placeholder:text-ink-faint focus:border-clinic-400"
      />
      {value && (
        <button
          onClick={() => {
            setValue("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
        >
          <span aria-hidden className="text-[15px] leading-none">×</span>
        </button>
      )}
    </div>
  );
}

/** Sort control. Changing it is a navigation, so the server re-sorts. */
export function SortSelect({ params }: { params: ShopParams }) {
  return (
    <div className="relative">
      <select
        value={params.sort}
        onChange={(e) =>
          (window.location.href = shopHref({ ...params, sort: e.target.value as SortKey, page: 1 }))
        }
        aria-label="Sort products"
        className="appearance-none rounded-full border border-line bg-white py-2.5 pl-3.5 pr-9 text-[12.5px] outline-none focus:border-clinic-400"
      >
        {SORTS.map((s) => (
          <option key={s.key} value={s.key}>
            {s.label}
          </option>
        ))}
      </select>
      <IconChevronDown
        size={13}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint"
      />
    </div>
  );
}

/**
 * Price ceiling. A slider, because a shopper wants to feel the range, but the
 * value only becomes a navigation when it settles, so dragging does not fire a
 * request per pixel.
 */
export function PriceFilter({ params, ceiling }: { params: ShopParams; ceiling: number }) {
  const [value, setValue] = useState(params.max > 0 ? params.max : ceiling);

  useEffect(() => setValue(params.max > 0 ? params.max : ceiling), [params.max, ceiling]);

  const commit = (next: number) => {
    window.location.href = shopHref({ ...params, max: next >= ceiling ? 0 : next, page: 1 });
  };

  return (
    <>
      <input
        type="range"
        min={0}
        max={ceiling}
        step={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        onPointerUp={() => commit(value)}
        onKeyUp={() => commit(value)}
        aria-label="Maximum price"
        className="w-full accent-[#0C6E8F]"
      />
      <div className="mt-1 flex justify-between text-[11.5px] text-ink-mute">
        <span>{formatINR(0)}</span>
        <span className="tabular-nums text-ink">{formatINR(value)}</span>
      </div>
    </>
  );
}

/** Mobile sheet holding the server-rendered filter panel. */
export function FilterSheet({ count, children }: { count: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2.5 text-[12.5px] lg:hidden"
      >
        Filters
        {count > 0 && (
          <span className="rounded-full bg-clinic-600 px-1.5 py-0.5 text-[10px] text-white">
            {count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-ink/25 backdrop-blur-[2px] lg:hidden"
          />
          <div
            className="fixed inset-x-0 bottom-0 z-[61] max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 lg:hidden"
            role="dialog"
            aria-label="Filters"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[13px] font-medium">Filters</p>
              <button onClick={() => setOpen(false)} aria-label="Close filters">
                <span aria-hidden className="text-[18px] leading-none text-ink-mute">×</span>
              </button>
            </div>
            {children}
            <button onClick={() => setOpen(false)} className="btn-primary mt-6 w-full">
              Done
            </button>
          </div>
        </>
      )}
    </>
  );
}
