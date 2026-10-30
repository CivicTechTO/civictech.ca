# Jekyll Site Bug Log

**Date:** 2026-10-29
**Status:** Open

## Overview

Bugs in the live civictech.ca (Jekyll) site, found while comparing it page by
page with the Hugo proof of concept in `hugo-poc/`. Each one was checked
against https://civictech.ca on 2026-10-29 and against git history for signs
that the behaviour was intended; none was. All can be fixed in Jekyll now,
independently of any migration.

The Hugo build already avoids every one of these. Archive data problems that
only matter to Hugo are tracked separately, in the "Interim workarounds"
register in `docs/hugo-migration.md`.

| # | Bug | Impact | Fix in |
| --- | --- | --- | --- |
| 1 | Invalid JSON-LD on every meetup page | High | this repo |
| 2 | `/venues/` lists 11 of 74 venues | High | this repo |
| 3 | `/organizations/` lists 50 of 130 organizations | High | this repo |
| 4 | `og:image` is a 404 on meetup and organization pages | Medium | this repo |
| 5 | Four old meetup URLs redirect to the wrong meetup | Medium | archives |
| 6 | Category pages missing for three venue categories; empty `topic/example` tag page | Medium | this repo |
| 7 | Meetup images have an empty `alt` | Medium | this repo |
| 8 | Feed summaries show a literal `&amp;` | Low | this repo |
| 9 | Category namespace pages never show counts | Low | this repo |
| 10 | Two 2016 announcements render a broken table | Low | archives |
| 11 | Malformed `sizes` on meetup images | Low | this repo |
| 12 | `CLAUDE.md` and `GEMINI.md` are published | Low | this repo |
| 13 | `/projects/` uses a filter that doesn't exist | None today | this repo |
| 14 | `/resources/` repeats one `id` in every group | Low | this repo |

---

## 1. Invalid JSON-LD on every meetup page

**Where:** `_includes/jsonld.html`, the `type/meetup` branch.

The `"organizer"` object is never closed, so the JSON-LD fails to parse on all
567 meetup pages and search engines ignore it.

**Fix:** close the object, and drop the trailing comma inside `"video"`.
Building the object as a hash and emitting it with `jsonify` would avoid
hand-written JSON altogether.

## 2. `/venues/` lists 11 of 74 venues

**Where:** `_pages/list-venues.md`.

The template lowercases each category to build the group headings
(`category | downcase`), then selects venues with
`venue.categories contains category` using that lowercased value. Venue
categories have been capitalized (`venue-category/Academic`) since they were
added to the archives in 2025-11, and Liquid's `contains` is case-sensitive.
Seven groups ("Venue category/academic Venues" and others) render as headings
with no venues.

**Fix:** compare case-insensitively, e.g. downcase each venue's categories
before matching. Also note that most venues have a scalar
`categories: venue-category/Industry` rather than a list, and `contains` on a
string is a substring test.

## 3. `/organizations/` lists 50 of 130 organizations

**Where:** `_pages/list-organizations.md`.

Organizations without categories are meant to appear under "Other
Organizations" (`{% if org.categories %} … {% else %}` pushes them to
`uncategorized_orgs`). That section has never rendered: Jekyll gives every
collection document `categories: []` when the key is missing, and an empty
array is truthy in Liquid. 83 organizations (64 without the key, 19 with
`categories: []`) appear nowhere. Six organizations with an empty list entry
(e.g. Gida) also form a group with a blank heading, " Organizations".

**Fix:** test `org.categories.size > 0`, and skip empty category values when
building `unique_categories`.

## 4. `og:image` is a 404 on meetup and organization pages

**Where:** `_layouts/base.html`.

`og:image` is `page.image | absolute_url`. That only works when `image:` is
already a full URL, as it is for most projects. Meetup images are file names
under `archives/images/events/`, so 130 meetups without a YouTube recording get
`https://civictech.ca/hacknight_135.jpg`. Organization logos are file names
under `assets/images/organizations/`, so 23 organizations get
`https://civictech.ca/supporter_hackeryou.png`. Both return 404, so link
previews show no image.

**Fix:** build the URL per collection: the generated meetup thumbnail (or
`/archives/images/events/<image>`) for meetups,
`/assets/images/organizations/<image>` for organizations.

## 5. Four old meetup URLs redirect to the wrong meetup

**Where:** the archives submodule, `_meetups/300.md`, `359.md`, `365.md`,
`367.md`.

Archive commit 2e82a26 ("Hacknight to Meetup event naming migration",
2026-01-16) added each old blog URL for meetups 299, 358, 364 and 366 to the
following meetup's `redirect_from` as well. With two pages claiming the same
URL, jekyll-redirect-from keeps the later one, so for example
`/2021/07/06/hacknight-299-empowering-students-…/` goes to `/events/300/`. The
URL's date and slug match meetup 299 (#300 was a week later).

**Fix:** in the archives, delete the dated URL from 300, 359, 365 and 367.
`_data/redirects.csv` in this repo already maps them correctly for the Hugo
build.

## 6. Category pages missing; empty `topic/example` tag page

**Where:** `_scripts/generate_category_data.sh`,
`_scripts/generate_tag_data.sh`.

The awk parser only reads block lists (`categories:` followed by `- item`
lines). Venue categories are mostly scalars (`categories:
venue-category/Academic`), added in 2025-12 after the scripts were written in
2025-06. So `/categories/venue-category/academic/` and `…/park/` are 404,
although 16 and 2 venues use them, and `…/hospitality/` is missing too.

The scripts also scan everything under `archives/`, including
`archives/utilities/examples/`, so `/tags/topic/example/` is published with
nothing tagged.

**Fix:** parse front matter as YAML (e.g. a short Ruby script) and limit the
scan to the collection directories (`archives/_*/`).

## 7. Meetup images have an empty `alt`

**Where:** `_layouts/meetup.html`, the `{% picture %}` line.

The line was copied from the list pages, where the loop variable is `event`:
`alt="{{ event.topic }}"`. A meetup page has no `event`, so every meetup image
renders `alt=""`.

**Fix:** use `page.topic`.

## 8. Feed summaries show a literal `&amp;`

**Where:** `feed.xml`, `<summary>`.

`description | markdownify | strip_html | … | xml_escape` escapes `&` twice:
kramdown outputs `&amp;`, `strip_html` leaves the entity, and `xml_escape`
turns it into `&amp;amp;`. Feed readers show "rise &amp; proliferation"
(meetup #557).

**Fix:** decode entities before `xml_escape`, or escape the plain-text
description without `markdownify`.

## 9. Category namespace pages never show counts

**Where:** `_layouts/category-namespace.html`.

It counts items with `item.categories contains category`, where `category` is
the bare value (`speaker`) but documents hold namespaced values
(`role/speaker`). The match never succeeds, so the `(N)` counts never appear.
The tag namespace layout builds the full value first and does show counts.

**Fix:** match against `namespace | append: "/" | append: category`.

## 10. Two 2016 announcements render a broken table

**Where:** the archives submodule,
`_announcements/first-ever-user-research-101-workshop.md` and
`_announcements/user-research-101-back-by-popular-demand.md`.

A bold line such as `**Tuesday, February 16th | 6.30 PM – 9.30 PM | Mozilla
(…)**` contains `|`, so kramdown reads it as a table row. The page shows a
table with literal `**` in its cells.

**Fix:** escape the pipes (`\|`) or replace them with another separator.

## 11. Malformed `sizes` on meetup images

**Where:** `_data/picture.yml`.

Meetup images get `sizes="((max-width: 600px)) 100vw, () 690px"`.
jekyll_picture_tag wraps media queries in parentheses itself, and takes the
unconditional size from `size:`, not from a `default` key under `sizes:`.
Browsers drop the invalid entry, and there's only one WebP candidate, so the
effect is small.

**Fix:** `mobile: "max-width: 600px"` under `media_queries`, and
`size: 690px` in place of `sizes: default: 690px`.

## 12. `CLAUDE.md` and `GEMINI.md` are published

**Where:** `_config.yml`, `exclude:`.

https://civictech.ca/CLAUDE.md and `/GEMINI.md` return 200, while
`/README.md` returns 404. The `exclude:` list covers the other repo docs but
predates these two files (added 2026-02). Probably unintended; the content is
harmless.

**Fix:** add both to `exclude:`.

## 13. `/projects/` uses a filter that doesn't exist

**Where:** `_pages/list-projects.md`.

`all_projects | reject: "tags", "from/breakout"` is meant to leave out
breakout projects, but neither Jekyll 4.3.4 nor Liquid 4.0.4 has `reject`.
Liquid silently returns the input, so "Other Community Projects" lists every
project. There's no visible effect today, because no project is tagged
`from/breakout`.

**Fix:** `where_exp: "item", "item.tags contains 'from/breakout'"` with
`unless` in the loop, or build the list with a `for`/`unless`.

## 14. `/resources/` repeats one `id` in every group

**Where:** `_pages/list-resources.md`.

Each category group's list is `<div id="resourcesList" class="card-list">`,
so the page has 13 elements with the same `id`. Pa11y (WCAG 2 AA, rule F77)
reports it on https://civictech.ca/resources/ (checked 2026-10-30). Nothing
in the CSS or JavaScript uses the `id`; it has been there since the page moved
to `_pages/`.

**Fix:** drop the `id`.
