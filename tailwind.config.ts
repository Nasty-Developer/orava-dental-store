import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A1A22",
          soft: "#22343E",
          mute: "#5C6F7A",
          faint: "#8A9AA3",
        },
        line: { DEFAULT: "#E4EAEE", strong: "#CFD9DF" },
        canvas: { DEFAULT: "#FFFFFF", tint: "#F6F9FA", deep: "#EEF4F6" },
        clinic: {
          50: "#F0F7FA",
          100: "#DCEDF3",
          200: "#B8DBE7",
          300: "#86C2D6",
          400: "#4C9FBB",
          500: "#22809F",
          600: "#0C6E8F",
          700: "#0A5A75",
          800: "#0B4A60",
          900: "#0B3D4F",
        },
        porcelain: "#FBFCFC",
        steel: "#9AAAB3",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3.2rem, 7vw, 6.2rem)", { lineHeight: "0.94", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.6rem, 4.6vw, 4.2rem)", { lineHeight: "1", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(2rem, 3.2vw, 2.9rem)", { lineHeight: "1.06", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        lift: "0 1px 2px rgba(10,26,34,0.04), 0 12px 32px -12px rgba(10,26,34,0.14)",
        panel: "0 24px 60px -28px rgba(10,26,34,0.28)",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        rise: { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "none" } },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        marquee: "marquee 38s linear infinite",
        rise: "rise 0.7s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
