import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { ProductArt, categoryTint } from "@/components/product-art";
import { Reveal, RevealGroup, StaggerItem } from "@/components/reveal";
import { IconArrowUpRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Six clinical categories: whitening, brushes and floss, rinses, clinical care, kids and orthodontic care.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Browse"
        title="Six clinical categories."
        lede="A narrow shelf by design. Each category answers one need, so choosing takes a minute rather than an evening."
        crumbs={[{ label: "Categories" }]}
      />

      <section className="shell py-14 md:py-20">
        <div className="space-y-3">
          {categories.map((c, i) => {
            const list = products.filter((p) => p.category === c.slug);
            return (
              <Reveal key={c.slug} delay={i * 0.04} y={16}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="group grid items-center gap-6 rounded-[10px] p-5 transition-colors duration-500 hover:bg-canvas-tint/70 sm:grid-cols-[1fr_auto] sm:p-7 lg:grid-cols-[88px_1fr_auto_auto] lg:gap-10"
                >
                  <div
                    className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-lg"
                    style={{ backgroundColor: categoryTint[c.slug] }}
                  >
                    <ProductArt
                      visual={c.visual}
                      className="h-full w-full scale-[1.1] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.2]"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-baseline gap-3">
                      <span className="text-[10.5px] tabular-nums tracking-[0.14em] text-ink-faint">
                        {String(c.order).padStart(2, "0")}
                      </span>
                      <h2 className="font-display text-[26px] leading-tight tracking-[-0.02em] text-ink">
                        {c.name}
                      </h2>
                    </div>
                    <p className="mt-2 max-w-[520px] text-[13.5px] leading-relaxed text-ink-mute">
                      {c.blurb}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 lg:contents">
                    <div className="hidden max-w-[260px] text-[12.5px] leading-relaxed text-ink-faint lg:block">
                      {list.length} {list.length === 1 ? "product" : "products"}
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink-mute transition-all duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                      <IconArrowUpRight size={16} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
