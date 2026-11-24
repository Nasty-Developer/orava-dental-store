import { searchIndex } from "@/data/search-index";

/**
 * /search-index.json — prerendered at build time, served as a static file.
 *
 * Nothing in the page bundle contains the catalogue; the header search and the
 * legacy-cart migration fetch this once, on demand.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(searchIndex), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
