#!/usr/bin/env node
/**
 * Moves approved staged products into the live catalogue.
 *
 * Publishing is gated on an explicit approval file. Without it this script does
 * nothing but report what is waiting, so a proposal can never reach the store by
 * accident.
 *
 *   staging/expansion/APPROVED.json
 *   { "approvedBy": "Tanvi Tapase", "approvedOn": "2026-11-23", "slugs": ["..."] | "*" }
 *
 *   node tools/publish-expansion.mjs            show what would publish
 *   node tools/publish-expansion.mjs --write    append approved rows to src/data/catalogue
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PARTS = "staging/expansion/parts";
const APPROVAL = "staging/expansion/APPROVED.json";
const WRITE = process.argv.includes("--write");

// category slug -> catalogue module file
const FILES = {
  restorative: "restorative", endodontics: "endodontics", prosthodontics: "prosthodontics",
  impression: "impression", instruments: "instruments", burs: "burs", handpieces: "handpieces",
  orthodontics: "orthodontics", implantology: "implantology", "oral-surgery": "oralSurgery",
  periodontics: "periodontics", pedodontics: "pedodontics", laboratory: "laboratory",
  consumables: "consumables", "infection-control": "infectionControl", sterilization: "sterilization",
  equipment: "equipment", imaging: "imaging", preventive: "preventive", whitening: "whitening",
  digital: "digital", anaesthetics: "anaesthetics", "clinic-kits": "clinicKits",
};

if (!fs.existsSync(PARTS)) { console.log("No staged products."); process.exit(0); }
const staged = fs.readdirSync(PARTS).filter((f) => f.endsWith(".json")).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(PARTS, f), "utf8")));

if (!fs.existsSync(APPROVAL)) {
  console.log(`${staged.length} staged product(s) are waiting for approval.`);
  console.log(`Nothing published. Create ${APPROVAL} to authorise a release.`);
  process.exit(0);
}

const approval = JSON.parse(fs.readFileSync(APPROVAL, "utf8"));
const approved = approval.slugs === "*" ? staged : staged.filter((r) => approval.slugs.includes(r.slug));
console.log(`${approved.length} of ${staged.length} staged product(s) approved by ${approval.approvedBy} on ${approval.approvedOn}.`);
if (!WRITE) { console.log("Dry run. Re-run with --write to append them."); process.exit(0); }

const q = (v) => JSON.stringify(v);
const block = (r) => `  {
    slug: ${q(r.slug)},
    name: ${q(r.name)},
    brand: ${q(r.brand)},
    category: ${q(r.category)},
    subcategory: ${q(r.subcategory)},
    packaging: ${r.packaging ? q(r.packaging) : "null"},
    summary: ${q(r.summary)},
    specs: [${r.specs.map((s) => `{ label: ${q(s.label)}, value: ${q(s.value)} }`).join(", ")}],
    price: null,
    visual: ${q(r.visual ?? "composite")},
    image: null,
    source: ${q(r.sourceUrl)},
    verification: { method: ${q(r.sourceType)}, checkedOn: ${q(r.verifiedOn)}, note: ${q(r.verificationNote)} },
  },`;

let added = 0;
for (const [cat, file] of Object.entries(FILES)) {
  const rows = approved.filter((r) => r.category === cat);
  if (!rows.length) continue;
  const p = path.join(ROOT, "src/data/catalogue", `${file}.ts`);
  let s = fs.readFileSync(p, "utf8");
  const idx = s.lastIndexOf("];");
  if (idx === -1) { console.error(`${file}.ts: could not find the array end`); continue; }
  s = s.slice(0, idx) + rows.map(block).join("\n") + "\n" + s.slice(idx);
  fs.writeFileSync(p, s);
  added += rows.length;
  console.log(`  ${file}.ts += ${rows.length}`);
}
console.log(`Added ${added} product(s). Run: npm run images:check && npx next build`);
