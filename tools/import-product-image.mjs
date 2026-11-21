#!/usr/bin/env node
/**
 * Import one real product photograph.
 *
 *   node tools/import-product-image.mjs <slug> <photo.jpg> \
 *     --source "Where it came from" --license "Why you may publish it" \
 *     [--alt "Short description"] [--dry-run]
 *
 * The photo is flattened onto white, fitted into a 1200x1200 square and saved
 * as public/products/<slug>.webp under 250 KB. The catalogue entry is then
 * pointed at it, with the source and licence you supplied. Both are required:
 * they are the record of why the image may be published, so the tool refuses
 * to write an entry without them.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { findProduct, writeImageField, PRODUCTS_DIR } from "./lib/read-catalogue.mjs";

const MAX_BYTES = 250 * 1024;
const SIZE = 1200;

const argv = process.argv.slice(2);
const flags = {};
const positional = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith("--")) {
    const key = a.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) flags[key] = true;
    else {
      flags[key] = next;
      i++;
    }
  } else positional.push(a);
}

const usage = `Usage: node tools/import-product-image.mjs <slug> <photo> --source "..." --license "..." [--alt "..."] [--dry-run]`;

if (positional.length < 2 || flags.help) {
  console.log(usage);
  process.exit(positional.length < 2 ? 1 : 0);
}

const [slug, file] = positional;
if (!fs.existsSync(file)) {
  console.error(`No such file: ${file}`);
  process.exit(1);
}
if (typeof flags.source !== "string" || typeof flags.license !== "string") {
  console.error(
    "Both --source and --license are required.\n\n" +
      "  --source   where the photograph came from, e.g. \"Waldent dealer media kit\"\n" +
      "  --license  why you may publish it, e.g. \"Distributor agreement, written permission 2026-11-22\"\n\n" +
      "If you cannot answer both honestly, leave image: null and keep the illustration.",
  );
  process.exit(1);
}

const product = findProduct(slug);
const outName = `${slug}.webp`;
const outPath = path.join(PRODUCTS_DIR, outName);

const meta = await sharp(file).metadata();
if (Math.min(meta.width ?? 0, meta.height ?? 0) < 900) {
  console.warn(
    `! source is ${meta.width}x${meta.height}; a 1200px square from this will be upscaled.`,
  );
}

const pipeline = () =>
  sharp(file)
    .rotate()
    .flatten({ background: "#ffffff" })
    .resize(SIZE, SIZE, { fit: "contain", background: "#ffffff", withoutEnlargement: false });

let quality = 82;
let buffer = await pipeline().webp({ quality }).toBuffer();
while (buffer.length > MAX_BYTES && quality > 45) {
  quality -= 6;
  buffer = await pipeline().webp({ quality }).toBuffer();
}

console.log(
  `${product.name} (${product.brand})\n  source ${meta.width}x${meta.height} -> ${SIZE}x${SIZE} webp q${quality}, ${(buffer.length / 1024).toFixed(0)} KB`,
);

if (buffer.length > MAX_BYTES) {
  console.warn("! still over 250 KB; consider a cleaner original");
}

const alt = typeof flags.alt === "string" ? flags.alt : `${product.name}, ${product.brand}`;
const block = `image: {
      src: "/products/${outName}",
      alt: ${JSON.stringify(alt)},
      source: ${JSON.stringify(flags.source)},
      license: ${JSON.stringify(flags.license)},
    }`;

if (flags["dry-run"]) {
  console.log("\n--dry-run, nothing written. Catalogue block would be:\n" + block);
  process.exit(0);
}

fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
fs.writeFileSync(outPath, buffer);
writeImageField(product, block);

console.log(`\n  wrote public/products/${outName}`);
console.log(`  updated ${path.relative(process.cwd(), product.file)}`);
console.log("\nNext: npm run images:check, then commit and push.");
