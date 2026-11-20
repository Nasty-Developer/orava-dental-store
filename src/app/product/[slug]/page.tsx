import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/data/products";
import { categoryMap } from "@/data/categories";
import { Breadcrumbs } from "@/components/page-header";
import { ProductDetail } from "@/components/product-detail";
import { ProductCard } from "@/components/product-card";
import { Reveal, RevealGroup, StaggerItem } from "@/components/reveal";
import { site } from "@/data/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = categoryMap[product.category];
  const related = products
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => {
      const sameA = a.category === product.category ? 1 : 0;
      const sameB = b.category === product.category ? 1 : 0;
      return sameB - sameA || b.rating - a.rating;
    })
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    category: category?.name,
    brand: { "@type": "Brand", name: site.name },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${site.url}/product/${product.slug}`,
      seller: { "@type": "Organization", name: site.name },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="shell pt-6">
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            { label: category?.shortName ?? "", href: `/categories/${product.category}` },
            { label: product.name },
          ]}
        />
      </div>

      <ProductDetail product={product} />

      <section className="shell border-t border-line py-16 md:py-20">
        <div className="flex items-end justify-between gap-6">
          <Reveal y={10}>
            <h2 className="display text-display-md text-ink">Complete the routine.</h2>
          </Reveal>
          <Reveal delay={0.06} y={8}>
            <a href="/shop" className="hidden text-[13px] text-ink-mute transition-colors hover:text-ink sm:block">
              View all
            </a>
          </Reveal>
        </div>
        <RevealGroup className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {related.map((p) => (
            <StaggerItem key={p.slug}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
