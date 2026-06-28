# Validate meetup image sources at build time (issue #142)

## Problem

Meetup #549's front matter referenced `hacknight_549.avif` while the source
file was `hacknight_549.png`. Nothing validated the reference, so it surfaced
only as a runtime `jekyll_picture_tag` warning and a broken image in production:

```
Jekyll Picture Tag Warning: JPT Could not find .../archives/images/events/hacknight_549.avif. Your site will have broken images. Continuing.
```

Because content is hand-authored in the auto-updated `archives/` submodule, the
next such mismatch would ship the same silent way.

## Goal

Catch a meetup whose `image:` source file is missing **before** it merges,
with a clear error naming the file — rather than as a buried build warning.

## Scope

**Meetups only.** Investigation of the collections that carry an `image:` field:

- **Meetups** (`archives/_meetups/`): `image:` is a bare filename rendered via
  `{% picture events /events/{{ page.image }} %}` (`_layouts/meetup.html:92`),
  resolving to `archives/images/events/<image>`. This is the only collection
  JPT processes and the only source of the "Could not find" warning. 452 of 549
  meetups use it.
- **Projects** (`archives/_projects/`): `image:` holds **external URLs**
  (`https://…`), rendered as a plain `<img>`/og:image. Not a local file — cannot
  be validated by file existence.
- **Organizations** (`archives/_organizations/`): have `image:` front matter,
  but `organization.html` does not render it, and the referenced files live in
  the **main repo** (`assets/images/organizations/`), not the archives.

Validating projects (URLs) or organizations (unrendered, different repo) would
add path-mapping complexity for fields that produce no broken JPT image. The
validator therefore targets meetups; values beginning with `http` are skipped.

## Failure mode

The script **exits non-zero** on any missing source. It is wired into
`ci.yml`, which runs on pull requests to `main` — including the daily
auto-update-archives PR — so a bad reference fails the PR check before merge.
It is **not** added to `pages.yml` (the push-to-`main` deploy) or to
`make generate`, so a single missing image can never block deploying the whole
site. Developers can also run it locally via `make validate`.

## Design

### `_scripts/validate_images.sh` (new)

Follows the existing `_scripts/*.sh` conventions (`#!/bin/bash`,
`set -euo pipefail`, `find`, emoji progress output).

- `ARCHIVES_DIR="${ARCHIVES_DIR:-archives}"` — overridable so tests can point at
  a fixture directory.
- `EVENTS_DIR="$ARCHIVES_DIR/images/events"`.
- For each `"$ARCHIVES_DIR"/_meetups/*.md`:
  - Extract the first `image:` value; strip surrounding quotes and whitespace.
  - Skip if empty.
  - Skip if it begins with `http` (external URL — out of scope).
  - If `"$EVENTS_DIR/<image>"` does not exist, record it as missing.
- Print each miss as:
  `❌ 549.md → image 'hacknight_549.avif' not found in archives/images/events/`
- Print a final summary: `✅ All <N> meetup image references resolve` when clean,
  or `❌ <M> meetup image reference(s) missing` when not.
- **Exit 1** if any are missing; **exit 0** otherwise.

### `Makefile` (modify)

Add a `validate` target and declare it `.PHONY`:

```make
validate:
	./_scripts/validate_images.sh
```

Kept separate from `generate` — validation is a check, not data generation, and
keeping it out of `generate` keeps it off the deploy path (`pages.yml` runs
`make generate`).

### `.github/workflows/ci.yml` (modify)

Add a step to the `build` job, immediately **before** `Build Jekyll site`:

```yaml
      - name: Validate meetup image references
        run: make validate
```

`ci.yml` triggers on `pull_request` to `main` and checks out submodules
recursively, so the archives images are present and a broken reference fails the
PR.

## Data flow

```
PR to main
  -> ci.yml build job
       checkout (submodules: recursive)
       make validate        <- fails fast on a missing meetup image
       make generate
       bundle exec jekyll build
       Pa11y
```

## Testing

A test harness points `ARCHIVES_DIR` at a temporary fixture tree:

- **Pass case:** `_meetups/ok.md` with `image: present.jpg` and
  `images/events/present.jpg` on disk → script exits 0, prints the ✅ summary.
- **Fail case:** `_meetups/bad.md` with `image: missing.avif` and no matching
  source → script exits 1, output names `bad.md` and `missing.avif`.
- **External-URL case:** `_meetups/url.md` with `image: https://example.com/x.jpg`
  → not reported as missing (script exits 0 for that fixture).
- **Real-tree smoke check:** run against the working tree. With the #549 fix not
  yet merged locally it exits 1 naming `549.md`, demonstrating it catches the
  real case; after the archives fix lands it exits 0.

## Scope boundaries

- Does not validate projects (external URLs) or organizations (unrendered,
  main-repo assets).
- Does not touch `pages.yml` or `make generate`; production deploys are not
  gated by this check.
- Out of scope: the pre-existing issue that meetup `image:` bare filenames are
  also used verbatim as `og:image` URLs in `_layouts/base.html` (a separate
  social-card concern, not a JPT broken image).

## Acceptance criteria

- [ ] A meetup referencing a non-existent image source is named and fails the
      check before/at build time.
- [ ] External-URL `image:` values are not flagged as missing.
- [ ] `make validate` runs the check locally; `ci.yml` runs it on PRs to `main`.
- [ ] `pages.yml` and `make generate` are unchanged (deploy not gated).
- [ ] Dev workflow docs mention `make validate`.
