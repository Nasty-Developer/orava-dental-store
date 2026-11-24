/** Shared catalogue types. Edit here, not in the per-category files. */

export type CategorySlug =
  | "restorative"
  | "endodontics"
  | "prosthodontics"
  | "impression"
  | "instruments"
  | "burs"
  | "handpieces"
  | "orthodontics"
  | "implantology"
  | "oral-surgery"
  | "periodontics"
  | "pedodontics"
  | "laboratory"
  | "consumables"
  | "infection-control"
  | "sterilization"
  | "equipment"
  | "imaging"
  | "preventive"
  | "whitening"
  | "digital"
  | "anaesthetics"
  | "clinic-kits";

/** Which placeholder illustration to draw when a product has no photo. */
export type ProductVisual =
  | "syringe"
  | "bottle"
  | "tube"
  | "box"
  | "instrument"
  | "bur"
  | "handpiece"
  | "file"
  | "bracket"
  | "implant"
  | "suture"
  | "carpule"
  | "ppe"
  | "machine"
  | "impression"
  | "crown";

export type ProductImage = {
  src: string;
  alt?: string;
  /** where the file came from */
  source: string;
  /** usage rights, e.g. "Manufacturer press kit, written permission" */
  license: string;
  credit?: string;
  /**
   * Who authorised publication.
   *  - "granted"        the brand itself said yes in writing
   *  - "owner-approved" Tanvi approved publishing without brand permission on
   *                     file; recorded so the distinction is never lost
   *  - "pending"        nobody has authorised it; must stay in staging
   */
  permission?: "granted" | "owner-approved" | "pending";
};

export type Product = {
  slug: string;
  /** product name, without the brand */
  name: string;
  brand: string;
  category: CategorySlug;
  subcategory: string;
  /** pack size as listed by the manufacturer or distributor */
  packaging: string | null;
  summary: string;
  specs: { label: string; value: string }[];
  /**
   * Indicative retail price in INR. `null` means price on request.
   * See docs/CATALOGUE.md for where these came from.
   */
  price: number | null;
  visual: ProductVisual;
  /** set this to use a real photograph instead of the placeholder art */
  image: ProductImage | null;
  /**
   * Where the facts on this row were checked, for products added after the
   * original catalogue. Absent on the first 344 rows.
   */
  source?: string;
  verification?: {
    method: string;
    checkedOn: string;
    note: string;
  };
  /**
   * SOMIL private label.
   *
   * Set only when SOMIL is genuinely authorised to sell this product under its
   * own name. While absent, the listing keeps the genuine manufacturer
   * photograph and identification: a SOMIL pack shot must never stand in for a
   * third-party product. Enforced by `npm run images:check`.
   */
  privateLabelAuthorised?: boolean;
  /** Who authorised the private label, and when. Required when the flag is set. */
  privateLabelRef?: string;
  featured?: boolean;
  popular?: boolean;
  tags?: string[];
};

/**
 * What a client surface is allowed to receive: a card, a cart line, a search
 * hit. Deliberately omits `specs`, `source`, `verification` and the private
 * label fields so that a large catalogue never ships its full records to the
 * browser. Full `Product` records stay on the server.
 */
export type ProductSummary = {
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  subcategory: string;
  packaging: string | null;
  summary: string;
  price: number | null;
  visual: ProductVisual;
  image: ProductImage | null;
  featured?: boolean;
  popular?: boolean;
};

/**
 * One row of the static search index served from /search-index.json. It is
 * fetched lazily by the header search and used as the fallback when a cart
 * saved before this index existed only holds slugs.
 */
export type SearchIndexItem = Omit<ProductSummary, "featured" | "popular">;
