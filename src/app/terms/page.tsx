import type { Metadata } from "next";
import { PageHeader, Prose } from "@/components/page-header";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that apply when you order from Orava, including how WhatsApp orders are confirmed and priced.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        lede="The rules of the shop, written in plain language."
        crumbs={[{ label: "Terms & Conditions" }]}
      />
      <section className="shell py-14 md:py-20">
        <p className="mb-10 text-[12px] text-ink-faint">Last updated: 20 November 2026</p>

        <Prose>
          <p>
            These terms apply when you use this website or place an order with {site.legalName}
            (“Orava”, “we”, “us”). By ordering, you accept them.
          </p>

          <h2>1. Orders are placed on WhatsApp</h2>
          <p>
            This website is a catalogue. It does not take payment. When you complete checkout we
            compose a message containing your items, quantities, prices, delivery address and
            notes, and open WhatsApp so you can send it to our team.
          </p>
          <p>
            <strong>An order is only accepted when we confirm it in the chat.</strong> Until then
            it is a request. Prices, availability and delivery estimates shown on this site are
            indicative and may be corrected at confirmation.
          </p>

          <h2>2. Pricing and payment</h2>
          <ul>
            <li>All prices are in Indian Rupees and include applicable GST.</li>
            <li>Delivery is free on orders over {`₹${site.freeShippingThreshold.toLocaleString("en-IN")}`}; otherwise a flat {`₹${site.shippingFlat}`} applies.</li>
            <li>
              Payment is collected after confirmation, by UPI or bank transfer as agreed in the
              chat. We never ask for card details, OTPs or remote-access apps.
            </li>
          </ul>

          <h2>3. Delivery</h2>
          <p>
            We dispatch within 24 hours on working days. Typical delivery is 2–4 working days in
            metro cities and 4–7 elsewhere. Delays caused by couriers, weather or incorrect
            addresses are outside our control, but we will chase them for you.
          </p>

          <h2>4. Returns and cancellations</h2>
          <p>
            Unopened products may be returned within 7 days of delivery. For hygiene reasons we
            cannot accept opened oral-care items. See{" "}
            <a href="/shipping-returns">Shipping &amp; Returns</a> for the full process.
          </p>
          <p>
            You may cancel before dispatch at no cost. Once dispatched, a cancellation is handled
            as a return.
          </p>

          <h2>5. Product use and health disclaimer</h2>
          <p>
            Products sold here are cosmetic and personal-care items intended to support daily
            oral hygiene. They are not medicines and are not a substitute for professional
            diagnosis or treatment.
          </p>
          <p>
            Whitening products are not suitable for people under 18, during pregnancy or
            breastfeeding, or for anyone with untreated cavities, gum disease or exposed roots.
            If you experience persistent sensitivity, bleeding or pain, stop using the product
            and consult a dentist.
          </p>
          <p>
            Always follow the directions on the pack. Do not exceed the stated course or
            concentration.
          </p>

          <h2>6. Accuracy of information</h2>
          <p>
            We try to describe products accurately, including active ingredients and
            concentrations. Manufacturers occasionally reformulate; where a discrepancy matters,
            the packaging is authoritative. Tell us and we will correct the page.
          </p>

          <h2>7. Intellectual property</h2>
          <p>
            The Orava name, text, layout and illustrations on this site belong to us. You may
            share links freely. Do not copy the catalogue or product photography for commercial
            use without permission.
          </p>

          <h2>8. Liability</h2>
          <p>
            To the extent permitted by law, our liability for any order is limited to the amount
            you paid for that order. We are not liable for indirect losses. Nothing here limits
            rights you have under Indian consumer law.
          </p>

          <h2>9. Governing law</h2>
          <p>
            These terms are governed by the laws of India. Disputes are subject to the exclusive
            jurisdiction of the courts of Mumbai, Maharashtra.
          </p>

          <h2>10. Contact</h2>
          <p>
            Questions about these terms: <a href={`mailto:${site.email}`}>{site.email}</a> or{" "}
            {site.support.display}.
          </p>
        </Prose>
      </section>
    </>
  );
}
