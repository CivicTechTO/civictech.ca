# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the [civictech.ca](https://civictech.ca) website — a Hugo static site for Civic Tech Toronto, hosted on GitHub Pages.

## Development Commands

```bash
make serve      # hugo server, http://localhost:1313
make build      # hugo --gc, writes public/
make check      # build, then scripts/check_output.py
make validate   # meetup image references resolve
make update     # bump the archives submodule
make clean      # remove public/ and resources/ (processed-image cache)
```

Requires Hugo extended ≥ 0.153 (CI pins 0.169.0) and Python 3 for the checks. No Ruby.

## Architecture

### Content Lives in a Git Submodule

All actual content (meetups, projects, people, organizations, venues, resources, announcements) lives in the `archives/` submodule — a separate repository updated daily by CI. Hugo mounts it read-only through `module.mounts` in `hugo.toml`; never modify files in `archives/` from this repo. Initialize it with:

```bash
git submodule update --init --recursive
```

### Collections and URLs

Mounted in `hugo.toml`, with permalinks from each file's name (Hugo lowercases and hyphenates them):
- `archives/_meetups/` → `/events/` (`390.md` and `Weather Report Card.md` are excluded; see below)
- `archives/_projects/` → `/projects/`
- `archives/_people/` → `/people/`
- `archives/_organizations/` → `/organizations/`
- `archives/_venues/` → `/venues/`
- `archives/_resources/` → `/resources/`
- `archives/_announcements/` → `/announcements/`

Site pages are in `content/`. Templates are in `layouts/` (per-collection `layouts/<section>/page.html`, shared pieces in `layouts/_partials/`). Static CSS, JS and images are in `static/assets/`; meetup images are processed from `archives/images/events/`.

### Tags and Categories

Hugo taxonomies (`tags`, `categories`) built from front matter. Terms are namespaced (`topic/open-data`); each namespace must be listed in `params.namespaces` in `hugo.toml`, or the build stops. `content/_content.gotmpl` adds a page per namespace.

### Redirects

Old URLs are listed in `assets/redirects.csv` (`from,to`; `to` is a site path or an archive record like `_meetups/99.md`). The build writes a redirect page per row, and `404.html` forwards the old mixed-case/space URLs in JavaScript (GitHub Pages can't serve those paths). The build stops if an archive `redirect_from` is missing from the CSV.

### Workarounds

Code that works around archive data Hugo can't read as Jekyll did is labelled `ARCHIVE-COMPAT(<id>)` and listed in `docs/hugo-migration.md`. Each goes away with the planned archive refactor; don't remove one before the archive data is fixed.

## CI/CD

- **`ci.yml`**: on pull requests to `main` and `v2`. Runs `make validate`, builds with Hugo, runs `scripts/check_output.py`, then Pa11y (WCAG 2 AA) and posts a report comment.
- **`pages.yml`**: on push to `main` (and weekly). Builds with Hugo and deploys `public/` to GitHub Pages. The feedback page's token comes from the `FEEDBACK_TOKEN` secret via `HUGO_PARAMS_FEEDBACKTOKEN`.
- **`update-submodule.yml`**: daily, opens a PR bumping the `archives` submodule.

Processed images are cached in `resources/_gen` (keyed on `archives/images/**`).

## Branches

Until the switch to Hugo, `main` is the live Jekyll site and `v2` is this Hugo version. See "Working on v2" in `docs/hugo-migration.md` for keeping the two in step.
