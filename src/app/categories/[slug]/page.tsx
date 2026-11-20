import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, categoryMap, type CategorySlug } from "@/data/categories";
import { products } from "@/data/products";
import { PageHeader } from "@/components/page-header";
import { ProductCard } from "@/components/product-card";
import { ProductArt, categoryTint } from "@/components/product-art";
import { RevealGroup, StaggerItem } from "@/components/reveal";
import { IconArrowRight } from "@/components/icons";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = categoryMap[slug as CategorySlug];
  if (!c) return { title: "Category" };
  return {
    title: c.name,
    description: c.description,
    alternates: { canonical: `/categories/${c.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryMap[slug as CategorySlug];
  if (!category) notFound();

  const list = products.filter((p) => p.category === category.slug);
  const others = categories.filter((c) => c.slug !== category.slug);

  return (
    <>
      <PageHeader
        eyebrow={`Category ${String(category.order).padStart(2, "0")}`}
        title={category.name}
        lede={category.description}
        crumbs={[{ label: "Categories", href: "/categories" }, { label: category.shortName }]}
        aside={
          <div
            className="relative hidden h-[120px] w-[120px] overflow-hidden rounded-xl md:block"
            style={{ backgroundColor: categoryTint[category.slug] }}
          >
            <ProductArt visual={category.visual} className="h-full w-full scale-[1.1]" />
          </div>
        }
      />

      <section className="shell py-12 md:py-16">
        <RevealGroup className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {list.map((p) => (
            <StaggerItem key={p.slug}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </RevealGroup>

        <div className="mt-20 border-t border-line pt-10">
          <p className="eyebrow">Also consider</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {others.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[12.5px] text-ink-mute transition-all duration-500 hover:border-clinic-600/40 hover:text-clinic-700"
              >
                {c.shortName}
                <IconArrowRight
                  size={13}
                  className="text-ink-faint transition-transform duration-500 group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
