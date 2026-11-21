import fs from "node:fs";
import path from "node:path";

/**
 * Reads src/data/catalogue/*.ts without compiling TypeScript: every product is
 * one `{ ... }` object with a handful of single-line fields, which is all the
 * image tooling needs to know.
 */
export const CATALOGUE_DIR = path.join(process.cwd(), "src", "data", "catalogue");
export const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");

const files = () =>
  fs
    .readdirSync(CATALOGUE_DIR)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => path.join(CATALOGUE_DIR, f));

const field = (body, name) => {
  const m = body.match(new RegExp(`\\n\\s*${name}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  return m ? m[1] : null;
};

export function readCatalogue() {
  const products = [];
  for (const file of files()) {
    const text = fs.readFileSync(file, "utf8");
    // split on top-level product objects: 2-space indent then "slug:"
    const parts = text.split(/\n  \{\n/);
    for (let i = 1; i < parts.length; i++) {
      const body = `\n${parts[i]}`;
      const slug = field(body, "slug");
      if (!slug) continue;
      const imageBlock = body.match(/image:\s*(\{[\s\S]*?\n {4}\}|null)/);
      const img = imageBlock && imageBlock[1] !== "null" ? imageBlock[1] : null;
      products.push({
        file,
        slug,
        name: field(body, "name") ?? slug,
        brand: field(body, "brand") ?? "",
        category: field(body, "category") ?? "",
        packaging: field(body, "packaging"),
        featured: /\n\s*featured:\s*true/.test(body),
        popular: /\n\s*popular:\s*true/.test(body),
        image: img
          ? {
              src: (img.match(/src:\s*"([^"]*)"/) ?? [])[1] ?? null,
              alt: (img.match(/alt:\s*"([^"]*)"/) ?? [])[1] ?? null,
              source: (img.match(/source:\s*"([^"]*)"/) ?? [])[1] ?? null,
              license: (img.match(/license:\s*"([^"]*)"/) ?? [])[1] ?? null,
              permission: (img.match(/permission:\s*"([^"]*)"/) ?? [])[1] ?? null,
            }
          : null,
        raw: body,
      });
    }
  }
  return products;
}

export function findProduct(slug) {
  const product = readCatalogue().find((p) => p.slug === slug);
  if (!product) {
    const near = readCatalogue()
      .map((p) => p.slug)
      .filter((s) => s.includes(slug.split("-")[0]))
      .slice(0, 5);
    throw new Error(`No product with slug "${slug}".${near.length ? ` Did you mean: ${near.join(", ")}` : ""}`);
  }
  return product;
}

/** Rewrites one product's `image` field in its own file. */
export function writeImageField(product, block) {
  const text = fs.readFileSync(product.file, "utf8");
  const start = text.indexOf(`slug: "${product.slug}"`);
  if (start === -1) throw new Error(`Could not locate ${product.slug} in ${product.file}`);
  const after = text.slice(start);
  const m = after.match(/image:\s*(\{[\s\S]*?\n {4}\}|null)/);
  if (!m) throw new Error(`No image field for ${product.slug}`);
  const absStart = start + m.index;
  const absEnd = absStart + m[0].length;
  fs.writeFileSync(product.file, text.slice(0, absStart) + block + text.slice(absEnd));
}
