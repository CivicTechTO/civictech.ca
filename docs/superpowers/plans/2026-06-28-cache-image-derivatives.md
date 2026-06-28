# Cache Image Derivatives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cache `jekyll_picture_tag` derivatives across CI builds so unchanged-content builds regenerate no historical images.

**Architecture:** Add one `actions/cache@v4` step to the Pages workflow that restores/saves `_site/assets/thumbs` keyed on a hash of `archives/images/**`. JPT skips any derivative whose output file already exists, so a restored cache eliminates regeneration; a content-varying key plus `restore-keys` makes new/changed images regenerate and persist.

**Tech Stack:** GitHub Actions (`actions/cache@v4`), Jekyll 4, `jekyll_picture_tag` 2.1.3, libvips/imagemagick.

## Global Constraints

- Cache path is exactly `_site/assets/thumbs` (JPT's destination; protected by Jekyll `keep_files`). Not `assets/thumbs`.
- Cache key: `jpt-thumbs-${{ hashFiles('archives/images/**') }}`; restore-keys: `jpt-thumbs-`.
- The new step must sit **before** the `Build Jekyll site` step and **after** checkout.
- Do not commit generated derivatives to git. Do not cache any path other than `_site/assets/thumbs`.
- Out of scope: the `hacknight_549.avif` warning (#141) and image-source validation (#142).
- Branch: `cache-image-derivatives`.

---

### Task 1: Add the derivative cache step to the Pages workflow

**Files:**
- Modify: `.github/workflows/pages.yml` (insert a step immediately before `- name: Build Jekyll site` at line ~82)

**Interfaces:**
- Consumes: nothing from prior tasks.
- Produces: a cache keyed `jpt-thumbs-*` containing `_site/assets/thumbs`, consumed implicitly by every subsequent CI build.

- [ ] **Step 1: Insert the cache step**

In `.github/workflows/pages.yml`, locate:

```yaml
      # Outputs to the './_site' directory by default
      - name: Build Jekyll site
        run: |
          bundle exec jekyll build
```

Insert this step immediately **before** the `# Outputs to the './_site' directory by default` comment, at the same indentation as the other steps:

```yaml
      - name: Cache generated image derivatives
        uses: actions/cache@v4
        with:
          path: _site/assets/thumbs
          key: jpt-thumbs-${{ hashFiles('archives/images/**') }}
          restore-keys: |
            jpt-thumbs-

```

- [ ] **Step 2: Verify the YAML parses**

Run: `ruby -ryaml -e "YAML.load_file('.github/workflows/pages.yml'); puts 'YAML OK'"`
Expected: `YAML OK`

- [ ] **Step 3: Verify the step is positioned correctly**

Run: `grep -n "Cache generated image derivatives\|Build Jekyll site\|actions/cache" .github/workflows/pages.yml`
Expected: the `Cache generated image derivatives` and `actions/cache@v4` lines appear at a lower line number than `Build Jekyll site`.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/pages.yml
git commit -m "ci: cache jekyll_picture_tag derivatives across builds (#140)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Document the caching behaviour

**Files:**
- Modify: `README.md` (append a note under the `### Common Issues` section, before `## Development Scripts` at line ~91)
- Modify: `CLAUDE.md` (extend the `### Image Handling` section)

**Interfaces:**
- Consumes: the cache key/path conventions from Task 1.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add a README note**

In `README.md`, immediately before the line `## Development Scripts`, insert:

```markdown
**Image Derivative Caching**
CI caches generated image thumbnails (`_site/assets/thumbs`) keyed on the contents of `archives/images/`, so unchanged images are not regenerated. Locally, `_site` persists between builds, so repeat builds are already incremental — running `make clean` wipes `_site` and forces a full regeneration on the next build.

```

- [ ] **Step 2: Extend the CLAUDE.md Image Handling section**

In `CLAUDE.md`, find the `### Image Handling` paragraph ending with:

```
The `assets/thumbs/` directory is gitignored and regenerated at build time.
```

Append immediately after it:

```markdown

`jekyll_picture_tag` only generates a derivative when its output file is absent in the Jekyll destination (`_site/assets/thumbs`), which Jekyll preserves across builds via `keep_files`. CI caches that directory (`actions/cache`, keyed on `archives/images/**`) so unchanged builds regenerate nothing. Generated filenames embed an MD5 of the source image, so a changed source regenerates correctly; `make clean` forces a full local rebuild.
```

- [ ] **Step 3: Verify both edits landed**

Run: `grep -n "Image Derivative Caching" README.md && grep -n "keep_files" CLAUDE.md`
Expected: one match in each file.

- [ ] **Step 4: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: document image derivative caching behaviour (#140)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Verify the speedup locally (cold vs. warm build)

**Files:** none modified — this task validates Task 1's premise that JPT skips existing derivatives.

**Interfaces:**
- Consumes: a working local toolchain (libvips + imagemagick installed; submodules initialised).
- Produces: timing evidence for the PR description / acceptance criteria.

> **Note:** Each `jekyll build` takes ~90s. Per the user's standing preference, **the user runs these commands** and reports output; the agent does not run them directly.

- [ ] **Step 1: Cold build (no cache)**

Provide the user this command and ask them to paste the tail of the output:

```bash
make clean && time bundle exec jekyll build 2>&1 | tee /tmp/jpt-cold.log; \
echo "Generated this run: $(grep -c 'Generating new image file' /tmp/jpt-cold.log)"
```

Expected: a large non-zero `Generated this run:` count (hundreds) and a build time in the ~90s range.

- [ ] **Step 2: Warm build (derivatives already in `_site`)**

```bash
time bundle exec jekyll build 2>&1 | tee /tmp/jpt-warm.log; \
echo "Generated this run: $(grep -c 'Generating new image file' /tmp/jpt-warm.log)"
```

Expected: `Generated this run: 0` and a materially shorter build time than the cold run. This confirms the skip-if-exists behaviour the CI cache relies on.

- [ ] **Step 3: Record results**

Capture the two timings and the two `Generated this run:` counts for the PR description. No commit (no files changed).

---

### Task 4: Open the pull request

**Files:** none.

- [ ] **Step 1: Push the branch**

```bash
git push -u origin cache-image-derivatives
```

- [ ] **Step 2: Open the PR**

```bash
gh pr create --title "Cache image derivatives across builds (#140)" --body "$(cat <<'EOF'
Closes #140.

Adds an `actions/cache@v4` step caching `_site/assets/thumbs` (jekyll_picture_tag's output, preserved across builds via `keep_files`) keyed on `archives/images/**`, so unchanged-content CI builds regenerate no historical derivatives.

## Why it's safe
JPT generated filenames embed an MD5 of the source content (`{name}-{width}-{hash}.webp`), so a changed source produces a new filename and regenerates correctly — no stale-image risk. Only `_site/assets/thumbs` is cached, never HTML.

## Verification
Local cold vs. warm build:
- Cold (`make clean` first): <COLD_COUNT> images generated, <COLD_TIME>.
- Warm: 0 images generated, <WARM_TIME>.

Will confirm the same pattern in post-merge CI logs.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Fill the `<COLD_*>` / `<WARM_*>` placeholders from Task 3 before running.

---

## Notes for the implementer

- After merge, watch the next two CI runs: the first populates the cache; a subsequent no-image-change run should show no `Generating new image file:` lines and a reduced build time. That closes the loop on the acceptance criteria.
