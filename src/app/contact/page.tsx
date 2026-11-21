import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { site } from "@/data/site";
import { orderLink, supportLink, mailLink } from "@/lib/whatsapp";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import {
  IconWhatsApp,
  IconPhone,
  IconMail,
  IconArrowUpRight,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the SOMIL team about products, orders or returns. WhatsApp, phone and email, answered by people.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: IconWhatsApp,
    label: "Orders",
    value: site.whatsapp.display,
    note: "The number every order goes to. Best for placing or changing an order.",
    href: orderLink(site.whatsapp.greeting),
    primary: true,
  },
  {
    icon: IconPhone,
    label: "Support",
    value: site.support.display,
    note: "Questions about delivery, returns or which product suits you.",
    href: supportLink(site.support.greeting),
  },
  {
    icon: IconMail,
    label: "Email",
    value: site.email,
    note: "For invoices, bulk clinic orders and anything that needs a paper trail.",
    href: mailLink("Website enquiry"),
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="A person, not a bot."
        lede="Message us on WhatsApp and someone from the team replies. We would rather answer a question than take an order you did not need."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="shell py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {channels.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06} y={16}>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`group flex h-full flex-col rounded-xl border p-6 transition-all duration-500 ${
                  c.primary
                    ? "border-ink/15 bg-ink text-white hover:bg-ink-soft"
                    : "border-line hover:border-line-strong hover:bg-canvas-tint/60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <c.icon size={20} className={c.primary ? "text-white/70" : "text-clinic-600/80"} />
                  <IconArrowUpRight
                    size={15}
                    className={`transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                      c.primary ? "text-white/40 group-hover:text-white" : "text-ink-faint"
                    }`}
                  />
                </div>
                <p
                  className={`mt-8 text-[10.5px] uppercase tracking-[0.12em] ${
                    c.primary ? "text-white/45" : "text-ink-faint"
                  }`}
                >
                  {c.label}
                </p>
                <p className={`mt-1.5 text-[15px] ${c.primary ? "text-white" : "text-ink"}`}>
                  {c.value}
                </p>
                <p
                  className={`mt-3 text-[12.5px] leading-relaxed ${
                    c.primary ? "text-white/55" : "text-ink-mute"
                  }`}
                >
                  {c.note}
                </p>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-14 border-t border-line pt-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal y={10}>
              <p className="eyebrow">Send a message</p>
              <h2 className="mt-3 display text-display-md text-ink">
                Tell us what you need.
              </h2>
              <p className="mt-4 max-w-[380px] text-[13.5px] leading-relaxed text-ink-mute">
                Fill this in and it opens WhatsApp with your message ready. If WhatsApp is not
                convenient, email works just as well.
              </p>
            </Reveal>

            <Reveal delay={0.1} y={10}>
              <div className="mt-10 space-y-6 border-t border-line pt-8">
                <div>
                  <p className="eyebrow">Hours</p>
                  <p className="mt-2 text-[13.5px] text-ink-soft">{site.hours}</p>
                </div>
                <div>
                  <p className="eyebrow">Address</p>
                  <address className="mt-2 not-italic text-[13.5px] leading-relaxed text-ink-soft">
                    {site.address.line1}
                    <br />
                    {site.address.line2}
                    <br />
                    {site.address.region}
                    <br />
                    {site.address.country}
                  </address>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.08} y={16}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
