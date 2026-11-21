"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/whatsapp";
import { ProductArt, categoryTint } from "@/components/product-art";
import { site } from "@/data/site";
import {
  IconMinus,
  IconPlus,
  IconTrash,
  IconArrowRight,
  IconWhatsApp,
  IconLock,
} from "@/components/icons";

export default function CartPage() {
  const { items, subtotal, shipping, total, count, setQty, remove, ready } = useCart();

  if (!ready) {
    return (
      <div className="shell py-20">
        <div className="shimmer h-8 w-40 rounded" />
        <div className="mt-10 space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="shimmer h-28 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="shell flex min-h-[52vh] flex-col items-center justify-center py-20 text-center">
        <p className="eyebrow">Cart</p>
        <h1 className="mt-3 display text-display-md text-ink">Nothing here yet.</h1>
        <p className="mt-3 max-w-[380px] text-[14px] leading-relaxed text-ink-mute">
          Your cart is empty. Browse the shelf, or message us and we will tell you where to
          start.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn-primary">
            Browse products
            <IconArrowRight size={16} />
          </Link>
          <a
            href={`https://wa.me/${site.whatsapp.number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <IconWhatsApp size={16} className="text-clinic-700" />
            Ask on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-10 md:py-14">
      <div className="flex items-end justify-between gap-6 border-b border-line pb-6">
        <div>
          <p className="eyebrow">Cart</p>
          <h1 className="mt-2 display text-display-md text-ink">Your cart</h1>
        </div>
        <p className="text-[12.5px] text-ink-mute">
          {count} {count === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div>
          <ul className="divide-y divide-line">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.li
                  key={item.slug}
                  layout
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-4 py-6 sm:gap-6">
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative h-[110px] w-[92px] shrink-0 overflow-hidden rounded-lg sm:h-[132px] sm:w-[110px]"
                      style={{ backgroundColor: categoryTint[item.product.category] }}
                    >
                      <ProductArt
                        visual={item.product.visual}
                        className="h-full w-full scale-[1.12]"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <Link
                            href={`/product/${item.slug}`}
                            className="text-[15px] text-ink transition-colors hover:text-clinic-700"
                          >
                            {item.product.name}
                          </Link>
                          <p className="mt-1 text-[12px] text-ink-faint">{item.product.packaging ?? item.product.brand}</p>
                          <p className="mt-1.5 text-[12px] text-ink-mute">
                            {formatINR(item.product.price)} each
                          </p>
                        </div>
                        <button
                          onClick={() => remove(item.slug)}
                          className="shrink-0 rounded-full p-1.5 text-ink-faint transition-colors hover:bg-canvas-tint hover:text-ink"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <IconTrash size={15} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-end justify-between gap-4 pt-4">
                        <div className="flex items-center rounded-full border border-line">
                          <button
                            onClick={() => setQty(item.slug, item.qty - 1)}
                            className="p-2 pl-3 text-ink-mute hover:text-ink"
                            aria-label="Decrease quantity"
                          >
                            <IconMinus size={13} />
                          </button>
                          <span className="w-7 text-center text-[13px] tabular-nums">{item.qty}</span>
                          <button
                            onClick={() => setQty(item.slug, item.qty + 1)}
                            className="p-2 pr-3 text-ink-mute hover:text-ink"
                            aria-label="Increase quantity"
                          >
                            <IconPlus size={13} />
                          </button>
                        </div>
                        <span className="text-[15px] tabular-nums text-ink">
                          {formatINR(item.lineTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="mt-6 flex items-center justify-between border-t border-line pt-6">
            <Link href="/shop" className="group inline-flex items-center gap-2 text-[13px] text-ink-mute hover:text-ink">
              <IconArrowRight size={15} className="rotate-180 transition-transform group-hover:-translate-x-1" />
              Continue shopping
            </Link>
            <button onClick={() => items.forEach((i) => remove(i.slug))} className="text-[12px] text-ink-faint hover:text-ink">
              Empty cart
            </button>
          </div>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-[100px] lg:self-start">
          <div className="rounded-xl border border-line bg-canvas-tint/50 p-6">
            <h2 className="text-[15px] text-ink">Order summary</h2>

            <dl className="mt-5 space-y-2.5 text-[13px]">
              <div className="flex justify-between text-ink-mute">
                <dt>Subtotal</dt>
                <dd className="tabular-nums text-ink">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-ink-mute">
                <dt>Delivery</dt>
                <dd className="tabular-nums text-ink">
                  {shipping === 0 ? "Free" : formatINR(shipping)}
                </dd>
              </div>
              {shipping > 0 && (
                <p className="text-[11.5px] text-ink-faint">
                  Add {formatINR(site.freeShippingThreshold - subtotal)} for free delivery.
                </p>
              )}
              <div className="flex justify-between border-t border-line pt-3 text-[16px]">
                <dt className="text-ink">Total</dt>
                <dd className="tabular-nums text-ink">{formatINR(total)}</dd>
              </div>
            </dl>

            <Link href="/checkout" className="btn-primary mt-6 w-full">
              <IconWhatsApp size={16} />
              Continue to order
            </Link>

            <p className="mt-4 flex items-start gap-2 text-[11.5px] leading-relaxed text-ink-faint">
              <IconLock size={13} className="mt-0.5 shrink-0" />
              No payment is taken on this site. Your order is sent to our team on WhatsApp and
              confirmed before dispatch.
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-line p-5">
            <p className="text-[12.5px] text-ink-soft">Need help choosing?</p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-ink-faint">
              Send us a message and a person will reply during business hours.
            </p>
            <a
              href={`https://wa.me/${site.support.number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] text-clinic-700"
            >
              <IconWhatsApp size={14} />
              {site.support.display}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
