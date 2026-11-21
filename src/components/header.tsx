"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { site } from "@/data/site";
import { products } from "@/data/products";
import { formatINR } from "@/lib/whatsapp";
import { Wordmark } from "./wordmark";
import {
  IconBag,
  IconClose,
  IconMenu,
  IconSearch,
  IconWhatsApp,
  IconArrowRight,
} from "./icons";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* announcement strip */}
      <div className="hidden bg-ink text-white/80 md:block">
        <div className="shell flex h-9 items-center justify-between text-[11.5px] tracking-[0.01em]">
          <p className="flex items-center gap-2">
            <IconWhatsApp size={13} className="text-white/60" />
            Orders are placed on WhatsApp and confirmed by our team
          </p>
          <div className="flex items-center gap-6">
            <span className="text-white/60">Free delivery over {formatINR(site.freeShippingThreshold)}</span>
            <a
              href={`tel:${site.support.number}`}
              className="link-underline text-white/80 hover:text-white"
            >
              {site.support.display}
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-line bg-white/85 backdrop-blur-xl"
            : "border-b border-transparent bg-white"
        }`}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-6 md:h-[76px]">
          <div className="flex items-center gap-10">
            <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
              <Wordmark />
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-3.5 py-2 text-[13.5px] transition-colors duration-300 ${
                    isActive(item.href) ? "text-ink" : "text-ink-mute hover:text-ink"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-canvas-tint"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="group flex items-center gap-2 rounded-full px-3 py-2 text-ink-mute transition-colors hover:text-ink"
              aria-label="Search products"
            >
              <IconSearch size={18} />
              <span className="hidden text-[12.5px] xl:inline">Search</span>
              <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[10px] text-ink-faint xl:inline">
                ⌘K
              </kbd>
            </button>

            <a
              href={`https://wa.me/${site.whatsapp.number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[12.5px] text-ink-soft transition-all duration-500 hover:border-clinic-600/40 hover:bg-clinic-50 hover:text-clinic-700 md:inline-flex"
            >
              <IconWhatsApp size={15} />
              WhatsApp
            </a>

            <button
              onClick={openCart}
              className="relative flex items-center gap-2 rounded-full px-3 py-2 text-ink transition-colors hover:text-clinic-700"
              aria-label={`Open cart, ${count} items`}
            >
              <IconBag size={19} />
              <span className="hidden text-[12.5px] sm:inline">Cart</span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-clinic-600 px-1 text-[10px] font-medium text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              className="ml-0.5 rounded-full p-2 text-ink lg:hidden"
              aria-label="Open menu"
            >
              <IconMenu size={20} />
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const term = q.trim().toLowerCase();
  const results = term
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.subtitle.toLowerCase().includes(term) ||
            p.shortDescription.toLowerCase().includes(term) ||
            p.category.includes(term) ||
            (p.tags ?? []).some((t) => t.includes(term)),
        )
        .slice(0, 6)
    : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-ink/25 backdrop-blur-[3px]" onClick={onClose} />
          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto mt-0 w-full max-w-[760px] bg-white shadow-panel"
          >
            <div className="flex items-center gap-3 border-b border-line px-5 py-4 sm:px-7">
              <IconSearch size={19} className="text-ink-faint" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products, e.g. whitening, floss, kids"
                className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink-faint"
              />
              <button onClick={onClose} className="rounded-full p-1.5 text-ink-faint hover:text-ink" aria-label="Close search">
                <IconClose size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-3 py-3 sm:px-4">
              {!term && (
                <div className="px-2 py-4">
                  <p className="eyebrow mb-3">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {["Whitening", "Sonic brush", "Sensitive", "Kids", "Aligner"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setQ(s)}
                        className="rounded-full border border-line px-3.5 py-1.5 text-[12.5px] text-ink-mute transition-colors hover:border-clinic-600/40 hover:text-clinic-700"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {term && results.length === 0 && (
                <p className="px-2 py-8 text-center text-[14px] text-ink-mute">
                  No products match “{q}”. Try a broader word.
                </p>
              )}

              {results.map((p) => (
                <Link
                  key={p.slug}
                  href={`/product/${p.slug}`}
                  onClick={onClose}
                  className="group flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-canvas-tint"
                >
                  <span className="h-14 w-14 shrink-0 rounded-md bg-canvas-deep" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] text-ink">{p.name}</span>
                    <span className="block truncate text-[12px] text-ink-faint">{p.subtitle}</span>
                  </span>
                  <span className="text-[13px] tabular-nums text-ink-soft">{formatINR(p.price)}</span>
                  <IconArrowRight size={16} className="text-ink-faint transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}

              {term && results.length > 0 && (
                <Link
                  href={`/shop?q=${encodeURIComponent(q)}`}
                  onClick={onClose}
                  className="mt-2 flex items-center justify-between rounded-lg border-t border-line px-3 py-3.5 text-[13px] text-clinic-700 hover:bg-clinic-50"
                >
                  See all results for “{q}”
                  <IconArrowRight size={16} />
                </Link>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[75] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-0 flex h-full w-[86%] max-w-[380px] flex-col bg-white"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <Wordmark />
              <button onClick={onClose} className="p-2 text-ink" aria-label="Close menu">
                <IconClose size={20} />
              </button>
            </div>
            <nav className="flex flex-col px-5 py-4">
              {[{ href: "/", label: "Home" }, ...NAV].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between border-b border-line/70 py-4 font-display text-[24px] tracking-[-0.02em]"
                  >
                    {item.label}
                    <IconArrowRight size={17} className="text-ink-faint" />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto space-y-3 px-5 pb-8">
              <a
                href={`https://wa.me/${site.whatsapp.number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                <IconWhatsApp size={16} />
                Order on WhatsApp
              </a>
              <p className="text-center text-[12px] text-ink-faint">{site.email}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
