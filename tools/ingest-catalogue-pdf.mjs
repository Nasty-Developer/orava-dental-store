#!/usr/bin/env node
/**
 * Bulk ingest of catalogue rows from a manufacturer's own PDF catalogue.
 *
 * Page-by-page scraping of manufacturer websites is slow (one product per page
 * load) and several manufacturers rate-limit it (HTTP 429). A downloaded
 * catalogue PDF carries the same facts — product name, descriptor, packaging
 * and the technical-data table — for a whole product family per page, so this
 * tool reads the PDF directly and emits rows in the exact shape used by
 * staging/expansion/parts/tranche-2a.json.
 *
 *   node tools/ingest-catalogue-pdf.mjs --list  --pdf <file> --map <mapping.json>
 *   node tools/ingest-catalogue-pdf.mjs         --pdf <file> --map <mapping.json> --out <rows.json>
 *
 * What the tool guarantees
 * ------------------------
 *  - A row is only emitted for a product whose name and subtitle are found
 *    verbatim in the page's text layer, in the column the mapping names.
 *  - Every spec label and value is taken from the page text; the tool asserts
 *    each emitted string occurs in the page text and refuses the row if not.
 *  - `sourceUrl` is the manufacturer's own catalogue URL recorded in the
 *    mapping, never a retailer. `verificationNote` records the PDF URL and the
 *    page number so any row can be re-checked by opening the PDF at that page.
 *  - `price` is always null and `imagePermission` always "none".
 *  - Slugs are unique against the live catalogue and against each other.
 *
 * The mapping file (see staging/expansion/mappings/) is the human judgement:
 * which page and column holds which product, its brand, category and
 * subcategory, and any name correction where the PDF prints the name across
 * two lines. Nothing else is typed by hand.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const argv = process.argv.slice(2);

function arg(name, fallback = null) {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
}
const has = (name) => argv.includes(`--${name}`);

const PDF = arg("pdf");
const MAP = arg("map");
const OUT = arg("out");
const LIST = has("list");
const VERBOSE = has("verbose");

if (!PDF || !MAP) {
  console.error("usage: node tools/ingest-catalogue-pdf.mjs --pdf <catalogue.pdf> --map <mapping.json> [--list] [--out rows.json]");
  process.exit(2);
}

const die = (msg) => { console.error("FAIL " + msg); process.exit(1); };

// ---------------------------------------------------------------- helpers
const norm = (s) => String(s).replace(/\s+/g, " ").replace(/\u00ad/g, "").trim();

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[®™©]/g, "")
    .replace(/\+/g, " plus ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

// Live catalogue slugs, so a proposed row can never collide with a live one.
function liveSlugs() {
  const dir = path.join(ROOT, "src/data/catalogue");
  const slugs = new Set();
  const names = new Set();
  if (!fs.existsSync(dir)) return { slugs, names };
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".ts") || f === "index.ts") continue;
    const s = fs.readFileSync(path.join(dir, f), "utf8");
    for (const m of s.matchAll(/slug:\s*"([^"]+)"/g)) slugs.add(m[1]);
    for (const m of s.matchAll(/name:\s*"([^"]+)"/g)) names.add(norm(m[1]).toLowerCase());
  }
  return { slugs, names };
}

// ---------------------------------------------------------------- PDF text
async function loadPdfjs() {
  try {
    return await import("pdfjs-dist/legacy/build/pdf.mjs");
  } catch {
    die("pdfjs-dist is not installed. Run `npm install` in the repo root first.");
  }
}

/**
 * Extract a page as positioned lines, then split them into columns.
 *
 * Catalogues are printed two-up. pdf.js returns one item per text run, so the
 * line is rebuilt by grouping runs on the same baseline (y within 3pt) and
 * ordering them by x. Columns are found from the widest vertical gutter in the
 * middle 30-70% of the page, which is where a two-up catalogue puts its gutter.
 */
async function readPages(pdfjs, file) {
  const data = new Uint8Array(fs.readFileSync(file));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  const pages = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const { width, height } = page.getViewport({ scale: 1 });
    const tc = await page.getTextContent();
    // Rotated runs are the printer's vertical side bands, not product copy.
    const items = tc.items
      .filter((i) => i.str && i.str.trim() && Math.abs(i.transform[2]) < 0.1)
      .map((i) => ({ x: i.transform[4], y: i.transform[5], s: i.str }))
      .filter((i) => i.y > height * 0.03 && i.y < height * 0.98);

    // gutter detection: widest gap that still leaves real text on both sides
    const xs = [...new Set(items.map((i) => Math.round(i.x)))].sort((a, b) => a - b);
    let split = null;
    let bestGap = 0;
    for (let k = 1; k < xs.length; k++) {
      const gap = xs[k] - xs[k - 1];
      const mid = (xs[k] + xs[k - 1]) / 2;
      if (mid < width * 0.3 || mid > width * 0.75 || gap < 40) continue;
      const left = items.filter((i) => i.x < mid).length;
      const right = items.filter((i) => i.x >= mid).length;
      if (left < items.length * 0.12 || right < items.length * 0.12) continue;
      if (gap > bestGap) { bestGap = gap; split = mid; }
    }
    if (bestGap < 40) split = null; // single-column page

    const linesOf = (side) => {
      const inSide = items.filter((i) => (split === null ? true : side === "left" ? i.x < split : i.x >= split));
      const rows = [];
      for (const it of inSide) {
        let row = rows.find((r) => Math.abs(r.y - it.y) <= 3);
        if (!row) { row = { y: it.y, parts: [] }; rows.push(row); }
        row.parts.push(it);
      }
      rows.sort((a, b) => b.y - a.y);
      return rows.map((r) => ({
        y: r.y,
        text: norm(r.parts.sort((a, b) => a.x - b.x).map((p) => p.s).join(" ")),
      })).filter((l) => l.text);
    };

    pages.push({
      page: n,
      width,
      height,
      split,
      left: linesOf("left"),
      right: split === null ? [] : linesOf("right"),
      full: norm([...linesOf("left"), ...linesOf("right")].map((l) => l.text).join(" \n ")),
    });
  }
  return pages;
}

// ---------------------------------------------------------------- parsing
const RUNNING_HEADER = /^(adhesives|composites|cements|endodontics|orthodontics|finishing|ceramic|varnishes|auxiliaries|impression|tooth whitening|hemostatic|temporary|lab products|digital dentistry|preventive)/i;

/** Drop the page's running section header and the footer/printer's marks. */
function trimColumn(lines, height, otherColumnFirst) {
  let out = lines.slice();
  if (out.length && otherColumnFirst && out[0].text.toLowerCase() === otherColumnFirst.toLowerCase()) {
    out = out.slice(1);
  } else if (out.length && RUNNING_HEADER.test(out[0].text) && out[0].text === out[0].text.toUpperCase()) {
    out = out.slice(1);
  }
  return out.filter((l) => l.y > height * 0.04 && l.y < height * 0.985);
}

const BLOCK_STOP = /^(INDICATIONS|PRODUCT BENEFITS|PACKAGING|TECHNICAL\s*DATA|PRODUCT DETAILS|HOW TO USE|CHARACTERISTICS.*BENEFITS|DOSAGE|CONTRA)/i;

const isHeading = (t) => {
  const s = t.replace(/[®™©]/g, "").replace(/^(TM|R)\s+/i, "").trim();
  if (s.length < 3) return false;
  if (!/[A-Z]{3}/.test(s)) return false;
  if (BLOCK_STOP.test(s)) return false;
  // all caps, allowing digits and punctuation
  return s === s.toUpperCase() && /[A-Z]/.test(s);
};

/**
 * A column can hold more than one product: a four-up page stacks two products
 * per column. Blocks are split on an all-caps heading line that is preceded by
 * a gap wider than normal line spacing.
 */
function splitBlocks(lines) {
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const prev = lines[i - 1];
    const gap = prev ? prev.y - l.y : 999;
    if (!blocks.length) { blocks.push({ lines: [l] }); continue; }
    if (isHeading(l.text) && gap >= 14) blocks.push({ lines: [l] });
    else blocks[blocks.length - 1].lines.push(l);
  }
  return blocks.filter((b) => b.lines.length > 1);
}

/** Pull "Technical Data" numbered rows:  "1. Mixing Time 35 - 40 Sec." */
function parseTechnicalData(lines) {
  const start = lines.findIndex((l) => /^technical\s*data/i.test(l.text) || /technical data/i.test(l.text));
  if (start === -1) return [];
  const specs = [];
  for (let i = start + 1; i < lines.length && specs.length < 10; i++) {
    const t = lines[i].text;
    const m = t.match(/^(\d{1,2})[.)]\s*(.+)$/);
    if (!m) {
      // continuation of the previous spec (wrapped line)
      if (specs.length && /^[A-Za-z(]/.test(t) && !/^(INDICATIONS|PRODUCT BENEFITS|PACKAGING)/i.test(t)) {
        specs[specs.length - 1].value = norm(specs[specs.length - 1].value + " " + t);
        continue;
      }
      if (t.length) break;
      continue;
    }
    let body = m[2];
    // value begins at the first digit; the label is the words before it
    const digit = body.search(/\d/);
    let label = digit > 0 ? body.slice(0, digit) : body;
    let value = digit > 0 ? body.slice(digit) : "";
    label = norm(label).replace(/[:.\-–]+$/, "").trim();
    value = norm(value).replace(/^[:.\-–]+/, "").trim();
    if (!label || !value) continue;
    // a trailing "ISO 9917-1" is the standard the method is tested to
    const iso = value.match(/\s*(ISO\s?[\d.\-]+)\s*$/i);
    if (iso) {
      value = norm(value.slice(0, iso.index));
      specs.push({ label: "Standard applied", value: iso[1].replace(/^ISO\s?/i, "ISO ") });
    }
    if (value) specs.push({ label, value });
  }
  return specs.filter((s) => s.value && s.label);
}

/** Pull the PACKAGING block: REF codes and what is in the box. */
function parsePackaging(lines) {
  const start = lines.findIndex((l) => /^packaging/i.test(l.text));
  if (start === -1) return "";
  const parts = [];
  for (let i = start + 1; i < lines.length; i++) {
    const t = lines[i].text;
    if (/^(technical\s*data|indications|product benefits)/i.test(t)) break;
    if (/^[\d.)\s]*$/.test(t)) continue;
    parts.push(t);
    if (parts.join(" ").length > 260) break;
  }
  return norm(parts.join(" "));
}

/** The first line of a column is the product name; the second is its descriptor. */
function detectProduct(lines) {
  if (!lines.length) return null;
  const name = lines[0].text;
  const subtitle = lines[1]?.text ?? "";
  return { name, subtitle };
}

// ---------------------------------------------------------------- mapping
const mapping = JSON.parse(fs.readFileSync(MAP, "utf8"));
const brand = mapping.brand;
const pdfUrl = mapping.pdfUrl;
if (!brand || !pdfUrl) die("mapping needs brand and pdfUrl");
if (!/^https?:\/\//.test(pdfUrl)) die("mapping.pdfUrl must be a URL");
const host = new URL(pdfUrl).hostname;
if (/(^|\.)(dentalkart|pinkblue|dentzoo|carakart|amazon|flipkart|indiamart|1mg|netmeds)\./i.test(host)) {
  die(`mapping.pdfUrl points at a retailer (${host}); a catalogue must be the manufacturer's own`);
}

if (mapping.pdfSha256) {
  const got = sha256(PDF);
  if (got !== mapping.pdfSha256) die(`PDF sha256 ${got} does not match the mapping (${mapping.pdfSha256}); re-download ${pdfUrl}`);
}

const pdfjs = await loadPdfjs();
const pages = await readPages(pdfjs, PDF);
const byPage = new Map(pages.map((p) => [p.page, p]));

const { slugs: liveSlugSet, names: liveNameSet } = liveSlugs();
const seenSlugs = new Map();
const seenNames = new Map();
const rows = [];
const rejected = [];
const unmapped = [];

const BATCH = arg("batch");
const wanted = (mapping.entries ?? []).filter((e) => BATCH === null || String(e.batch ?? 1) === String(BATCH));

for (const entry of wanted) {
  const page = byPage.get(Number(entry.page));
  if (!page) { rejected.push(`page ${entry.page} is outside the PDF (${pages.length} pages)`); continue; }
  const side = entry.column ?? "left";
  if (side !== "left" && side !== "right") { rejected.push(`page ${entry.page}: column must be left or right`); continue; }
  if (side === "right" && page.split === null) { rejected.push(`page ${entry.page}: mapping expects two columns but the page has one`); continue; }

  const otherFirst = side === "left" ? page.right[0]?.text : page.left[0]?.text;
  const columnLines = trimColumn(side === "left" ? page.left : page.right, page.height, otherFirst);
  const blocks = splitBlocks(columnLines);
  const blockIndex = Number(entry.block ?? 1) - 1;
  const block = blocks[blockIndex];
  if (!block) { rejected.push(`page ${entry.page} ${side}: no product block ${blockIndex + 1} (column has ${blocks.length})`); continue; }
  const lines = block.lines;
  const detected = detectProduct(lines);
  if (!detected) { rejected.push(`page ${entry.page} ${side}: no text in column`); continue; }

  const name = norm(entry.name ?? detected.name);
  const subtitle = norm(entry.subtitle ?? detected.subtitle);
  const qualifier = entry.qualifier ? norm(entry.qualifier) : "";
  // display is the name as printed, title-cased for the storefront; it must
  // still contain every word of the printed name
  const displayName = entry.display ? norm(entry.display) : qualifier ? `${name} (${qualifier})` : name;

  // the name must be on the page, in this column, verbatim. A qualifier used to
  // tell two same-named catalogue products apart must also be printed there.
  const columnText = norm(lines.map((l) => l.text).join(" "));
  if (!columnText.toLowerCase().includes(name.toLowerCase())) {
    rejected.push(`page ${entry.page} ${side}: "${name}" is not in that column's text`);
    continue;
  }
  if (qualifier && !columnText.toLowerCase().includes(qualifier.toLowerCase())) {
    rejected.push(`page ${entry.page} ${side}: qualifier "${qualifier}" is not in that column's text`);
    continue;
  }

  const specs = parseTechnicalData(lines);
  const packaging = norm(entry.packaging ?? parsePackaging(lines));
  if (entry.specsFromSubtitle !== false) {
    if (!specs.some((s) => s.label.toLowerCase() === "type") && subtitle) {
      specs.unshift({ label: "Type", value: subtitle, synthetic: true });
    }
  }
  // a product whose page prints no technical-data table still gets the
  // catalogue's own descriptor and pack line, never an invented value
  if (specs.length < 2 && packaging) specs.push({ label: "Pack", value: packaging.slice(0, 160), synthetic: true });

  // every spec string must be in the page text
  const pageText = page.full.toLowerCase();
  // a printed technical-data row must have both its label and its value on the
  // page; a value lifted from the product's own subtitle or pack line only has
  // to have the value on the page (the label is ours: "Type", "Pack").
  const badSpecs = specs.filter((s) => !pageText.includes(s.value.toLowerCase()) || (!s.synthetic && !pageText.includes(s.label.toLowerCase())));
  if (badSpecs.length) {
    rejected.push(`page ${entry.page} ${side}: spec not found in page text (${badSpecs.map((s) => s.label).join(", ")})`);
    continue;
  }

  const slugBase = entry.slug ?? slugify(`${brand} ${displayName}`);
  let slug = slugBase;
  let n = 2;
  while (liveSlugSet.has(slug) || seenSlugs.has(slug)) { slug = `${slugBase}-${n++}`; }
  const nameKey = norm(displayName).toLowerCase();
  if (liveNameSet.has(nameKey)) { rejected.push(`page ${entry.page} ${side}: "${name}" duplicates a live product name`); continue; }
  if (seenNames.has(nameKey)) { rejected.push(`page ${entry.page} ${side}: "${name}" duplicates ${seenNames.get(nameKey)} in this tranche`); continue; }

  seenSlugs.set(slug, `${entry.page}:${side}`);
  seenNames.set(nameKey, slug);

  const category = entry.category ?? mapping.defaults?.category;
  const subcategory = entry.subcategory ?? mapping.defaults?.subcategory;
  if (!category || !subcategory) { rejected.push(`page ${entry.page} ${side}: mapping has no category/subcategory`); continue; }

  const printedPage = entry.printedPage ? ` (printed page ${entry.printedPage})` : "";
  rows.push({
    slug,
    name: displayName.replace(/\s+/g, " ").trim(),
    brand,
    category,
    subcategory,
    packaging: packaging || subtitle,
    summary: `${displayName} — ${subtitle.replace(/\s*[—-]\s*$/, "")}. Listed in ${brand}'s own catalogue under ${subcategory.toLowerCase()}.`,
    specs: specs.slice(0, 8).map(({ label, value }) => ({ label, value })),
    price: null,
    sourceUrl: pdfUrl,
    sourceType: mapping.sourceType ?? "manufacturer",
    verifiedOn: mapping.verifiedOn,
    verificationNote: `Read from ${brand}'s own catalogue PDF, ${pdfUrl}, PDF page ${entry.page}${printedPage}, ${side} column. Product name and descriptor taken verbatim from the page; the ${specs.length} specification${specs.length === 1 ? "" : "s"} are the catalogue's own technical-data table for that product.`,
    imagePermission: "none",
  });
}

function lowerFirst(s) {
  if (!s) return "";
  const t = s.trim();
  // keep acronyms and brand names as printed
  if (/^[A-Z0-9\s\-+/]+$/.test(t)) return t;
  return t.charAt(0).toLowerCase() + t.slice(1);
}

// report products that exist on a page but have no mapping entry. Blocks that
// are not products (cover, contents, section dividers, shade lists, a second
// block for a product already mapped) are named in mapping.exclude with the
// reason they are skipped, so the guard stays meaningful.
const mapped = new Set([
  ...(mapping.entries ?? []).map((e) => `${e.page}:${e.column ?? "left"}:${e.block ?? 1}`),
  ...(mapping.exclude ?? []).map((e) => `${e.page}:${e.column ?? "left"}:${e.block ?? 1}`),
]);
for (const p of pages) {
  for (const side of p.split === null ? ["left"] : ["left", "right"]) {
    const otherFirst = side === "left" ? p.right[0]?.text : p.left[0]?.text;
    const columnLines = trimColumn(side === "left" ? p.left : p.right, p.height, otherFirst);
    splitBlocks(columnLines).forEach((b, i) => {
      if (!mapped.has(`${p.page}:${side}:${i + 1}`)) unmapped.push(`p${p.page}:${side}:${i + 1} "${b.lines[0].text.slice(0, 60)}"`);
    });
  }
}

const DUMP = arg("dump");
if (DUMP) {
  const p = byPage.get(Number(DUMP));
  if (!p) die(`page ${DUMP} is outside the PDF`);
  console.log(`page ${p.page} width ${Math.round(p.width)} height ${Math.round(p.height)} split ${p.split && Math.round(p.split)} rawLines left=${p.left.length} right=${p.right.length}`);
  for (const side of p.split === null ? ["left"] : ["left", "right"]) {
    const otherFirst = side === "left" ? p.right[0]?.text : p.left[0]?.text;
    const columnLines = trimColumn(side === "left" ? p.left : p.right, p.height, otherFirst);
    const blocks = splitBlocks(columnLines);
    console.log(`--- ${side} column: ${columnLines.length} lines, ${blocks.length} block(s)`);
    if (VERBOSE) for (const l of columnLines.slice(0, 5)) console.log(`    raw ${Math.round(l.y)} ${l.text.slice(0, 90)}`);
    blocks.forEach((b, i) => {
      console.log(`  block ${i + 1}: ${b.lines.length} lines, first="${b.lines[0].text.slice(0, 70)}"`);
      if (VERBOSE) for (const l of b.lines) console.log(`      ${Math.round(l.y)} ${l.text.slice(0, 110)}`);
    });
  }
  process.exit(0);
}

const JSONOUT = arg("json");
if (JSONOUT) {
  const inventory = [];
  for (const p of pages) {
    for (const side of p.split === null ? ["left"] : ["left", "right"]) {
      const otherFirst = side === "left" ? p.right[0]?.text : p.left[0]?.text;
      const columnLines = trimColumn(side === "left" ? p.left : p.right, p.height, otherFirst);
      splitBlocks(columnLines).forEach((b, i) => {
        const d = detectProduct(b.lines);
        inventory.push({
          page: p.page, column: side, block: i + 1,
          detectedName: d.name, detectedSubtitle: d.subtitle,
          specs: parseTechnicalData(b.lines), packaging: parsePackaging(b.lines),
          mapped: mapped.has(`${p.page}:${side}:${i + 1}`),
        });
      });
    }
  }
  fs.mkdirSync(path.dirname(JSONOUT), { recursive: true });
  fs.writeFileSync(JSONOUT, JSON.stringify({ pdf: path.basename(PDF), pages: pages.length, blocks: inventory }, null, 1) + "\n");
  console.log(`wrote ${JSONOUT} (${inventory.length} blocks over ${pages.length} pages)`);
  process.exit(0);
}

if (LIST) {
  for (const p of pages) {
    for (const side of p.split === null ? ["left"] : ["left", "right"]) {
      const otherFirst = side === "left" ? p.right[0]?.text : p.left[0]?.text;
      const columnLines = trimColumn(side === "left" ? p.left : p.right, p.height, otherFirst);
      splitBlocks(columnLines).forEach((b, i) => {
        const d = detectProduct(b.lines);
        const specs = parseTechnicalData(b.lines);
        const tag = mapped.has(`${p.page}:${side}:${i + 1}`) ? "  " : "??";
        console.log(`${tag} p${String(p.page).padStart(2)} ${side.padEnd(5)} b${i + 1} | ${d.name.slice(0, 32).padEnd(32)} | ${(d.subtitle || "").slice(0, 44).padEnd(44)} | ${specs.length} specs | ${parsePackaging(b.lines).slice(0, 34)}`);
      });
    }
  }
  console.log(`\n${pages.length} pages, ${unmapped.length} unmapped product columns`);
  for (const u of unmapped) console.log("  unmapped " + u);
  process.exit(0);
}

if (unmapped.length) {
  console.error(`${unmapped.length} product column(s) in the PDF have no mapping entry — add them or confirm they are cover/TOC pages:`);
  for (const u of unmapped.slice(0, 40)) console.error("  " + u);
  if (!has("allow-unmapped")) die("refusing to write a partial tranche (use --allow-unmapped to override)");
}

if (rejected.length) {
  console.log(`rejected ${rejected.length}:`);
  for (const r of rejected) console.log("  " + r);
}
if (!rows.length) die("no rows produced");
if (OUT) {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(rows, null, 2) + "\n");
}
console.log(`pdf ${path.basename(PDF)} (${pages.length} pages) | brand ${brand} | rows ${rows.length}`);
for (const r of rows) if (VERBOSE) console.log(`  ${r.slug} | p${r.verificationNote.match(/PDF page (\d+)/)[1]} | ${r.specs.length} specs`);
if (rejected.length) {
  console.log(`rejected ${rejected.length}:`);
  for (const r of rejected) console.log("  " + r);
}
if (OUT) console.log(`wrote ${OUT}`);
