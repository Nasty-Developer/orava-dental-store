# Recovery checkpoints

Each entry is a git tag on `main`. The tag is the authoritative record: it pins a
commit that can be checked out or cloned at any time.

| Tag | Commit | What it marks |
| --- | --- | --- |
| `checkpoint-2026-11-24` | `a041c72` | State before the commerce-platform audit. Bundle also committed at `checkpoints/2026-11-24/repo.bundle`. |
| `checkpoint-2026-11-24-m0` | `872379b` | State before Stage 2 architecture work. 344 products, 42 commits. |

Bundles are full `--all` archives, verifiable with `git bundle verify <file>`.
The `m0` bundle is 25 MB and is deliberately kept out of the repository to avoid
committing the history twice; the tag above is the durable record. Ask for the
file if you need the offline copy.
