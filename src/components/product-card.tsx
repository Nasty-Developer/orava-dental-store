"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { formatINR, buildProductEnquiry, orderLink } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart";
import { ProductArt, categoryTint } from "./product-art";
import { IconPlus, IconWhatsApp } from "./icons";

export function ProductCard({
  product,
  priority = false,
  compact = false,
}: {
  product: Product;
  priority?: boolean;
  compact?: boolean;
}) {
  const { add } = useCart();
  const priced = product.price !== null;

  return (
    <article className="group relative">
      <Link
        href={`/product/${product.slug}`}
        className="block focus-visible:outline-none"
        aria-label={`${product.name}, ${product.brand}, ${
          priced ? formatINR(product.price as number) : "price on request"
        }`}
      >
        <div
          className="relative overflow-hidden rounded-[10px]"
          style={{ backgroundColor: categoryTint[product.category] }}
        >
          <div className="aspect-[4/5] w-full">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image.src}
                alt={product.image.alt ?? product.name}
                loading={priority ? "eager" : "lazy"}
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
            ) : (
              <ProductArt
                visual={product.visual}
                title={product.name}
                className="h-full w-full scale-[1.02] p-3 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
              />
            )}
          </div>

          <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {!priced && <span className="badge">Price on request</span>}
          </div>

          {/* quick action, hover on pointer devices */}
          <div className="absolute inset-x-3 bottom-3 translate-y-[130%] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
            {priced ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  add(product.slug, 1);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white/95 py-2.5 text-[12.5px] font-medium text-ink shadow-lift backdrop-blur transition-colors hover:bg-ink hover:text-white"
              >
                <IconPlus size={14} />
                Add to cart
              </button>
            ) : (
              <a
                href={orderLink(buildProductEnquiry(product))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white/95 py-2.5 text-[12.5px] font-medium text-ink shadow-lift backdrop-blur transition-colors hover:bg-ink hover:text-white"
              >
                <IconWhatsApp size={14} />
                Ask for price
              </a>
            )}
          </div>

          {/* touch devices have no hover */}
          {priced ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                add(product.slug, 1);
              }}
              aria-label={`Add ${product.name} to cart`}
              className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink shadow-lift backdrop-blur transition-colors active:bg-ink active:text-white md:hidden"
            >
              <IconPlus size={15} />
            </button>
          ) : (
            <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-clinic-700 shadow-lift backdrop-blur md:hidden">
              <IconWhatsApp size={15} />
            </span>
          )}
        </div>

        <div className={compact ? "mt-3" : "mt-4"}>
          <p className="text-[10.5px] uppercase tracking-[0.16em] text-ink-faint">
            {product.brand}
          </p>
          <h3 className="mt-1.5 text-[14.5px] leading-snug text-ink transition-colors group-hover:text-clinic-700">
            {product.name}
          </h3>
          {!compact && (
            <p className="mt-1 line-clamp-1 text-[12.5px] text-ink-mute">
              {product.subcategory}
              {product.packaging ? ` · ${product.packaging}` : ""}
            </p>
          )}
          <div className="mt-2.5 flex items-baseline gap-2">
            {priced ? (
              <span className="text-[14px] tabular-nums text-ink">
                {formatINR(product.price as number)}
              </span>
            ) : (
              <span className="text-[12.5px] text-ink-mute">Price on request</span>
            )}
          </div>
        </div>
      </Link>

      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-x-3 -inset-y-2 -z-10 rounded-xl opacity-0 shadow-lift transition-opacity duration-500 group-hover:opacity-100"
      />
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="shimmer aspect-[4/5] w-full rounded-[10px]" />
      <div className="mt-4 space-y-2">
        <div className="shimmer h-2.5 w-16 rounded" />
        <div className="shimmer h-3.5 w-4/5 rounded" />
        <div className="shimmer h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}
