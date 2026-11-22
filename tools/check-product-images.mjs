#!/usr/bin/env node
/**
 * Validate every real product photograph in the catalogue.
 *
 *   npm run images:check
 *
 * Checks that the file exists, is under 250 KB, is at least 900px square, and
 * that source and licence are filled in. Exits non-zero if anything is wrong,
 * so it can gate a deploy.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { readCatalogue } from "./lib/read-catalogue.mjs";

const MAX_BYTES = 250 * 1024;
const MIN_PX = 900;

const products = readCatalogue();
const withImage = products.filter((p) => p.image);
const problems = [];

for (const p of withImage) {
  const { src, source, license } = p.image;
  if (!src) problems.push(`${p.slug}: image block has no src`);
  else if (!src.startsWith("/products/")) problems.push(`${p.slug}: src should live under /products/, got ${src}`);
  if (!source || !source.trim()) problems.push(`${p.slug}: missing source`);
  if (!license || !license.trim()) problems.push(`${p.slug}: missing license`);
  if (!["granted", "owner-approved"].includes(p.image.permission))
    problems.push(`${p.slug}: photograph is not authorised for publication (permission: ${p.image.permission ?? "unset"})`);

  if (!src) continue;
  const file = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  if (!fs.existsSync(file)) {
    problems.push(`${p.slug}: ${src} does not exist`);
    continue;
  }
  const { size } = fs.statSync(file);
  if (size > MAX_BYTES) problems.push(`${p.slug}: ${src} is ${(size / 1024).toFixed(0)} KB, over 250 KB`);
  try {
    const meta = await sharp(file).metadata();
    if (Math.min(meta.width ?? 0, meta.height ?? 0) < MIN_PX) {
      problems.push(`${p.slug}: ${src} is ${meta.width}x${meta.height}, under ${MIN_PX}px`);
    }
  } catch {
    problems.push(`${p.slug}: ${src} is not a readable image`);
  }
}

// ── SOMIL private label ──────────────────────────────────────────────────
// A SOMIL-branded pack shot belongs only on a product SOMIL is genuinely
// authorised to sell under its own name. Everything else keeps the
// manufacturer's own photograph and identification.
const PRIVATE_LABEL_SRC = /\/products\/somil-/;
for (const p of products) {
  const src = p.image?.src ?? "";
  if (PRIVATE_LABEL_SRC.test(src) && p.privateLabelAuthorised !== true) {
    problems.push(`${p.slug}: uses a SOMIL pack shot but is not marked privateLabelAuthorised`);
  }
  if (p.privateLabelAuthorised === true && !p.privateLabelRef) {
    problems.push(`${p.slug}: privateLabelAuthorised is set with no privateLabelRef (who authorised it, and when)`);
  }
}
const privateLabel = products.filter((p) => p.privateLabelAuthorised === true);
console.log(`${privateLabel.length}/${products.length} products are authorised SOMIL private label.`);

const missing = products.length - withImage.length;
console.log(`${withImage.length}/${products.length} products have a real photograph (${missing} still illustrated).`);

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}
console.log("All photographs are valid.");
