"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { categoryMap } from "@/data/categories";
import { formatINR, buildProductEnquiry, orderLink } from "@/lib/whatsapp";
import { site } from "@/data/site";
import { useCart } from "@/lib/cart";
import { ProductArt, categoryTint } from "@/components/product-art";
import {
  IconMinus,
  IconPlus,
  IconWhatsApp,
  IconStar,
  IconTruck,
  IconShield,
  IconReturn,
  IconCheck,
  IconChevronDown,
} from "@/components/icons";

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>("description");
  const category = categoryMap[product.category];
  const onSale = product.compareAt && product.compareAt > product.price;
  const lowStock = product.stock > 0 && product.stock <= 12;

  const sections = [
    {
      id: "description",
      title: "Full description",
      body: <p className="leading-[1.75]">{product.description}</p>,
    },
    {
      id: "highlights",
      title: "Why it works",
      body: (
        <ul className="space-y-2.5">
          {product.highlights.map((h) => (
            <li key={h} className="flex gap-2.5">
              <IconCheck size={15} className="mt-0.5 shrink-0 text-clinic-600" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "specs",
      title: "Specifications",
      body: (
        <dl className="divide-y divide-line">
          {product.specs.map((s) => (
            <div key={s.label} className="flex justify-between gap-6 py-2.5">
              <dt className="text-ink-faint">{s.label}</dt>
              <dd className="text-right text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      id: "shipping",
      title: "Shipping & returns",
      body: (
        <div className="space-y-3">
          <p>
            Dispatched within 24 hours on working days. Metro cities usually receive orders in
            2–4 days, the rest of India in 4–7.
          </p>
          <p>
            Free delivery over {formatINR(site.freeShippingThreshold)}, otherwise a flat{" "}
            {formatINR(site.shippingFlat)}. Unopened products can be returned within 7 days.
          </p>
          <Link href="/shipping-returns" className="inline-block text-clinic-700 underline underline-offset-4">
            Read the full policy
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="shell py-8 md:py-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ── visual ── */}
        <div className="lg:sticky lg:top-[100px] lg:self-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-[12px]"
            style={{ backgroundColor: categoryTint[product.category] }}
          >
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 600 620"
              fill="none"
              aria-hidden
            >
              <circle cx="300" cy="310" r="210" stroke="#0C6E8F" strokeOpacity="0.08" />
              <circle cx="300" cy="310" r="150" stroke="#0C6E8F" strokeOpacity="0.06" />
            </svg>
            <div className="relative aspect-square w-full">
              <ProductArt
                visual={product.visual}
                title={product.name}
                className="absolute inset-0 h-full w-full scale-[0.9] p-8 transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[0.96]"
              />
            </div>

            <div className="absolute left-4 top-4 flex flex-col gap-1.5">
              {product.badge && <span className="badge">{product.badge}</span>}
              {onSale && (
                <span className="badge border-clinic-600/20 text-clinic-700">
                  Save {formatINR(product.compareAt! - product.price)}
                </span>
              )}
            </div>

            <div className="absolute bottom-4 right-4">
              <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-ink-faint backdrop-blur">
                {category?.shortName}
              </span>
            </div>
          </motion.div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {[
              { icon: IconTruck, label: "Ships in 24h" },
              { icon: IconShield, label: "Dentist-reviewed" },
              { icon: IconReturn, label: "7-day returns" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-center gap-2 rounded-lg border border-line px-2 py-3.5 text-center"
              >
                <f.icon size={17} className="text-clinic-600/70" />
                <span className="text-[11px] leading-tight text-ink-mute">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── info ── */}
        <div className="pt-1">
          <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-ink-faint">
            <Link href={`/categories/${product.category}`} className="transition-colors hover:text-clinic-700">
              {category?.name}
            </Link>
          </div>

          <h1 className="mt-3 display text-display-md text-ink">{product.name}</h1>
          <p className="mt-2 text-[14px] text-ink-mute">{product.subtitle}</p>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex gap-0.5 text-clinic-600">
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStar
                  key={i}
                  size={12}
                  className={i < Math.round(product.rating) ? "" : "text-line-strong"}
                />
              ))}
            </div>
            <span className="text-[12.5px] text-ink-mute">
              {product.rating.toFixed(1)} · {product.reviewCount} reviews
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-[28px] tabular-nums tracking-[-0.02em] text-ink">
              {formatINR(product.price)}
            </span>
            {onSale && (
              <span className="text-[15px] tabular-nums text-ink-faint line-through">
                {formatINR(product.compareAt!)}
              </span>
            )}
            <span className="text-[12px] text-ink-faint">{product.size}</span>
          </div>

          <p className="mt-5 max-w-[460px] text-[14px] leading-relaxed text-ink-soft">
            {product.shortDescription}
          </p>

          <div className="mt-7 flex items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 text-[12px] ${
                product.stock === 0
                  ? "text-ink-faint"
                  : lowStock
                    ? "text-amber-700"
                    : "text-clinic-700"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  product.stock === 0
                    ? "bg-line-strong"
                    : lowStock
                      ? "bg-amber-500"
                      : "bg-clinic-500"
                }`}
              />
              {product.stock === 0
                ? "Out of stock"
                : lowStock
                  ? `Only ${product.stock} left`
                  : "In stock"}
            </span>
            <span className="text-[11.5px] text-ink-faint">· Dispatched from Mumbai</span>
          </div>

          {/* actions */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center justify-between rounded-full border border-line-strong px-1.5 py-1 sm:w-[124px]">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="rounded-full p-2 text-ink-mute transition-colors hover:text-ink disabled:opacity-40"
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                <IconMinus size={15} />
              </button>
              <span className="w-6 text-center text-[14px] tabular-nums" aria-live="polite">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                className="rounded-full p-2 text-ink-mute transition-colors hover:text-ink"
                aria-label="Increase quantity"
              >
                <IconPlus size={15} />
              </button>
            </div>

            <button
              onClick={() => add(product.slug, qty)}
              disabled={product.stock === 0}
              className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add to cart
              <span className="text-white/60">·</span>
              {formatINR(product.price * qty)}
            </button>
          </div>

          <a
            href={orderLink(buildProductEnquiry(product, qty))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost mt-3 w-full"
          >
            <IconWhatsApp size={16} className="text-clinic-700" />
            Order this on WhatsApp
          </a>

          <p className="mt-4 max-w-[440px] text-[11.5px] leading-relaxed text-ink-faint">
            {site.orderNotice}
          </p>

          {/* accordion */}
          <div className="mt-10 border-t border-line">
            {sections.map((s) => {
              const open = openSection === s.id;
              return (
                <div key={s.id} className="border-b border-line">
                  <button
                    onClick={() => setOpenSection(open ? null : s.id)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left text-[14px] text-ink"
                  >
                    {s.title}
                    <IconChevronDown
                      size={16}
                      className={`shrink-0 text-ink-faint transition-transform duration-400 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-5 text-[13.5px] leading-relaxed text-ink-mute">{s.body}</div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
