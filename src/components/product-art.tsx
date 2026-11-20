import type { ProductVisual } from "@/data/products";
import type { CategorySlug } from "@/data/categories";

const C = {
  ink: "#0A1A22",
  inkSoft: "#22343E",
  blue: "#0C6E8F",
  blueSoft: "#B9D8E3",
  steel: "#C9D5DB",
  steelDeep: "#A9B8C0",
  paper: "#FFFFFF",
  tint: "#E7EFF3",
  warm: "#D9A574",
};

export const categoryTint: Record<CategorySlug, string> = {
  whitening: "#EAF2F6",
  brushes: "#F1F4F5",
  rinses: "#E9F3F5",
  clinical: "#EDF1F4",
  kids: "#FAF2EA",
  ortho: "#F0F2F4",
};

/**
 * Placeholder product artwork — a consistent, drawn product family.
 * Swap for real photography by adding `image` to a product in products.ts.
 */
export function ProductArt({
  visual,
  className = "",
  title,
}: {
  visual: ProductVisual;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 300 340"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
    >
      {/* ground shadow */}
      <ellipse cx="150" cy="301" rx="82" ry="10" fill={C.ink} opacity="0.07" />
      <ellipse cx="150" cy="300" rx="46" ry="5.5" fill={C.ink} opacity="0.07" />

      {visual === "serum" && (
        <g>
          <rect x="126" y="62" width="48" height="46" rx="9" fill={C.ink} />
          <rect x="133" y="70" width="10" height="30" rx="5" fill="#fff" opacity="0.12" />
          <rect x="120" y="104" width="60" height="184" rx="16" fill={C.paper} />
          <rect x="120" y="104" width="60" height="184" rx="16" stroke={C.steel} />
          <path d="M120 150h60v10h-60z" fill={C.blue} opacity="0.1" />
          <rect x="133" y="176" width="34" height="4" rx="2" fill={C.ink} opacity="0.55" />
          <rect x="133" y="188" width="24" height="3" rx="1.5" fill={C.ink} opacity="0.2" />
          <rect x="133" y="197" width="30" height="3" rx="1.5" fill={C.ink} opacity="0.2" />
          <rect x="133" y="228" width="34" height="34" rx="17" fill={C.tint} />
          <circle cx="150" cy="245" r="9" stroke={C.blue} strokeWidth="1.5" opacity="0.6" />
          <rect x="136" y="112" width="7" height="150" rx="3.5" fill="#fff" opacity="0.75" />
        </g>
      )}

      {visual === "strips" && (
        <g transform="rotate(-7 150 175)">
          <rect x="92" y="86" width="116" height="164" rx="12" fill={C.paper} stroke={C.steel} />
          <rect x="92" y="86" width="116" height="34" rx="12" fill={C.blue} opacity="0.09" />
          <path d="M92 120h116" stroke={C.steel} strokeDasharray="4 5" />
          <rect x="112" y="146" width="76" height="52" rx="6" fill={C.tint} />
          <path d="M112 146l18 18v-18z" fill={C.paper} />
          <rect x="112" y="216" width="46" height="4" rx="2" fill={C.ink} opacity="0.45" />
          <rect x="112" y="228" width="30" height="3" rx="1.5" fill={C.ink} opacity="0.18" />
          <circle cx="182" cy="230" r="10" stroke={C.blue} strokeWidth="1.4" opacity="0.55" />
          <rect x="100" y="94" width="6" height="148" rx="3" fill="#fff" opacity="0.6" />
        </g>
      )}

      {visual === "kit" && (
        <g>
          <rect x="150" y="70" width="34" height="112" rx="9" fill={C.paper} stroke={C.steel} />
          <rect x="150" y="70" width="34" height="26" rx="8" fill={C.ink} opacity="0.85" />
          <rect x="82" y="150" width="136" height="122" rx="10" fill={C.paper} stroke={C.steel} />
          <rect x="82" y="150" width="136" height="20" rx="10" fill={C.blue} opacity="0.1" />
          <path d="M82 170h136" stroke={C.steel} />
          <rect x="100" y="192" width="52" height="4" rx="2" fill={C.ink} opacity="0.5" />
          <rect x="100" y="204" width="34" height="3" rx="1.5" fill={C.ink} opacity="0.2" />
          <circle cx="176" cy="222" r="26" fill={C.tint} />
          <circle cx="176" cy="222" r="14" stroke={C.blue} strokeWidth="1.4" opacity="0.55" />
          <path d="M176 208v28M162 222h28" stroke={C.blue} strokeWidth="1.4" opacity="0.35" />
        </g>
      )}

      {visual === "brush" && (
        <g>
          <rect x="133" y="56" width="34" height="72" rx="16" fill={C.paper} stroke={C.steel} />
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={139 + i * 6}
              y="66"
              width="2.6"
              height="34"
              rx="1.3"
              fill={C.blueSoft}
            />
          ))}
          <rect x="139" y="104" width="22" height="8" rx="4" fill={C.ink} opacity="0.75" />
          <rect x="136" y="112" width="28" height="176" rx="14" fill={C.paper} stroke={C.steel} />
          <rect x="136" y="112" width="28" height="20" rx="10" fill={C.ink} opacity="0.08" />
          <circle cx="150" cy="176" r="9" fill={C.tint} />
          <circle cx="150" cy="176" r="4" fill={C.blue} opacity="0.7" />
          <rect x="145" y="196" width="10" height="52" rx="5" fill={C.ink} opacity="0.06" />
          <rect x="141" y="118" width="6" height="160" rx="3" fill="#fff" opacity="0.7" />
        </g>
      )}

      {visual === "floss" && (
        <g>
          <circle cx="150" cy="168" r="62" fill={C.paper} stroke={C.steel} />
          <circle cx="150" cy="168" r="44" stroke={C.tint} strokeWidth="10" />
          <circle cx="150" cy="168" r="22" fill={C.tint} />
          <circle cx="150" cy="168" r="7" fill={C.blue} opacity="0.55" />
          <path
            d="M150 106c0-22 14-32 34-32s30 12 30 30"
            stroke={C.inkSoft}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path d="M96 168h-14M204 168h14" stroke={C.steelDeep} strokeWidth="2" strokeLinecap="round" />
          <rect x="122" y="150" width="56" height="4" rx="2" fill={C.ink} opacity="0.35" />
          <rect x="130" y="162" width="40" height="3" rx="1.5" fill={C.ink} opacity="0.15" />
        </g>
      )}

      {visual === "bottle" && (
        <g>
          <rect x="130" y="56" width="40" height="42" rx="7" fill={C.ink} />
          <rect x="136" y="64" width="8" height="26" rx="4" fill="#fff" opacity="0.12" />
          <path
            d="M136 98h28c22 0 34 14 34 34v140c0 9-7 16-16 16H118c-9 0-16-7-16-16V132c0-20 12-34 34-34z"
            fill={C.paper}
            stroke={C.steel}
          />
          <rect x="106" y="166" width="88" height="66" rx="6" fill={C.blue} opacity="0.09" />
          <rect x="122" y="182" width="56" height="5" rx="2.5" fill={C.ink} opacity="0.5" />
          <rect x="122" y="196" width="38" height="3.5" rx="1.75" fill={C.ink} opacity="0.18" />
          <rect x="122" y="206" width="46" height="3.5" rx="1.75" fill={C.ink} opacity="0.18" />
          <path d="M120 120h6v152h-6z" fill="#fff" opacity="0.6" />
        </g>
      )}

      {visual === "mist" && (
        <g>
          <rect x="136" y="58" width="28" height="30" rx="5" fill={C.ink} />
          <rect x="142" y="88" width="16" height="16" rx="3" fill={C.steel} />
          <rect x="134" y="104" width="32" height="184" rx="12" fill={C.paper} stroke={C.steel} />
          <rect x="134" y="150" width="32" height="60" fill={C.blue} opacity="0.1" />
          <rect x="142" y="168" width="16" height="3.5" rx="1.75" fill={C.ink} opacity="0.4" />
          <rect x="142" y="178" width="11" height="3" rx="1.5" fill={C.ink} opacity="0.16" />
          <g stroke={C.blue} strokeWidth="1.6" strokeLinecap="round" opacity="0.5">
            <path d="M176 62l10-6" />
            <path d="M180 74h12" />
            <path d="M176 86l10 6" />
          </g>
          <rect x="139" y="112" width="5" height="168" rx="2.5" fill="#fff" opacity="0.7" />
        </g>
      )}

      {visual === "gel" && (
        <g>
          <rect x="138" y="52" width="24" height="26" rx="4" fill={C.ink} />
          <path
            d="M132 78h36c6 0 10 5 10 11v156c0 6-4 10-10 10h-36c-6 0-10-4-10-10V89c0-6 4-11 10-11z"
            fill={C.paper}
            stroke={C.steel}
          />
          <rect x="118" y="128" width="64" height="70" rx="5" fill={C.blue} opacity="0.09" />
          <rect x="132" y="146" width="36" height="4" rx="2" fill={C.ink} opacity="0.45" />
          <rect x="132" y="158" width="24" height="3" rx="1.5" fill={C.ink} opacity="0.16" />
          <circle cx="150" cy="186" r="11" stroke={C.blue} strokeWidth="1.4" opacity="0.5" />
          <path d="M118 232h64" stroke={C.steel} strokeDasharray="3 4" />
          <path d="M118 240h64" stroke={C.steel} strokeDasharray="3 4" />
          <path d="M118 248h64" stroke={C.steel} strokeDasharray="3 4" />
        </g>
      )}

      {visual === "scaler" && (
        <g>
          <g transform="rotate(-14 150 180)">
            <rect x="126" y="118" width="48" height="150" rx="18" fill={C.paper} stroke={C.steel} />
            <rect x="126" y="118" width="48" height="26" rx="13" fill={C.ink} opacity="0.85" />
            <circle cx="150" cy="186" r="8" fill={C.tint} />
            <circle cx="150" cy="186" r="3.5" fill={C.blue} opacity="0.8" />
            <rect x="142" y="210" width="16" height="42" rx="8" fill={C.ink} opacity="0.05" />
            <path d="M150 118V86" stroke={C.steelDeep} strokeWidth="3" strokeLinecap="round" />
            <path d="M150 86l10-24" stroke={C.inkSoft} strokeWidth="2.4" strokeLinecap="round" />
          </g>
          <path
            d="M96 300c26 0 30-22 52-22"
            stroke={C.steelDeep}
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.8"
          />
          <circle cx="150" cy="300" r="4" fill={C.blue} opacity="0.35" />
        </g>
      )}

      {visual === "mirror" && (
        <g>
          <circle cx="150" cy="140" r="58" fill={C.paper} stroke={C.steel} strokeWidth="1.5" />
          <circle cx="150" cy="140" r="48" fill={C.tint} opacity="0.75" />
          <path d="M118 108a44 44 0 0 1 40-12" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
          <g transform="rotate(20 150 230)">
            <rect x="142" y="196" width="16" height="96" rx="8" fill={C.paper} stroke={C.steel} />
            <rect x="142" y="212" width="16" height="24" fill={C.ink} opacity="0.07" />
          </g>
          <circle cx="150" cy="140" r="58" stroke={C.blue} strokeWidth="1" opacity="0.15" />
        </g>
      )}

      {visual === "kidbrush" && (
        <g>
          <rect x="128" y="76" width="44" height="52" rx="20" fill={C.paper} stroke={C.steel} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={136 + i * 10} y="86" width="4" height="26" rx="2" fill={C.warm} opacity="0.8" />
          ))}
          <path
            d="M136 128h28c8 0 12 6 12 14v104c0 12-8 20-26 20s-26-8-26-20V142c0-8 4-14 12-14z"
            fill={C.paper}
            stroke={C.steel}
          />
          <circle cx="150" cy="200" r="14" fill={C.warm} opacity="0.22" />
          <path
            d="M150 192l3.4 6.9 7.6 1.1-5.5 5.4 1.3 7.6-6.8-3.6-6.8 3.6 1.3-7.6-5.5-5.4 7.6-1.1z"
            fill={C.warm}
            opacity="0.85"
          />
        </g>
      )}

      {visual === "aligner" && (
        <g>
          <path
            d="M92 122c0-14 12-24 26-24h64c14 0 26 10 26 24 0 10-6 16-6 26v34c0 16-12 26-26 26h-52c-14 0-26-10-26-26v-34c0-10-6-16-6-26z"
            fill={C.paper}
            stroke={C.blueSoft}
            strokeWidth="1.6"
          />
          <path
            d="M108 126c0-8 8-14 18-14h48c10 0 18 6 18 14 0 8-6 12-6 20v30c0 10-8 16-18 16h-36c-10 0-18-6-18-16v-30c0-8-6-12-6-20z"
            fill={C.tint}
            opacity="0.85"
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse
              key={i}
              cx={122 + i * 14}
              cy={148}
              rx="6"
              ry="10"
              fill={C.paper}
              stroke={C.blueSoft}
            />
          ))}
          <path d="M96 190h108" stroke={C.blueSoft} strokeDasharray="5 6" opacity="0.8" />
        </g>
      )}

      {visual === "wax" && (
        <g>
          <ellipse cx="150" cy="132" rx="66" ry="22" fill={C.tint} />
          <path d="M84 132v76c0 12 30 22 66 22s66-10 66-22v-76" fill={C.paper} stroke={C.steel} />
          <ellipse cx="150" cy="132" rx="66" ry="22" fill={C.paper} stroke={C.steel} />
          <ellipse cx="150" cy="132" rx="48" ry="15" fill={C.tint} opacity="0.8" />
          <rect x="126" y="126" width="48" height="5" rx="2.5" fill={C.ink} opacity="0.35" />
          <rect x="136" y="140" width="28" height="3" rx="1.5" fill={C.ink} opacity="0.14" />
          <path d="M96 160v44c0 8 24 16 54 16s54-8 54-16v-44" stroke={C.blue} strokeWidth="1" opacity="0.12" />
        </g>
      )}
    </svg>
  );
}
