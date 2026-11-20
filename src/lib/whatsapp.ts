import { site } from "@/data/site";
import type { Product } from "@/data/products";

/** Build a wa.me link with a prefilled message. */
export function waLink(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const orderLink = (message: string) => waLink(site.whatsapp.number, message);
export const supportLink = (message: string) => waLink(site.support.number, message);

export const generalEnquiryLink = () => orderLink(site.whatsapp.greeting);
export const supportEnquiryLink = () => supportLink(site.support.greeting);

export const mailLink = (subject?: string, body?: string) => {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const q = params.toString();
  return `mailto:${site.email}${q ? `?${q}` : ""}`;
};

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export type OrderLine = {
  product: Pick<Product, "slug" | "name" | "price" | "size">;
  qty: number;
};

export type OrderCustomer = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
};

/**
 * Compose the WhatsApp order message. Every cart line, price and note
 * is included — nothing is dropped.
 */
export function buildOrderMessage(lines: OrderLine[], customer: OrderCustomer) {
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const shipping = subtotal >= site.freeShippingThreshold ? 0 : site.shippingFlat;
  const total = subtotal + shipping;
  const ref = `ORV-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  const rows = lines
    .map(
      (l, i) =>
        `${i + 1}. ${l.product.name} (${l.product.size})\n` +
        `    Qty: ${l.qty} × ${inr(l.product.price)} = ${inr(l.product.price * l.qty)}`,
    )
    .join("\n");

  const message = [
    `*NEW ORDER — ${site.name}*`,
    `Ref: ${ref}`,
    "",
    "*CUSTOMER*",
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    customer.email ? `Email: ${customer.email}` : null,
    "",
    "*DELIVERY ADDRESS*",
    customer.address,
    `${customer.city}, ${customer.state} ${customer.pincode}`,
    "",
    "*ITEMS*",
    rows,
    "",
    "*SUMMARY*",
    `Subtotal: ${inr(subtotal)}`,
    `Shipping: ${shipping === 0 ? "Free" : inr(shipping)}`,
    `*Total: ${inr(total)}*`,
    "",
    customer.notes ? `*NOTES*\n${customer.notes}` : null,
    "",
    "_Sent from the Orava website. Please confirm stock and delivery._",
  ]
    .filter(Boolean)
    .join("\n");

  return { message, subtotal, shipping, total, ref };
}

/** Single-product enquiry message from a product page. */
export function buildProductEnquiry(product: Product, qty = 1) {
  return [
    `Hello ${site.name}, I'd like to order:`,
    "",
    `*${product.name}*`,
    `${product.size}`,
    `Qty: ${qty} × ${inr(product.price)} = ${inr(product.price * qty)}`,
    "",
    "Please share availability and delivery time.",
  ].join("\n");
}

export { inr as formatINR };
