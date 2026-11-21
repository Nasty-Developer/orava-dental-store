import { site } from "@/data/site";

const SIZES = {
  sm: {
    word: "text-[21px] sm:text-[23px] tracking-[-0.015em]",
    sub: "text-[6.5px] sm:text-[7px] tracking-[0.28em]",
    gap: "mt-[4px]",
  },
  md: {
    word: "text-[28px] tracking-[-0.015em]",
    sub: "text-[8px] tracking-[0.3em]",
    gap: "mt-[6px]",
  },
  lg: {
    word: "text-[44px] sm:text-[62px] tracking-[-0.01em]",
    sub: "text-[9px] sm:text-[11px] tracking-[0.4em]",
    gap: "mt-[10px] sm:mt-[14px]",
  },
} as const;

type Size = keyof typeof SIZES;
type Tone = "ink" | "white";

/**
 * The SOMIL lockup: serif wordmark with a letterspaced descriptor beneath.
 * Used in the header, footer and loading screen so the brand always matches.
 */
export function Wordmark({
  size = "sm",
  tone = "ink",
  className = "",
}: {
  size?: Size;
  tone?: Tone;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span
        className={`font-display leading-none ${s.word} ${
          tone === "white" ? "text-white" : "text-ink"
        }`}
      >
        {site.shortName}
      </span>
      <span
        className={`font-sans uppercase leading-none ${s.sub} ${s.gap} ${
          tone === "white" ? "text-white/55" : "text-ink-faint"
        }`}
      >
        {site.descriptor}
      </span>
    </span>
  );
}
