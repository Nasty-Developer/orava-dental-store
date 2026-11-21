"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Wordmark } from "./wordmark";

/**
 * A single-stroke tooth mark. `pathLength={1}` normalises the geometry, so the
 * outline can ink itself in with a plain CSS dash animation, with no measuring
 * and no dependency on hydration.
 */
const TOOTH =
  "M24 9c-3 0-4.6 1.4-6.8 1.4-2 0-3.6-1.2-5.4.6-2.2 2.2-1.8 5.6-1 9.2.6 3 1 6 1.5 9 .4 2.2.8 4.8 1.7 6.6.5 1.2 1.8 2 2.9 1.6 1.2-.4 1.6-1.4 2-3.1.5-2.6 1.1-5.7 2-7.7.5-1.1 1.5-1.8 2.5-1.8h1.2c1 0 2 .7 2.5 1.8.9 2 1.5 5.1 2 7.7.4 1.7.8 2.7 2 3.1 1.1.4 2.4-.4 2.9-1.6.9-1.8 1.3-4.4 1.7-6.6.5-3 .9-6 1.5-9 .8-3.6 1.2-7-1-9.2-1.8-1.8-3.4-.6-5.4-.6C28.6 10.4 27 9 24 9Z";

const RING_R = 46;
const RING_C = 2 * Math.PI * RING_R;

/** Shortest time the curtain stays up, so the animation never stutters. */
const MIN_MS = 1500;
const EASE = [0.16, 1, 0.3, 1] as const;

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  // Wait for the document to finish loading, but never less than MIN_MS.
  useEffect(() => {
    let timer = 0;
    let cancelled = false;

    const start = performance.now();
    const finish = () => {
      if (cancelled) return;
      const wait = Math.max(0, MIN_MS + 120 - (performance.now() - start));
      timer = window.setTimeout(() => {
        if (!cancelled) setVisible(false);
      }, wait);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener("load", finish);
    };
  }, []);

  // Hold the page still while the curtain is up.
  useEffect(() => {
    const root = document.documentElement;
    if (!visible) {
      root.style.overflow = "";
      return;
    }
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
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
                style={
                  {
                    transform: "rotate(-90deg)",
                    "--ls-ring": RING_C,
                  } as React.CSSProperties
                }
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
                  className="ls-ring"
                  fill="none"
                  stroke="#0C6E8F"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={RING_C}
                />
              </svg>

              <svg
                viewBox="0 0 48 48"
                className="absolute inset-0 m-auto h-[54px] w-[54px] sm:h-[60px] sm:w-[60px]"
              >
                <path
                  d={TOOTH}
                  className="ls-settle"
                  fill="#0C6E8F"
                  style={{ opacity: 0 }}
                />
                <path
                  d={TOOTH}
                  className="ls-draw"
                  pathLength={1}
                  fill="none"
                  stroke="#0A1A22"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={1}
                  strokeDashoffset={1}
                />
              </svg>
            </div>

            <div className="mt-9 overflow-hidden pb-[2px] sm:mt-11">
              <div className="ls-rise">
                <Wordmark size="lg" />
              </div>
            </div>
          </motion.div>

          <noscript>
            <style>{`#app-loader{display:none!important}`}</style>
          </noscript>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
