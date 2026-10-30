# Moving civictech.ca from Jekyll to Hugo

The `v2` branch is civictech.ca rebuilt with Hugo. It builds everything the
Jekyll site on `main` publishes:
- a page for every record in all seven archive collections (meetups, people,
  projects, venues, organizations, announcements, resources)
- each collection's list page (`/events/`, `/projects/`, …)
- the home page and site pages
- the redirect stubs
- the tag and category pages that `make generate` produced for Jekyll
- `feed.xml`, `sitemap.xml`, `robots.txt`, `llms.txt` and `generate-csv.csv`

Nothing in `archives/` is modified. Everything is mounted read-only from the
submodule via `module.mounts` in `hugo.toml`. How to build and check it is in
the [README](../README.md). This document records how the Jekyll site maps to
Hugo, what differs, the workarounds pending the archive refactor, and how
`v2` is kept alongside `main` until the switch.

Decisions (2026-10-30): hosting stays on GitHub Pages for the near to mid
term; person, venue, project, organization, announcement and resource URLs
become lowercase (old URLs are forwarded); the archive refactor happens after
the switch. The exploration that led here is on the `explore/hugo-migration`
branch, where Hugo lived in `hugo-poc/` beside Jekyll.

## Working on v2

`main` stays the live Jekyll site, and `v2` is the Hugo site. CI builds both:
pull requests to `main` run the Jekyll build, and pull requests to `v2` the
Hugo build. Nothing deploys from `v2` (`pages.yml` runs on pushes to `main`).

Merge `main` into `v2` regularly, at least after each change to `main` other
than an archives bump:

```bash
git switch v2
git merge main
make check
```

What to expect:
- **Archives bumps** (the daily `update-submodule.yml` PRs go to `main`)
  merge cleanly. If the build then stops with "redirect_from URLs missing
  from assets/redirects.csv", add a row per URL to `assets/redirects.csv`.
- **Changes to files that moved** (`assets/css`, `assets/js` and
  `assets/images` are `static/assets/…` on v2; `_data/*.yml` is `data/`;
  `_includes/icons` and `logo.svg` are under `assets/`; the site pages are
  in `content/`) follow the rename and merge cleanly. `footer_social.yml` is
  a list on v2, so a change to it needs redoing by hand.
- **Changes to Jekyll templates** (`_layouts/`, `_includes/`,
  `_pages/*.md` with Liquid) conflict, because v2 deleted those files. Port
  the change to the matching file in `layouts/` (collection layouts are
  `layouts/<section>/page.html`, includes are `layouts/_partials/`, list
  pages are `layouts/_partials/lists/`), then `git rm` the Jekyll file to
  resolve.

Fixes to the live-site bugs in
[`plans/2026-10-29-jekyll-site-bug-log.md`](plans/2026-10-29-jekyll-site-bug-log.md)
are made in Jekyll on `main`; v2 already avoids all of them, so resolve those
conflicts in favour of v2.

## Switching to Hugo

1. Pause template changes on `main`. Merge `main` into `v2` one last time;
   CI must pass.
2. Tag the last Jekyll commit on `main` as `v1.0.0`.
3. Open a pull request from `v2` to `main` and merge it with a merge commit
   (not squash), so both histories are kept. `pages.yml` on `main` then
   builds and deploys with Hugo.
4. Check the deploy: run `make check`, open a few pages of each type, and try
   old URLs (`/people/Lilly%20Tong/`, `/hacknights/1/`, a dated blog URL).
5. Tag `v2.0.0`, with release notes covering the URL changes and the new
   requirements (Hugo instead of Ruby).
6. Remove `v2` from the branches in `ci.yml` and delete the branch.
7. Start the archive refactor; each `ARCHIVE-COMPAT` entry below lists the
   archive change that retires it.

## Build time (measured 2026-10-29, Apple Silicon, Ruby 3.2.2, Hugo 0.169.0)

Both sides build the whole site: Jekyll 2,742 pages, Hugo 2,748. Hugo's
extra pages are the 404 page and the category pages Jekyll's generate
scripts missed. Each side makes 856 image derivatives. Jekyll is
`make generate` followed by `bundle exec jekyll build`; Hugo is `hugo`.
Wall-clock seconds per run:

| | Jekyll: `make generate` + build | Hugo |
| --- | --- | --- |
| clean (no image cache) | 7.7 + 91.0, 7.4 + 86.2 | 11.6 / 11.4 / 12.3 |
| cached (thumbs / `resources/_gen` kept) | 7.4 + 29.7, 7.5 + 29.3, 7.2 + 29.9 | 1.0 / 0.9 / 0.9 |

Where the time goes:

- **Jekyll, clean.** About 55–60s is jekyll_picture_tag inside
  `meetup.html`, and libvips runs serially. The rest is as in the cached
  build.
- **Jekyll, cached.** 25.2s of 28.5s is render. `backlinks.html` takes
  18.9s of that, an O(pages × collection) Liquid scan repeated on 1,384
  pages. `make generate` adds another 7–8s of shell and awk on every build.
- **Hugo, clean.** Almost all of it is image processing, spread across
  cores.
- **Hugo, cached.** 0.8–1.0s for the whole site (`hugo --templateMetrics`).
  Backlinks cost 0.45s of template time in total, because the index is built
  once per field set rather than per page.

## Bugs found in the live Jekyll site

Comparing the two builds turned up 14 bugs in the live site, including
invalid JSON-LD on every meetup page, venue and organization list pages
missing most entries, and `og:image` URLs that 404. They are logged, with
cause, evidence and suggested fix, in
[`plans/2026-10-29-jekyll-site-bug-log.md`](plans/2026-10-29-jekyll-site-bug-log.md).
The Hugo build avoids all of them.

## What's mounted

| Source | Mounted as | Rendered? |
| --- | --- | --- |
| `archives/_meetups` | `content/events` | `/events/:file/` |
| `archives/_people`, `_projects`, `_venues`, `_organizations`, `_announcements`, `_resources` | `content/<collection>` | `/<collection>/:file/` |
| `archives/images/events` | `assets/images/events` | processed by Hugo's image pipeline |
| `archives/_people`, `_projects`, `_organizations` (again) | `assets/sources/…` | raw sources, read for `social` key order |
| `static/assets/images/organizations` | `assets/org-logos` | so `og:image` can check a logo exists |

Everything else is in Hugo's usual directories: `content/` (site pages,
section titles in `_index.md`), `data/`, `assets/` (icons, logo,
`redirects.csv`) and `static/`.

## How the Jekyll behaviour maps

- **Wikilinks.** `_partials/wikilinks.html` strips `[[…]]` and resolves the
  name with `site.GetPage "/<section>/<name>"`. It replaces Jekyll's
  `where: "relative_path"` scan of the whole collection on every lookup.
- **Backlinks.** `_partials/backlink-index.html` builds a `[[name]] → pages`
  map once per (sections, fields) pair through `partialCached`.
  `backlinks.html` then does a map lookup. Jekyll's `backlinks.html` rescans
  every meetup and project for each of the ~1,400 pages that include it,
  which is most of its cached build time.
- **Redirects.** These come from `assets/redirects.csv`, not from the
  archives. The `redirect_from` data in meetups and announcements is
  historical: no dated permalinks after 2025, no `/hacknights/N/` after
  #530. So it was exported once into the CSV, which this repo owns. The
  build stops if the archives ever add a `redirect_from` the CSV lacks
  (`_partials/check-redirect-from.html`). Each `to` is either a site path
  (`/events/`, used for the three rows added by hand from the site pages) or
  an archive record (`_meetups/99.md`). `_partials/redirect-target.html`
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
  the announcement bar. `code-of-conduct.md` and `get-involved.md` had no
  Liquid and moved to `content/` as they were. `feedback.md` is HTML in a
  `.md` file whose indented form markup would become code blocks under
  CommonMark, so it is `content/feedback.html` (this needs
  `security.allowContent` to allow `text/html`). Its one Liquid value, the
  feedback token, is the `feedback-token` shortcode, set from
  `HUGO_PARAMS_FEEDBACKTOKEN`. `about-us.md` embedded two Liquid loops in its
  prose; `content/about-us.md` has the `featured-speakers` and
  `featured-supporters` shortcodes in their place.
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

Checked against `_site/`:
- main-content text and link targets of every collection page
- the items under each heading of every list, tag and category page
- every redirect stub's target
- the feed entry by entry
- the sitemap's URL set

These comparisons were one-off scripts and aren't committed, because they
need a Jekyll build; `scripts/check_output.py` guards the Hugo side.

A visual review in Chrome (2026-10-30) compared one page of every type,
every list page, the tag and category indexes and the site pages with
civictech.ca: screenshots plus page height, heading positions, image sizes
and link counts. The menu, theme switcher, mobile menu, phone-width layout
(390px) and `404.html` forwarding were checked by hand. At 390px,
`/projects/bikespace/` and `/code-of-conduct/` scroll sideways on both sites
(shared CSS, not the port). The feed passes the
W3C Feed Validator and parses with feedparser, as the live feed does.

Apart from the deliberate fixes described above, this is what remains.

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
  Goldmark also opens the footnote block with an `<hr>`, which adds a rule
  and 20px to pages with footnotes (e.g. `/projects/bikespace/`).
- **Category namespace order** on `/categories/` is alphabetical. Jekyll's
  order is whatever order `make generate`'s scripts find files in, which
  differs between the committed `_data/categories.yml` and the live build.
- **Undated documents** (most projects, resources, venues) show no date in
  backlinks and tag/category lists, and sort last. Jekyll gives them the build
  date (a quirk of `Document#date`), which also sorts them first.
- **Empty `title:`.** Hugo falls back to the file name ("Ghazaleh Mohseni",
  "ASL19"). Jekyll titleizes the slug ("Ghazaleh mohseni", "Asl19").
- **Image `alt` and `sizes`.** Jekyll's meetup layout passes `event.topic`,
  which is undefined, so `alt` is empty. Its `sizes` attribute is malformed.
  Hugo emits the topic and a valid `sizes`.
- **JSON-LD** is built as a map and serialized with `jsonify`. Jekyll's
  hand-assembled meetup JSON-LD is missing a closing brace and fails to parse
  on every meetup page.
- **Redirects without a trailing slash** (2 entries) are written as
  `…/index.html` rather than as an extensionless file.

## Interim workarounds

Workarounds are labelled in the code so they can be found and removed:

```bash
grep -rn 'ARCHIVE-COMPAT' hugo.toml layouts content scripts .github
```

### `ARCHIVE-COMPAT`: pending the archive refactor

Each of these works around data in the archives submodule. The archive
change listed would break the Jekyll site, so it's made after the switch. Once it's made, delete the workaround. "New cases"
says whether a fresh instance of the problem would be caught.

| ID | Problem in the archives | Workaround | Archive change that removes it | New cases |
| --- | --- | --- | --- | --- |
| `unpublished-flag` | `_meetups/390.md` has `published: false`, which Hugo parses as a date | excluded by name (`hugo.toml`) | use `draft: true` | build fails |
| `invalid-date` | `_projects/Weather Report Card.md` has `date: 2027-02-29` | excluded by name (`hugo.toml`, two mounts) | fix the date | build fails |
| `mislabeled-images` | `hacknight_528–530.png` are WebP, `549/551/552.png` are AVIF | re-typed by magic bytes (`_partials/event-image.html`) | correct the extensions and `image:` values | `.png`: handled; other extensions: build fails |
| `jekyll-thumb-path` | `_projects/Tabs Toronto.md` `image:` is a Jekyll picture-tag derivative path | source image found by name (`_partials/project-image.html`) | name the source image | handled |
| `org-logo-extension` | ThoughtWorks and School of Public Policy and Governance name `.jpg` logos that are `.png` | matched by base name (`_partials/og-image.html`) | correct the filenames | handled |
| `social-markdown-link` | `_projects/TPL Digital Innovation Hub booking app.md` has a Markdown link as a `social` value | URL extracted (`_partials/social-links.html`) | plain URL | handled |
| `nested-wikilinks` | `_people/Maayan Ziv.md` has unquoted `organization: [[AccessNow]]`, a nested list in YAML | flattened (`_partials/wikilink-names.html`, `backlink-index.html`) | quote wikilinks | handled |
| `empty-titles` | ASL19, Ethelo, Ghazaleh Mohseni, Ryan Markwart have an empty `title:` | file name fallback (`_partials/title.html`) | add titles | handled |
| `obsidian-aliases` | person files use Obsidian's `aliases` key for alternate names; in Hugo it means redirect URLs | `disableAliases = true` (`hugo.toml`) | rename the key, e.g. `alternate_names` | handled |
| `map-key-order` | `social` is a map, and Hugo doesn't keep map key order | order read from raw sources (`_partials/social-links.html`, `assets/sources/` mounts) | make `social` a list | handled |
| `category-shape` | `categories` is a scalar in venues and a list elsewhere, mixes case, and some lists have empty entries | normalized (`_partials/category-values.html`) | lowercase lists, no empty entries | handled |
| `unnamespaced-categories` | `supporter` (34 organizations), `civictech`, `closed`, `feature`, `school` have no namespace | kept off index pages; no namespace breadcrumb (`_partials/namespaces.html`, `term.html`) | namespace them | handled |
| `jekyll-content-syntax` | two announcements use Liquid `embed_youtube` includes and a kramdown `{:target}` attribute | translated (`_partials/content.html`) | plain Markdown/HTML | `warnf` at build |
| `redirect-from` | meetups and announcements carry `redirect_from`, now owned by `assets/redirects.csv` | build stops on one the CSV lacks (`_partials/check-redirect-from.html`) | drop `redirect_from` from the archives | build fails |
| `duplicate-redirects` | four old URLs are listed on meetup N and N+1 (299/300, 358/359, 364/365, 366/367) | the CSV maps each to the meetup the slug names | delete the line from N+1 | not checked |

### `JEKYLL-TRANSITION`: done on v2

While Hugo lived beside Jekyll in `hugo-poc/`, three more workarounds
(`site-pages`, `about-us-copy`, `footer-order`) let the two share files. On
`v2` the site pages moved into `content/`, `sync-about-us.rb` was deleted,
and `data/footer_social.yml` became a list, so none remain.
