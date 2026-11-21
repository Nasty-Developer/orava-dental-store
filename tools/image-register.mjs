#!/usr/bin/env node
/**
 * Builds the photograph register: every catalogue product, its image status,
 * where any photograph came from, and its permission position.
 *
 *   node tools/image-register.mjs
 *
 * Writes docs/PRODUCT-IMAGE-REGISTER.csv (one row per product, spreadsheet
 * ready) and docs/PRODUCT-IMAGE-REGISTER.md (the same, readable, grouped by
 * brand with a summary at the top).
 */
import fs from "node:fs";
import path from "node:path";
import { readCatalogue } from "./lib/read-catalogue.mjs";
import { categories } from "../src/data/categories.ts";

const MANIFEST_DIR = path.join(process.cwd(), "docs", "sourcing", "pending");
const products = readCatalogue();

// staged photographs, keyed by slug
const staged = new Map();
if (fs.existsSync(MANIFEST_DIR)) {
  for (const f of fs.readdirSync(MANIFEST_DIR).filter((x) => x.endsWith(".json"))) {
    const m = JSON.parse(fs.readFileSync(path.join(MANIFEST_DIR, f), "utf8"));
    for (const p of m.photos ?? []) staged.set(p.slug, { ...p, brand: m.brand, granted_on: m.granted_on, ref: m.permission_ref });
  }
}

const categoryName = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

const rows = products.map((p, i) => {
  const live = p.image && p.image.permission === "granted";
  const stage = staged.get(p.slug);
  let status = "Illustration (no photograph sourced)";
  let source = "";
  let permission = "Not applicable: illustration in use";
  if (live) {
    status = "Photograph live";
    source = p.image.source;
    permission = "Granted in writing";
  } else if (stage) {
    status = "Photograph sourced, staged (not published)";
    source = stage.source;
    permission = "Pending: written permission not received";
  }
  return {
    n: i + 1,
    name: p.name,
    brand: p.brand,
    category: categoryName[p.category] ?? p.category,
    status,
    source,
    permission,
    slug: p.slug,
  };
});

const header = ["#", "Product name", "Brand", "Category", "Image status", "Image source", "Permission status", "Slug"];
const csv = [header.map(csvCell).join(",")]
  .concat(rows.map((r) => [r.n, r.name, r.brand, r.category, r.status, r.source, r.permission, r.slug].map(csvCell).join(",")))
  .join("\n");
fs.writeFileSync(path.join(process.cwd(), "docs", "PRODUCT-IMAGE-REGISTER.csv"), csv + "\n");

const count = (fn) => rows.filter(fn).length;
const liveN = count((r) => r.status === "Photograph live");
const stagedN = count((r) => r.status.startsWith("Photograph sourced"));
const illN = rows.length - liveN - stagedN;

const byBrand = new Map();
for (const r of rows) {
  if (!byBrand.has(r.brand)) byBrand.set(r.brand, { total: 0, live: 0, staged: 0 });
  const b = byBrand.get(r.brand);
  b.total++;
  if (r.status === "Photograph live") b.live++;
  if (r.status.startsWith("Photograph sourced")) b.staged++;
}
const brands = [...byBrand.entries()].sort((a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0]));

const md = [];
md.push("# Product photograph register");
md.push("");
md.push(`Every one of the ${rows.length} catalogue products, its image status, where any photograph came from, and its permission position. Generated ${new Date().toISOString().slice(0, 10)} by \`node tools/image-register.mjs\`.`);
md.push("");
md.push("| | Products |");
md.push("|---|---|");
md.push(`| Photograph live with written permission | ${liveN} |`);
md.push(`| Photograph sourced, staged, not published | ${stagedN} |`);
md.push(`| Illustration in use | ${illN} |`);
md.push(`| **Total** | **${rows.length}** |`);
md.push("");
md.push("Nothing is published without written permission: `npm run images:check` fails on any photograph that is not marked `permission: \"granted\"`.");
md.push("");
md.push("## Brands by outstanding work");
md.push("");
md.push("| Brand | Products | Live | Staged | Still illustrated |");
md.push("|---|---|---|---|---|");
for (const [brand, b] of brands) {
  md.push(`| ${brand} | ${b.total} | ${b.live} | ${b.staged} | ${b.total - b.live - b.staged} |`);
}
md.push("");
md.push("## Every product");
md.push("");
let currentBrand = null;
for (const r of rows) {
  if (r.brand !== currentBrand) {
    currentBrand = r.brand;
    md.push("");
    md.push(`### ${r.brand} (${byBrand.get(r.brand).total})`);
    md.push("");
    md.push("| # | Product | Category | Image status | Source | Permission |");
    md.push("|---|---|---|---|---|---|");
  }
  const source = r.source ? `[source](${r.source})` : "—";
  md.push(`| ${r.n} | ${r.name} | ${r.category} | ${r.status} | ${source} | ${r.permission} |`);
}
fs.writeFileSync(path.join(process.cwd(), "docs", "PRODUCT-IMAGE-REGISTER.md"), md.join("\n") + "\n");

console.log(`register: ${rows.length} products | live ${liveN} | staged ${stagedN} | illustration ${illN}`);
console.log(`brands: ${brands.length}`);
console.log("docs/PRODUCT-IMAGE-REGISTER.csv + .md");
