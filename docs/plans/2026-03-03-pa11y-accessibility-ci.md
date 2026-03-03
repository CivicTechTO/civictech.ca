# Pa11y Accessibility CI — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `ci.yml` GitHub Actions workflow that builds the Jekyll site once on every PR, then runs Pa11y WCAG2AA accessibility checks against a representative set of rendered pages.

**Architecture:** A single `ci.yml` workflow with two jobs: `build` (produces `_site/` artifact) and `accessibility` (downloads artifact, runs Pa11y against one HTML file per layout type). The two-job structure avoids duplicating the expensive Jekyll build and makes it easy to add further checks (broken links, etc.) as additional jobs later. The check fails naturally when Pa11y finds violations — it is advisory because it is not listed in branch protection required status checks.

**Tech Stack:** Jekyll 4, GitHub Actions, Pa11y v9 (Node.js CLI — the GitHub-hosted `ubuntu-latest` runner ships with Node 20+, so no explicit Node setup step is required)

---

### Task 1: Create `.github/workflows/ci.yml`

**Files:**
- Create: `.github/workflows/ci.yml`

**Step 1: Create the workflow file**

```yaml
name: CI

on:
  pull_request:
    branches:
      - main

permissions:
  contents: read

jobs:
  build:
    name: Build Jekyll site
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository (with submodules)
        uses: actions/checkout@v4
        with:
          submodules: recursive

      - name: Set up Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true
          cache-version: 0

      - name: Install system dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y libvips libvips-dev imagemagick

      - name: Generate tag and category data
        run: make generate

      - name: Build Jekyll site
        run: bundle exec jekyll build

      - name: Upload built site artifact
        uses: actions/upload-artifact@v4
        with:
          name: site
          path: _site/
          retention-days: 1

  accessibility:
    name: Accessibility (Pa11y)
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Download built site artifact
        uses: actions/download-artifact@v4
        with:
          name: site
          path: _site/

      - name: Install Pa11y
        run: npm install -g pa11y

      - name: Run Pa11y on representative pages
        run: |
          FAILED=0

          run_pa11y() {
            local label="$1"
            local glob="$2"
            local file
            file=$(find _site/$glob -name "index.html" 2>/dev/null | sort | head -1)
            if [ -z "$file" ]; then
              echo "SKIP [$label]: no file found at _site/$glob"
              return
            fi
            echo ""
            echo "=== $label: $file ==="
            pa11y --standard WCAG2AA "$file" || FAILED=1
          }

          run_pa11y "Homepage"     ""
          run_pa11y "Event"        "events"
          run_pa11y "Project"      "projects"
          run_pa11y "Person"       "people"
          run_pa11y "Organization" "organizations"
          run_pa11y "Venue"        "venues"
          run_pa11y "Resource"     "resources"
          run_pa11y "Tag"          "tags"
          run_pa11y "Category"     "categories"

          exit $FAILED
```

**Step 2: Verify the `make generate` step works**

The `Makefile` has a `generate` target that runs all four `_scripts/generate_*.sh` scripts. Confirm it exists:

```bash
grep -n "^generate:" Makefile
```

Expected output: a line like `generate: generate-data generate-pages`

**Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "feat: add CI workflow with Pa11y accessibility checks on PRs"
```

---

### Task 2: Open the GitHub issue

**Step 1: Create the issue**

```bash
gh issue create \
  --title "Add automated accessibility checks (Pa11y) to PR workflow" \
  --body "$(cat <<'EOF'
## Summary

Adds a \`ci.yml\` GitHub Actions workflow that builds the Jekyll site on every PR and runs Pa11y WCAG2AA accessibility checks against a representative set of rendered pages.

## Design decisions

- **Two-job structure:** \`build\` job produces \`_site/\` artifact; \`accessibility\` job downloads it and runs Pa11y. Avoids duplicating the expensive Jekyll build. Additional check jobs (broken links, etc.) can be added later using the same artifact.
- **Tool:** Pa11y v9 with WCAG2AA standard (HTML_CodeSniffer runner). Accepts local file paths directly — no local server required.
- **Scope:** One representative page per layout type — homepage, event, project, person, organization, venue, resource, tag, category. Sufficient to catch template-level issues without scanning hundreds of generated pages.
- **Advisory:** The check fails normally (red X) when violations are found, but is not listed in branch protection required status checks, so it never blocks merge. This is the correct GitHub-native way to implement advisory checks — the advisory/blocking distinction is a repo settings concern, not a workflow concern.

## Implementation

PR: (link PR here)
EOF
)"
```

---

### Task 3: Validate the workflow

After pushing the branch and opening a PR:

**Step 1: Confirm both jobs appear in the PR checks UI**

Navigate to PR → Checks tab. You should see:
- `CI / Build Jekyll site`
- `CI / Accessibility (Pa11y)`

**Step 2: Confirm the artifact handoff works**

In the `Build Jekyll site` job log, confirm the "Upload built site artifact" step completes successfully and shows the file count.

In the `Accessibility (Pa11y)` job log, confirm the "Download built site artifact" step downloads successfully before Pa11y runs.

**Step 3: Confirm representative pages are found**

In the Pa11y step log, confirm each `run_pa11y` call prints `=== Label: _site/path/index.html ===` rather than a `SKIP` line. If any show `SKIP`, the `find` path for that layout needs adjustment.

**Step 4: Confirm advisory behaviour**

If Pa11y finds violations and the job shows red, confirm the PR merge button is still active (not blocked). This verifies the check is correctly advisory.

---

### Notes

- The `feedback_token` injection step from `pages.yml` is intentionally omitted — it requires a `FEEDBACK_TOKEN` secret not available in fork PRs, and is not needed for accessibility scanning.
- Pa11y v9 requires Node 20+. GitHub-hosted `ubuntu-latest` runners ship with Node 20, so no explicit Node setup step is needed.
- The `Homepage` entry passes an empty string to `find _site/` — this will locate `_site/index.html`. This is correct behaviour.
- If a collection has no content rendered (e.g. `announcements`), the `SKIP` message is informational and does not count as a failure.
- Pa11y's default HTML_CodeSniffer runner covers more WCAG criteria than axe-core. If the team later wants results consistent with the axe browser extension, add `--runner axe` to the `pa11y` invocation.
- `retention-days: 1` on the artifact keeps storage usage minimal — the artifact only needs to live long enough for the `accessibility` job to download it.
