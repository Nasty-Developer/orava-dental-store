import type { CategorySlug } from "./categories";

/**
 * ─────────────────────────────────────────────────────────────
 *  PRODUCT CATALOGUE
 *  This is the only file you edit to add or change products.
 *  Add an object to the array below and the product appears
 *  automatically in the shop, its category, search and filters.
 * ─────────────────────────────────────────────────────────────
 *
 *  To use a real photo instead of the placeholder artwork:
 *    1. drop the file in  public/products/<slug>.jpg
 *    2. add  image: "/products/<slug>.jpg"  to that product
 */

export type ProductVisual =
  | "serum"
  | "strips"
  | "kit"
  | "brush"
  | "floss"
  | "bottle"
  | "mist"
  | "gel"
  | "scaler"
  | "mirror"
  | "kidbrush"
  | "aligner"
  | "wax";

export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  category: CategorySlug;
  price: number;
  compareAt?: number;
  size: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  stock: number;
  badge?: string;
  featured?: boolean;
  popular?: boolean;
  rating: number;
  reviewCount: number;
  visual: ProductVisual;
  image?: string;
  tags?: string[];
};

export const products: Product[] = [
  {
    slug: "aurora-whitening-serum",
    name: "Aurora Whitening Serum",
    subtitle: "5.5% hydrogen peroxide precision pen",
    category: "whitening",
    price: 1499,
    compareAt: 1899,
    size: "8 ml · 30 applications",
    shortDescription:
      "A measured-dose brightening pen that lifts coffee and tobacco staining without roughening enamel.",
    description:
      "Aurora uses a 5.5% hydrogen peroxide gel held in an anhydrous base, so the peroxide stays stable on the shelf and releases evenly once it meets saliva. The brush tip delivers a controlled 0.04 ml per press — enough to cover the facial surface of six anterior teeth, not enough to pool at the gum margin. Potassium nitrate is built into the formula to head off the transient sensitivity that makes most whitening pens a one-time purchase.",
    highlights: [
      "5.5% hydrogen peroxide, enamel-safe at recommended dose",
      "Potassium nitrate desensitiser included in the gel",
      "Precision brush tip, 0.04 ml per press",
      "Visible lift in 7–10 consecutive nights",
    ],
    specs: [
      { label: "Active", value: "Hydrogen peroxide 5.5%" },
      { label: "Desensitiser", value: "Potassium nitrate 3%" },
      { label: "pH", value: "7.1 (neutral)" },
      { label: "Course", value: "30 applications" },
    ],
    stock: 24,
    badge: "Bestseller",
    featured: true,
    popular: true,
    rating: 4.8,
    reviewCount: 214,
    visual: "serum",
    tags: ["coffee stains", "night routine"],
  },
  {
    slug: "radiant-whitening-strips",
    name: "Radiant Whitening Strips",
    subtitle: "Dissolving strips, 14-night course",
    category: "whitening",
    price: 899,
    size: "28 strips · 14 days",
    shortDescription:
      "Ultra-thin strips that dissolve in place, so you can talk, sip water and forget they are there.",
    description:
      "Each strip carries a 6% hydrogen peroxide film that adheres to the facial surface and dissolves over thirty minutes. No peeling, no slipping, no twenty minutes of not swallowing. The film is trimmed to stay 0.5 mm clear of the gingival margin, which is where most strip irritation comes from.",
    highlights: [
      "Dissolves completely — nothing to remove",
      "6% hydrogen peroxide film, even release",
      "Trimmed clear of the gum margin",
      "14-night course, one strip per arch",
    ],
    specs: [
      { label: "Active", value: "Hydrogen peroxide 6%" },
      { label: "Wear time", value: "30 minutes, dissolving" },
      { label: "Course", value: "14 nights" },
      { label: "Flavour", value: "Cool mint" },
    ],
    stock: 41,
    featured: true,
    popular: true,
    rating: 4.6,
    reviewCount: 168,
    visual: "strips",
  },
  {
    slug: "lumen-polish-kit",
    name: "Lumen Polish Kit",
    subtitle: "In-chair finish, at home",
    category: "whitening",
    price: 2499,
    compareAt: 2999,
    size: "Full kit · 6 treatments",
    shortDescription:
      "A three-step polish: stain lift, micro-polish, then a remineralising seal. The closest thing to a hygiene appointment.",
    description:
      "Lumen follows the sequence a hygienist uses. Step one is a papain and PEG-8 stain lift that softens extrinsic deposits. Step two is a 4 µm calcium carbonate micro-polish applied with the included dual-head cup. Step three is an amorphous calcium phosphate seal that fills the microscopic pores polishing opens up. Used fortnightly, it holds a whitening result far longer than whitening alone.",
    highlights: [
      "Three steps: lift, polish, remineralise",
      "Papain enzyme, no aggressive abrasives",
      "Amorphous calcium phosphate seal",
      "Reusable dual-head applicator",
    ],
    specs: [
      { label: "Steps", value: "3 (lift / polish / seal)" },
      { label: "Abrasive", value: "RDA 42, calcium carbonate" },
      { label: "Treatments", value: "6 full cycles" },
      { label: "Cadence", value: "Every 14 days" },
    ],
    stock: 12,
    badge: "New",
    featured: true,
    rating: 4.9,
    reviewCount: 87,
    visual: "kit",
  },
  {
    slug: "precision-sonic-brush",
    name: "Precision Sonic Brush",
    subtitle: "40,000 rpm with pressure sensing",
    category: "brushes",
    price: 3999,
    compareAt: 4799,
    size: "Handle · 2 heads · USB-C",
    shortDescription:
      "A quiet sonic handle that tells you when you press too hard, because that is what actually damages gums.",
    description:
      "The motor runs at 40,000 movements per minute with a 5.5 mm sweep amplitude — enough to clear plaque at the margin without the harshness of a rotating head. A load cell in the neck detects pressure above 250 g and pulses the motor to back you off. Four modes, a two-minute quadrant timer, and 40 days of charge from USB-C. The handle is machined aluminium with an IPX7 seal, so it survives a wet shelf.",
    highlights: [
      "40,000 rpm, 5.5 mm sweep amplitude",
      "Pressure sensor pulses above 250 g",
      "2-minute quadrant timer with 30s intervals",
      "40-day battery, USB-C, IPX7",
    ],
    specs: [
      { label: "Motor", value: "Sonic, 40,000 vpm" },
      { label: "Modes", value: "Clean / Soft / Whiten / Gum" },
      { label: "Battery", value: "40 days typical use" },
      { label: "Warranty", value: "24 months" },
    ],
    stock: 18,
    badge: "Bestseller",
    featured: true,
    popular: true,
    rating: 4.7,
    reviewCount: 302,
    visual: "brush",
  },
  {
    slug: "charcoal-soft-brush-trio",
    name: "Charcoal Soft Brush",
    subtitle: "Three-pack, 8,000 filaments",
    category: "brushes",
    price: 449,
    size: "3 brushes",
    shortDescription:
      "A genuinely soft manual brush: 0.12 mm tapered filaments, no scratch, no splay after a month.",
    description:
      "Most soft brushes are soft in name only. This one uses 0.12 mm tapered PBT filaments at a density of 8,000 per head, which lets each tip flex independently along the gum margin. The charcoal is in the handle and the bristle core, not as an abrasive additive — brushing charcoal onto enamel does more harm than good, so we left it out of the working surface.",
    highlights: [
      "0.12 mm tapered filaments, gentle at the margin",
      "8,000 filaments per head for even pressure",
      "No charcoal abrasive in the brushing surface",
      "Slim neck reaches the last molar",
    ],
    specs: [
      { label: "Filament", value: "PBT, 0.12 mm tapered" },
      { label: "Heads", value: "3" },
      { label: "Handle", value: "Bamboo-core composite" },
      { label: "Replace", value: "Every 12 weeks" },
    ],
    stock: 96,
    rating: 4.5,
    reviewCount: 241,
    visual: "brush",
  },
  {
    slug: "silk-floss-dispenser",
    name: "Silk Floss Dispenser",
    subtitle: "PTFE-free, 50 m refillable",
    category: "brushes",
    price: 349,
    size: "50 m · refillable",
    shortDescription:
      "Waxed silk-blend floss that glides between tight contacts without shredding.",
    description:
      "A flat-profile silk and polyester blend, waxed with candelilla rather than petroleum wax. It slides through contacts as tight as 0.1 mm and resists fraying on rough restorations. The dispenser is machined aluminium with a stainless cutter and takes 50 m refills, so you buy the object once.",
    highlights: [
      "Flat profile for tight contacts",
      "Candelilla wax, PTFE-free",
      "Machined aluminium, refillable",
      "50 m — roughly 5 months of daily use",
    ],
    specs: [
      { label: "Length", value: "50 m" },
      { label: "Material", value: "Silk / polyester blend" },
      { label: "Coating", value: "Candelilla wax" },
      { label: "Refills", value: "Sold separately" },
    ],
    stock: 64,
    rating: 4.6,
    reviewCount: 129,
    visual: "floss",
  },
  {
    slug: "interdental-brush-set",
    name: "Interdental Brush Set",
    subtitle: "Four sizes, ISO colour-coded",
    category: "brushes",
    price: 299,
    size: "8 brushes · 4 sizes",
    shortDescription:
      "The tool most people skip and most dentists wish they would not.",
    description:
      "Interdental brushes remove roughly 40% more plaque between teeth than floss alone, particularly where gums have receded. This set covers ISO sizes 0 to 3 in colour-coded wires, with a bendable neck and a cap that doubles as a handle extension. Replace weekly — a worn brush stops cleaning the gap it was bought for.",
    highlights: [
      "ISO 0–3 sizes, colour-coded",
      "Bendable neck for posterior access",
      "Two of each size, 8 total",
      "Cap doubles as handle extender",
    ],
    specs: [
      { label: "Sizes", value: "ISO 0, 1, 2, 3" },
      { label: "Quantity", value: "8 brushes" },
      { label: "Wire", value: "Coated stainless" },
      { label: "Replace", value: "Weekly" },
    ],
    stock: 58,
    rating: 4.4,
    reviewCount: 76,
    visual: "floss",
  },
  {
    slug: "clear-rinse-alcohol-free",
    name: "Clear Rinse",
    subtitle: "Alcohol-free daily mouthwash",
    category: "rinses",
    price: 649,
    size: "500 ml · 5 weeks",
    shortDescription:
      "An alcohol-free daily rinse that does not burn, dry your mouth or stain your tongue.",
    description:
      "Alcohol in mouthwash dries tissue and drops salivary pH, which is the opposite of what a healthy mouth needs. Clear Rinse uses cetylpyridinium chloride at 0.05% with xylitol and sodium fluoride 225 ppm, buffered to pH 6.8. It is effective against plaque biofilm without the sting, and it will not discolour composite restorations.",
    highlights: [
      "0% alcohol, pH 6.8 buffered",
      "CPC 0.05% + fluoride 225 ppm",
      "Xylitol sweetened, no sugar",
      "Safe for composite restorations",
    ],
    specs: [
      { label: "Active", value: "CPC 0.05%" },
      { label: "Fluoride", value: "225 ppm" },
      { label: "Alcohol", value: "0%" },
      { label: "Volume", value: "500 ml" },
    ],
    stock: 73,
    popular: true,
    rating: 4.7,
    reviewCount: 195,
    visual: "bottle",
  },
  {
    slug: "sensitive-shield-rinse",
    name: "Sensitive Shield Rinse",
    subtitle: "Potassium nitrate 5% weekly rinse",
    category: "rinses",
    price: 749,
    size: "350 ml · 8 weeks",
    shortDescription:
      "A weekly rinse for cold-sensitive teeth, built to settle the nerve before it complains.",
    description:
      "Potassium nitrate depolarises the nerve ending inside the dentinal tubules, which is why it works for sensitivity where desensitising toothpastes alone plateau. At 5% in a once-weekly rinse, it reaches the tubules without the twice-daily exposure that causes taste alteration. Use at night, thirty minutes after brushing.",
    highlights: [
      "Potassium nitrate 5%, once weekly",
      "Reduces cold and sweet sensitivity",
      "Fluoride 250 ppm included",
      "Alcohol and SLS free",
    ],
    specs: [
      { label: "Active", value: "Potassium nitrate 5%" },
      { label: "Fluoride", value: "250 ppm" },
      { label: "Cadence", value: "Weekly, at night" },
      { label: "Volume", value: "350 ml" },
    ],
    stock: 34,
    rating: 4.5,
    reviewCount: 88,
    visual: "bottle",
  },
  {
    slug: "breath-freshening-mist",
    name: "Breath Freshening Mist",
    subtitle: "Pocket atomiser, 200 sprays",
    category: "rinses",
    price: 399,
    size: "15 ml · 200 sprays",
    shortDescription:
      "A fine mist with zinc and xylitol that neutralises odour rather than covering it with mint.",
    description:
      "Volatile sulphur compounds are the actual cause of most breath odour, and mint merely outshouts them. Zinc gluconate binds the sulphur molecules directly; xylitol keeps the mouth alkaline between meals. The atomiser delivers 75 µl per spray, fine enough to coat the whole oral cavity in two presses.",
    highlights: [
      "Zinc gluconate neutralises VSCs",
      "Xylitol, no sugar or alcohol",
      "200 metered sprays",
      "Fits a shirt pocket",
    ],
    specs: [
      { label: "Active", value: "Zinc gluconate 0.3%" },
      { label: "Sprays", value: "200 metered" },
      { label: "Volume", value: "15 ml" },
      { label: "Flavour", value: "Wild mint" },
    ],
    stock: 120,
    rating: 4.3,
    reviewCount: 112,
    visual: "mist",
  },
  {
    slug: "enamel-repair-gel",
    name: "Enamel Repair Gel",
    subtitle: "ACP + fluoride 5,000 ppm",
    category: "clinical",
    price: 1299,
    size: "40 g · 8 weeks",
    shortDescription:
      "Prescription-strength remineralisation for white spots, early erosion and post-whitening recovery.",
    description:
      "Amorphous calcium phosphate supplies the mineral; 5,000 ppm fluoride drives it into the lesion. Together they rebuild the subsurface layer that early caries and acid erosion hollow out, which is why this gel is used after orthodontic debonding and around white spot lesions. Apply to a dry tooth surface at night and leave it undisturbed.",
    highlights: [
      "5,000 ppm fluoride, ACP mineral source",
      "For white spots and early erosion",
      "Post-whitening and post-ortho recovery",
      "Apply at night, no rinsing after",
    ],
    specs: [
      { label: "Fluoride", value: "5,000 ppm" },
      { label: "Mineral", value: "Amorphous calcium phosphate" },
      { label: "Use", value: "Nightly, 8 weeks" },
      { label: "Size", value: "40 g" },
    ],
    stock: 21,
    badge: "Clinical",
    featured: true,
    rating: 4.8,
    reviewCount: 64,
    visual: "gel",
  },
  {
    slug: "sensitivity-shield-gel",
    name: "Sensitivity Shield Gel",
    subtitle: "Arginine + calcium carbonate",
    category: "clinical",
    price: 999,
    size: "50 g · 10 weeks",
    shortDescription:
      "A plug-and-seal formula that physically occludes exposed dentinal tubules.",
    description:
      "Arginine and calcium carbonate form a calcium-rich layer over the dentine surface that physically blocks the tubules, cutting fluid movement and with it the sharp response to cold. Unlike potassium salts, the effect is mechanical, so it survives a meal and builds with repeated use. Also works as a spot treatment on a single sensitive tooth.",
    highlights: [
      "Occludes tubules mechanically",
      "Arginine 8% + calcium carbonate",
      "Survives eating and drinking",
      "Use as paste or spot treatment",
    ],
    specs: [
      { label: "Active", value: "Arginine 8%" },
      { label: "Mechanism", value: "Tubule occlusion" },
      { label: "Fluoride", value: "1,450 ppm" },
      { label: "Size", value: "50 g" },
    ],
    stock: 39,
    rating: 4.6,
    reviewCount: 97,
    visual: "gel",
  },
  {
    slug: "professional-scaler-kit",
    name: "Professional Scaler Kit",
    subtitle: "Ultrasonic with 5 tips",
    category: "clinical",
    price: 3499,
    compareAt: 4299,
    size: "Unit · 5 tips · case",
    shortDescription:
      "A home ultrasonic scaler for tartar control between hygiene visits, with the tip set to do it properly.",
    description:
      "Built for people who form calculus quickly and see a hygienist twice a year. The handpiece oscillates at 28,000 Hz with water-line cooling, and ships with five tips: two universal, two periodontal and one for the lingual of the lower anteriors. Intensity is stepped, not continuous, because full power on a home unit is how enamel gets chipped.",
    highlights: [
      "28,000 Hz with water-line cooling",
      "Five tips incl. periodontal and lingual",
      "Stepped intensity, not continuous",
      "Hard travel case included",
    ],
    specs: [
      { label: "Frequency", value: "28,000 Hz" },
      { label: "Tips", value: "5 (2 universal, 2 perio, 1 lingual)" },
      { label: "Cooling", value: "Water line" },
      { label: "Power", value: "USB-C, 90 min runtime" },
    ],
    stock: 9,
    badge: "Clinical",
    rating: 4.5,
    reviewCount: 41,
    visual: "scaler",
  },
  {
    slug: "diagnostic-mouth-mirror",
    name: "Diagnostic Mouth Mirror",
    subtitle: "Anti-fog, LED lit",
    category: "clinical",
    price: 599,
    size: "Mirror · 2 heads",
    shortDescription:
      "See what your dentist sees, in the places you have never actually looked.",
    description:
      "A rhodium-coated glass mirror with a hydrophobic anti-fog surface and a ring of warm-white LEDs in the rim, so the lingual of your lower incisors is finally visible. The head detaches for cleaning and a second, smaller head is included for posterior access.",
    highlights: [
      "Rhodium glass, true colour",
      "Hydrophobic anti-fog coating",
      "Warm-white LED ring, 3 brightness",
      "Two interchangeable heads",
    ],
    specs: [
      { label: "Coating", value: "Rhodium, anti-fog" },
      { label: "Light", value: "LED ring, 3 levels" },
      { label: "Heads", value: "2 (standard, posterior)" },
      { label: "Battery", value: "2 × AAA" },
    ],
    stock: 47,
    rating: 4.4,
    reviewCount: 58,
    visual: "mirror",
  },
  {
    slug: "little-orava-brush-set",
    name: "Little Orava Brush Set",
    subtitle: "Ages 3–8, two brushes",
    category: "kids",
    price: 549,
    size: "2 brushes + timer",
    shortDescription:
      "Small-headed brushes with a 1,000 ppm fluoride paste and a sand timer children actually use.",
    description:
      "The head is 40% smaller than an adult brush with 0.10 mm filaments, sized for a mouth that is still making room. The handle has a grip zone where a child's fingers actually land, and the set includes a two-minute sand timer because the timer is what changes the habit, not the brush.",
    highlights: [
      "40% smaller head, 0.10 mm filaments",
      "Grip zone sized for small hands",
      "Two-minute sand timer included",
      "BPA-free, ages 3–8",
    ],
    specs: [
      { label: "Ages", value: "3–8 years" },
      { label: "Brushes", value: "2" },
      { label: "Filament", value: "0.10 mm soft" },
      { label: "Extras", value: "2-min sand timer" },
    ],
    stock: 62,
    rating: 4.7,
    reviewCount: 143,
    visual: "kidbrush",
  },
  {
    slug: "bubblegum-fluoride-gel",
    name: "Bubblegum Fluoride Gel",
    subtitle: "1,000 ppm, ages 3+",
    category: "kids",
    price: 399,
    size: "50 g · 3 months",
    shortDescription:
      "Paediatric fluoride at the right concentration, in a flavour that ends the argument.",
    description:
      "1,000 ppm sodium fluoride is the concentration paediatric guidance recommends from age three, when a child can spit reliably. The gel is dye-free and sweetened with xylitol rather than sorbitol, so it does not feed the bacteria it is meant to fight. Bubblegum, because mint is a learned taste and children have not learned it yet.",
    highlights: [
      "1,000 ppm fluoride, ages 3+",
      "Dye-free, xylitol sweetened",
      "Pea-sized dose guide on the cap",
      "Bubblegum flavour, no mint burn",
    ],
    specs: [
      { label: "Fluoride", value: "1,000 ppm NaF" },
      { label: "Ages", value: "3 years and up" },
      { label: "Sweetener", value: "Xylitol" },
      { label: "Size", value: "50 g" },
    ],
    stock: 84,
    rating: 4.5,
    reviewCount: 71,
    visual: "gel",
  },
  {
    slug: "aligner-care-kit",
    name: "Aligner Care Kit",
    subtitle: "Clean, soak, carry",
    category: "ortho",
    price: 1799,
    size: "Full kit · 60 soaks",
    shortDescription:
      "Everything a tray needs: effervescent cleanser, a vented case and a brush that fits inside it.",
    description:
      "Aligner trays trap saliva and bacteria against enamel for 22 hours a day, and a rinse under the tap does not fix that. The cleanser is a perborate-free effervescent tablet that lifts biofilm in fifteen minutes without discolouring the tray. The case is vented so trays dry instead of sitting wet, and the brush is angled to reach the occlusal well of a molar tray.",
    highlights: [
      "60 effervescent soaks, perborate-free",
      "Vented case lets trays dry properly",
      "Angled brush for tray wells",
      "Travel pouch included",
    ],
    specs: [
      { label: "Soaks", value: "60 tablets" },
      { label: "Soak time", value: "15 minutes" },
      { label: "Case", value: "Vented, BPA-free" },
      { label: "Extras", value: "Tray brush + pouch" },
    ],
    stock: 28,
    featured: true,
    rating: 4.6,
    reviewCount: 53,
    visual: "aligner",
  },
  {
    slug: "wax-relief-kit",
    name: "Wax & Relief Kit",
    subtitle: "For wires, brackets and day one",
    category: "ortho",
    price: 449,
    size: "12 strips + gel",
    shortDescription:
      "The kit you wish the clinic handed you on day one of braces.",
    description:
      "Twelve medical-grade wax strips to cover a bracket that is rubbing, plus a benzocaine-free relief gel that numbs a sore spot without the numb-tongue feeling of anaesthetic gels. Both fit in a pocket-sized tin, which is where they need to be.",
    highlights: [
      "12 medical-grade wax strips",
      "Benzocaine-free relief gel",
      "Pocket tin, fits a school bag",
      "Safe with aligners and wires",
    ],
    specs: [
      { label: "Wax", value: "12 strips" },
      { label: "Gel", value: "10 ml, benzocaine-free" },
      { label: "Packaging", value: "Metal pocket tin" },
      { label: "Use", value: "As needed" },
    ],
    stock: 55,
    rating: 4.4,
    reviewCount: 39,
    visual: "wax",
  },
];

export const productMap = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<
  string,
  Product
>;

export const getProduct = (slug: string) => productMap[slug];

export const productsByCategory = (slug: CategorySlug) =>
  products.filter((p) => p.category === slug);

export const featuredProducts = products.filter((p) => p.featured);
export const popularProducts = products.filter((p) => p.popular);

export const priceRange = {
  min: Math.min(...products.map((p) => p.price)),
  max: Math.max(...products.map((p) => p.price)),
};

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
