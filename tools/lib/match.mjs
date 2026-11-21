/** Strict product-name matching, shared by every sourcing tool. */

const STOP = new Set([
  "pack","of","the","and","with","for","kit","set","ml","gm","gms","gram","grams","pcs","pc",
  "piece","pieces","no","size","mm","cm","inch","box","bottle","tube","refill","assorted",
  "colours","colors","free","new",
]);

export const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#8211;/g, "-");

const singular = (t) => (t.length > 3 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t);

export const tokens = (s) =>
  new Set(
    decode(s).toLowerCase().replace(/[^a-z0-9+ ]/g, " ").split(/\s+/)
      .filter((t) => t && !STOP.has(t)).map(singular),
  );

/**
 * Packaging words decide whether two listings are the same product. A refill is
 * not a syringe, a carpule box is not a bottle, and a combo kit is not one of
 * its components: when our name and the brand's name describe different
 * packaging, the match is refused even if every other word lines up.
 */
const PACKAGING = [
  ["refill", "refills", "carpule", "carpules", "cartridge", "cartridges"],
  ["syringe", "syringes"],
  ["kit", "kits", "set", "sets", "combo", "combos"],
  ["pack", "packs", "packet", "packets"],
  ["bottle", "bottles"],
  ["tube", "tubes"],
  ["jar", "jars"],
  ["box", "boxes"],
];
const rawTokens = (s) =>
  new Set(decode(s).toLowerCase().replace(/[^a-z0-9+ ]/g, " ").split(/\s+/).filter(Boolean));
const packagingOf = (s) => {
  const t = rawTokens(s); // packaging words are STOP words, so tokenise raw

  const found = new Set();
  for (const group of PACKAGING) if (group.some((w) => t.has(w) || t.has(singular(w)))) found.add(group[0]);
  return found;
};

/**
 * Every meaningful word in our catalogue name must appear in the brand's own
 * title. "X-Ray Film E-Speed" must not land on "X-Ray Film IOPA"; a combo must
 * not land on one of its components. Ties break towards the leaner brand title.
 */
/**
 * Catalogue names carry model numbers and packaging in brackets, e.g.
 * "Pro-Paste Prophylaxis Paste (9002/090)". The brand's own title rarely does,
 * so those bracketed groups are stripped before comparison. Numbers outside
 * brackets stay significant, because 18% and 5% are different products.
 */
export const normalizeName = (s) =>
  decode(s)
    .replace(/\([^)]*\d[^)]*\)/g, " ") // only bracketed codes, not bracketed words
    .replace(/\b\d{3,}[\/-]\d+\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const score = (oursRaw, theirsRaw) => {
  const ours = normalizeName(oursRaw), theirs = normalizeName(theirsRaw);
  const A = tokens(ours), B = tokens(theirs);
  if (!A.size || !B.size) return 0;
  const packOurs = packagingOf(ours);
  const packTheirs = packagingOf(theirs);
  if (packOurs.size && packTheirs.size) {
    for (const g of packOurs) if (!packTheirs.has(g)) return 0; // different packaging
  }
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  const covered = inter / A.size;
  if (covered < 1) return covered * 0.6;
  const extra = B.size - inter;
  return 1 - Math.min(extra, 8) * 0.01;
};

export const brandPrefix = (brand) => new RegExp(`^${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+`, "i");
