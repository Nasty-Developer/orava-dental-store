import type { ProductVisual, ProductImage } from "@/data/products";
import type { CategorySlug } from "@/data/categories";

/**
 * Placeholder product artwork.
 *
 * These are original SOMIL illustrations, drawn so a 300-SKU catalogue still
 * looks like one brand until real photography arrives. Nothing here is traced
 * from or copied out of a supplier catalogue.
 *
 * To use a real photo for one product, set `image` on that product in
 * src/data/products.ts — <ProductArt> is skipped automatically.
 */

const ink = "#0A1A22";
const blue = "#0C6E8F";
const blueSoft = "#BBD4DF";
const steel = "#C6D3D9";
const paper = "#FFFFFF";
const tint = "#E7EFF3";

export const categoryTint: Record<CategorySlug, string> = {
  restorative: "#EDF3F6",
  endodontics: "#E9F1F5",
  prosthodontics: "#F1F3F5",
  impression: "#EAF2F4",
  instruments: "#F0F3F5",
  burs: "#EDF2F5",
  handpieces: "#E8EFF3",
  orthodontics: "#EEF3F7",
  implantology: "#E9F0F4",
  "oral-surgery": "#EDF2F5",
  periodontics: "#EBF2F4",
  pedodontics: "#FBF3EC",
  laboratory: "#F1F3F4",
  consumables: "#EFF3F5",
  "infection-control": "#E8F1F4",
  sterilization: "#EDF3F5",
  equipment: "#EAF0F4",
  imaging: "#E9F0F5",
  preventive: "#EBF3F6",
  whitening: "#E9F2F6",
  digital: "#EAF1F5",
  anaesthetics: "#EDF2F6",
  "clinic-kits": "#EFF2F4",
};

const Shadow = () => (
  <ellipse cx="150" cy="248" rx="56" ry="8" fill={ink} opacity="0.055" />
);

const Spec = () => (
  <rect x="176" y="150" width="26" height="3" rx="1.5" fill={blue} opacity="0.35" />
);

function Syringe() {
  return (
    <>
      <rect x="124" y="38" width="52" height="9" rx="4.5" fill={ink} />
      <rect x="142" y="46" width="16" height="34" fill={steel} />
      <rect x="116" y="78" width="68" height="128" rx="10" fill={paper} stroke={steel} strokeWidth="2" />
      <rect x="124" y="118" width="52" height="80" rx="6" fill={blueSoft} />
      <rect x="136" y="204" width="28" height="16" rx="3" fill={ink} />
      <path d="M144 220h12l-4 24h-4z" fill={ink} />
      {[96, 108, 132, 144, 156, 168, 180, 192].map((y) => (
        <rect key={y} x="124" y={y} width="10" height="2" rx="1" fill={steel} />
      ))}
    </>
  );
}

function Bottle() {
  return (
    <>
      <rect x="132" y="52" width="36" height="32" rx="5" fill={ink} />
      <rect x="138" y="82" width="24" height="16" fill={paper} stroke={steel} strokeWidth="2" />
      <path
        d="M108 118c0-11 8-20 18-20h48c10 0 18 9 18 20v112c0 8-6 14-14 14h-56c-8 0-14-6-14-14z"
        fill={paper}
        stroke={steel}
        strokeWidth="2"
      />
      <path d="M112 190h76v38c0 7-5 12-12 12h-52c-7 0-12-5-12-12z" fill={blueSoft} opacity="0.7" />
      <rect x="108" y="140" width="84" height="46" fill={tint} />
      <rect x="122" y="152" width="40" height="3" rx="1.5" fill={ink} opacity="0.45" />
      <rect x="122" y="162" width="56" height="3" rx="1.5" fill={ink} opacity="0.2" />
      <rect x="122" y="172" width="30" height="3" rx="1.5" fill={ink} opacity="0.2" />
    </>
  );
}

function Tube() {
  return (
    <>
      <rect x="138" y="50" width="24" height="28" rx="4" fill={ink} />
      <path d="M122 78h56c4 0 7 3 7 7v118h-70V85c0-4 3-7 7-7z" fill={paper} stroke={steel} strokeWidth="2" />
      <rect x="112" y="203" width="76" height="14" rx="2" fill={steel} />
      <rect x="115" y="118" width="70" height="42" fill={tint} />
      <rect x="126" y="128" width="34" height="3" rx="1.5" fill={ink} opacity="0.45" />
      <rect x="126" y="138" width="48" height="3" rx="1.5" fill={ink} opacity="0.2" />
      <rect x="115" y="172" width="70" height="6" fill={blue} opacity="0.55" />
    </>
  );
}

function Box() {
  return (
    <>
      <path d="M96 112l22-22h104l-22 22z" fill={tint} stroke={steel} strokeWidth="2" />
      <path d="M200 112l22-22v100l-22 22z" fill={steel} opacity="0.55" />
      <rect x="96" y="112" width="104" height="100" fill={paper} stroke={steel} strokeWidth="2" />
      <rect x="96" y="150" width="104" height="34" fill={blue} opacity="0.1" />
      <rect x="110" y="160" width="44" height="3" rx="1.5" fill={ink} opacity="0.45" />
      <rect x="110" y="170" width="60" height="3" rx="1.5" fill={ink} opacity="0.2" />
    </>
  );
}

function Instrument() {
  return (
    <>
      <g transform="rotate(-42 150 160)">
        <circle cx="150" cy="92" r="34" fill={paper} stroke={steel} strokeWidth="2" />
        <circle cx="150" cy="92" r="24" fill={tint} />
        <rect x="144" y="124" width="12" height="118" rx="6" fill={steel} />
        <rect x="141" y="150" width="18" height="10" rx="3" fill={ink} />
      </g>
    </>
  );
}

function Bur() {
  return (
    <>
      <rect x="142" y="56" width="16" height="104" rx="4" fill={steel} />
      <rect x="138" y="150" width="24" height="12" rx="2" fill={ink} />
      <circle cx="150" cy="184" r="22" fill={paper} stroke={steel} strokeWidth="2" />
      <path d="M132 176q18 8 36 0M132 190q18 8 36 0" stroke={blue} strokeWidth="2" fill="none" opacity="0.5" />
    </>
  );
}

function Handpiece() {
  return (
    <>
      <rect x="126" y="92" width="48" height="146" rx="24" fill={paper} stroke={steel} strokeWidth="2" />
      <rect x="136" y="120" width="28" height="70" rx="14" fill={tint} />
      <rect x="116" y="58" width="68" height="46" rx="16" fill={ink} />
      <rect x="146" y="40" width="8" height="20" rx="4" fill={steel} />
      <circle cx="150" cy="81" r="6" fill={blueSoft} />
      <rect x="132" y="214" width="36" height="6" rx="3" fill={steel} />
    </>
  );
}

function File() {
  return (
    <>
      <rect x="136" y="48" width="28" height="44" rx="5" fill={ink} />
      <rect x="147" y="92" width="6" height="86" fill={steel} />
      <path d="M143 178h14l-4 56h-6z" fill={steel} />
      <path d="M143 190l14 6M143 204l14 6M143 218l14 6" stroke={blue} strokeWidth="2" opacity="0.55" />
      <rect x="176" y="120" width="26" height="3" rx="1.5" fill={blue} opacity="0.35" />
      <rect x="176" y="134" width="18" height="3" rx="1.5" fill={blue} opacity="0.35" />
    </>
  );
}

function Bracket() {
  return (
    <>
      <rect x="62" y="150" width="176" height="7" rx="3.5" fill={steel} />
      <rect x="124" y="130" width="52" height="46" rx="7" fill={paper} stroke={steel} strokeWidth="2" />
      <rect x="124" y="148" width="52" height="10" fill={ink} />
      <circle cx="150" cy="153" r="30" fill="none" stroke={blue} strokeWidth="2.5" opacity="0.55" />
    </>
  );
}

function Implant() {
  return (
    <>
      <path d="M130 78h40l-6 30h-28z" fill={paper} stroke={steel} strokeWidth="2" />
      <path d="M136 108h28l-6 104q-8 14-16 0z" fill={steel} />
      {[124, 138, 152, 166, 180, 194].map((y) => (
        <path key={y} d={`M137 ${y}l26 7`} stroke={paper} strokeWidth="2" opacity="0.9" />
      ))}
      <rect x="176" y="150" width="26" height="3" rx="1.5" fill={blue} opacity="0.35" />
    </>
  );
}

function Suture() {
  return (
    <>
      <path d="M96 96q34-34 62 0t-14 54" stroke={ink} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M144 150q-22 26 6 44t52-6" stroke={blue} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="196" cy="196" r="34" fill={tint} stroke={steel} strokeWidth="2" />
      <circle cx="196" cy="196" r="14" fill={paper} stroke={steel} strokeWidth="2" />
    </>
  );
}

function Carpule() {
  return (
    <>
      <rect x="114" y="80" width="72" height="140" rx="36" fill={paper} stroke={steel} strokeWidth="2" />
      <rect x="122" y="132" width="56" height="80" rx="28" fill={blueSoft} />
      <rect x="114" y="66" width="72" height="18" rx="9" fill={ink} />
      <circle cx="150" cy="94" r="9" fill={ink} />
      <rect x="176" y="150" width="26" height="3" rx="1.5" fill={blue} opacity="0.35" />
    </>
  );
}

function PPE() {
  return (
    <>
      <path d="M104 120c0-14 11-24 24-24h44c13 0 24 10 24 24v50c0 20-16 34-46 34s-46-14-46-34z" fill={paper} stroke={steel} strokeWidth="2" />
      <path d="M104 138h92M104 156h92M104 174h92" stroke={steel} strokeWidth="2" />
      <path d="M104 128c-14 4-20 18-14 30M196 128c14 4 20 18 14 30" stroke={ink} strokeWidth="2" fill="none" opacity="0.5" />
      <rect x="176" y="150" width="26" height="3" rx="1.5" fill={blue} opacity="0.35" />
    </>
  );
}

function Machine() {
  return (
    <>
      <rect x="80" y="98" width="140" height="112" rx="14" fill={paper} stroke={steel} strokeWidth="2" />
      <rect x="98" y="116" width="104" height="54" rx="7" fill={tint} />
      <path d="M108 152l14-16 12 12 16-22 14 26" stroke={blue} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="150" cy="192" r="11" fill={ink} />
      <rect x="112" y="210" width="12" height="16" rx="3" fill={steel} />
      <rect x="176" y="210" width="12" height="16" rx="3" fill={steel} />
    </>
  );
}

function Impression() {
  return (
    <>
      <ellipse cx="150" cy="112" rx="54" ry="18" fill={tint} stroke={steel} strokeWidth="2" />
      <path d="M96 112v96c0 10 24 18 54 18s54-8 54-18v-96" fill={paper} stroke={steel} strokeWidth="2" />
      <ellipse cx="150" cy="104" rx="56" ry="19" fill={steel} />
      <ellipse cx="150" cy="100" rx="56" ry="19" fill={ink} opacity="0.85" />
      <rect x="118" y="150" width="64" height="3" rx="1.5" fill={ink} opacity="0.3" />
      <rect x="126" y="162" width="48" height="3" rx="1.5" fill={ink} opacity="0.15" />
    </>
  );
}

function Crown() {
  return (
    <>
      <g transform="translate(150 158) scale(2.5) translate(-24 -22)">
        <path
          d="M24 9c-3 0-4.6 1.4-6.8 1.4-2 0-3.6-1.2-5.4.6-2.2 2.2-1.8 5.6-1 9.2.6 3 1 6 1.5 9 .4 2.2.8 4.8 1.7 6.6.5 1.2 1.8 2 2.9 1.6 1.2-.4 1.6-1.4 2-3.1.5-2.6 1.1-5.7 2-7.7.5-1.1 1.5-1.8 2.5-1.8h1.2c1 0 2 .7 2.5 1.8.9 2 1.5 5.1 2 7.7.4 1.7.8 2.7 2 3.1 1.1.4 2.4-.4 2.9-1.6.9-1.8 1.3-4.4 1.7-6.6.5-3 .9-6 1.5-9 .8-3.6 1.2-7-1-9.2-1.8-1.8-3.4-.6-5.4-.6C28.6 10.4 27 9 24 9Z"
          fill={paper}
          stroke={ink}
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <path d="M24 9c-3 0-4.6 1.4-6.8 1.4-2 0-3.6-1.2-5.4.6-1.4 1.4-1.6 3.4-1.3 5.6h27c.3-2.2.1-4.2-1.3-5.6-1.8-1.8-3.4-.6-5.4-.6C28.6 10.4 27 9 24 9Z" fill={blueSoft} />
      </g>
    </>
  );
}

const MOTIFS: Record<ProductVisual, () => React.JSX.Element> = {
  syringe: Syringe,
  bottle: Bottle,
  tube: Tube,
  box: Box,
  instrument: Instrument,
  bur: Bur,
  handpiece: Handpiece,
  file: File,
  bracket: Bracket,
  implant: Implant,
  suture: Suture,
  carpule: Carpule,
  ppe: PPE,
  machine: Machine,
  impression: Impression,
  crown: Crown,
};

export function ProductArt({
  visual,
  className = "",
  title,
  image,
}: {
  visual: ProductVisual;
  className?: string;
  title?: string;
  image?: ProductImage | null;
}) {
  // A real photograph always wins over the placeholder illustration.
  if (image?.src) {
    return (
      <img
        src={image.src}
        alt={image.alt ?? title ?? ""}
        loading="lazy"
        decoding="async"
        className={`object-contain ${className}`}
      />
    );
  }

  const Motif = MOTIFS[visual] ?? Box;
  return (
    <svg
      viewBox="0 0 300 300"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <Shadow />
      <Motif />
      <Spec />
    </svg>
  );
}
