#!/usr/bin/env node
/**
 * Validates a proposed catalogue expansion before anything reaches the store.
 *
 * Nothing in staging/ is published. This script is the gate: it refuses rows
 * that duplicate what we already sell, that were sourced from a competing
 * retailer, that carry an invented price, or that cannot be traced to a page
 * somebody actually opened.
 *
 *   node tools/check-expansion.mjs            validate and write the proposal
 *   node tools/check-expansion.mjs --strict   also fail on any warning
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PARTS = "staging/expansion/parts";

// A competing retailer is a discovery reference, never a source of record.
const RETAILER = /(^|\.)(dentalkart|pinkblue|dentzoo|carakart|amazon|flipkart|indiamart|1mg|netmeds)\./i;
const REQUIRED = ["slug","name","brand","category","subcategory","summary","specs","sourceUrl","sourceType","verifiedOn","verificationNote"];
const PERMISSIONS = new Set(["none","granted","owner-approved"]);

const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const catSlugs = [...read("src/data/categories.ts").matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const catName = Object.fromEntries(
  [...read("src/data/categories.ts").matchAll(/slug:\s*"([^"]+)"[\s\S]{0,400}?name:\s*"([^"]+)"/g)].map((m) => [m[1], m[2]])
);

const existingSlugs = new Set();
const existingNames = new Map();
for (const f of fs.readdirSync(path.join(ROOT, "src/data/catalogue"))) {
  if (!f.endsWith(".ts") || f === "index.ts") continue;
  const s = read(path.join("src/data/catalogue", f));
  for (const m of s.matchAll(/slug:\s*"([^"]+)"/g)) existingSlugs.add(m[1]);
  for (const m of s.matchAll(/name:\s*"([^"]+)"/g)) existingNames.set(norm(m[1]), f.replace(".ts", ""));
}

function norm(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\b(for|with|and|the|of|pack)\b/g, " ").replace(/\s+/g, " ").trim();
}

const errors = [];
const warnings = [];
const rows = [];

if (!fs.existsSync(path.join(ROOT, PARTS))) {
  console.error(`No research parts at ${PARTS}. Nothing to validate.`);
  process.exit(0);
}

for (const f of fs.readdirSync(path.join(ROOT, PARTS)).filter((x) => x.endsWith(".json")).sort()) {
  let data;
  try {
    data = JSON.parse(read(path.join(PARTS, f)));
  } catch (e) {
    errors.push(`${f}: not valid JSON (${e.message})`);
    continue;
  }
  if (!Array.isArray(data)) { errors.push(`${f}: expected a JSON array`); continue; }
  for (const [i, r] of data.entries()) {
    const at = `${f}[${i}] ${r?.slug ?? r?.name ?? "?"}`;
    for (const k of REQUIRED) if (r?.[k] === undefined || r?.[k] === null || r?.[k] === "") errors.push(`${at}: missing ${k}`);
    if (!catSlugs.includes(r?.category)) errors.push(`${at}: unknown category "${r?.category}"`);
    if (!Array.isArray(r?.specs) || r.specs.length < 2) warnings.push(`${at}: fewer than 2 specs`);
    if (r?.price !== null) errors.push(`${at}: price must be null, never guessed`);
    if (!/^https?:\/\//.test(r?.sourceUrl ?? "")) errors.push(`${at}: sourceUrl is not a URL`);
    else if (RETAILER.test(new URL(r.sourceUrl).hostname)) errors.push(`${at}: sourced from a competing retailer (${new URL(r.sourceUrl).hostname})`);
    if (!["manufacturer","authorised-distributor"].includes(r?.sourceType)) warnings.push(`${at}: sourceType "${r?.sourceType}" is unusual`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r?.verifiedOn ?? "")) errors.push(`${at}: verifiedOn is not a date`);
    if (!PERMISSIONS.has(r?.imagePermission ?? "")) errors.push(`${at}: imagePermission must be one of ${[...PERMISSIONS].join(", ")}`);
    if (r?.slug && existingSlugs.has(r.slug)) errors.push(`${at}: slug already exists in the catalogue`);
    if (r?.name && existingNames.has(norm(r.name))) errors.push(`${at}: name duplicates an existing product (${existingNames.get(norm(r.name))})`);
    rows.push({ ...r, _file: f });
  }
}

// duplicates inside the proposal itself
const seen = new Map();
for (const r of rows) {
  const key = norm(r.name ?? "");
  if (seen.has(key)) errors.push(`${r.slug}: duplicate of ${seen.get(key)} inside the proposal`);
  else seen.set(key, r.slug);
}

// ---- proposal document -------------------------------------------------
const byCat = new Map();
for (const r of rows) byCat.set(r.category, (byCat.get(r.category) ?? 0) + 1);
const existingByCat = {};
for (const f of fs.readdirSync(path.join(ROOT, "src/data/catalogue"))) {
  if (!f.endsWith(".ts") || f === "index.ts") continue;
  existingByCat[f.replace(".ts", "")] = (read(path.join("src/data/catalogue", f)).match(/slug:\s*"/g) ?? []).length;
}
const domains = {};
for (const r of rows) { try { const h = new URL(r.sourceUrl).hostname.replace(/^www\./, ""); domains[h] = (domains[h] ?? 0) + 1; } catch {} }
const perms = {};
for (const r of rows) perms[r.imagePermission] = (perms[r.imagePermission] ?? 0) + 1;

const clean = rows.filter((r) => !errors.some((e) => e.includes(r.slug)));
const lines = [];
lines.push("# Catalogue expansion, tranche 1");
lines.push("");
lines.push("Generated by `node tools/check-expansion.mjs` from `staging/expansion/parts/`.");
lines.push("**Nothing in this document is live.** Staged rows are published only after the owner approves them.");
lines.push("");
lines.push(`- Proposed products: **${rows.length}**`);
lines.push(`- Passing every gate: **${clean.length}**`);
lines.push(`- Existing catalogue: **${Object.values(existingByCat).reduce((a, b) => a + b, 0)}** products`);
lines.push(`- Blocking problems: **${errors.length}**, warnings: **${warnings.length}**`);
lines.push("");
lines.push("## What the gate enforces");
lines.push("");
lines.push("- no slug or name that already exists in the catalogue");
lines.push("- no row sourced from a competing retailer (dentalkart, pinkblue, dentzoo, carakart, marketplaces)");
lines.push("- no price: every row is `null` and will show *Price on request*");
lines.push("- every row carries the exact page a researcher opened and the date it was checked");
lines.push("- an image permission state on every row");
lines.push("");
lines.push("## Proposed products by clinical area");
lines.push("");
lines.push("| Area | Slug | Existing | Proposed | After |");
lines.push("| --- | --- | --- | --- | --- |");
for (const slug of catSlugs) {
  const ex = existingByCat[Object.entries(existingByCat).find(([, v]) => true) && Object.keys(existingByCat).find((k) => k.toLowerCase().replace(/[^a-z]/g, "") === slug.replace(/[^a-z]/g, ""))] ?? 0;
  const prop = byCat.get(slug) ?? 0;
  lines.push(`| ${catName[slug] ?? slug} | ${slug} | ${ex} | ${prop} | ${ex + prop} |`);
}
lines.push("");
lines.push("## Where the facts came from");
lines.push("");
lines.push("| Source domain | Rows |");
lines.push("| --- | --- |");
for (const [d, n] of Object.entries(domains).sort((a, b) => b[1] - a[1])) lines.push(`| ${d} | ${n} |`);
lines.push("");
lines.push("## Image permission");
lines.push("");
for (const [p, n] of Object.entries(perms)) lines.push(`- \`${p}\`: ${n}`);
lines.push("");
lines.push("Rows marked `none` have no photograph and would render the drawn placeholder. No photograph is attached without recorded permission.");
lines.push("");
if (errors.length) {
  lines.push("## Blocking problems");
  lines.push("");
  for (const e of errors) lines.push(`- ${e}`);
  lines.push("");
}
if (warnings.length) {
  lines.push("## Warnings");
  lines.push("");
  for (const w of warnings.slice(0, 40)) lines.push(`- ${w}`);
  lines.push("");
}

fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync("docs/EXPANSION-PROPOSAL.md", lines.join("\n"));

const csv = ["slug,name,brand,category,subcategory,packaging,price,sourceUrl,sourceType,verifiedOn,imagePermission"];
const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
for (const r of rows) csv.push([r.slug,r.name,r.brand,r.category,r.subcategory,r.packaging,r.price,r.sourceUrl,r.sourceType,r.verifiedOn,r.imagePermission].map(esc).join(","));
fs.writeFileSync("docs/expansion-tranche-1.csv", csv.join("\n"));

console.log(`proposed ${rows.length} | clean ${clean.length} | existing ${existingSlugs.size}`);
console.log(`errors ${errors.length} | warnings ${warnings.length}`);
for (const e of errors.slice(0, 15)) console.log("  ERROR " + e);
for (const w of warnings.slice(0, 8)) console.log("  warn  " + w);
console.log("wrote docs/EXPANSION-PROPOSAL.md and docs/expansion-tranche-1.csv");
if (errors.length || (process.argv.includes("--strict") && warnings.length)) process.exit(1);
