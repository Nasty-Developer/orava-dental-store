import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Send your SOMIL Dental Products order to our team on WhatsApp. Nothing is charged online.",
  robots: { index: false, follow: true },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
