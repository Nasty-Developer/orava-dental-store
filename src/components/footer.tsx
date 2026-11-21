import Link from "next/link";
import { site } from "@/data/site";
import { categories, type CategorySlug } from "@/data/categories";
import { products } from "@/data/products";
import { Wordmark } from "./wordmark";
import { IconWhatsApp, IconMail, IconArrowUpRight, IconPhone } from "./icons";
import { orderLink, mailLink } from "@/lib/whatsapp";

const legal = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/shipping-returns", label: "Shipping & Returns" },
];

/**
 * The footer shows the areas people actually shop by, not all 23. The full
 * taxonomy stays one click away, and /categories lists every one of them, so a
 * wall of links never buries the pages that matter.
 */
const shopHighlights: CategorySlug[] = [
  "restorative",
  "endodontics",
  "instruments",
  "burs",
  "handpieces",
  "orthodontics",
  "impression",
  "prosthodontics",
  "infection-control",
  "anaesthetics",
];

const shopCategories = shopHighlights
  .map((slug) => categories.find((c) => c.slug === slug))
  .filter((c): c is (typeof categories)[number] => Boolean(c));

const help = [
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
  { href: "/shop", label: "All products" },
  { href: "/categories", label: "Categories" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-white">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="md:col-span-1 lg:col-span-3">
            <Wordmark size="md" />
            <p className="mt-5 max-w-[280px] text-[13.5px] leading-relaxed text-ink-mute">
              {site.tagline} Clinician-reviewed oral care, dispatched from Mumbai to anywhere
              in India.
            </p>

            <div className="mt-7 space-y-2.5">
              <a
                href={orderLink(site.whatsapp.greeting)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 text-[13px] text-ink-soft transition-colors hover:text-clinic-700"
              >
                <IconWhatsApp size={15} className="text-ink-faint" />
                {site.whatsapp.display}
                <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  orders
                </span>
              </a>
              <a
                href={`tel:${site.support.number}`}
                className="flex items-center gap-2.5 text-[13px] text-ink-soft transition-colors hover:text-clinic-700"
              >
                <IconPhone size={15} className="text-ink-faint" />
                {site.support.display}
                <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  support
                </span>
              </a>
              <a
                href={mailLink("Website enquiry")}
                className="flex items-center gap-2.5 text-[13px] text-ink-soft transition-colors hover:text-clinic-700"
              >
                <IconMail size={15} className="text-ink-faint" />
                {site.email}
              </a>
            </div>
          </div>

          <div className="md:col-span-1 lg:col-span-4">
            <h3 className="eyebrow">Shop by area</h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3">
              {shopCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="link-underline text-[13.5px] text-ink-soft transition-colors hover:text-ink"
                  >
                    {c.shortName}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2.5 border-t border-line pt-5">
              <Link
                href="/shop"
                className="group flex items-center gap-1.5 text-[13px] font-medium text-clinic-700 transition-colors hover:text-clinic-800"
              >
                All {products.length} products
                <IconArrowUpRight
                  size={13}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/categories"
                className="group flex items-center gap-1.5 text-[13px] text-ink-soft transition-colors hover:text-ink"
              >
                Browse all {categories.length} categories
                <IconArrowUpRight
                  size={13}
                  className="text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          <div className="md:col-span-1 lg:col-span-2">
            <h3 className="eyebrow">Company</h3>
            <ul className="mt-5 space-y-3">
              {help.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="link-underline text-[13.5px] text-ink-soft transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1 lg:col-span-3">
            <h3 className="eyebrow">Visit</h3>
            <address className="mt-5 not-italic text-[13.5px] leading-relaxed text-ink-mute">
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.region}
              <br />
              {site.address.country}
            </address>
            <p className="mt-4 text-[12.5px] text-ink-faint">{site.hours}</p>

            <a
              href={orderLink(site.whatsapp.greeting)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-clinic-700"
            >
              Talk to a product advisor
              <IconArrowUpRight size={14} />
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-ink-faint">
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[12px] text-ink-faint transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-8 max-w-[900px] text-[11px] leading-relaxed text-ink-faint/80">
          Products are cosmetic and personal-care items. They support daily oral hygiene and are
          not a substitute for professional diagnosis or treatment. If you have a persistent
          dental concern, please see a dentist.
        </p>
      </div>
    </footer>
  );
}
