import type { Metadata } from "next";
import Link from "next/link";
import { categoryMap, type CategorySlug } from "@/data/categories";
import { PageHeader } from "@/components/page-header";
import { ProductCard } from "@/components/product-card";
import { RevealGroup, StaggerItem } from "@/components/reveal";
import { FilterSheet, ShopControls, SortSelect } from "@/components/shop-controls";
import { ShopFilterPanel } from "@/components/shop-filter-panel";
import { PAGE_SIZE, parseShopParams, queryShop, shopHref } from "@/lib/catalogue-query";

const DESCRIPTION =
  "Browse the full SOMIL clinical range: restorative, endodontics, prosthodontics, impressions, instruments, burs, handpieces, orthodontics and surgery supplies, priced in INR and ordered on WhatsApp.";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = parseShopParams(await searchParams);
  const narrowed =
    params.cats.length > 0 ||
    params.brands.length > 0 ||
    params.subs.length > 0 ||
    Boolean(params.q.trim()) ||
    params.max > 0;

  return {
    title: "Shop all dental care",
    description: DESCRIPTION,
    alternates: { canonical: "/shop" },
    // A filtered view is a user journey, not a page worth indexing. The brief is
    // explicit that the catalogue must not spawn hundreds of thin SEO pages.
    ...(narrowed ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseShopParams(await searchParams);
  const result = queryShop(params);
  const from = result.total === 0 ? 0 : (result.page - 1) * PAGE_SIZE + 1;
  const to = Math.min(result.page * PAGE_SIZE, result.total);

  const panel = <ShopFilterPanel params={params} result={result} />;

  return (
    <>
      <PageHeader
        eyebrow="All products"
        title="The full shelf."
        lede="Every product here was chosen for a specific clinical reason. Filter by what you are actually trying to solve."
        crumbs={[{ label: "Shop" }]}
        aside={
          <p className="text-[12.5px] text-ink-mute">
            {result.total} {result.total === 1 ? "product" : "products"}
            <br />
            <span className="text-ink-faint">Free delivery over ₹1,499</span>
          </p>
        }
      />

      <div className="shell py-10 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-14">
          <aside className="hidden lg:sticky lg:top-[100px] lg:block lg:self-start">
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">Filters</p>
            </div>
            <div className="mt-4">{panel}</div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
              <ShopControls params={params} />
              <FilterSheet count={result.activeCount}>{panel}</FilterSheet>
              <SortSelect params={params} />
            </div>

            <p className="mt-4 text-[12px] text-ink-faint">
              {result.total === 0
                ? "No products match"
                : `Showing ${from}–${to} of ${result.total}`}
              {params.cats.length === 1 &&
                ` in ${categoryMap[params.cats[0] as CategorySlug]?.shortName}`}
              {params.brands.length === 1 && ` · ${params.brands[0]}`}
            </p>

            {result.items.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-display text-[24px] tracking-[-0.01em]">Nothing matches that.</p>
                <p className="mx-auto mt-2 max-w-[38ch] text-[13px] text-ink-mute">
                  Try a wider price range or fewer filters. If you are looking for something specific,
                  our team can source it.
                </p>
                <Link href="/shop" className="btn-ghost mt-6 inline-block">
                  Clear filters
                </Link>
              </div>
            ) : (
              <RevealGroup className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
                {result.items.map((p, i) => (
                  <StaggerItem key={p.slug}>
                    <ProductCard product={p} priority={i < 4} />
                  </StaggerItem>
                ))}
              </RevealGroup>
            )}

            {result.pageCount > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-14 flex items-center justify-center gap-2 border-t border-line pt-8"
              >
                {result.page > 1 ? (
                  <Link href={shopHref({ ...params, page: result.page - 1 })} className="btn-ghost">
                    Previous
                  </Link>
                ) : (
                  <span className="btn-ghost pointer-events-none opacity-40">Previous</span>
                )}

                <span className="px-3 text-[12.5px] tabular-nums text-ink-mute">
                  Page {result.page} of {result.pageCount}
                </span>

                {result.page < result.pageCount ? (
                  <Link href={shopHref({ ...params, page: result.page + 1 })} className="btn-ghost">
                    Next
                  </Link>
                ) : (
                  <span className="btn-ghost pointer-events-none opacity-40">Next</span>
                )}
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
