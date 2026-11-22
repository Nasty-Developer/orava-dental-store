import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/data/products";
import { categoryMap } from "@/data/categories";
import { Breadcrumbs } from "@/components/page-header";
import { ProductDetail } from "@/components/product-detail";
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

  const title = `${product.name} · SOMIL Dental Store`;
  return {
    title,
    description: product.summary,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { title, description: product.summary, type: "website" },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = categoryMap[product.category];

  /**
   * Only facts we actually hold are published. No rating, review count or
   * availability claim is emitted, because none has been verified.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    category: category?.name,
    brand: { "@type": "Brand", name: product.brand },
    ...(product.price !== null
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: product.price,
            seller: { "@type": "Organization", name: site.name },
          },
        }
      : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Shop", item: `${site.url}/shop` },
      {
        "@type": "ListItem",
        position: 2,
        name: category?.name ?? "Products",
        item: `${site.url}/categories/${product.category}`,
      },
      { "@type": "ListItem", position: 3, name: product.name },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: product.name }]} />
      <ProductDetail product={product} />
    </>
  );
}
