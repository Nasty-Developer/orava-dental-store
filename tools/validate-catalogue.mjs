#!/usr/bin/env node
/**
 * Structural validation of the catalogue, run before every build.
 *
 *   node tools/validate-catalogue.mjs        (also `npm run validate`)
 *
 * Two classes of finding:
 *
 *   error   the data is internally broken and must not ship — a duplicate slug,
 *           a product pointing at a missing photograph, a category that is not
 *           one of the 23, an image published without a permission state.
 *   warning a known gap in provenance on the original 344 rows. These are real
 *           work (Stage 3 of the brief) but they are not corruption, so they do
 *           not block a deploy. The count is printed so it can only go down.
 *
 * Exits non-zero on errors only.
 */
import fs from "node:fs";
import path from "node:path";
import { readCatalogue, PRODUCTS_DIR } from "./lib/read-catalogue.mjs";

const errors = [];
const warnings = [];
/** Products whose specs array is honestly empty — a Stage 3 fill, not corruption. */
const emptySpecs = [];

/** The 23 clinical areas, read from the type union so there is one source. */
const typesFile = fs.readFileSync(path.join(process.cwd(), "src", "data", "types.ts"), "utf8");
const categoryUnion = typesFile.match(/export type CategorySlug =([\s\S]*?);/);
const VALID_CATEGORIES = new Set(
  [...(categoryUnion?.[1] ?? "").matchAll(/"([a-z-]+)"/g)].map((m) => m[1]),
);
const visualUnion = typesFile.match(/export type ProductVisual =([\s\S]*?);/);
const VALID_VISUALS = new Set(
  [...(visualUnion?.[1] ?? "").matchAll(/"([a-z-]+)"/g)].map((m) => m[1]),
);

const products = readCatalogue();

if (!products.length) {
  console.error("validate-catalogue: no products found — the reader is broken, not the data.");
  process.exit(1);
}

// ── identity ────────────────────────────────────────────────────────────────
const seen = new Map();
for (const p of products) {
  if (seen.has(p.slug)) {
    errors.push(`${p.slug}: duplicate slug (${path.basename(seen.get(p.slug))} and ${path.basename(p.file)})`);
  } else {
    seen.set(p.slug, p.file);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) {
    errors.push(`${p.slug}: slug must be lowercase words separated by single hyphens`);
  }
}

// ── required fields ─────────────────────────────────────────────────────────
for (const p of products) {
  if (!p.name || p.name === p.slug) errors.push(`${p.slug}: missing name`);
  if (!p.brand) errors.push(`${p.slug}: missing brand`);
  if (!p.category) errors.push(`${p.slug}: missing category`);
  else if (!VALID_CATEGORIES.has(p.category)) {
    errors.push(`${p.slug}: category "${p.category}" is not one of the ${VALID_CATEGORIES.size} clinical areas`);
  }
  if (!/\n\s*subcategory:\s*"/.test(p.raw)) errors.push(`${p.slug}: missing subcategory`);
  if (!/\n\s*summary:\s*"/.test(p.raw)) errors.push(`${p.slug}: missing summary`);
  if (!/\n\s*visual:\s*"/.test(p.raw)) errors.push(`${p.slug}: missing visual`);

  const visual = (p.raw.match(/\n\s*visual:\s*"([^"]*)"/) ?? [])[1];
  if (visual && !VALID_VISUALS.has(visual)) {
    errors.push(`${p.slug}: visual "${visual}" is not a known placeholder`);
  }

  // price: either a positive number or an explicit null. Never a string.
  const priceMatch = p.raw.match(/\n\s*price:\s*([^,\n]+),/);
  if (!priceMatch) errors.push(`${p.slug}: missing price field`);
  else {
    const raw = priceMatch[1].trim();
    if (raw !== "null" && !/^\d+(\.\d+)?$/.test(raw)) {
      errors.push(`${p.slug}: price must be a number or null, got ${raw}`);
    } else if (raw !== "null" && Number(raw) <= 0) {
      errors.push(`${p.slug}: price must be positive, got ${raw}`);
    }
  }

  // specs: at least one { label, value } pair.
  // Specs are written inline: specs: [{ label: "…", value: "…" }, …],
  const specsBlock = p.raw.match(/\n\s*specs:\s*\[([^\]]*)\]/);
  if (!specsBlock) errors.push(`${p.slug}: missing specs array`);
  else if (!/label:\s*"/.test(specsBlock[1])) emptySpecs.push(p.slug);
  else if (!/value:\s*"/.test(specsBlock[1])) errors.push(`${p.slug}: specs entry with no value`);
}

// ── photographs ─────────────────────────────────────────────────────────────
for (const p of products) {
  if (!p.image) continue;
  const { src, source, license, permission } = p.image;
  if (!src) {
    errors.push(`${p.slug}: image block has no src`);
    continue;
  }
  if (!src.startsWith("/products/")) {
    errors.push(`${p.slug}: image src must live under /products/, got ${src}`);
    continue;
  }
  const file = path.join(PRODUCTS_DIR, path.basename(src));
  if (!fs.existsSync(file)) errors.push(`${p.slug}: ${src} does not exist on disk`);
  if (!source) errors.push(`${p.slug}: image has no recorded source`);
  if (!license) errors.push(`${p.slug}: image has no recorded licence`);
  if (!["granted", "owner-approved"].includes(permission ?? "")) {
    errors.push(`${p.slug}: image permission must be granted or owner-approved, got ${permission ?? "unset"}`);
  }
  if (permission === "owner-approved") {
    warnings.push(`${p.slug}: photograph published on the owner's authority, no brand permission on file`);
  }
}

// ── private label ───────────────────────────────────────────────────────────
for (const p of products) {
  const flagged = /\n\s*privateLabelAuthorised:\s*true/.test(p.raw);
  if (flagged && !/\n\s*privateLabelRef:\s*"/.test(p.raw)) {
    errors.push(`${p.slug}: privateLabelAuthorised set with no privateLabelRef`);
  }
}

// ── provenance coverage (warning only) ──────────────────────────────────────
// Product-level fields sit at four spaces; the image block's own source is
// nested deeper, so anchor on the exact indent to avoid counting it.
const withSource = products.filter((p) => /\n {4}source:\s*"/.test(p.raw)).length;
const withVerification = products.filter((p) => /\n {4}verification:\s*\{/.test(p.raw)).length;
const withPhoto = products.filter((p) => p.image).length;
const missingProvenance = products.length - withVerification;

// ── report ──────────────────────────────────────────────────────────────────
console.log(`catalogue: ${products.length} products, ${withPhoto} with a photograph on file`);
console.log(`provenance: ${withSource} with a source, ${withVerification} with a verification block`);
if (missingProvenance > 0) {
  console.log(
    `warning: ${missingProvenance} rows have no verification block yet (Stage 3 backfill). These do not block the build.`,
  );
}
if (emptySpecs.length) {
  console.log(`warning: ${emptySpecs.length} products have an empty specs array and need specifications researched:`);
  for (const slug of emptySpecs) console.log(`  ${slug}`);
}
if (warnings.length) {
  const shown = warnings.slice(0, 3);
  console.log(`warning: ${warnings.length} photographs rest on owner approval rather than brand permission`);
  for (const w of shown) console.log(`  ${w}`);
  if (warnings.length > shown.length) console.log(`  …and ${warnings.length - shown.length} more`);
}

if (errors.length) {
  console.error(`\nvalidate-catalogue: ${errors.length} error(s)`);
  for (const e of errors.slice(0, 40)) console.error(`  ${e}`);
  if (errors.length > 40) console.error(`  …and ${errors.length - 40} more`);
  process.exit(1);
}

console.log("validate-catalogue: no structural errors.");
