export type CategorySlug =
  | "whitening"
  | "brushes"
  | "rinses"
  | "clinical"
  | "kids"
  | "ortho";

export type Category = {
  slug: CategorySlug;
  name: string;
  shortName: string;
  blurb: string;
  description: string;
  /** which placeholder artwork to draw on the category tile */
  visual: "serum" | "brush" | "bottle" | "scaler" | "kidbrush" | "aligner";
  order: number;
};

export const categories: Category[] = [
  {
    slug: "whitening",
    name: "Whitening & Stain Removal",
    shortName: "Whitening",
    blurb: "Enamel-safe brightening, without the sting.",
    description:
      "Peroxide and non-peroxide brightening systems built around a neutral pH so the shine comes back without the sensitivity. Every formula here is enamel-safe at the recommended dose.",
    visual: "serum",
    order: 1,
  },
  {
    slug: "brushes",
    name: "Brushes & Floss",
    shortName: "Brushes",
    blurb: "The two minutes that decide everything.",
    description:
      "Sonic and manual brushes with filament geometry designed for the gum line, plus floss and interdental tools for the surfaces a brush simply cannot reach.",
    visual: "brush",
    order: 2,
  },
  {
    slug: "rinses",
    name: "Mouthwash & Rinses",
    shortName: "Rinses",
    blurb: "Alcohol-free, pH balanced, actually pleasant.",
    description:
      "Rinses that finish the job without drying your mouth. No alcohol burn, no staining, no sugar — just chlorhexidine alternatives and gentle antimicrobials that respect your oral microbiome.",
    visual: "bottle",
    order: 3,
  },
  {
    slug: "clinical",
    name: "Clinical & Professional",
    shortName: "Clinical",
    blurb: "Clinic-grade care for home use.",
    description:
      "The stronger end of the shelf: remineralising gels, desensitisers and hygiene tools chosen with dentists for patients managing real clinical needs between appointments.",
    visual: "scaler",
    order: 4,
  },
  {
    slug: "kids",
    name: "Kids & Family",
    shortName: "Kids",
    blurb: "Small hands, right-sized habits.",
    description:
      "Fluoride at the correct paediatric concentration, soft filaments sized for smaller mouths, and flavours that do not need negotiating at bedtime.",
    visual: "kidbrush",
    order: 5,
  },
  {
    slug: "ortho",
    name: "Orthodontic Care",
    shortName: "Ortho",
    blurb: "For aligners, braces and everything between.",
    description:
      "Cleaning, relief and travel kits made for people mid-treatment — because wires and trays collect more than a brush can clear.",
    visual: "aligner",
    order: 6,
  },
];

export const categoryMap = Object.fromEntries(
  categories.map((c) => [c.slug, c]),
) as Record<CategorySlug, Category>;
