"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/whatsapp";
import { categoryTint } from "./product-art";
import { ProductShot } from "./product-shot";
import { site } from "@/data/site";
import {
  IconClose,
  IconMinus,
  IconPlus,
  IconArrowRight,
  IconWhatsApp,
  IconTrash,
} from "./icons";

export function CartDrawer() {
  const { isOpen, closeCart, items, count, subtotal, shipping, total, setQty, remove } = useCart();

  const remaining = Math.max(0, site.freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / site.freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" onClick={closeCart} />

          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-white shadow-panel"
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <div className="flex items-baseline gap-2.5">
                <h2 className="font-display text-[23px] tracking-[-0.02em]">Your cart</h2>
                <span className="text-[12.5px] text-ink-faint">
                  {count} {count === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="rounded-full p-2 text-ink-mute transition-colors hover:bg-canvas-tint hover:text-ink"
                aria-label="Close cart"
              >
                <IconClose size={19} />
              </button>
            </header>

            {items.length > 0 && (
              <div className="border-b border-line px-6 py-3.5">
                <p className="mb-2 text-[11.5px] text-ink-mute">
                  {remaining > 0 ? (
                    <>
                      Add <span className="text-ink">{formatINR(remaining)}</span> for free delivery
                    </>
                  ) : (
                    <span className="text-clinic-700">Free delivery unlocked</span>
                  )}
                </p>
                <div className="h-[3px] w-full overflow-hidden rounded-full bg-canvas-deep">
                  <motion.div
                    className="h-full rounded-full bg-clinic-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-canvas-tint">
                    <IconWhatsApp size={26} className="text-ink-faint" />
                  </div>
                  <p className="font-display text-[21px] tracking-[-0.02em]">Your cart is empty</p>
                  <p className="mt-2 max-w-[240px] text-[13.5px] leading-relaxed text-ink-mute">
                    Start with the essentials — or ask us what suits your routine.
                  </p>
                  <Link href="/shop" onClick={closeCart} className="btn-primary mt-6">
                    Browse the shop
                    <IconArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.slug}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-4 px-6 py-5">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={closeCart}
                            className="relative h-[92px] w-[80px] shrink-0 overflow-hidden rounded-md"
                            style={{ backgroundColor: categoryTint[item.product.category] }}
                          >
                            <ProductShot
                              image={item.product.image}
                              visual={item.product.visual}
                              title={item.product.name}
                              className="p-1"
                              artClassName="h-full w-full scale-[1.15] object-contain p-1"
                            />
                          </Link>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <Link
                                href={`/product/${item.slug}`}
                                onClick={closeCart}
                                className="text-[14px] leading-snug text-ink hover:text-clinic-700"
                              >
                                {item.product.name}
                              </Link>
                              <button
                                onClick={() => remove(item.slug)}
                                className="shrink-0 p-1 text-ink-faint transition-colors hover:text-ink"
                                aria-label={`Remove ${item.product.name}`}
                              >
                                <IconTrash size={15} />
                              </button>
                            </div>
                            <p className="mt-0.5 text-[11.5px] text-ink-faint">{item.product.packaging ?? item.product.brand}</p>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center rounded-full border border-line">
                                <button
                                  onClick={() => setQty(item.slug, item.qty - 1)}
                                  className="p-1.5 pl-2.5 text-ink-mute hover:text-ink"
                                  aria-label="Decrease quantity"
                                >
                                  <IconMinus size={13} />
                                </button>
                                <span className="w-6 text-center text-[12.5px] tabular-nums">
                                  {item.qty}
                                </span>
                                <button
                                  onClick={() => setQty(item.slug, item.qty + 1)}
                                  className="p-1.5 pr-2.5 text-ink-mute hover:text-ink"
                                  aria-label="Increase quantity"
                                >
                                  <IconPlus size={13} />
                                </button>
                              </div>
                              <span className="text-[13.5px] tabular-nums text-ink">
                                {formatINR(item.lineTotal)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-line bg-canvas-tint/60 px-6 py-5">
                <dl className="space-y-2 text-[13px]">
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
                  <div className="flex justify-between border-t border-line pt-2.5 text-[15px]">
                    <dt className="text-ink">Total</dt>
                    <dd className="tabular-nums text-ink">{formatINR(total)}</dd>
                  </div>
                </dl>

                <Link href="/checkout" onClick={closeCart} className="btn-primary mt-4 w-full">
                  <IconWhatsApp size={16} />
                  Continue to order
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="mt-1.5 block py-2 text-center text-[12.5px] text-ink-mute transition-colors hover:text-ink"
                >
                  View full cart
                </Link>
                <p className="mt-2 text-center text-[11px] leading-relaxed text-ink-faint">
                  No online payment. We confirm every order on WhatsApp.
                </p>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
