import type { Metadata } from "next";
import { PageHeader, Prose } from "@/components/page-header";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Orava collects, uses and stores the information you share when you browse the site or place an order on WhatsApp.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        lede="What we collect, why we need it, and how long we keep it."
        crumbs={[{ label: "Privacy Policy" }]}
      />
      <section className="shell py-14 md:py-20">
        <p className="mb-10 text-[12px] text-ink-faint">Last updated: 20 November 2026</p>

        <Prose>
          <p>
            This policy explains how {site.legalName} (“Orava”, “we”) handles personal data when
            you use this website or place an order with us over WhatsApp. We keep it short
            because we collect very little.
          </p>

          <h2>1. What we collect</h2>
          <ul>
            <li>
              <strong>Order details you give us:</strong> name, mobile number, delivery address,
              optional email address, PIN code, and any notes you add at checkout.
            </li>
            <li>
              <strong>Messages:</strong> the content of WhatsApp, email or phone conversations
              with our team.
            </li>
            <li>
              <strong>Basic technical data:</strong> our hosting provider may record standard
              request logs such as IP address, browser type and pages requested, for security
              and performance.
            </li>
            <li>
              <strong>Cart contents:</strong> stored locally in your own browser. This never
              reaches our servers.
            </li>
          </ul>
          <p>
            We do not collect payment card details, and this website does not process payments.
          </p>

          <h2>2. How we use it</h2>
          <ul>
            <li>To confirm, pack, dispatch and deliver your order.</li>
            <li>To answer your questions and handle returns or replacements.</li>
            <li>To keep records required for tax and accounting.</li>
            <li>To protect the site against abuse and fraud.</li>
          </ul>
          <p>
            We do not sell your data, and we do not run advertising trackers on this site.
          </p>

          <h2>3. Who we share it with</h2>
          <p>
            Only the people who need it to complete your order: our courier partners (name,
            address, phone) and our hosting provider. Where required by law, we may share
            information with authorities.
          </p>
          <p>
            Our website is hosted on Vercel. Conversations happen on WhatsApp, which is operated
            by Meta and governed by its own privacy terms.
          </p>

          <h2>4. How long we keep it</h2>
          <p>
            Order records are kept for as long as tax and accounting rules require, currently
            eight years in India. Chat conversations are kept for up to two years, then deleted.
            Cart data in your browser stays until you clear it.
          </p>

          <h2>5. Your choices</h2>
          <p>
            You can ask us to show you the data we hold about you, correct it, or delete it where
            we are not required to keep it. Write to{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a> and we will respond within 30 days.
            You can also ask us to stop contacting you for anything other than an active order.
          </p>

          <h2>6. Security</h2>
          <p>
            The site is served over HTTPS. Order details live in our order records and in
            WhatsApp, protected by access controls on our accounts. No system is perfectly
            secure, but we do not store more than we need, which is the most reliable protection
            there is.
          </p>

          <h2>7. Children</h2>
          <p>
            This site is not intended for children under 18. Paediatric products should be
            purchased by a parent or guardian.
          </p>

          <h2>8. Changes</h2>
          <p>
            If this policy changes materially we will update the date at the top of this page.
            Continued use of the site after that counts as acceptance.
          </p>

          <h2>9. Contact</h2>
          <p>
            {site.legalName}, {site.address.line2}, {site.address.region}, {site.address.country}.
            Email <a href={`mailto:${site.email}`}>{site.email}</a>, or message{" "}
            {site.support.display}.
          </p>
        </Prose>
      </section>
    </>
  );
}
