# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the [civictech.ca](https://civictech.ca) website — a Jekyll 4 static site for Civic Tech Toronto, hosted on GitHub Pages.

## Development Commands

```bash
# Install Ruby dependencies
make install          # or: bundle install

# Start development server
make serve            # http://localhost:4000
make serve-incremental  # faster rebuilds

# Regenerate tag/category data and pages (required after content changes)
make generate

# Update archives submodule to latest
make update           # or: git submodule update --remote --merge

# Clean build artifacts
make clean
```

The `make generate` step must be run before serving if you've changed content in the `archives/` submodule, as it runs four shell scripts that extract tags and categories from front matter and write them to `_data/` and `tags/`/`categories/` directories.

## Architecture

### Content Lives in a Git Submodule

All actual content (meetups, projects, people, organizations, venues, resources) lives in the `archives/` submodule — a separate repository updated daily by CI. The main repo contains only templates, styles, scripts, and site configuration. When working with content, always remember to initialize submodules:

```bash
git submodule update --init --recursive
```

### Jekyll Collections

Defined in `_config.yml`, collections map to these URL paths:
- `archives/_meetups/` → `/events/`
- `archives/_projects/` → `/projects/`
- `archives/_people/` → `/people/`
- `archives/_organizations/` → `/organizations/`
- `archives/_venues/` → `/venues/`
- `archives/_resources/` → `/resources/`
- `_announcements/` → `/announcements/`

### Data Generation Pipeline

Tags and categories are not manually maintained — they're generated from collection front matter by bash scripts in `_scripts/`:

1. `generate_tag_data.sh` → writes `_data/tags.yml`
2. `generate_tag_pages.sh` → writes `tags/*.html`
3. `generate_category_data.sh` → writes `_data/categories.yml`
4. `generate_category_pages.sh` → writes `categories/*.html`

The CI build (`.github/workflows/pages.yml`) always runs `make generate` before `jekyll build`. Do not manually edit files in `tags/`, `categories/`, or `_data/tags.yml`/`_data/categories.yml` — they will be overwritten.

### Navigation and Site Data

Site-wide data is in `_data/`:
- `navigation.yml` — header/footer nav structure
- `footer_social.yml` — social links with `rel` attribute support (used for Mastodon verification)
- `featured_topics.yml` — homepage featured topics

### Image Handling

The `jekyll_picture_tag` plugin processes images from `archives/images/` and caches generated thumbnails in `assets/thumbs/`. This requires `libvips` and `imagemagick` to be installed locally. The `assets/thumbs/` directory is gitignored and regenerated at build time.

## CI/CD

- **`pages.yml`**: Triggers on push to `main`. Runs `make generate`, then `jekyll build`, then deploys to GitHub Pages.
- **`update-submodule.yml`**: Runs daily at midnight UTC, creates a PR to bump the `archives` submodule to its latest master commit.

## Ruby Version

The project requires Ruby 3.2.2 (specified in `.ruby-version`). Use `rbenv` or `rvm` to manage this.
