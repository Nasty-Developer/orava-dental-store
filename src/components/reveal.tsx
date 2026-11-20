"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const easing = [0.16, 1, 0.3, 1] as const;

/** Fade + rise on scroll. Respects reduced-motion. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  once = true,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  as?: "div" | "section" | "li" | "span" | "header";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: easing }}
    >
      {children}
    </MotionTag>
  );
}

/** Staggered container for lists and grids. */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "section";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
    >
      {children}
    </MotionTag>
  );
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easing } },
};

/**
 * Line-by-line headline reveal.
 *
 * Uses an animated clip-path instead of `overflow: hidden` so tight display
 * line-heights never crop ascenders or descenders.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0.15,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <span className={className}>
      {lines.map((line, i) => (
        <motion.span
          key={i}
          className={`block ${lineClassName ?? ""}`}
          initial={
            reduce
              ? false
              : { clipPath: "inset(-20% 0 100% 0)", y: "0.08em", opacity: 0 }
          }
          animate={
            reduce
              ? undefined
              : { clipPath: "inset(-20% 0 -20% 0)", y: "0em", opacity: 1 }
          }
          transition={{ duration: 1.05, delay: delay + i * 0.09, ease: easing }}
        >
          {line}
        </motion.span>
      ))}
    </span>
  );
}

/** Child of <RevealGroup> that inherits the stagger. */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
