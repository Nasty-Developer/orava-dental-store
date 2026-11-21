#!/usr/bin/env node
/**
 * Writes the media-kit permission requests, one per brand, from the live
 * catalogue so the product counts and example SKUs are always accurate.
 *
 *   node tools/media-kit-drafts.mjs
 *
 * Nothing is sent. The output is docs/OUTREACH-MEDIA-KITS.md for Tanvi to read
 * and approve; sending happens only after she has seen the exact drafts.
 */
import fs from "node:fs";
import path from "node:path";
import { readCatalogue } from "./lib/read-catalogue.mjs";

const CONTACTS = {
  Waldent: { email: "sales@waldent.com", page: "https://www.waldent.com/pages/contact-us", phone: "+91 94033 23232", verified: true },
  GDC: { email: "info@gdcdental.com", page: "https://www.gdcdental.com/contact.php", phone: "+91 70095 45466", verified: true },
  Woodpecker: { email: "mkt@glwoodpecker.com", page: "https://www.glwoodpecker.com", phone: "", verified: true, note: "Guilin head office; ask them to route to the India distributor" },
  Ammdent: { email: "ammdent@hotmail.com", page: "https://ammdent.com", phone: "+91 172 5090343", verified: true },
  Maarc: { email: "sales@shivaproducts.net", page: "https://maarcdental.com/contact/", phone: "+91 99678 06543", verified: true },
  Oracraft: { email: "", page: "", phone: "", verified: false, note: "contact details not confirmed yet, needs a manual look at oracraft.com" },
  Labodent: { email: "", page: "", phone: "", verified: false, note: "several unrelated businesses use this name, needs confirming before any email" },
};

const SENDER = {
  name: "Tanvi Tapase",
  business: "SOMIL Dental Products",
  site: "https://somil-dental-products.vercel.app",
  email: "tanudevworks@gmail.com",
  city: "Mumbai, Maharashtra",
};

const products = readCatalogue();
const byBrand = new Map();
for (const p of products) {
  if (!byBrand.has(p.brand)) byBrand.set(p.brand, []);
  byBrand.get(p.brand).push(p);
}

const order = [...byBrand.entries()].sort((a, b) => b[1].length - a[1].length);
const brandsWithContact = order.filter(([b]) => CONTACTS[b]);

const md = [];
md.push("# Media-kit permission requests");
md.push("");
md.push(`Prepared ${new Date().toISOString().slice(0, 10)}. **None of these have been sent.** Tanvi approves the exact wording before anything leaves the mailbox.`);
md.push("");
md.push("## What is being asked for");
md.push("");
md.push("1. Written confirmation that SOMIL Dental Products may use the brand's product photography on its store and in product listings.");
md.push("2. The dealer media kit, or the specific image files for the products we list.");
md.push("3. Any brand guidelines: image size, background, cropping, logo use.");
md.push("");
md.push("## Status");
md.push("");
md.push("| Brand | Products listed | Contact | Verified | Draft |");
md.push("|---|---|---|---|---|");
for (const [brand, items] of order.slice(0, 20)) {
  const c = CONTACTS[brand];
  md.push(
    `| ${brand} | ${items.length} | ${c?.email ? c.email : "not confirmed"} | ${c?.verified ? "yes" : "no"} | ${c ? "ready" : "needs contact research"} |`,
  );
}
md.push("");
md.push(`The remaining ${order.length - brandsWithContact.length} brands have no confirmed contact yet.`);
md.push("");

for (const [brand, items] of order) {
  const c = CONTACTS[brand];
  if (!c) continue;
  const examples = items.slice(0, 3).map((p) => p.name);
  const more = items.length > examples.length ? ` and ${items.length - examples.length} more` : "";
  const subject = `Permission to use ${brand} product images on our dental supplies store`;
  const body = [
    `Hello ${brand} team,`,
    ``,
    `I run ${SENDER.business}, an online dental supplies store based in ${SENDER.city} (${SENDER.site}).`,
    ``,
    `We list ${items.length} ${brand} products, including ${examples.join(", ")}${more}. Every listing currently shows a plain illustration, because we do not publish a manufacturer's photograph without written permission.`,
    ``,
    `We would like to replace those illustrations with your official product photography. Could you please:`,
    ``,
    `1. Confirm in writing that ${SENDER.business} may use ${brand} product images on our store and in our product listings;`,
    `2. Share your dealer media kit, or the image files for the ${items.length} products we list;`,
    `3. Let us know any brand guidelines we should follow (image size, background, cropping, logo use).`,
    ``,
    `A download link is perfect if that is easier than attachments. I am happy to send the full product list as a spreadsheet.`,
    ``,
    `Thank you,`,
    SENDER.name,
    SENDER.business,
    `${SENDER.email}`,
  ].join("\n");

  md.push(`## ${brand}`);
  md.push("");
  md.push(`**To:** ${c.email}${c.phone ? ` · **Phone:** ${c.phone}` : ""}`);
  md.push("");
  md.push(`**Contact page:** ${c.page}`);
  if (c.note) md.push("");
  if (c.note) md.push(`> ${c.note}`);
  md.push("");
  md.push(`**Subject:** ${subject}`);
  md.push("");
  md.push("```text");
  md.push(body);
  md.push("```");
  md.push("");
}

fs.writeFileSync(path.join(process.cwd(), "docs", "OUTREACH-MEDIA-KITS.md"), md.join("\n") + "\n");
console.log(`drafts written for ${brandsWithContact.length} brands: ${brandsWithContact.map(([b]) => b).join(", ")}`);
console.log(`${order.length - brandsWithContact.length} brands still need a verified contact.`);
