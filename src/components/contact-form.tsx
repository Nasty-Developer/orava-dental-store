"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { orderLink } from "@/lib/whatsapp";
import { IconWhatsApp, IconCheck } from "@/components/icons";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("Product advice");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Please tell us your name.");
    if (phone.replace(/\D/g, "").length < 10) return setError("Please add a 10-digit number.");
    if (message.trim().length < 5) return setError("Add a line about what you need.");
    setError("");

    const text = [
      `Hello ${site.name},`,
      "",
      `*${topic}*`,
      message.trim(),
      "",
      `— ${name.trim()}`,
      `Phone: ${phone.trim()}`,
    ].join("\n");

    window.open(orderLink(text), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c-name">
            Your name
          </label>
          <input
            id="c-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field"
            placeholder="Full name"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="label" htmlFor="c-phone">
            Mobile
          </label>
          <input
            id="c-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="field"
            placeholder="10-digit number"
            inputMode="tel"
            autoComplete="tel"
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="c-topic">
          What is this about?
        </label>
        <select
          id="c-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="field appearance-none"
        >
          {["Product advice", "An existing order", "Bulk / clinic order", "Returns", "Something else"].map(
            (t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ),
          )}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="c-message">
          Message
        </label>
        <textarea
          id="c-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="field resize-none"
          placeholder="Tell us what you are trying to solve."
        />
      </div>

      {error && <p className="text-[12px] text-red-600">{error}</p>}

      <button type="submit" className="btn-primary w-full sm:w-auto">
        <IconWhatsApp size={16} />
        Send on WhatsApp
      </button>

      <p className="flex items-center gap-2 text-[11.5px] text-ink-faint">
        <IconCheck size={12} className="text-clinic-600" />
        Opens WhatsApp with your message ready to send.
      </p>
    </form>
  );
}
