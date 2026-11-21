#!/usr/bin/env node
/**
 * Source official product photographs from any brand site, whatever it runs on.
 *
 *   node tools/source-photos.mjs --brand "Ammdent" --domain ammdent.com --apply
 *
 * Discovers the brand's own product pages (Shopify product sitemap, WooCommerce
 * sitemaps, or a crawl of the site's sitemap), matches each catalogue product to
 * a listing by name with the strict matcher, and downloads the photograph.
 *
 * Nothing is published. Photographs land in staging/product-photos/<brand>/ with
 * a manifest recording the exact source page, because a brand's photograph needs
 * written permission before it goes live (see tools/photo-permissions.mjs).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { readCatalogue } from "./lib/read-catalogue.mjs";
import { score, decode, brandPrefix } from "./lib/match.mjs";

const argv = process.argv.slice(2);
const flag = (name, def = null) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = argv[i + 1];
  return !v || v.startsWith("--") ? true : v;
};

const brand = flag("brand");
const domain = String(flag("domain", "")).replace(/^https?:\/\//, "").replace(/\/$/, "");
const minScore = Number(flag("min-score", 0.9));
const apply = flag("apply", false) === true;
const limit = Number(flag("limit", 0));
const maxPages = Number(flag("max-pages", 120));
if (!brand || !domain) {
  console.error('Usage: node tools/source-photos.mjs --brand "Ammdent" --domain ammdent.com [--apply] [--limit n]');
  process.exit(1);
}

const UA = "Mozilla/5.0 (compatible; SOMIL-catalogue-bot/1.0; +https://somil-dental-products.vercel.app)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = async (url, asBuffer = false) => {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "*/*" },
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return asBuffer ? Buffer.from(await res.arrayBuffer()) : await res.text();
};
const origin = `https://${domain}`;
const STAGING = path.join(process.cwd(), "staging", "product-photos");
const MANIFEST_DIR = path.join(process.cwd(), "docs", "sourcing", "pending");
const brandSlug = (b) => b.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ---------- discovery ----------
const parseSitemap = (xml) => ({
  children: [...xml.matchAll(/<sitemap>[\s\S]*?<loc>([^<]+)<\/loc>/g)].map((m) => m[1]),
  urls: [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
    const u = m[1];
    return {
      page: (u.match(/<loc>([^<]+)<\/loc>/) ?? [])[1],
      images: [...u.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((x) => x[1]),
      title: decode((u.match(/<image:title>([^<]*)<\/image:title>/) ?? [])[1] ?? ""),
    };
  }),
});

async function discover() {
  const cacheDir = path.join(process.cwd(), ".cache", "sitemaps");
  fs.mkdirSync(cacheDir, { recursive: true });
  const cacheFile = path.join(cacheDir, `${domain.replace(/[^a-z0-9]+/gi, "-")}.json`);
  if (fs.existsSync(cacheFile) && !flag("fresh", false)) {
    const cached = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
    if (Date.now() - cached.at < 7 * 864e5) return cached.entries;
  }

  const pages = new Map(); // url -> {title, images}
  const seenMaps = new Set();
  const SKIP = /\/(blog|news|cart|checkout|account|policy|privacy|terms|refund|shipping|faq|about|contact|author|tag|wp-json|feed|search)(\/|\?|$)/i;
  const PRODUCTISH = /\/(products?|shop|p)\/|product|instrument|material/i;

  const collect = async (url, depth = 0) => {
    if (depth > 2 || seenMaps.has(url)) return;
    seenMaps.add(url);
    let xml;
    try {
      xml = await get(url);
    } catch {
      return;
    }
    const parsed = parseSitemap(xml);
    for (const u of parsed.urls) {
      if (!u.page || SKIP.test(u.page)) continue;
      const prev = pages.get(u.page) ?? { title: "", images: [] };
      pages.set(u.page, { title: u.title || prev.title, images: u.images.length ? u.images : prev.images });
    }
    for (const child of parsed.children) {
      if (/product|shop|page|post/i.test(child) || depth === 0) await collect(child, depth + 1);
    }
  };

  // different platforms hide the product list in different places
  for (const root of ["/sitemap.xml", "/sitemap_index.xml", "/wp-sitemap.xml"]) {
    await collect(origin + root);
  }
  for (const extra of [
    "/product-sitemap.xml",
    "/product-sitemap1.xml",
    "/product-sitemap2.xml",
    "/product-sitemap3.xml",
    "/sitemap_products_1.xml",
    "/sitemap_products_2.xml",
  ]) {
    await collect(origin + extra);
  }

  // read each candidate page for its title and og:image
  const candidates = [...pages.entries()]
    .filter(([u, v]) => !v.images.length || !v.title)
    .sort((a, b) => (PRODUCTISH.test(b[0]) ? 1 : 0) - (PRODUCTISH.test(a[0]) ? 1 : 0))
    .slice(0, maxPages);

  for (const [url, info] of candidates) {
    try {
      const html = await get(url);
      const og =
        (html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i) ?? [])[1] ??
        (html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ?? [])[1];
      const t = (html.match(/<title>([^<]{0,200})<\/title>/i) ?? [])[1] ?? "";
      const h1 = (html.match(/<h1[^>]*>([^<]{0,200})<\/h1>/i) ?? [])[1] ?? "";
      info.title = decode((info.title || h1 || t).replace(/\s+/g, " ").trim());
      if (!info.images.length && og) info.images = [og];
    } catch {}
    await sleep(25);
  }

  const entries = [...pages.entries()]
    .map(([page, v]) => ({ page, title: v.title, images: v.images }))
    .filter((e) => e.images.length);
  fs.writeFileSync(cacheFile, JSON.stringify({ at: Date.now(), entries }, null, 0));
  return entries;
}

const entries = await discover();
console.log(`${brand} (${domain}): ${entries.length} listings with a photograph`);

// ---------- match ----------
const products = readCatalogue().filter(
  (p) => p.brand.toLowerCase() === brand.toLowerCase() && !p.image,
);
const prefix = brandPrefix(brand);
const rows = products.map((p) => {
  const ranked = entries
    .map((e) => ({ e, sc: score(p.name, e.title ? e.title.replace(prefix, "") : "") }))
    .sort((a, b) => b.sc - a.sc);
  return { product: p, best: ranked[0], second: ranked[1] };
});
const ok = rows.filter((r) => r.best && r.best.sc >= minScore);
console.log(`  catalogue products without a photo: ${products.length}`);
console.log(`  matched: ${ok.length}   kept as placeholder: ${rows.length - ok.length}\n`);

const report = { brand, domain, checked: new Date().toISOString(), matched: [], unmatched: [] };
for (const r of rows) {
  const entry = r.best;
  if (r.best && r.best.sc >= minScore) {
    console.log(`  ${r.best.sc.toFixed(2)}  ${r.product.name}  ->  ${entry.e.title || entry.e.page}`);
    report.matched.push({ slug: r.product.slug, name: r.product.name, source: entry.e.page, title: entry.e.title, score: +r.best.sc.toFixed(3) });
  } else {
    report.unmatched.push({
      slug: r.product.slug,
      name: r.product.name,
      closest: entry ? { title: entry.e.title, page: entry.e.page, score: +entry.sc.toFixed(3) } : null,
    });
  }
}

// ---------- download into staging ----------
if (apply && ok.length) {
  const dir = path.join(STAGING, brandSlug(brand));
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(MANIFEST_DIR, { recursive: true });
  const manifestPath = path.join(MANIFEST_DIR, `${brandSlug(brand)}.json`);
  const manifest = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
    : { brand, photos: [] };

  const todo = limit ? ok.slice(0, limit) : ok;
  let done = 0;
  for (const r of todo) {
    const e = r.best.e;
    const slug = r.product.slug;
    try {
      const rawUrl = /cdn\.shopify\.com|\/cdn\/shop\//.test(e.images[0])
        ? `${e.images[0].split("?")[0]}?width=1600`
        : e.images[0];
      const raw = await get(rawUrl, true);
      const meta = await sharp(raw).metadata();
      if ((meta.width ?? 0) < 400) {
        console.log(`  skip ${slug}: only ${meta.width}px wide`);
        continue;
      }
      const pipe = () => sharp(raw).rotate().flatten({ background: "#ffffff" })
        .resize(1200, 1200, { fit: "contain", background: "#ffffff" });
      let q = 82;
      let buf = await pipe().webp({ quality: q }).toBuffer();
      while (buf.length > 250 * 1024 && q > 45) {
        q -= 6;
        buf = await pipe().webp({ quality: q }).toBuffer();
      }
      const outName = `${slug}.webp`;
      fs.writeFileSync(path.join(dir, outName), buf);
      manifest.photos = manifest.photos.filter((x) => x.slug !== slug);
      manifest.photos.push({
        slug,
        file: path.relative(process.cwd(), path.join(dir, outName)),
        alt: e.title || r.product.name,
        source: e.page,
        license: `${brand} official product image, ${new URL(e.page).hostname}, sourced ${new Date().toISOString().slice(0, 10)}; written permission not yet confirmed`,
        staged_on: new Date().toISOString().slice(0, 10),
        match_score: +r.best.sc.toFixed(3),
      });
      done++;
      console.log(`  saved ${slug} (${(buf.length / 1024).toFixed(0)} KB, ${meta.width}x${meta.height})`);
    } catch (err) {
      console.log(`  fail ${slug}: ${err.message}`);
    }
    await sleep(350);
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  console.log(`\nstaged ${done}/${todo.length} photographs -> ${path.relative(process.cwd(), dir)}`);
}

fs.mkdirSync(path.join(process.cwd(), "docs", "sourcing"), { recursive: true });
fs.writeFileSync(
  path.join(process.cwd(), "docs", "sourcing", `${brandSlug(brand)}.json`),
  JSON.stringify(report, null, 1),
);
console.log(`report: docs/sourcing/${brandSlug(brand)}.json`);
