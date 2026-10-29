# Hugo proof of concept

An exploration of moving civictech.ca from Jekyll to Hugo. It builds
everything the Jekyll site publishes:
- a page for every record in all seven archive collections (meetups, people,
  projects, venues, organizations, announcements, resources)
- each collection's list page (`/events/`, `/projects/`, …)
- the home page and site pages
- the redirect stubs
- the tag and category pages that `make generate` produces for Jekyll
- `feed.xml`, `sitemap.xml`, `robots.txt`, `llms.txt` and `generate-csv.csv`

Nothing in `archives/` is modified. Everything is mounted read-only from the
submodule via `module.mounts` in `hugo.toml`.

```bash
cd hugo-poc
hugo                   # writes public/
hugo server            # http://localhost:1313/events/99/
```

Requires Hugo extended ≥ 0.153 (tested with 0.169.0).

## Build time (measured 2026-10-29, Apple Silicon, Ruby 3.2.2, Hugo 0.169.0)

Both builds produce the same page set: 567 meetups, 613 people, 1,017
redirects, and the tag and category index, namespace and term pages (Jekyll
2,350 pages; Hugo 2,357, the extra being the 404 page and term pages the
generate scripts missed). Each makes 856 image derivatives. The Jekyll run is
`make generate` followed by `jekyll build` with `_config.yml` plus an override
that excludes `_pages` and the feed. Its projects, venues, organizations,
announcements and resources are read but not output. Wall-clock seconds:

| | Jekyll: `make generate` + build | Hugo |
| --- | --- | --- |
| clean (no image cache) | 10.5 + 77.6 | 12.3 / 13.4 / 12.3 |
| cached (thumbs / `resources/_gen` kept) | 7.6 + 21.3, 10.9 + 22.2, 7.5 + 20.3 | 0.9 / 0.7 / 0.7 |

Before tag pages were added, the meetup/person/redirect set alone took
Jekyll 72.7 / 71.4s clean and 17.3 / 16.9 / 18.5s cached, and Hugo 15.1 /
14.3 / 16.3s and 2.2 / 0.9 / 1.0s. Hugo got faster since then because it now
reads only `.png` bytes when checking image formats. The full Jekyll site
(all 2,742 pages) takes 95.6s clean and 30.8s cached, plus `make generate`.

Where the time goes:

- **Jekyll, clean.** About 55s goes to jekyll_picture_tag inside
  `meetup.html`: 57.1s inclusive, against 1.9–2.4s once the images are cached.
  libvips runs serially.
- **Jekyll, cached.** `backlinks.html` takes 11.3s of 16.3s render. It is an
  O(pages × collection) Liquid scan. On the full site, `organization.html`
  and `person.html` push it to about 20s. The tag and category layouts add
  about 1.2s. `make generate` adds 7.5–11s of shell and awk on every build.
- **Hugo, clean.** Almost all of it is image processing, about 96s of CPU
  spread across cores.
- **Hugo, cached.** 0.65–0.9s in total (`hugo --templateMetrics`). The
  backlink index is built once, and all 150 term pages take 0.27s of
  template time.

## What's mounted

| Source | Mounted as | Rendered? |
| --- | --- | --- |
| `archives/_meetups` | `content/events` | `/events/:file/` |
| `archives/_people`, `_projects`, `_venues`, `_organizations`, `_announcements`, `_resources` | `content/<collection>` | `/<collection>/:file/` |
| `archives/images/events` | `assets/images/events` | processed by Hugo's image pipeline |
| `_data/redirects.csv` | `assets/redirects.csv` | one redirect page per row |
| `archives/_people`, `_projects`, `_organizations` (again) | `assets/sources/…` | raw sources, read for `social` key order |
| `_data`, `_includes/icons`, `_includes/logo.svg`, `assets/css`, `assets/js`, `assets/images` | data / assets / static | shared with the Jekyll site |

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
  archives. The `redirect_from` data in meetups and announcements is
  historical: no dated permalinks after 2025, no `/hacknights/N/` after
  #530. So it is exported with `ruby _scripts/redirects.rb export`, and the
  CSV is owned by this repo. `make check-redirects` fails if the archives
  ever add a `redirect_from` the CSV lacks. Each `to` is either a site path
  (`/events/`, used for the three rows added by hand from `_pages`) or an
  archive record (`_meetups/99.md`). `_partials/redirect-target.html`
  resolves a record to its page's current URL, and an unresolvable record
  fails the build. That way the CSV doesn't depend on a URL scheme: the two
  announcements whose URLs change in Hugo are redirected to the new URLs
  without editing the CSV. `content/_content.gotmpl` adds one `redirect`
  page per row, with the same markup as jekyll-redirect-from. The export also
  fixed four 2021–2022 URLs listed on both meetup N and N+1: Jekyll sent them
  to N+1, and they now go to N, the meetup the slug names.
- **Tags and categories.** These are Hugo taxonomies, so `make generate`
  and its committed output (`_data/tags.yml`, `_data/categories.yml`,
  `tags/`, `categories/`) aren't needed. Terms keep their namespace in the
  URL (`/tags/topic/open-data/`). The namespace index pages (`/tags/topic/`)
  are added by `content/_content.gotmpl` from `params.namespaces` in
  `hugo.toml`. A term in an unlisted namespace stops the build
  (`_partials/namespaces.html`) rather than silently losing its index page.
  Compared with the shell scripts, Hugo reads the parsed front matter, so:
  - scalar values such as `categories: venue-category/Academic` are counted.
    The awk parser only read block lists, so Academic, Hospitality and Park
    had no pages.
  - `archives/utilities/examples/` is ignored. The scripts scanned it and
    published an empty `topic/example` page.
  - categories without a namespace (`supporter` on 34 organizations,
    `civictech`, `closed`, `feature`, `school`) get term pages. They are left
    off the index pages, as before.
  - category namespace pages show counts. Jekyll's template compared the bare
    value against namespaced categories and never found a match.
- **Jekyll-only syntax in content.** Two announcements use Liquid
  (`{% include embed_youtube.html … %}`, three times) and one uses a kramdown
  link attribute (`{:target="_blank"}`). Goldmark would print these as text.
  `_partials/content.html` translates exactly these constructs and re-renders
  those pages only; any other `{%`/`{:` in a body is reported with `warnf`.
  Raw HTML passes through (`unsafe = true`), as with kramdown. Content images
  get `loading="lazy"` from a render hook, as jekyll-loading-lazy did.
- **List pages.** The `_pages/list-*.md` pages are Liquid inside Markdown,
  which Hugo can't run. They become section pages: `layouts/section.html`
  wraps `_partials/lists/<section>.html`, and `content/<section>/_index.md`
  sets the title. Liquid that computed values never output (topic lists,
  unused captures) was dropped. Where Jekyll's output was plainly broken, the
  port does what the template meant to do:
  - **`/venues/`** lists all 74 venues. Jekyll showed 11: categories were
    lowercased for the group headings but matched case-sensitively, so seven
    groups rendered empty.
  - **`/organizations/`** lists all 130. Jekyll showed 50: an empty
    `categories:` list is truthy in Liquid, so those organizations were
    neither categorized nor "Other". An empty category also produced a blank
    " Organizations" group.
  - **`/projects/`** "Other Community Projects" excludes breakout projects.
    Jekyll used `reject`, which isn't a Jekyll 4 filter and silently returned
    every project. No project is tagged `from/breakout` today, so the output
    is the same.
- **Ordering.** Jekyll orders a collection's documents by byte-order path
  (uppercase before lowercase), and Hugo's `sort` collates instead.
  `_partials/sort-by-path.html` sorts on the hex-encoded path to get byte
  order. `_partials/newest-first.html` reproduces Liquid's
  `sort: "date" | reverse`, which also reverses same-date ties. The one
  order that can't be matched is projects': Jekyll compares `date` and falls
  back to path when either side has none. Mixing dated and undated projects
  makes that comparison inconsistent, so its result depends on Ruby's sort
  internals. Open and featured projects are listed by path here.
- **Home and site pages.** `layouts/home.html` ports `_pages/index.md` and
  the announcement bar. `code-of-conduct.md` and `get-involved.md` have no
  Liquid and are mounted from `_pages/` as they are. `feedback.md` is HTML in
  a `.md` file whose indented form markup would become code blocks under
  CommonMark, so it is mounted as `feedback.html` (this needs
  `security.allowContent` to allow `text/html`). Its one Liquid value, the
  feedback token, comes from `HUGO_PARAMS_FEEDBACKTOKEN`. `about-us.md`
  embeds two Liquid loops in its prose. `sync-about-us.rb` writes
  `content/about-us.md` from it, with the `featured-speakers` and
  `featured-supporters` shortcodes in their place. Until the Jekyll site is
  retired, re-run it after editing the Jekyll page.
- **Feed, sitemap and other files.** These are output formats of the home
  page in `hugo.toml`. `feed.xml` (`home.feed.xml`) ports the hand-rolled
  Atom feed of the 25 latest meetups: titles, dates, authors, categories and
  content text match Jekyll's. Two differences. Summaries are escaped once
  (Jekyll double-escaped `&` as `&amp;amp;`), and line breaks become spaces
  so list items don't run together. Images point at the 800px derivative,
  not the original under `/archives/images/`. That was the only reference to
  the originals, so Hugo doesn't publish the 152 MB `archives/images/` copy
  that Jekyll does. `generate-csv.csv` (`home.wpcsv.csv`) is byte-identical.
  `robots.txt` and `llms.txt` are identical. The sitemap is Hugo's own and
  lists the same pages, except for the URL changes and term-page
  differences noted elsewhere. Jekyll also publishes `redirects.json` (a
  jekyll-redirect-from by-product) and, because `_config.yml` doesn't exclude
  them, the repo's `CLAUDE.md` and `GEMINI.md`. Hugo publishes none of these.
- **Images.** `_partials/picture.html` mirrors the jekyll_picture_tag
  `events` preset: a 690px WebP in `srcset` plus an 800px JPEG/PNG fallback.
  Derivatives are cached in `resources/_gen`. That is the counterpart of
  caching `_site/assets/thumbs` in CI.

## Legacy URLs

Hugo can't write a file at a path containing a space, so it can't put
redirect stubs at the old Jekyll URLs. Instead, `_partials/legacy-urls.html`
derives an old→new map from the file names (889 entries; Jekyll used the
name minus trailing dots). It's published two ways:

- **`404.html`** carries the map and forwards with `location.replace`. That
  works on GitHub Pages, but only for browsers: crawlers see a 404. The page
  is 75 KB, 25 KB gzipped. The current Jekyll site has no `404.html` at all.
- **`_redirects`** is Netlify / Cloudflare Pages format: the CSV rows plus
  the legacy map as real 301s, 1,906 rules in all. GitHub Pages ignores it.
  Cloudflare Pages caps static redirects at 2,000, so it is close to that
  limit.

## Differences from the Jekyll output

Checked page by page against `_site/` (main-content text and link targets for
all 567 meetups and 613 people). What remains is listed here.

- **Person/venue/project/organization/announcement/resource URLs change.**
  Hugo lowercases paths and sanitizes them: spaces become `-`, and `()`,
  `,`, `'`, `+`, `&` are dropped. So `/people/Lilly Tong/` becomes
  `/people/lilly-tong/`. Lowercasing (no `disablePathToLower`) keeps tag and
  category URLs as Jekyll had them. Hugo can't lowercase terms but not
  content. Meetup URLs are unchanged. Old URLs are forwarded; see "Legacy
  URLs" above.
- **Markdown renderer.** Goldmark and kramdown differ in a handful of bodies.
  kramdown accepts pipe tables without a separator row. That turned two 2016
  announcements' bold "date | time | place" lines into broken tables with
  literal `**`; Goldmark renders them as intended. Smart quotes differ in
  about 10 places, and footnote back-links use `↩︎` rather than `↩`.
- **Undated documents** (most projects, resources, venues) show no date in
  backlinks and tag/category lists, and sort last. Jekyll gives them the build
  date (a quirk of `Document#date`), which also sorts them first.
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
  re-types them by magic bytes. Only `.png` files are read for this; reading
  every image added about 1.2s of CPU to each cached build.
- `_people/Maayan Ziv.md` has an unquoted `organization: [[AccessNow]]`, which
  YAML reads as a nested list. Jekyll never resolves it; the POC flattens it.
- `_projects/Tabs Toronto.md` sets `image:` to a jekyll_picture_tag
  derivative (`/assets/thumbs/events/hacknight_341-690-96ae99ad0.webp`), a
  hashed filename that only Jekyll produces. It's a broken image in Hugo; it
  should name the source image instead.
- `_projects/TPL Digital Innovation Hub booking app.md` has a Markdown link
  as a `social` value. Jekyll emits it verbatim as an `href` (a broken link);
  Hugo's URL escaping turns it into `#ZgotmplZ`.
- `aliases:` in person files holds alternate names (Obsidian). In Hugo that
  key means redirect URLs, so `disableAliases = true`.
- YAML maps lose their key order in Hugo, so footer and person social links are
  re-ordered from the raw files. Lists would avoid that.
