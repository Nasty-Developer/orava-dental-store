import Link from "next/link";
import { site, marqueeItems, trustPoints } from "@/data/site";
import { categories } from "@/data/categories";
import { products, featuredProducts, popularProducts, brands } from "@/data/products";
import { formatINR, orderLink, supportLink, mailLink } from "@/lib/whatsapp";
import { ProductArt, categoryTint } from "@/components/product-art";
import { categoryShot } from "@/data/category-images";
import { ProductCard } from "@/components/product-card";
import { Reveal, RevealGroup, RevealLines, StaggerItem } from "@/components/reveal";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconWhatsApp,
  IconMail,
  IconPhone,
  IconStar,
  IconSparkle,
  IconShield,
  IconTruck,
  IconReturn,
} from "@/components/icons";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustMarquee />
      <CategoryGrid />
      <FeaturedProducts />
      <BrandDiscovery />
      <StandardsBand />
      <PopularRail />
      <OrderSteps />
      <SupportBand />
      <Faq />
    </>
  );
}

/* ───────────────────────── HERO ───────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="shell grid items-center gap-14 pb-16 pt-12 md:pb-24 md:pt-16 lg:grid-cols-12 lg:gap-8 lg:pb-28">
        <div className="lg:col-span-6 xl:col-span-5">
          <Reveal y={10}>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-clinic-600/50" />
              <p className="eyebrow text-clinic-700">Dental care · Mumbai</p>
            </div>
          </Reveal>

          <h1 className="mt-6 display text-display-xl text-ink">
            <RevealLines
              lines={["Oral care,", "held to a", <em key="c" className="not-italic text-clinic-700">clinical standard.</em>]}
            />
          </h1>

          <Reveal delay={0.45} y={12}>
            <p className="lede mt-7 max-w-[430px]">
              Restorative, endodontic, orthodontic and surgical supplies for Indian dental
              practices — sourced from the brands clinicians already trust, confirmed on WhatsApp.
            </p>
          </Reveal>

          <Reveal delay={0.55} y={12}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/shop" className="btn-primary group">
                Shop the collection
                <IconArrowRight
                  size={16}
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                />
              </Link>
              <a
                href={orderLink(site.whatsapp.greeting)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <IconWhatsApp size={16} className="text-clinic-700" />
                Ask a question
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.65} y={12}>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-6">
              <p className="text-[12.5px] text-ink-mute">
                <span className="text-ink">{products.length}</span> products across{" "}
                <span className="text-ink">{categories.length}</span> clinical areas
              </p>
              <p className="text-[12.5px] text-ink-mute">
                Free delivery over {formatINR(site.freeShippingThreshold)}
              </p>
            </div>
          </Reveal>
        </div>

        {/* product presentation */}
        <div className="lg:col-span-6 lg:col-start-7 xl:col-span-7">
          <Reveal delay={0.2} y={24}>
            <div className="relative">
              <div className="relative overflow-hidden rounded-[14px] bg-white">
                {/* concentric guides */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 600 660"
                  fill="none"
                  aria-hidden
                >
                  <circle cx="300" cy="330" r="228" stroke="#0C6E8F" strokeOpacity="0.09" />
                  <circle cx="300" cy="330" r="168" stroke="#0C6E8F" strokeOpacity="0.07" />
                  <path d="M300 60v540" stroke="#0C6E8F" strokeOpacity="0.05" />
                  <path d="M60 330h480" stroke="#0C6E8F" strokeOpacity="0.05" />
                </svg>

                <div className="relative aspect-[10/11] w-full sm:aspect-[6/5] lg:aspect-[10/11]">
                  {/* SOMIL private-label packaging concept: a branding mockup, not a
                      photograph of a stocked product, so it carries no brand, price or
                      link to a real SKU. Swap for a real SOMIL pack shot once private
                      labelling is authorised. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/somil-hero-composite-1024.webp"
                    srcSet="/brand/somil-hero-composite-512.webp 512w, /brand/somil-hero-composite-1024.webp 1024w"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 60vw, 620px"
                    alt="SOMIL private-label light cure composite packaging concept"
                    width={1024}
                    height={683}
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-contain p-3 sm:p-5"
                  />
                </div>

                {/* floating specs */}
                <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                  <span className="badge">Packaging concept</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between sm:bottom-6 sm:left-6 sm:right-6">
                  <div className="rounded-lg bg-white/85 px-3.5 py-2.5 backdrop-blur-md">
                    <p className="text-[10px] uppercase tracking-[0.11em] text-ink-faint">
                      Label
                    </p>
                    <p className="mt-0.5 max-w-[150px] truncate text-[12.5px] text-ink">SOMIL Dental</p>
                  </div>
                  <div className="hidden rounded-lg bg-white/85 px-3.5 py-2.5 text-right backdrop-blur-md sm:block">
                    <p className="text-[10px] uppercase tracking-[0.11em] text-ink-faint">
                      Range
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-ink">Restorative</p>
                  </div>
                </div>
              </div>

              {/* caption card */}
              <div className="absolute -bottom-6 left-1/2 w-[min(92%,340px)] -translate-x-1/2 rounded-xl border border-line bg-white px-5 py-4 shadow-lift lg:-left-10 lg:bottom-8 lg:translate-x-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] text-ink">Light Cure Composite kit</p>
                    <p className="mt-0.5 truncate text-[11.5px] text-ink-faint">
                      Concept packaging, pending authorisation
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-all duration-500 hover:border-ink hover:bg-ink hover:text-white"
                    aria-label="Ask about SOMIL private label"
                  >
                    <IconArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── TRUST MARQUEE ───────────────────── */

function TrustMarquee() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <section className="border-y border-line bg-ink py-3.5" aria-hidden>
      <div className="mask-fade-x overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-10 text-[11.5px] uppercase tracking-[0.2em] text-white/55">
              {item}
              <span className="h-1 w-1 rounded-full bg-clinic-400/60" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── CATEGORIES ─────────────────────── */

function CategoryGrid() {
  return (
    <section className="shell py-20 md:py-28">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <Reveal y={8}>
            <p className="eyebrow">The shelf</p>
          </Reveal>
          <Reveal delay={0.06} y={14}>
            <h2 className="mt-3 display text-display-lg text-ink">Twenty-three areas.</h2>
          </Reveal>
        </div>
        <Reveal delay={0.12} y={10}>
          <p className="max-w-[330px] text-[13.5px] leading-relaxed text-ink-mute">
            From composites and rotary files to autoclaves and intraoral scanners — organised the
            way a practice actually buys, not the way a catalogue is printed.
          </p>
        </Reveal>
      </div>

      <RevealGroup className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categories.slice(0, 7).map((c) => (
          <StaggerItem key={c.slug}>
            <CategoryTile slug={c.slug} />
          </StaggerItem>
        ))}
        <StaggerItem>
          <Link
            href="/categories"
            className="group flex h-full min-h-[168px] flex-col justify-between rounded-[10px] border border-line bg-white p-5 transition-colors hover:border-ink"
          >
            <span className="text-[10px] uppercase tracking-[0.12em] text-ink-faint">All areas</span>
            <span className="flex items-end justify-between gap-3">
              <span className="font-display text-[22px] leading-[1.1] tracking-[-0.01em]">
                View all {categories.length}
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-all duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                <IconArrowUpRight size={14} />
              </span>
            </span>
          </Link>
        </StaggerItem>
      </RevealGroup>
    </section>
  );
}

function CategoryTile({ slug }: { slug: string }) {
  const c = categories.find((x) => x.slug === slug)!;
  const count = products.filter((p) => p.category === c.slug).length;
  const shot = categoryShot[c.slug];

  return (
    <a
      href={`/categories/${c.slug}`}
      className="group relative block overflow-hidden rounded-[10px] border border-line bg-white transition-all duration-500 hover:border-clinic-600/40 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
        {shot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shot.src}
            alt={shot.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: categoryTint[c.slug as keyof typeof categoryTint] }}
          >
            <ProductArt visual={c.visual} className="absolute bottom-0 right-0 h-[92%] w-[74%]" />
          </div>
        )}
      </div>

      <div className="border-t border-line/70 p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
            {String(c.order).padStart(2, "0")} · {count} products
          </p>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-faint transition-all duration-500 group-hover:bg-canvas-tint group-hover:text-ink">
            <IconArrowUpRight size={14} />
          </span>
        </div>
        <h3 className="mt-2 font-display text-[20px] leading-[1.14] tracking-[-0.015em] text-ink">
          {c.shortName}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-snug text-ink-mute">{c.blurb}</p>
      </div>
    </a>
  );
}

/* ───────────────────── FEATURED PRODUCTS ───────────────────── */

function FeaturedProducts() {
  return (
    <section className="border-y border-line bg-canvas-tint/50 py-20 md:py-24">
      <div className="shell">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Reveal y={8}>
              <p className="eyebrow">Considered essentials</p>
            </Reveal>
            <Reveal delay={0.06} y={14}>
              <h2 className="mt-3 display text-display-lg text-ink">Where most people start.</h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={10}>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-[13px] text-ink-mute transition-colors hover:text-ink"
            >
              View all {products.length} products
              <IconArrowRight
                size={15}
                className="transition-transform duration-500 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        <RevealGroup className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {featuredProducts.slice(0, 4).map((p) => (
            <StaggerItem key={p.slug}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ─────────────────────── STANDARDS ─────────────────────── */

const standards = [
  {
    n: "01",
    title: "Formulated with dentists",
    body: "Every formula is reviewed by practising clinicians before it reaches the shelf. If a claim cannot be defended in a chair, it does not go on the box.",
    icon: IconShield,
  },
  {
    n: "02",
    title: "Nothing you do not need",
    body: "No charcoal grit on enamel, no alcohol burn, no SLS where it causes ulcers. The ingredient list is short because each line has to justify itself.",
    icon: IconSparkle,
  },
  {
    n: "03",
    title: "Ordered like a conversation",
    body: "You send your cart on WhatsApp. A person checks stock, confirms the address and tells you when it ships. No payment gateway in between.",
    icon: IconWhatsApp,
  },
];

const BRAND_COUNTS = products.reduce<Record<string, number>>((acc, p) => {
  acc[p.brand] = (acc[p.brand] ?? 0) + 1;
  return acc;
}, {});
const TOP_BRANDS = Object.entries(BRAND_COUNTS)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 24);

/**
 * Brand discovery. Dentists often arrive knowing the maker, not the category,
 * so the 130 makers in the catalogue get a direct route in.
 */
function BrandDiscovery() {
  return (
    <section className="shell py-20 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal y={8}>
            <p className="eyebrow">Brands</p>
          </Reveal>
          <Reveal delay={0.06} y={14}>
            <h2 className="mt-3 display text-display-md text-ink">Shop the maker you trust.</h2>
          </Reveal>
        </div>
        <Reveal delay={0.1} y={10}>
          <Link href="/shop" className="inline-flex items-center gap-2 text-[13px] text-clinic-700">
            <span className="link-underline">All {brands.length} brands</span>
            <IconArrowUpRight size={14} />
          </Link>
        </Reveal>
      </div>

      <Reveal delay={0.12} y={12}>
        <div className="mt-9 flex flex-wrap gap-2.5">
          {TOP_BRANDS.map(([name, n]) => (
            <Link
              key={name}
              href={`/shop?brand=${encodeURIComponent(name)}`}
              className="group inline-flex items-baseline gap-2 rounded-full border border-line bg-white px-4 py-2.5 transition-all duration-300 hover:border-clinic-600/40 hover:bg-clinic-50"
            >
              <span className="text-[13px] text-ink transition-colors group-hover:text-clinic-700">
                {name}
              </span>
              <span className="text-[11px] tabular-nums text-ink-faint">{n}</span>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function StandardsBand() {
  return (
    <section className="shell py-20 md:py-28">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Reveal y={8}>
            <p className="eyebrow">Why SOMIL</p>
          </Reveal>
          <Reveal delay={0.06} y={14}>
            <h2 className="mt-3 display text-display-md text-ink">
              A small shelf, held to a high bar.
            </h2>
          </Reveal>
          <Reveal delay={0.12} y={10}>
            <p className="lede mt-5">
              Oral care is one of the few categories where the marketing is louder than the
              evidence. We built SOMIL the other way round.
            </p>
          </Reveal>
          <Reveal delay={0.18} y={10}>
            <Link href="/about" className="mt-7 inline-flex items-center gap-2 text-[13px] text-clinic-700">
              <span className="link-underline">Read our approach</span>
              <IconArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <RevealGroup className="divide-y divide-line border-y border-line">
            {standards.map((s) => (
              <StaggerItem key={s.n}>
                <div className="group flex gap-6 py-8 first:pt-7 last:pb-7">
                  <div className="flex w-10 shrink-0 flex-col items-start gap-3">
                    <span className="text-[11px] tabular-nums tracking-[0.12em] text-ink-faint">
                      {s.n}
                    </span>
                    <s.icon size={17} className="text-clinic-600/70" />
                  </div>
                  <div>
                    <h3 className="text-[16px] text-ink">{s.title}</h3>
                    <p className="mt-2 max-w-[440px] text-[13.5px] leading-relaxed text-ink-mute">
                      {s.body}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── POPULAR RAIL ───────────────────── */

function PopularRail() {
  return (
    <section className="border-t border-line bg-white py-20 md:py-24">
      <div className="shell">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Reveal y={8}>
              <p className="eyebrow">Popular picks</p>
            </Reveal>
            <Reveal delay={0.06} y={14}>
              <h2 className="mt-3 display text-display-md text-ink">What is moving.</h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={10}>
            <Link
              href="/shop?sort=popular"
              className="group hidden items-center gap-2 text-[13px] text-ink-mute transition-colors hover:text-ink sm:inline-flex"
            >
              See the ranking
              <IconArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
          {popularProducts.map((p, i) => (
            <div
              key={p.slug}
              className="w-[68%] shrink-0 snap-start sm:w-[42%] lg:w-[calc((100%-60px)/4)]"
            >
              <div className="mb-3 flex items-baseline gap-2">
                <span className="text-[10.5px] tabular-nums tracking-[0.1em] text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <ProductCard product={p} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── ORDER STEPS ───────────────────── */

const steps = [
  {
    n: "01",
    title: "Build your cart",
    body: "Add what you need. Your cart is saved on this device, so you can come back to it.",
  },
  {
    n: "02",
    title: "Send it on WhatsApp",
    body: "Checkout composes a message with your items, quantities, prices and address — then opens WhatsApp.",
  },
  {
    n: "03",
    title: "We confirm, then ship",
    body: "Our team replies with stock, delivery time and payment options. Nothing is charged online.",
  },
];

function OrderSteps() {
  return (
    <section className="bg-canvas-tint/60 py-20 md:py-24">
      <div className="shell">
        <div className="mx-auto max-w-[560px] text-center">
          <Reveal y={8}>
            <p className="eyebrow">How ordering works</p>
          </Reveal>
          <Reveal delay={0.06} y={14}>
            <h2 className="mt-3 display text-display-md text-ink">
              Three steps, one human reply.
            </h2>
          </Reveal>
          <Reveal delay={0.12} y={10}>
            <p className="lede mt-4">{site.orderNotice}</p>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          {steps.map((s) => (
            <StaggerItem key={s.n}>
              <div className="group bg-white p-7 transition-colors duration-500 hover:bg-canvas-tint/60 md:p-8">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[30px] leading-none tracking-[-0.02em] text-clinic-700/25">
                    {s.n}
                  </span>
                  <IconArrowUpRight
                    size={15}
                    className="text-ink-faint/50 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-clinic-700"
                  />
                </div>
                <h3 className="mt-8 text-[15.5px] text-ink">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-mute">{s.body}</p>
              </div>
            </StaggerItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ───────────────────── SUPPORT BAND ───────────────────── */

function SupportBand() {
  return (
    <section className="shell py-20 md:py-24">
      <Reveal y={20}>
        <div className="relative overflow-hidden rounded-[14px] bg-ink px-7 py-12 text-white md:px-14 md:py-16">
          <svg
            className="pointer-events-none absolute -right-20 -top-24 h-[420px] w-[420px] opacity-[0.07]"
            viewBox="0 0 400 400"
            fill="none"
            aria-hidden
          >
            <circle cx="200" cy="200" r="180" stroke="#fff" />
            <circle cx="200" cy="200" r="130" stroke="#fff" />
            <circle cx="200" cy="200" r="80" stroke="#fff" />
          </svg>

          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className="text-[11px] uppercase tracking-[0.13em] text-white/45">
                Not sure what you need?
              </p>
              <h2 className="mt-4 display text-display-md text-white">
                Ask before you buy.
              </h2>
              <p className="mt-4 max-w-[400px] text-[14px] leading-relaxed text-white/60">
                Tell us what is bothering you — sensitivity, staining, a new aligner — and we
                will point you at the right product, or tell you to see a dentist instead.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-6">
              <a
                href={orderLink(site.whatsapp.greeting)}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border border-white/12 bg-white/[0.04] p-5 transition-all duration-500 hover:border-white/25 hover:bg-white/[0.08]"
              >
                <div className="flex items-center justify-between">
                  <IconWhatsApp size={19} className="text-white/70" />
                  <IconArrowUpRight
                    size={15}
                    className="text-white/30 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  />
                </div>
                <p className="mt-6 text-[10.5px] uppercase tracking-[0.11em] text-white/40">
                  Orders
                </p>
                <p className="mt-1 text-[14.5px] text-white">{site.whatsapp.display}</p>
              </a>

              <a
                href={supportLink(site.support.greeting)}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border border-white/12 bg-white/[0.04] p-5 transition-all duration-500 hover:border-white/25 hover:bg-white/[0.08]"
              >
                <div className="flex items-center justify-between">
                  <IconPhone size={19} className="text-white/70" />
                  <IconArrowUpRight
                    size={15}
                    className="text-white/30 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  />
                </div>
                <p className="mt-6 text-[10.5px] uppercase tracking-[0.11em] text-white/40">
                  Support
                </p>
                <p className="mt-1 text-[14.5px] text-white">{site.support.display}</p>
              </a>

              <a
                href={mailLink("Product enquiry")}
                className="group flex items-center justify-between rounded-lg border border-white/12 bg-white/[0.04] px-5 py-4 transition-all duration-500 hover:border-white/25 hover:bg-white/[0.08] sm:col-span-2"
              >
                <span className="flex items-center gap-3 text-[13.5px] text-white/85">
                  <IconMail size={17} className="text-white/50" />
                  {site.email}
                </span>
                <IconArrowUpRight size={15} className="text-white/30 transition-colors group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ───────────────────────── FAQ ───────────────────────── */

const faqs = [
  {
    q: "How do I actually pay?",
    a: "You do not pay on this website. Checkout opens WhatsApp with your order written out. Our team confirms stock and delivery, then shares payment options — UPI or bank transfer — before dispatch.",
  },
  {
    q: "How long does delivery take?",
    a: "Metro cities usually receive orders in 2–4 working days, the rest of India in 4–7. We dispatch within 24 hours of confirmation on working days.",
  },
  {
    q: "Are the whitening products safe for enamel?",
    a: "Yes, at the recommended dose. Aurora is a 5.5% hydrogen peroxide gel buffered to pH 7.1 with potassium nitrate for sensitivity. Do not exceed the stated course, and skip it if you are pregnant or under 18.",
  },
  {
    q: "Can I return a product?",
    a: "Unopened products can be returned within 7 days of delivery. For hygiene reasons, opened oral-care items cannot be resold, so we ask you to check the seal on arrival.",
  },
  {
    q: "Do you ship outside India?",
    a: "Not yet. We currently ship across India only, and we are working on international delivery.",
  },
];

function Faq() {
  return (
    <section className="shell pb-8 md:pb-4">
      <div className="grid gap-12 border-t border-line pt-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal y={8}>
            <p className="eyebrow">Questions</p>
          </Reveal>
          <Reveal delay={0.06} y={12}>
            <h2 className="mt-3 display text-display-md text-ink">Answered plainly.</h2>
          </Reveal>
          <Reveal delay={0.12} y={10}>
            <p className="mt-4 text-[13.5px] leading-relaxed text-ink-mute">
              Still unsure? Message us — a person replies during business hours.
            </p>
            <a
              href={orderLink(site.whatsapp.greeting)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[13px] text-clinic-700"
            >
              <span className="link-underline">Chat on WhatsApp</span>
              <IconArrowUpRight size={14} />
            </a>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px] text-ink marker:hidden">
                  {f.q}
                  <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                    <span className="absolute h-px w-3.5 bg-ink-mute transition-transform duration-400" />
                    <span className="absolute h-3.5 w-px bg-ink-mute transition-transform duration-400 group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>
                <p className="mt-3 max-w-[560px] text-[13.5px] leading-relaxed text-ink-mute">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
