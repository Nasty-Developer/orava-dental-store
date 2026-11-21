import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Prose } from "@/components/page-header";
import { site } from "@/data/site";
import { IconWhatsApp, IconArrowUpRight } from "@/components/icons";
import { orderLink, supportLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "Delivery timelines, charges and the 7-day return process for SOMIL Dental Products orders across India.",
  alternates: { canonical: "/shipping-returns" },
};

const zones = [
  { zone: "Mumbai & MMR", time: "1–2 working days", note: "Same-day dispatch before 2 pm" },
  { zone: "Metro cities", time: "2–4 working days", note: "Delhi, Bengaluru, Hyderabad, Chennai, Pune, Ahmedabad, Kolkata" },
  { zone: "Rest of India", time: "4–7 working days", note: "Including North-East and island regions" },
];

export default function ShippingReturnsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Help"
        title="Shipping & Returns"
        lede="How long delivery takes, what it costs, and what happens if something is not right."
        crumbs={[{ label: "Shipping & Returns" }]}
      />

      <section className="shell py-14 md:py-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Prose>
              <h2 className="!mt-0">Dispatch</h2>
              <p>
                Orders confirmed before 2 pm on a working day are dispatched the same day.
                Anything after that, or on a Sunday, goes out the next working day. You will
                receive a tracking link in the same WhatsApp chat where you ordered.
              </p>

              <h2>Delivery estimates</h2>
              <div className="!mt-6 overflow-hidden rounded-lg border border-line">
                {zones.map((z, i) => (
                  <div
                    key={z.zone}
                    className={`grid gap-1 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center ${
                      i > 0 ? "border-t border-line" : ""
                    }`}
                  >
                    <div>
                      <p className="!text-[13.5px] !text-ink">{z.zone}</p>
                      <p className="!mt-0.5 !text-[11.5px] !text-ink-faint">{z.note}</p>
                    </div>
                    <p className="!text-[12.5px] !text-ink-soft">{z.time}</p>
                  </div>
                ))}
              </div>

              <h2>Charges</h2>
              <p>
                Free delivery on orders over{" "}
                {`₹${site.freeShippingThreshold.toLocaleString("en-IN")}`}. Below that, a flat{" "}
                {`₹${site.shippingFlat}`} applies anywhere in India. No handling or packaging fees.
              </p>

              <h2>Returns</h2>
              <p>
                Unopened products in their original packaging can be returned within{" "}
                <strong>7 days of delivery</strong>. For hygiene and safety reasons, opened
                oral-care items — toothpaste, gels, rinses, brushes that have been used — cannot
                be resold and are therefore not returnable unless they arrived damaged or faulty.
              </p>

              <h3>How to start a return</h3>
              <ul>
                <li>Message us on the support number with your order reference and a photo.</li>
                <li>We confirm eligibility within one working day.</li>
                <li>
                  For damaged or incorrect items we arrange pickup at our cost and send a
                  replacement or refund, your choice.
                </li>
                <li>
                  For change-of-mind returns on unopened items, return shipping is paid by you
                  and refunded to your original payment method within 5 working days of receipt.
                </li>
              </ul>

              <h2>Damaged in transit</h2>
              <p>
                Photograph the parcel before opening it if the outer box looks damaged, and send
                us the photos within 48 hours of delivery. We replace transit damage without
                argument.
              </p>

              <h2>Wrong address</h2>
              <p>
                Tell us before dispatch and we will correct it. After dispatch, a re-delivery
                charge from the courier may apply.
              </p>
            </Prose>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="sticky top-[100px] space-y-4">
              <div className="rounded-xl border border-line p-6">
                <p className="eyebrow">Start a return</p>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-mute">
                  Message the support number with your order reference. A person handles it, not
                  a form.
                </p>
                <a
                  href={supportLink("Hello SOMIL, I'd like to return an item from my order.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-5 w-full"
                >
                  <IconWhatsApp size={16} />
                  Message support
                </a>
                <p className="mt-3 text-center text-[11.5px] text-ink-faint">
                  {site.support.display}
                </p>
              </div>

              <div className="rounded-xl bg-canvas-tint/70 p-6">
                <p className="text-[12.5px] text-ink-soft">Placing a new order?</p>
                <a
                  href={orderLink(site.whatsapp.greeting)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] text-clinic-700"
                >
                  Order on WhatsApp
                  <IconArrowUpRight size={13} />
                </a>
                <div className="mt-5 border-t border-line pt-4">
                  <Link
                    href="/contact"
                    className="text-[12px] text-ink-mute underline underline-offset-4 hover:text-ink"
                  >
                    All contact options
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
