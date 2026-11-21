import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { site } from "@/data/site";
import { Reveal, RevealGroup, StaggerItem } from "@/components/reveal";
import { ProductArt } from "@/components/product-art";
import { IconArrowRight, IconWhatsApp, IconArrowUpRight } from "@/components/icons";
import { orderLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "About",
  description:
    "SOMIL Dental Products is a small, clinician-reviewed oral care house in Mumbai. A narrow shelf, honest claims and orders confirmed by people.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    n: "01",
    title: "The evidence sets the shelf",
    body: "A product gets in if a dentist can explain why it works, and out if they cannot. That is why there are eighteen products rather than a hundred and eighty.",
  },
  {
    n: "02",
    title: "Concentration over cleverness",
    body: "Fluoride at the right ppm. Peroxide at a dose that brightens without burning. Alcohol left out because it does more harm than good.",
  },
  {
    n: "03",
    title: "Say what the product does not do",
    body: "No product here whitens in one night, replaces flossing or fixes a cavity. The packaging says so, and so does this page.",
  },
  {
    n: "04",
    title: "Sell through a conversation",
    body: "Orders arrive as WhatsApp messages and leave as parcels tracked by a person. It is slower than a checkout button and considerably more useful.",
  },
];

const numbers = [
  { value: "18", label: "Products on the shelf" },
  { value: "6", label: "Clinical categories" },
  { value: "24h", label: "Dispatch window" },
  { value: "7", label: "Day return window" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={
          <>
            Built like a clinic,
            <br />
            not a campaign.
          </>
        }
        lede="SOMIL began with a simple irritation: the oral care aisle is full of loud claims and thin evidence. We wanted a shelf where every product could be defended."
        crumbs={[{ label: "About" }]}
      />

      {/* statement + visual */}
      <section className="shell py-16 md:py-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal y={14}>
              <p className="display text-[26px] leading-[1.35] tracking-[-0.015em] text-ink md:text-[30px]">
                “Most people do not need more products. They need the right three, used
                properly.”
              </p>
              <p className="mt-6 text-[12px] uppercase tracking-[0.11em] text-ink-faint">
                The founding note
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.08} y={18}>
              <div className="space-y-5 text-[14.5px] leading-[1.75] text-ink-mute">
                <p>
                  We started by asking practising dentists a blunt question: if you could only
                  recommend five things from your own chair, what would they be? The answers were
                  consistent, and almost none of them were on the front of a supermarket shelf.
                </p>
                <p>
                  So the shelf was built backwards from that list. Formulations were chosen for
                  what they measurably do — tubule occlusion, remineralisation, biofilm
                  disruption — rather than for a flavour or a colour. Where an ingredient had no
                  defensible job, it came out.
                </p>
                <p>
                  What is left is deliberately small. Eighteen products across six categories,
                  each with a written reason for existing. If a new one cannot beat what is
                  already here, it does not get added.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* visual band */}
      <section className="border-y border-line bg-canvas-tint/50">
        <div className="shell grid grid-cols-2 divide-x divide-line md:grid-cols-4">
          {(["tube", "instrument", "bottle", "bracket"] as const).map((v, i) => (
            <Reveal key={v} delay={i * 0.05} y={0}>
              <div className="relative aspect-square overflow-hidden">
                <ProductArt
                  visual={v}
                  className="h-full w-full scale-[1.05] p-4 transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.12]"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* principles */}
      <section className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal y={10}>
              <p className="eyebrow">Principles</p>
              <h2 className="mt-3 display text-display-md text-ink">Four rules we do not bend.</h2>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <RevealGroup className="divide-y divide-line border-y border-line">
              {principles.map((p) => (
                <StaggerItem key={p.n}>
                  <div className="flex gap-6 py-7">
                    <span className="w-8 shrink-0 pt-1 text-[11px] tabular-nums tracking-[0.12em] text-ink-faint">
                      {p.n}
                    </span>
                    <div>
                      <h3 className="text-[15.5px] text-ink">{p.title}</h3>
                      <p className="mt-2 max-w-[440px] text-[13.5px] leading-relaxed text-ink-mute">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* numbers */}
      <section className="border-y border-line bg-white">
        <div className="shell grid grid-cols-2 divide-x divide-line md:grid-cols-4">
          {numbers.map((n, i) => (
            <Reveal key={n.label} delay={i * 0.05} y={12}>
              <div className="px-2 py-10 text-center md:py-12">
                <p className="font-display text-[38px] leading-none tracking-[-0.03em] text-ink md:text-[46px]">
                  {n.value}
                </p>
                <p className="mt-3 text-[11.5px] uppercase tracking-[0.1em] text-ink-faint">
                  {n.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="shell py-20 md:py-28">
        <Reveal y={16}>
          <div className="mx-auto max-w-[640px] text-center">
            <h2 className="display text-display-md text-ink">
              Start with the essentials.
            </h2>
            <p className="lede mx-auto mt-4 max-w-[440px]">
              Most routines need three things: a brush that does not damage gums, a fluoride
              paste, and something for the gaps between teeth.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/shop" className="btn-primary group">
                Shop the shelf
                <IconArrowRight
                  size={16}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </Link>
              <a
                href={orderLink(site.whatsapp.greeting)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <IconWhatsApp size={16} className="text-clinic-700" />
                Ask for a recommendation
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
