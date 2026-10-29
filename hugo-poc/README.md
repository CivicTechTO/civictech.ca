# Hugo proof of concept

An exploration of moving civictech.ca from Jekyll to Hugo. It renders only
meetup pages, person pages and the meetup `redirect_from` stubs, so its build
time can be compared against Jekyll for the same page set.

Nothing in `archives/` is modified. Everything is mounted read-only from the
submodule via `module.mounts` in `hugo.toml`.

```bash
cd hugo-poc
hugo                   # writes public/
hugo server            # http://localhost:1313/events/99/
```

Requires Hugo extended ≥ 0.153 (tested with 0.169.0).

## Build time (measured 2026-10-29, Apple Silicon, Ruby 3.2.2, Hugo 0.169.0)

The same page set was built both ways: 567 meetups, 613 people and 1,017
redirects, with 856 image derivatives. The Jekyll run used `_config.yml` plus
an override that excludes `_pages`, `tags`, `categories` and the feed. Its
projects, venues and organizations are read but not output. Wall-clock
seconds:

| | Jekyll (subset) | Hugo |
| --- | --- | --- |
| clean (no image cache) | 72.7 / 71.4 | 15.1 / 14.3 / 16.3 |
| cached (thumbs / `resources/_gen` kept) | 17.3 / 16.9 / 18.5 | 2.2 / 0.9 / 1.0 |

The full Jekyll site (all 2,742 pages) takes 95.6s clean and 30.8s cached,
plus about 8–9s for `make generate`.

Where the time goes:

- **Jekyll, clean.** About 55s goes to jekyll_picture_tag inside
  `meetup.html`: 57.1s inclusive, against 1.9s once the images are cached.
  libvips runs serially.
- **Jekyll, cached.** `backlinks.html` takes 10.9s of 13.9s render. It is an
  O(pages × collection) Liquid scan. On the full site, `organization.html`
  and `person.html` push it to about 20s.
- **Hugo, clean.** Image processing takes about 96s of CPU, spread across
  cores in about 14s wall.
- **Hugo, cached.** About 1s in total. The backlink index is built once, in
  0.12s (`hugo --templateMetrics`).

## What's mounted

| Source | Mounted as | Rendered? |
| --- | --- | --- |
| `archives/_meetups` | `content/events` | yes, `/events/:file/` |
| `archives/_people` | `content/people` | yes, `/people/:file/` |
| `archives/_projects`, `_venues`, `_organizations` | `content/…` | no (`build.render = "link"`). Read only so wikilinks and backlinks resolve. |
| `archives/images/events` | `assets/images/events` | processed by Hugo's image pipeline |
| `_data/redirects.csv` | `assets/redirects.csv` | one redirect page per row |
| `archives/_people` (again) | `assets/people-sources` | raw sources, read for `social` key order |
| `_data`, `_includes/icons`, `_includes/logo.svg`, `assets/css`, `assets/js` | data / assets / static | shared with the Jekyll site |

## How the Jekyll behaviour maps

- **Wikilinks.** `_partials/wikilinks.html` strips `[[…]]` and resolves the
  name with `site.GetPage "/<section>/<name>"`. It replaces Jekyll's
  `where: "relative_path"` scan of the whole collection on every lookup.
- **Backlinks.** `_partials/backlink-index.html` builds a `[[name]] → pages`
  map once per (sections, fields) pair through `partialCached`.
  `backlinks.html` then does a map lookup. Jekyll's `backlinks.html` rescans
  every meetup and project for each of the ~1,400 pages that include it,
  which is most of its cached build time.
- **Redirects.** These come from `_data/redirects.csv`, not from the
  archives. The meetup `redirect_from` data is historical: the dated blog
  permalinks stop in May 2025 and `/hacknights/N/` after #530. So it was
  exported once with `ruby _scripts/redirects.rb export`, and the CSV is now
  owned by this repo. `make check-redirects` fails if the archives ever add a
  `redirect_from` the CSV lacks. `content/_content.gotmpl` adds one
  `redirect` page per row, with the same markup as jekyll-redirect-from. The
  export also fixed four 2021–2022 URLs listed on both meetup N and N+1:
  Jekyll sent them to N+1, and they now go to N, the meetup the slug names.
- **Images.** `_partials/picture.html` mirrors the jekyll_picture_tag
  `events` preset: a 690px WebP in `srcset` plus an 800px JPEG/PNG fallback.
  Derivatives are cached in `resources/_gen`. That is the counterpart of
  caching `_site/assets/thumbs` in CI.

## Legacy URLs

Hugo can't write a file at a path containing a space, so it can't put
redirect stubs at the old Jekyll URLs. Instead, `_partials/legacy-urls.html`
derives an old→new map from the file names (830 entries; Jekyll used the
name minus trailing dots). It's published two ways:

- **`404.html`** carries the map and forwards with `location.replace`. That
  works on GitHub Pages, but only for browsers: crawlers see a 404. The page
  is 72 KB, 23 KB gzipped. The current Jekyll site has no `404.html` at all.
- **`_redirects`** is Netlify / Cloudflare Pages format: the CSV rows plus
  the legacy map as real 301s, 1,847 rules in all. GitHub Pages ignores it.
  Cloudflare Pages caps static redirects at 2,000, so it is close to that
  limit.

## Differences from the Jekyll output

Checked page by page against `_site/` (main-content text and link targets for
all 567 meetups and 613 people). What remains is listed here.

- **Person/venue/project/organization URLs change.** Hugo sanitizes paths:
  spaces become `-`, and `()`, `,`, `'`, `+`, `&` are dropped, so
  `/people/Lilly Tong/` becomes `/people/Lilly-Tong/`. Meetup URLs are
  unchanged. Old URLs are forwarded; see "Legacy URLs" below.
- **Markdown renderer.** Goldmark and kramdown differ in a handful of meetup
  bodies. kramdown accepts pipe tables without a separator row, and its smart
  quotes differ in about 6 places.
- **Dateless projects** in backlinks show no date. Jekyll shows the build date
  there, a quirk of `Document#date`.
- **Empty `title:`.** Hugo falls back to the file name ("Ghazaleh Mohseni",
  "ASL19"). Jekyll titleizes the slug ("Ghazaleh mohseni", "Asl19").
- **Image `alt` and `sizes`.** Jekyll's meetup layout passes `event.topic`,
  which is undefined, so `alt` is empty. Its `sizes` attribute is malformed.
  The POC emits the topic and a valid `sizes`.
- **JSON-LD** is built as a map and serialized with `jsonify`. Jekyll's
  hand-assembled meetup JSON-LD is missing a closing brace and fails to parse
  on every meetup page.
- **Project backlink order** follows Hugo's collation, not Jekyll's byte-order
  path sort.
- **Redirects without a trailing slash** (2 entries) are written as
  `…/index.html` rather than as an extensionless file.

## Archive data the POC has to work around

These are fine in Jekyll but need handling in Hugo. Fixing them in `archives`
would remove the workarounds.

- `_meetups/390.md` uses `published: false`. Hugo reads `published` as a date
  and fails, so the file is excluded from the mount; Jekyll doesn't output it
  either. The usual Hugo key is `draft: true`.
- `_projects/Weather Report Card.md` has `date: 2027-02-29`, which doesn't
  exist. It's excluded from the mount.
- 6 images named `.png` are WebP (528–530) or AVIF (549, 551, 552) data.
  libvips sniffs them; Hugo goes by extension, so `_partials/event-image.html`
  re-types them by magic bytes.
- `_people/Maayan Ziv.md` has an unquoted `organization: [[AccessNow]]`, which
  YAML reads as a nested list. Jekyll never resolves it; the POC flattens it.
- `aliases:` in person files holds alternate names (Obsidian). In Hugo that
  key means redirect URLs, so `disableAliases = true`.
- YAML maps lose their key order in Hugo, so footer and person social links are
  re-ordered from the raw files. Lists would avoid that.
