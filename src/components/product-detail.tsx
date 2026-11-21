"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { productsByCategory } from "@/data/products";
import { categoryMap } from "@/data/categories";
import { site } from "@/data/site";
import { formatINR, orderLink, buildProductEnquiry } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart";
import { categoryTint } from "./product-art";
import { ProductShot } from "./product-shot";
import { ProductCard } from "./product-card";
import {
  IconMinus,
  IconPlus,
  IconWhatsApp,
  IconArrowRight,
  IconCheck,
  IconChevronDown,
} from "./icons";

function Accordion({
  title,
  children,
  open,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-line">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-[13.5px] font-medium tracking-[-0.01em]">{title}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <IconChevronDown size={15} className="text-ink-mute" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="pb-5 text-[13.5px] leading-relaxed text-ink-mute">{children}</div>
      </motion.div>
    </div>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState<string | null>("specs");
  const category = categoryMap[product.category];
  const priced = product.price !== null;

  const related = productsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => (a.subcategory === product.subcategory ? -1 : 0) - (b.subcategory === product.subcategory ? -1 : 0))
    .slice(0, 4);

  return (
    <div className="shell pt-8">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[11.5px] text-ink-faint">
        <Link href="/shop" className="transition-colors hover:text-ink">Shop</Link>
        <span>/</span>
        <Link href={`/categories/${product.category}`} className="transition-colors hover:text-ink">
          {category?.shortName}
        </Link>
        <span>/</span>
        <span className="text-ink-mute">{product.subcategory}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-16">
        {/* visual */}
        <div className="lg:sticky lg:top-[100px] lg:self-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[12px]"
            style={{ backgroundColor: categoryTint[product.category] }}
          >
            <div className="aspect-[4/5] w-full sm:aspect-square">
              <ProductShot
                image={product.image}
                visual={product.visual}
                title={product.name}
                priority
                className="p-4 sm:p-6"
                artClassName="h-full w-full p-8 sm:p-14"
              />
            </div>
            {!product.image && (
              <span className="absolute left-4 top-4 rounded-full bg-white/85 px-2.5 py-1 text-[10px] uppercase tracking-[0.11em] text-ink-mute backdrop-blur">
                Illustration
              </span>
            )}
          </motion.div>
          {!product.image && (
            <p className="mt-3 text-[11.5px] leading-relaxed text-ink-faint">
              Placeholder illustration. The manufacturer photograph will replace this once supplied.
            </p>
          )}
        </div>

        {/* buy column */}
        <div className="pb-4">
          <p className="text-[11px] uppercase tracking-[0.13em] text-clinic-600">{product.brand}</p>
          <h1 className="mt-3 font-display text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[1.08] tracking-[-0.02em]">
            {product.name}
          </h1>
          <p className="mt-2.5 text-[13px] text-ink-mute">
            {product.subcategory}
            {product.packaging ? ` · ${product.packaging}` : ""}
          </p>

          {/* price */}
          <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {priced ? (
              <>
                <span className="price font-display text-[26px] leading-none tracking-[-0.01em]">
                  {formatINR(product.price as number)}
                </span>
                <span className="text-[11.5px] text-ink-faint">indicative, incl. taxes</span>
              </>
            ) : (
              <span className="price font-display text-[24px] leading-none tracking-[-0.01em] text-ink-mute">
                Price on request
              </span>
            )}
          </div>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-faint">
            Final price, batch and availability are confirmed by our team on WhatsApp before dispatch.
          </p>

          <p className="mt-6 max-w-[46ch] text-[14px] leading-relaxed text-ink-soft">
            {product.summary}
          </p>

          {/* quantity + actions */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-line-strong">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink-mute transition-colors hover:text-ink"
              >
                <IconMinus size={13} />
              </button>
              <span className="min-w-6 text-center text-[13.5px] tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                aria-label="Increase quantity"
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink-mute transition-colors hover:text-ink"
              >
                <IconPlus size={13} />
              </button>
            </div>

            {priced ? (
              <button
                onClick={() => add(product.slug, qty)}
                className="btn-primary flex-1 min-w-[190px] sm:flex-none"
              >
                Add to cart
                <IconArrowRight size={15} />
              </button>
            ) : (
              <a
                href={orderLink(buildProductEnquiry(product, qty))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 min-w-[190px] sm:flex-none"
              >
                <IconWhatsApp size={16} />
                Enquire on WhatsApp
              </a>
            )}
          </div>

          <a
            href={orderLink(buildProductEnquiry(product, qty))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-[12.5px] text-ink-mute underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
          >
            <IconWhatsApp size={14} />
            Ask about this product
          </a>

          {/* reassurance */}
          <ul className="mt-7 space-y-2.5 border-t border-line pt-6">
            {[
              "Availability and batch confirmed on WhatsApp before dispatch",
              "Genuine stock sourced through authorised distributors",
              "Delivery across India, tracked",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink-mute">
                <IconCheck size={13} className="mt-0.5 shrink-0 text-clinic-600" />
                {line}
              </li>
            ))}
          </ul>

          {/* accordions */}
          <div className="mt-7">
            <Accordion
              title="Specifications"
              open={open === "specs"}
              onToggle={() => setOpen(open === "specs" ? null : "specs")}
            >
              {product.specs.length ? (
                <dl className="divide-y divide-line">
                  {product.specs.map((s) => (
                    <div key={s.label} className="grid grid-cols-[minmax(0,150px)_minmax(0,1fr)] gap-3 py-2">
                      <dt className="text-ink-faint">{s.label}</dt>
                      <dd className="text-ink-soft">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p>Full specifications for this item are being verified and will be published shortly.</p>
              )}
            </Accordion>

            <Accordion
              title="Packaging"
              open={open === "pack"}
              onToggle={() => setOpen(open === "pack" ? null : "pack")}
            >
              <p>
                {product.packaging
                  ? `Supplied as ${product.packaging}. Pack size and contents are confirmed against the manufacturer label before dispatch.`
                  : "Pack size is confirmed on request against the manufacturer label."}
              </p>
            </Accordion>

            <Accordion
              title="Ordering & delivery"
              open={open === "delivery"}
              onToggle={() => setOpen(open === "delivery" ? null : "delivery")}
            >
              <p>
                Orders are placed over WhatsApp and confirmed by our team. Nothing is charged on this
                website. Delivery timelines depend on stock and your location, and are shared with your
                confirmation. See{" "}
                <Link href="/shipping-returns" className="underline decoration-line-strong underline-offset-4 hover:text-ink">
                  shipping & returns
                </Link>
                .
              </p>
            </Accordion>
          </div>

          <p className="mt-6 text-[11.5px] text-ink-faint">
            Questions? Email{" "}
            <a href={`mailto:${site.email}`} className="underline decoration-line-strong underline-offset-4 hover:text-ink">
              {site.email}
            </a>{" "}
            or call {site.support.display}.
          </p>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-12">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1] tracking-[-0.02em]">
              More in {category?.shortName}
            </h2>
            <Link
              href={`/categories/${product.category}`}
              className="shrink-0 text-[12.5px] text-ink-mute underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
            >
              View all
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
