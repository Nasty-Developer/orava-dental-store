import type { Metadata, Viewport } from "next";
import { Inter, Manrope, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { LoadingScreen } from "@/components/loading-screen";

/* Headings: Manrope, a geometric grotesque that stays crisp at large sizes. */
const display = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

/* Body, navigation, buttons, tables, product copy: Inter. */
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/* The wordmark keeps a serif voice, but a modern low-contrast one. */
const wordmark = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-wordmark",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Premium Dental Care Essentials`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "SOMIL Dental Products",
    "dental products",
    "teeth whitening",
    "sonic toothbrush",
    "mouthwash",
    "oral care India",
    "buy dental care online",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Premium Dental Care Essentials`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Premium Dental Care Essentials`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: site.name,
  legalName: site.legalName,
  description: site.description,
  url: site.url,
  email: site.email,
  telephone: `+${site.whatsapp.number}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.line1,
    addressLocality: site.address.line2,
    addressRegion: site.address.region,
    addressCountry: "IN",
  },
  currenciesAccepted: "INR",
  openingHours: "Mo-Sa 10:00-19:00",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable} ${wordmark.variable}`}>
      <body>
        <LoadingScreen />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-[13px] focus:text-white"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFab />
        </CartProvider>
      </body>
    </html>
  );
}
