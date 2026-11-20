"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { orderLink } from "@/lib/whatsapp";
import { IconWhatsApp } from "./icons";

export function WhatsAppFab() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.a
      href={orderLink(site.whatsapp.greeting)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order on WhatsApp"
      initial={false}
      animate={show ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 14, scale: 0.94 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{ pointerEvents: show ? "auto" : "none" }}
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-ink px-4 py-3 text-white shadow-panel transition-colors duration-500 hover:bg-clinic-600 sm:bottom-7 sm:right-7"
    >
      <IconWhatsApp size={19} />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[12.5px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-w-[140px]">
        Order on WhatsApp
      </span>
    </motion.a>
  );
}
