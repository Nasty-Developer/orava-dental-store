import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your cart",
  description:
    "Review the SOMIL Dental Products in your cart before sending your order to our team on WhatsApp.",
  robots: { index: false, follow: true },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
