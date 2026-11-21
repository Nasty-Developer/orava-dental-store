/**
 * SINGLE SOURCE OF TRUTH for brand, contact and commerce settings.
 * Change values here and they update across the entire site.
 */

export const site = {
  /** Full brand name, used in titles, legal copy and metadata. */
  name: "SOMIL Dental Products",
  /** Short mark used in the header, loading screen and tight spaces. */
  shortName: "SOMIL",
  /** Secondary line of the brand lockup. */
  descriptor: "Dental Products",
  legalName: "SOMIL Dental Products",
  tagline: "Clinical oral care, quietly perfected.",
  description:
    "SOMIL Dental Products is a premium dental care house in Mumbai, offering clinician-reviewed whitening, brushing and rinse essentials, with every order confirmed personally on WhatsApp.",
  url: "https://somil-dental-products.vercel.app",

  /** Order line. Every checkout is sent here. */
  whatsapp: {
    /** digits only, country code first */
    number: "918591434914",
    display: "+91 85914 34914",
    /** pre-filled opener used for general enquiries */
    greeting: "Hello SOMIL Dental Products, I'd like some help choosing the right products.",
  },

  /** Support line. Enquiries only, never orders. */
  support: {
    number: "918433553501",
    display: "+91 84335 53501",
    greeting: "Hello SOMIL Dental Products, I have a question about an existing order.",
  },

  email: "tanudevworks@gmail.com",

  address: {
    line1: "SOMIL Dental Products",
    line2: "Kurla West, Mumbai",
    region: "Maharashtra 400070",
    country: "India",
  },

  hours: "Mon – Sat, 10:00 – 19:00 IST",

  currency: {
    code: "INR",
    symbol: "₹",
    locale: "en-IN",
  },

  freeShippingThreshold: 1499,
  shippingFlat: 79,

  social: {
    instagram: "https://instagram.com",
  },

  /**
   * Every order is placed over WhatsApp and confirmed by a human.
   * Keep this honest wording on the site.
   */
  orderNotice:
    "Orders are sent to our team on WhatsApp. Nothing is charged online — we confirm stock, address and delivery before dispatch.",
} as const;

export const trustPoints = [
  { label: "Authorised sourcing", detail: "Genuine stock, batch verified" },
  { label: "Free delivery over ₹1,499", detail: "Tracked, across India" },
  { label: "Price on request", detail: "Confirmed before dispatch" },
  { label: "Order on WhatsApp", detail: "A real person replies" },
] as const;

export const marqueeItems = [
  "Restorative",
  "Endodontics",
  "Orthodontics",
  "Implantology",
  "Instruments",
  "Infection control",
  "Sterilization",
  "Imaging",
  "Ships across India",
  "No online payment",
] as const;
