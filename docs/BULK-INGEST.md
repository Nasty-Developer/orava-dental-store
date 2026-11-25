# Bulk ingest from manufacturer PDF catalogues

Page-by-page scraping of manufacturer websites is the wrong tool for reaching 3,000
products. It yields roughly 20 rows per worker pass, and two of the largest brands
(waldent.com, purexa.in) answer with HTTP 429 before a pass completes. A manufacturer's
own downloadable catalogue carries the same facts, for a whole product family per page,
from a source we are allowed to cite.

## What the tool does

`tools/ingest-catalogue-pdf.mjs` reads a downloaded manufacturer catalogue PDF plus a
mapping file and emits rows in the exact 14-key shape used by
`staging/expansion/parts/tranche-2a.json`.

```
node tools/ingest-catalogue-pdf.mjs --list --pdf <file.pdf> --map <mapping.json>
node tools/ingest-catalogue-pdf.mjs        --pdf <file.pdf> --map <mapping.json> --out <rows.json>
```

Guarantees, enforced by the tool rather than by care:

- a row is emitted only when the product name and subtitle are found verbatim in the
  page's text layer, in the column the mapping names;
- every spec label and value is taken from the page text and asserted against it, so a
  row whose spec cannot be re-found in the page is refused;
- `sourceUrl` is the manufacturer's own catalogue URL from the mapping, never a retailer;
- `verificationNote` records the PDF URL and page number, so any row can be re-checked
  by opening that page;
- `price` is always `null` and `imagePermission` always `"none"`;
- slugs are unique against the live catalogue and against each other.

The mapping file is the only human judgement in the process: which page and column holds
which product, its brand, category and subcategory, and any name correction where the
PDF prints a name across two lines. Nothing else is typed by hand.

## Catalogues ingested so far

| Catalogue | Mapping | Rows | Notes |
| --- | --- | --- | --- |
| Prevest DenPro e-catalogue 2024 | `staging/expansion/mappings/prevest-ecatalog-2024.json` | 57 | five committed batches, `prevest-batch-1..5.json` |
| GC America Product Catalog 2023 | not committed (lost with an interrupted run) | 101 | recovered from a local working tree, cleaned, committed as `tranche-3-gc-america.json` |

Measured throughput: 57 rows in one worker pass of about ten minutes, roughly 5.7 rows
per minute, against roughly 2 rows per minute for page scraping and without the
rate-limit failures.

## Known quality issue to fix in the next pass

The GC extraction mis-parsed the packaging column on 33 of 101 rows, producing fragments
such as `0.12 mL)` or `(5 mL) with a new silicone cover to enab`. Those fields were
blanked rather than published as wrong data, and one row whose name had collapsed into a
descriptive sentence was dropped. The next ingest run should tighten the packaging
extraction: require balanced parentheses and reject a value that begins with a bare
measurement. Names, categories and specs from both catalogues were unaffected.

## Running the next tranche

1. Download the manufacturer's own catalogue PDF and save it under `staging/expansion/`.
2. Create a mapping in `staging/expansion/mappings/` following
   `prevest-ecatalog-2024.json`: page, column, brand, category, subcategory, and the
   catalogue URL to cite as `sourceUrl`.
3. Run the tool with `--list` first to see what it can find on each page, then without
   `--list` and `--out staging/expansion/parts/<catalogue>-batch-N.json`.
4. Run `node tools/check-expansion.mjs` and require zero errors before committing.
5. Commit and push after every batch of about 20 rows. An interrupted run must never
   cost more than one batch; both earlier losses came from work that existed only in a
   worker's local clone.
6. Never publish: `APPROVED.json` is created only with the owner's explicit approval.

## Where this leaves the 3,000 target

221 staged rows plus 344 live ones is 565 of 3,000. At the measured rate a catalogue
PDF yields 50 to 150 rows per pass, so the remaining work is a matter of running the
tool across the next 20 to 40 manufacturer catalogues, not of scraping more pages.
