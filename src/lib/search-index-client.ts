"use client";

import type { SearchIndexItem } from "@/data/types";

/**
 * Lazily loads /search-index.json — the prerendered, slim projection of the
 * catalogue — and keeps it in memory for the session.
 *
 * The catalogue module is deliberately NOT imported here: it is ~320 KB of
 * JavaScript at 344 products and would be megabytes at 3,000. The index is
 * ~29 KB gzipped at 344 products and is only fetched when something actually
 * needs to look a product up — the first search, or a cart saved before the
 * index existed that only holds slugs.
 */
let pending: Promise<SearchIndexItem[]> | null = null;

export function loadSearchIndex(): Promise<SearchIndexItem[]> {
  if (!pending) {
    pending = fetch("/search-index.json")
      .then((res) => (res.ok ? (res.json() as Promise<SearchIndexItem[]>) : []))
      .catch(() => []);
  }
  return pending;
}
