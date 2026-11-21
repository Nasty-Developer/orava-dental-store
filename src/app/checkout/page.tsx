"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { site } from "@/data/site";
import { buildOrderMessage, formatINR, orderLink } from "@/lib/whatsapp";
import { ProductArt, categoryTint } from "@/components/product-art";
import {
  IconWhatsApp,
  IconArrowRight,
  IconCheck,
  IconLock,
  IconChevronDown,
} from "@/components/icons";

type Fields = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
};

const EMPTY: Fields = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  notes: "",
};

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Odisha", "Puducherry",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Other",
];

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (f.name.trim().length < 2) e.name = "Please enter your full name.";
  const digits = f.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  if (digits.length !== 10) e.phone = "Enter a 10-digit mobile number.";
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim()))
    e.email = "That email does not look right.";
  if (f.address.trim().length < 8) e.address = "Add house / flat, street and area.";
  if (f.city.trim().length < 2) e.city = "Required.";
  if (!f.state) e.state = "Select a state.";
  if (!/^\d{6}$/.test(f.pincode.trim())) e.pincode = "6-digit PIN code.";
  return e;
}

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, count, clear, ready } = useCart();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [submitted, setSubmitted] = useState<{
    message: string;
    ref: string;
    link: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = document.querySelector<HTMLElement>("[data-invalid='true']");
      first?.focus();
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const { message, ref } = buildOrderMessage(
      items.map((i) => ({ product: i.product, qty: i.qty })),
      {
        name: fields.name.trim(),
        phone: fields.phone.trim(),
        email: fields.email.trim() || undefined,
        address: fields.address.trim(),
        city: fields.city.trim(),
        state: fields.state,
        pincode: fields.pincode.trim(),
        notes: fields.notes.trim() || undefined,
      },
    );

    const link = orderLink(message);
    setSubmitted({ message, ref, link });

    // try to open straight away; the panel below is the guaranteed fallback
    const win = window.open(link, "_blank", "noopener,noreferrer");
    if (!win) {
      // popup blocked — the panel button will do it on a user gesture
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyMessage = async () => {
    if (!submitted) return;
    try {
      await navigator.clipboard.writeText(submitted.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  if (!ready) {
    return (
      <div className="shell py-20">
        <div className="shimmer h-8 w-52 rounded" />
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="shimmer h-80 rounded-lg" />
          <div className="shimmer h-80 rounded-lg" />
        </div>
      </div>
    );
  }

  if (items.length === 0 && !submitted) {
    return (
      <div className="shell flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="display text-display-md text-ink">Your cart is empty.</h1>
        <p className="mt-3 max-w-[360px] text-[14px] leading-relaxed text-ink-mute">
          Add a product first, then come back here to send your order.
        </p>
        <Link href="/shop" className="btn-primary mt-7">
          Browse products
          <IconArrowRight size={16} />
        </Link>
      </div>
    );
  }

  /* ── success / hand-off panel ── */
  if (submitted) {
    return (
      <div className="shell py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[720px]"
        >
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-clinic-50 text-clinic-700">
              <IconWhatsApp size={22} />
            </div>
            <div>
              <p className="eyebrow">Almost done</p>
              <h1 className="mt-2 display text-display-md text-ink">
                Send this on WhatsApp.
              </h1>
              <p className="mt-3 max-w-[520px] text-[14px] leading-relaxed text-ink-mute">
                Your order is written out below. WhatsApp should have opened in a new tab — if
                it did not, tap the button. Nothing is confirmed or charged until our team
                replies.
              </p>
            </div>
          </div>

          <a
            href={submitted.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-7 w-full sm:w-auto"
          >
            <IconWhatsApp size={17} />
            Open WhatsApp with this order
          </a>

          <div className="mt-8 overflow-hidden rounded-xl border border-line">
            <div className="flex items-center justify-between border-b border-line bg-canvas-tint/60 px-5 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                Message preview · Ref {submitted.ref}
              </p>
              <button
                onClick={copyMessage}
                className="text-[11.5px] text-clinic-700 hover:text-ink"
              >
                {copied ? "Copied" : "Copy text"}
              </button>
            </div>
            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap px-5 py-4 font-sans text-[12.5px] leading-relaxed text-ink-soft">
              {submitted.message}
            </pre>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                clear();
                setSubmitted(null);
                setFields(EMPTY);
              }}
              className="btn-ghost"
            >
              Start a new order
            </button>
            <Link href="/shop" className="btn-ghost">
              Keep shopping
            </Link>
          </div>

          <p className="mt-6 text-[11.5px] leading-relaxed text-ink-faint">
            Prefer email? Write to{" "}
            <a href={`mailto:${site.email}`} className="text-clinic-700 underline underline-offset-2">
              {site.email}
            </a>{" "}
            with the same details and we will reply there.
          </p>
        </motion.div>
      </div>
    );
  }

  /* ── form ── */
  return (
    <div className="shell py-10 md:py-14">
      <div className="border-b border-line pb-6">
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-2 display text-display-md text-ink">Where should it go?</h1>
        <p className="mt-3 max-w-[520px] text-[13.5px] leading-relaxed text-ink-mute">
          We only need what is required to deliver. This form builds your WhatsApp order — it is
          not a payment page.
        </p>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <form onSubmit={handleSubmit} noValidate>
          <fieldset className="space-y-7">
            <legend className="sr-only">Delivery details</legend>

            <div className="grid gap-7 sm:grid-cols-2">
              <Field
                label="Full name"
                required
                value={fields.name}
                onChange={set("name")}
                error={errors.name}
                autoComplete="name"
                placeholder="Tanvi Tapase"
              />
              <Field
                label="Mobile number"
                required
                value={fields.phone}
                onChange={set("phone")}
                error={errors.phone}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="10-digit number"
                hint="We confirm your order on this number."
              />
            </div>

            <Field
              label="Email (optional)"
              value={fields.email}
              onChange={set("email")}
              error={errors.email}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />

            <div>
              <label className="label" htmlFor="address">
                Delivery address <span className="text-clinic-700">*</span>
              </label>
              <textarea
                id="address"
                value={fields.address}
                onChange={set("address")}
                rows={3}
                autoComplete="street-address"
                placeholder="Flat / house no., building, street, area"
                data-invalid={!!errors.address}
                className={`field resize-none ${errors.address ? "border-red-400" : ""}`}
              />
              <FieldError message={errors.address} />
            </div>

            <div className="grid gap-7 sm:grid-cols-3">
              <Field
                label="City"
                required
                value={fields.city}
                onChange={set("city")}
                error={errors.city}
                autoComplete="address-level2"
                placeholder="Mumbai"
              />
              <div>
                <label className="label" htmlFor="state">
                  State <span className="text-clinic-700">*</span>
                </label>
                <div className="relative">
                  <select
                    id="state"
                    value={fields.state}
                    onChange={set("state")}
                    data-invalid={!!errors.state}
                    className={`field appearance-none pr-6 ${errors.state ? "border-red-400" : ""}`}
                  >
                    <option value="">Select</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <IconChevronDown
                    size={14}
                    className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-ink-faint"
                  />
                </div>
                <FieldError message={errors.state} />
              </div>
              <Field
                label="PIN code"
                required
                value={fields.pincode}
                onChange={set("pincode")}
                error={errors.pincode}
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="400070"
                maxLength={6}
              />
            </div>

            <div>
              <label className="label" htmlFor="notes">
                Order notes (optional)
              </label>
              <textarea
                id="notes"
                value={fields.notes}
                onChange={set("notes")}
                rows={3}
                placeholder="Delivery instructions, preferred time, GST details, or a question about the product."
                className="field resize-none"
              />
            </div>
          </fieldset>

          <div className="mt-9 rounded-lg bg-canvas-tint/70 p-5">
            <p className="flex items-start gap-2.5 text-[12px] leading-relaxed text-ink-mute">
              <IconLock size={14} className="mt-0.5 shrink-0 text-clinic-600" />
              <span>
                <span className="text-ink">No online payment.</span> Submitting opens WhatsApp
                with your order written out. Our team confirms stock, delivery time and payment
                options in the chat.
              </span>
            </p>
          </div>

          <button type="submit" className="btn-primary mt-6 w-full">
            <IconWhatsApp size={17} />
            Send order on WhatsApp
          </button>

          <p className="mt-3 text-center text-[11px] text-ink-faint">
            By sending this order you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-ink">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
              privacy policy
            </Link>
            .
          </p>
        </form>

        {/* summary */}
        <aside className="lg:sticky lg:top-[100px] lg:self-start">
          <div className="rounded-xl border border-line p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[15px] text-ink">Your order</h2>
              <Link href="/cart" className="text-[11.5px] text-ink-faint hover:text-ink">
                Edit
              </Link>
            </div>

            <ul className="mt-5 space-y-4">
              {items.map((i) => (
                <li key={i.slug} className="flex items-center gap-3.5">
                  <div
                    className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md"
                    style={{ backgroundColor: categoryTint[i.product.category] }}
                  >
                    <ProductArt visual={i.product.visual} className="h-full w-full scale-[1.15]" />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[9px] text-white">
                      {i.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] text-ink">{i.product.name}</p>
                    <p className="text-[11px] text-ink-faint">{i.product.packaging ?? i.product.brand}</p>
                  </div>
                  <span className="text-[12.5px] tabular-nums text-ink-soft">
                    {formatINR(i.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-[13px]">
              <div className="flex justify-between text-ink-mute">
                <dt>Subtotal ({count})</dt>
                <dd className="tabular-nums text-ink">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-ink-mute">
                <dt>Delivery</dt>
                <dd className="tabular-nums text-ink">
                  {shipping === 0 ? "Free" : formatINR(shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-[16px]">
                <dt className="text-ink">Total</dt>
                <dd className="tabular-nums text-ink">{formatINR(total)}</dd>
              </div>
            </dl>

            <p className="mt-4 text-[11px] leading-relaxed text-ink-faint">
              Estimated delivery 2–7 working days after confirmation. Prices include GST.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  required,
  hint,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  hint?: string;
  type?: string;
  inputMode?: "text" | "tel" | "numeric" | "email";
  autoComplete?: string;
  placeholder?: string;
  maxLength?: number;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label} {required && <span className="text-clinic-700">*</span>}
      </label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        data-invalid={!!error}
        className={`field ${error ? "border-red-400" : ""}`}
        {...rest}
      />
      <AnimatePresence>
        {error ? (
          <FieldError message={error} />
        ) : hint ? (
          <p className="mt-1.5 text-[11px] text-ink-faint">{hint}</p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-1.5 flex items-center gap-1.5 text-[11px] text-red-600"
        >
          <IconCheck size={11} className="rotate-45" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
