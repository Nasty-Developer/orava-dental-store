import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ShopClient } from "@/components/shop-client";
import { ProductCardSkeleton } from "@/components/product-card";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop all dental care",
  description:
    "Browse the full Orava range: enamel-safe whitening, sonic brushes, alcohol-free rinses, clinical gels and orthodontic kits.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow="All products"
        title="The full shelf."
        lede="Every product here was chosen for a specific clinical reason. Filter by what you are actually trying to solve."
        crumbs={[{ label: "Shop" }]}
        aside={
          <p className="text-[12.5px] text-ink-mute">
            {products.length} products
            <br />
            <span className="text-ink-faint">Free delivery over ₹1,499</span>
          </p>
        }
      />
      <Suspense
        fallback={
          <div className="shell grid grid-cols-2 gap-6 py-12 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <ShopClient />
      </Suspense>
    </>
  );
}
