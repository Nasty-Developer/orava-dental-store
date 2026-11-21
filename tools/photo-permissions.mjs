#!/usr/bin/env node
/**
 * Keep photographs out of production until permission exists.
 *
 *   node tools/photo-permissions.mjs --withdraw        move every unpermitted
 *                                                     photograph to staging
 *   node tools/photo-permissions.mjs --status          what is staged, per brand
 *   node tools/photo-permissions.mjs --grant "Waldent" \
 *        --ref "Email from X, 2026-11-24"              restore a brand once a
 *                                                     written yes is on file
 *
 * A photograph is only ever written into the catalogue with permission:
 * "granted". Anything else lives in staging/product-photos/<brand>/ with its
 * source and licence recorded, ready to go live the moment the brand agrees.
 */
import fs from "node:fs";
import path from "node:path";
import { readCatalogue, writeImageField, PRODUCTS_DIR } from "./lib/read-catalogue.mjs";

const argv = process.argv.slice(2);
const has = (f) => argv.includes(`--${f}`);
const val = (f) => {
  const i = argv.indexOf(`--${f}`);
  return i === -1 ? null : argv[i + 1];
};

const STAGING = path.join(process.cwd(), "staging", "product-photos");
const MANIFEST_DIR = path.join(process.cwd(), "docs", "sourcing", "pending");
const brandSlug = (b) => b.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const manifestFile = (brand) => path.join(MANIFEST_DIR, `${brandSlug(brand)}.json`);
const readManifest = (brand) =>
  fs.existsSync(manifestFile(brand)) ? JSON.parse(fs.readFileSync(manifestFile(brand), "utf8")) : null;
const writeManifest = (brand, data) => {
  fs.mkdirSync(MANIFEST_DIR, { recursive: true });
  fs.writeFileSync(manifestFile(brand), JSON.stringify(data, null, 1));
};

const products = readCatalogue();

if (has("withdraw")) {
  const pending = products.filter((p) => p.image && p.image.permission !== "granted");
  if (!pending.length) {
    console.log("Nothing to withdraw: every photograph in the catalogue is permitted.");
    process.exit(0);
  }
  const byBrand = new Map();
  for (const p of pending) {
    if (!byBrand.has(p.brand)) byBrand.set(p.brand, []);
    byBrand.get(p.brand).push(p);
  }
  let moved = 0;
  for (const [brand, items] of byBrand) {
    const dir = path.join(STAGING, brandSlug(brand));
    fs.mkdirSync(dir, { recursive: true });
    const manifest = readManifest(brand) ?? { brand, photos: [] };
    for (const p of items) {
      const file = path.basename(p.image.src);
      const from = path.join(PRODUCTS_DIR, file);
      const to = path.join(dir, file);
      if (fs.existsSync(from)) {
        fs.renameSync(from, to);
        moved++;
      }
      manifest.photos = manifest.photos.filter((x) => x.slug !== p.slug);
      manifest.photos.push({
        slug: p.slug,
        file: path.relative(process.cwd(), to),
        alt: p.image.alt ?? p.name,
        source: p.image.source,
        license: p.image.license,
        staged_on: new Date().toISOString().slice(0, 10),
      });
      writeImageField(p, "image: null");
    }
    writeManifest(brand, manifest);
    console.log(`withdrew ${items.length} ${brand} photograph(s) -> ${path.relative(process.cwd(), dir)}`);
  }
  console.log(`\n${moved} file(s) moved to staging. Those products now show their illustration.`);
  process.exit(0);
}

if (has("status")) {
  const files = fs.existsSync(MANIFEST_DIR) ? fs.readdirSync(MANIFEST_DIR).filter((f) => f.endsWith(".json")) : [];
  if (!files.length) console.log("No staged photographs.");
  for (const f of files) {
    const m = JSON.parse(fs.readFileSync(path.join(MANIFEST_DIR, f), "utf8"));
    console.log(`${m.brand}: ${m.photos.length} photograph(s) staged, awaiting written permission`);
  }
  process.exit(0);
}

if (has("grant")) {
  const brand = val("grant");
  const ref = val("ref");
  if (!ref) {
    console.error("--grant needs --ref describing the written permission, e.g. --ref \"Waldent dealer email, 2026-11-24\"");
    process.exit(1);
  }
  const manifest = readManifest(brand);
  if (!manifest) {
    console.error(`No staged photographs for "${brand}".`);
    process.exit(1);
  }
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
  let restored = 0;
  for (const photo of manifest.photos) {
    const product = products.find((p) => p.slug === photo.slug);
    if (!product) {
      console.log(`skip ${photo.slug}: no longer in the catalogue`);
      continue;
    }
    const from = path.join(process.cwd(), photo.file);
    const fileName = path.basename(photo.file);
    const to = path.join(PRODUCTS_DIR, fileName);
    if (fs.existsSync(from)) fs.renameSync(from, to);
    writeImageField(
      product,
      `image: {
      src: "/products/${fileName}",
      alt: ${JSON.stringify(photo.alt)},
      source: ${JSON.stringify(photo.source)},
      license: ${JSON.stringify(`Written permission: ${ref}`)},
      permission: "granted",
    },`,
    );
    restored++;
  }
  writeManifest(brand, { ...manifest, granted_on: new Date().toISOString().slice(0, 10), permission_ref: ref, photos: [] });
  console.log(`restored ${restored} ${brand} photograph(s) with written permission recorded.`);
  process.exit(0);
}

console.error("Use --withdraw, --status, or --grant \"<brand>\" --ref \"<written permission>\"");
process.exit(1);
