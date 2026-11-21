"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "./wordmark";

/**
 * A single-stroke tooth mark. The outline inks itself in by measuring its own
 * length and easing the dash offset to zero.
 */
const TOOTH =
  "M24 9c-3 0-4.6 1.4-6.8 1.4-2 0-3.6-1.2-5.4.6-2.2 2.2-1.8 5.6-1 9.2.6 3 1 6 1.5 9 .4 2.2.8 4.8 1.7 6.6.5 1.2 1.8 2 2.9 1.6 1.2-.4 1.6-1.4 2-3.1.5-2.6 1.1-5.7 2-7.7.5-1.1 1.5-1.8 2.5-1.8h1.2c1 0 2 .7 2.5 1.8.9 2 1.5 5.1 2 7.7.4 1.7.8 2.7 2 3.1 1.1.4 2.4-.4 2.9-1.6.9-1.8 1.3-4.4 1.7-6.6.5-3 .9-6 1.5-9 .8-3.6 1.2-7-1-9.2-1.8-1.8-3.4-.6-5.4-.6C28.6 10.4 27 9 24 9Z";

const RING_R = 46;
const RING_C = 2 * Math.PI * RING_R;

/** Shortest time the curtain stays up, so the animation never stutters. */
const MIN_MS = 1500;
const EASE = [0.16, 1, 0.3, 1] as const;

export function LoadingScreen() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [pct, setPct] = useState(0);

  const toothRef = useRef<SVGPathElement | null>(null);
  const [length, setLength] = useState(0);
  const [drawn, setDrawn] = useState(false);

  // Progress: eased towards 100%, but held at 93% until the document has
  // actually finished loading.
  useEffect(() => {
    let raf = 0;
    let timer = 0;
    const start = performance.now();
    let loaded = document.readyState === "complete";

    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener("load", onLoad);

    const tick = (now: number) => {
      const t = Math.min((now - start) / MIN_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.min(eased, loaded ? 1 : 0.93);
      setPct(next * 100);
      if (next >= 1) {
        timer = window.setTimeout(() => setVisible(false), 340);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  // Measure the tooth so it can draw itself on, then start the stroke.
  useEffect(() => {
    const path = toothRef.current;
    if (!path) return;
    setLength(path.getTotalLength());
  }, []);

  useEffect(() => {
    if (!length) return;
    if (reduce) {
      setDrawn(true);
      return;
    }
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, [length, reduce]);

  // Hold the page still while the curtain is up.
  useEffect(() => {
    const root = document.documentElement;
    if (visible) {
      root.style.overflow = "hidden";
      return () => {
        root.style.overflow = "";
      };
    }
    root.style.overflow = "";
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="app-loader"
          aria-hidden="true"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.62, ease: EASE } }}
        >
          <motion.div
            className="flex flex-col items-center px-6"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.035,
              y: -8,
              transition: { duration: 0.55, ease: EASE },
            }}
          >
            <div className="relative h-[124px] w-[124px] sm:h-[136px] sm:w-[136px]">
              <svg
                viewBox="0 0 120 120"
                className="h-full w-full"
                style={{ transform: "rotate(-90deg)" }}
              >
                <circle
                  cx="60"
                  cy="60"
                  r={RING_R}
                  fill="none"
                  stroke="#EDF2F5"
                  strokeWidth="1.25"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={RING_R}
                  fill="none"
                  stroke="#0C6E8F"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={RING_C * (1 - pct / 100)}
                  style={{ transition: "stroke-dashoffset 140ms linear" }}
                />
              </svg>

              <svg
                viewBox="0 0 48 48"
                className="absolute inset-0 m-auto h-[54px] w-[54px] sm:h-[60px] sm:w-[60px]"
              >
                <path
                  d={TOOTH}
                  fill="#0C6E8F"
                  style={{
                    opacity: drawn ? 0.07 : 0,
                    transition: "opacity 900ms ease-out 700ms",
                  }}
                />
                <path
                  ref={toothRef}
                  d={TOOTH}
                  fill="none"
                  stroke="#0A1A22"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={length || undefined}
                  strokeDashoffset={drawn ? 0 : length}
                  style={{
                    opacity: length ? 1 : 0,
                    transition: reduce
                      ? "none"
                      : "stroke-dashoffset 1250ms cubic-bezier(0.65,0,0.35,1), opacity 200ms linear",
                  }}
                />
              </svg>
            </div>

            <div className="mt-9 overflow-hidden pb-[2px] sm:mt-11">
              <motion.div
                initial={{ y: "112%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: reduce ? 0 : 0.95,
                  delay: reduce ? 0 : 0.22,
                  ease: EASE,
                }}
              >
                <Wordmark size="lg" />
              </motion.div>
            </div>

            <motion.p
              className="mt-6 font-sans text-[10px] uppercase tracking-[0.42em] text-ink-faint tabular-nums sm:mt-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reduce ? 0 : 0.8,
                delay: reduce ? 0 : 0.55,
                ease: EASE,
              }}
            >
              {Math.round(pct)}%
            </motion.p>
          </motion.div>

          <noscript>
            <style>{`#app-loader{display:none!important}`}</style>
          </noscript>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
