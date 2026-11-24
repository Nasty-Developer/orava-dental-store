import Link from "next/link";
import { categories } from "@/data/categories";
import { IconCheck, IconClose } from "@/components/icons";
import { BrandFilter, PriceFilter } from "@/components/shop-controls";
import { toggleHref } from "@/lib/shop-params";
import type { ShopParams } from "@/lib/shop-params";
import type { ShopResult } from "@/lib/catalogue-query";

/**
 * The shop facet panel, rendered on the server.
 *
 * Every option is a link, not a button: selecting a facet is a navigation, the
 * server re-filters the catalogue and returns only the visible page of products.
 * That is what lets the catalogue grow to 3,000 rows without shipping any of it
 * to the browser.
 */

export function FilterSection({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
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

export function FilterRow({
  href,
  label,
  meta,
  checked,
}: {
  href: string;
  label: string;
  meta?: number;
  checked: boolean;
}) {
  return (
    <Link
      href={href}
      scroll={false}
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
    </Link>
  );
}

export function ShopFilterPanel({ params, result }: { params: ShopParams; result: ShopResult }) {
  return (
    <>
      <FilterSection title="Category" count={params.cats.length}>
        <div className="max-h-[260px] overflow-y-auto pr-1">
          {categories.map((c) => (
            <FilterRow
              key={c.slug}
              href={toggleHref(params, "cats", c.slug)}
              label={c.shortName}
              meta={result.categoryCounts[c.slug] ?? 0}
              checked={params.cats.includes(c.slug)}
            />
          ))}
        </div>
      </FilterSection>

      {params.cats.length > 0 && result.subOptions.length > 1 && (
        <FilterSection title="Type" count={params.subs.length}>
          <div className="max-h-[220px] overflow-y-auto pr-1">
            {result.subOptions.map((sub) => (
              <FilterRow
                key={sub}
                href={toggleHref(params, "subs", sub)}
                label={sub}
                meta={result.subCounts[sub] ?? 0}
                checked={params.subs.includes(sub)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Brand" count={params.brands.length}>
        <BrandFilter params={params} brands={result.brandList} />
      </FilterSection>

      <FilterSection title="Max price">
        <PriceFilter params={params} ceiling={result.ceiling} />
      </FilterSection>

      {result.activeCount > 0 && (
        <Link
          href="/shop"
          className="mt-4 flex items-center gap-1.5 text-[12px] text-ink-mute transition-colors hover:text-ink"
        >
          <IconClose size={12} /> Clear all filters
        </Link>
      )}
    </>
  );
}
