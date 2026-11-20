"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { formatINR } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart";
import { ProductArt, categoryTint } from "./product-art";
import { categoryMap } from "@/data/categories";
import { IconPlus, IconStar } from "./icons";

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
  const category = categoryMap[product.category];
  const onSale = product.compareAt && product.compareAt > product.price;

  return (
    <article className="group relative">
      <Link
        href={`/product/${product.slug}`}
        className="block focus-visible:outline-none"
        aria-label={`${product.name}, ${formatINR(product.price)}`}
      >
        <div
          className="relative overflow-hidden rounded-[10px]"
          style={{ backgroundColor: categoryTint[product.category] }}
        >
          <div className="aspect-[4/5] w-full">
            <ProductArt
              visual={product.visual}
              title={product.name}
              className="h-full w-full scale-[1.02] p-3 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
            />
          </div>

          {/* badges */}
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {product.badge && <span className="badge">{product.badge}</span>}
            {onSale && (
              <span className="badge border-clinic-600/20 bg-white/90 text-clinic-700">
                Save {formatINR(product.compareAt! - product.price)}
              </span>
            )}
          </div>

          {/* quick add */}
          <div className="absolute inset-x-3 bottom-3 translate-y-[130%] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
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
          </div>

          {/* touch devices have no hover, so give them a permanent quick-add */}
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

          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
              <span className="rounded-full bg-ink px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white">
                Sold out
              </span>
            </div>
          )}
        </div>

        <div className={compact ? "mt-3" : "mt-4"}>
          <p className="text-[10.5px] uppercase tracking-[0.16em] text-ink-faint">
            {category?.shortName ?? product.category}
          </p>
          <h3 className="mt-1.5 text-[14.5px] leading-snug text-ink transition-colors group-hover:text-clinic-700">
            {product.name}
          </h3>
          {!compact && (
            <p className="mt-1 line-clamp-1 text-[12.5px] text-ink-mute">{product.subtitle}</p>
          )}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-[14px] tabular-nums text-ink">{formatINR(product.price)}</span>
            {onSale && (
              <span className="text-[12px] tabular-nums text-ink-faint line-through">
                {formatINR(product.compareAt!)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-2 flex items-center gap-1.5 text-[11.5px] text-ink-faint">
        <IconStar size={11} className="text-clinic-600/70" />
        <span className="tabular-nums">{product.rating.toFixed(1)}</span>
        <span className="text-ink-faint/60">·</span>
        <span>{product.reviewCount} reviews</span>
      </div>

      {/* hover lift shadow */}
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
