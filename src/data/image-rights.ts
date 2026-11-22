/**
 * Rights gate for product photography.
 *
 * Every photograph in public/products/ came from Dentalkart's CDN (see
 * docs/IMAGE-RIGHTS-REPORT.md and docs/IMAGE-RIGHTS-AUDIT.csv). No commercial
 * reuse permission is recorded for any of them, so they are held back from the
 * live site until written permission arrives or each is replaced with an asset
 * we hold rights to.
 *
 * This deletes nothing. Catalogue records, original image URLs, the manifest and
 * the audit stay exactly as they are; only the served photograph is withheld.
 * Flip PRODUCT_PHOTOS_LIVE once rights are cleared, or move to per-product flags
 * if permission is granted brand by brand.
 */

export const PRODUCT_PHOTOS_LIVE = false;

export const PHOTO_HOLD_REASON =
  "Photograph withheld: retailer CDN source with no recorded commercial reuse permission.";

/** Withholds every product photograph while the gate is closed. */
export function gateImages<T extends { image: unknown }>(rows: T[]): T[] {
  if (PRODUCT_PHOTOS_LIVE) return rows;
  return rows.map((row) => ({ ...row, image: null }));
}
