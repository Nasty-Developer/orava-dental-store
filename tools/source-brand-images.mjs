#!/usr/bin/env node
/**
 * Source official product photographs from a brand's own storefront.
 *
 *   node tools/source-brand-images.mjs --brand Waldent \
 *     --sitemap "https://www.waldent.com/sitemap_products_1.xml?..." \
 *     [--min-score 0.72] [--apply] [--limit 10]
 *
 * Reads the brand's product sitemap, matches each catalogue product to the
 * brand's own listing by name, and (with --apply) downloads the matching
 * photograph, optimises it and rewrites the catalogue entry.
 *
 * Matching is deliberately strict. A wrong photograph is worse than an
 * illustration, so anything below --min-score is reported as unmatched and the
 * product keeps its placeholder. Every image records the exact page it came
 * from.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { readCatalogue, writeImageField, PRODUCTS_DIR } from "./lib/read-catalogue.mjs";

const argv = process.argv.slice(2);
const flag = (name, def = null) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = argv[i + 1];
  return !v || v.startsWith("--") ? true : v;
};

const brand = flag("brand");
const sitemap = flag("sitemap");
const minScore = Number(flag("min-score", 0.72));
const apply = flag("apply", false) === true;
const limit = Number(flag("limit", 0));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (!brand || !sitemap) {
  console.error('Usage: node tools/source-brand-images.mjs --brand "Waldent" --sitemap "<products sitemap url>" [--apply] [--min-score 0.72]');
  process.exit(1);
}

const UA = "Mozilla/5.0 (compatible; SOMIL-catalogue-bot/1.0)";
const get = async (url, asBuffer = false) => {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "*/*" }, redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return asBuffer ? Buffer.from(await res.arrayBuffer()) : await res.text();
};

// ---------- the brand's own product list ----------
const xml = await get(sitemap);
const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]).map((u) => ({
  page: (u.match(/<loc>([^<]+)<\/loc>/) ?? [])[1],
  images: [...u.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => m[1]),
  title: (u.match(/<image:title>([^<]*)<\/image:title>/) ?? [])[1] ?? "",
})).filter((e) => e.page && e.images.length);

// ---------- matching ----------
const STOP = new Set(["pack","of","the","and","with","for","kit","set","ml","gm","gms","gram","grams","pcs","pc","piece","pieces","no","size","mm","cm","inch","box","bottle","tube","refill","assorted","colours","colors","free","new"]);
const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const singular = (t) => (t.length > 3 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t);
const tokens = (s) =>
  new Set(
    decode(s).toLowerCase().replace(/[^a-z0-9+ ]/g, " ").split(/\s+/)
      .filter((t) => t && !STOP.has(t)).map(singular),
  );

/**
 * Strict match. Every meaningful word in our catalogue name must appear in the
 * brand's own title: "X-Ray Film E-Speed" must not land on "X-Ray Film IOPA",
 * and a combo listing must not land on one component of the combo. Ties are
 * broken by how little extra the brand title carries.
 */
const score = (ours, theirs) => {
  const A = tokens(ours), B = tokens(theirs);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  const covered = inter / A.size;
  if (covered < 1) return covered * 0.6; // never a match, but keeps ranking useful
  const extra = B.size - inter;
  return 1 - Math.min(extra, 8) * 0.01;
};

const products = readCatalogue().filter((p) => p.brand.toLowerCase() === brand.toLowerCase() && !p.image);
const results = [];

for (const p of products) {
  const ranked = entries
    .map((e) => ({ e, sc: score(p.name, e.title.replace(new RegExp(`^${brand}\\s+`, "i"), "")) }))
    .sort((a, b) => b.sc - a.sc);
  results.push({ product: p, best: ranked[0], second: ranked[1] });
}

const ok = results.filter((r) => r.best && r.best.sc >= minScore);
const unsure = results.filter((r) => r.best && r.best.sc < minScore);

console.log(`${brand}: ${products.length} catalogue products without a photo`);
console.log(`  matched >= ${minScore}: ${ok.length}`);
console.log(`  left on illustration: ${unsure.length}\n`);

const report = { brand, sitemap, checked: new Date().toISOString(), matched: [], unmatched: [] };
const toApply = limit ? ok.slice(0, limit) : ok;

for (const r of ok) {
  const e = r.best.e;
  const line = `${r.best.sc.toFixed(2)}  ${r.product.name}  ->  ${e.title}`;
  console.log(line);
  report.matched.push({ slug: r.product.slug, name: r.product.name, source: e.page, title: e.title, score: +r.best.sc.toFixed(3) });
}
for (const r of unsure) {
  report.unmatched.push({
    slug: r.product.slug,
    name: r.product.name,
    closest: r.best ? { title: r.best.e.title, page: r.best.e.page, score: +r.best.sc.toFixed(3) } : null,
  });
}

if (apply) {
  console.log(`\nDownloading ${toApply.length} photographs...`);
  let done = 0;
  for (const r of toApply) {
    const e = r.best.e;
    const slug = r.product.slug;
    const outName = `${slug}.webp`;
    try {
      const src = /cdn\.shopify\.com|\/cdn\/shop\//.test(e.images[0])
        ? `${e.images[0].split("?")[0]}?width=1600`
        : e.images[0];
      const raw = await get(src, true);
      const meta = await sharp(raw).metadata();
      if ((meta.width ?? 0) < 400) {
        console.log(`  skip ${slug}: image only ${meta.width}px wide`);
        continue;
      }
      const pipeline = () =>
        sharp(raw).rotate().flatten({ background: "#ffffff" })
          .resize(1200, 1200, { fit: "contain", background: "#ffffff" });
      let q = 82;
      let buf = await pipeline().webp({ quality: q }).toBuffer();
      while (buf.length > 250 * 1024 && q > 45) {
        q -= 6;
        buf = await pipeline().webp({ quality: q }).toBuffer();
      }
      fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
      fs.writeFileSync(path.join(PRODUCTS_DIR, outName), buf);
      writeImageField(
        r.product,
        `image: {
      src: "/products/${outName}",
      alt: ${JSON.stringify(e.title || r.product.name)},
      source: ${JSON.stringify(e.page)},
      license: ${JSON.stringify(`${brand} official product image, ${new URL(e.page).hostname}, sourced ${new Date().toISOString().slice(0, 10)}; reseller permission requested, not yet confirmed`)},
    }`,
      );
      done++;
      console.log(`  ok ${slug} (${(buf.length / 1024).toFixed(0)} KB, ${meta.width}x${meta.height})`);
    } catch (err) {
      console.log(`  fail ${slug}: ${err.message}`);
    }
    await sleep(700);
  }
  console.log(`\napplied ${done}/${toApply.length}`);
}

fs.mkdirSync(path.join(process.cwd(), "docs", "sourcing"), { recursive: true });
const outFile = path.join(process.cwd(), "docs", "sourcing", `${brand.toLowerCase().replace(/\W+/g, "-")}.json`);
fs.writeFileSync(outFile, JSON.stringify(report, null, 1));
console.log(`\nreport: ${path.relative(process.cwd(), outFile)}`);
