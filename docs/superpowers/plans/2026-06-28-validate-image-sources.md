# Meetup Image Source Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a build-time check that fails when a meetup's `image:` front matter points at a source file missing from `archives/images/events/`.

**Architecture:** A standalone bash script (`_scripts/validate_images.sh`) following the existing `_scripts/*.sh` conventions, with `ARCHIVES_DIR` overridable for fixture-based tests. It is exposed locally via a `make validate` target and run on pull requests via a step in `ci.yml`. The push-to-`main` deploy (`pages.yml`) and `make generate` are deliberately left untouched so production deploys are never gated by this check.

**Tech Stack:** Bash, GNU/BSD coreutils (`grep`, `sed`), GNU Make, GitHub Actions.

## Global Constraints

- Scope is **meetups only** (`archives/_meetups/*.md`); source dir is `archives/images/events/`.
- Skip `image:` values that are empty or begin with `http://` / `https://` (external URLs).
- Script **exits 1** if any source is missing, **exits 0** otherwise.
- `ARCHIVES_DIR` env var overrides the archives root (default `archives`); source dir is `$ARCHIVES_DIR/images/events`.
- Do **not** modify `pages.yml` or the `make generate` target — deploy must not be gated.
- Follow existing script style: `#!/bin/bash`, `set -euo pipefail`, emoji progress output (🔍 / ❌ / ✅).
- Branch: `validate-image-sources`.
- **Sequencing:** this check fails on the pre-existing #549 (`hacknight_549.avif`) until issue #141 (archives PR CivicTechTO/archives#26) is merged and the submodule pointer is updated. That is correct behaviour, not a bug in this work — see Task 5.

---

### Task 1: Create the validator script with its test (TDD)

**Files:**
- Create: `_scripts/validate_images.sh`
- Create: `_scripts/test_validate_images.sh`

**Interfaces:**
- Produces: an executable `_scripts/validate_images.sh` that reads `ARCHIVES_DIR` (default `archives`), scans `$ARCHIVES_DIR/_meetups/*.md`, and exits 1 if any non-URL `image:` value is missing from `$ARCHIVES_DIR/images/events/`, else 0. Consumed by Task 2 (`make validate`, `ci.yml`).

- [ ] **Step 1: Write the failing test**

Create `_scripts/test_validate_images.sh`:

```bash
#!/bin/bash
# Fixture-based tests for validate_images.sh. Each case builds a temp ARCHIVES_DIR.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VALIDATOR="$SCRIPT_DIR/validate_images.sh"
fails=0

setup_fixture() {
  mkdir -p "$1/_meetups" "$1/images/events"
}

# Case 1: source present -> exit 0
t1=$(mktemp -d); setup_fixture "$t1"
printf 'image: present.jpg\n' > "$t1/_meetups/ok.md"
: > "$t1/images/events/present.jpg"
if ARCHIVES_DIR="$t1" "$VALIDATOR" >/dev/null 2>&1; then
  echo "✅ case 1 (present) exits 0"
else
  echo "❌ case 1 (present) should exit 0"; fails=$((fails + 1))
fi

# Case 2: source missing -> exit 1, names the file and image
t2=$(mktemp -d); setup_fixture "$t2"
printf 'image: missing.avif\n' > "$t2/_meetups/bad.md"
out=$(ARCHIVES_DIR="$t2" "$VALIDATOR" 2>&1) && rc=0 || rc=$?
if [ "${rc:-0}" -eq 1 ] && printf '%s' "$out" | grep -q "bad.md" && printf '%s' "$out" | grep -q "missing.avif"; then
  echo "✅ case 2 (missing) exits 1 and names bad.md/missing.avif"
else
  echo "❌ case 2 (missing) should exit 1 naming bad.md/missing.avif (rc=${rc:-0})"; fails=$((fails + 1))
fi

# Case 3: external URL -> not flagged, exit 0
t3=$(mktemp -d); setup_fixture "$t3"
printf 'image: https://example.com/x.jpg\n' > "$t3/_meetups/url.md"
if ARCHIVES_DIR="$t3" "$VALIDATOR" >/dev/null 2>&1; then
  echo "✅ case 3 (external url) exits 0"
else
  echo "❌ case 3 (external url) should exit 0"; fails=$((fails + 1))
fi

rm -rf "$t1" "$t2" "$t3"
if [ "$fails" -gt 0 ]; then echo "❌ $fails test(s) failed"; exit 1; fi
echo "✅ all validate_images tests passed"
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `chmod +x _scripts/test_validate_images.sh && bash _scripts/test_validate_images.sh`
Expected: FAIL — the validator does not exist yet, so case 1 and case 3 report failure (and the script ultimately exits non-zero). Output includes `❌ case 1` because `"$VALIDATOR"` is not found.

- [ ] **Step 3: Write the validator**

Create `_scripts/validate_images.sh`:

```bash
#!/bin/bash
set -euo pipefail

ARCHIVES_DIR="${ARCHIVES_DIR:-archives}"
MEETUPS_DIR="$ARCHIVES_DIR/_meetups"
EVENTS_DIR="$ARCHIVES_DIR/images/events"

echo "🔍 Validating meetup image references in $MEETUPS_DIR..."

missing=0
checked=0

shopt -s nullglob
for file in "$MEETUPS_DIR"/*.md; do
  # First `image:` value, with surrounding whitespace and any quotes stripped.
  img=$(grep -m1 '^image:' "$file" 2>/dev/null | sed "s/^image:[[:space:]]*//; s/[\"']//g; s/[[:space:]]*\$//" || true)

  # Skip entries with no image or an external URL.
  [ -z "$img" ] && continue
  case "$img" in
    http://*|https://*) continue ;;
  esac

  checked=$((checked + 1))
  if [ ! -f "$EVENTS_DIR/$img" ]; then
    echo "❌ $(basename "$file") → image '$img' not found in $EVENTS_DIR/"
    missing=$((missing + 1))
  fi
done

if [ "$missing" -gt 0 ]; then
  echo "❌ $missing meetup image reference(s) missing."
  exit 1
fi

echo "✅ All $checked meetup image references resolve."
```

- [ ] **Step 4: Make it executable and run the test to verify it passes**

Run: `chmod +x _scripts/validate_images.sh && bash _scripts/test_validate_images.sh`
Expected: PASS — three ✅ lines then `✅ all validate_images tests passed`, exit 0.

- [ ] **Step 5: Commit**

```bash
git add _scripts/validate_images.sh _scripts/test_validate_images.sh
git commit -m "feat: add meetup image source validator with tests (#142)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Wire the validator into Make and CI

**Files:**
- Modify: `Makefile` (add `validate` target; extend `.PHONY`)
- Modify: `.github/workflows/ci.yml` (add a step in the `build` job before `Build Jekyll site`)

**Interfaces:**
- Consumes: `_scripts/validate_images.sh` from Task 1.
- Produces: `make validate` and a CI step both invoking the validator.

- [ ] **Step 1: Add the `validate` Make target**

In `Makefile`, immediately after the `generate: generate-data generate-pages` block, add:

```make
# Validate that meetup image references resolve to source files
validate:
	$(SCRIPTS_DIR)/validate_images.sh
```

- [ ] **Step 2: Add `validate` to `.PHONY`**

In `Makefile`, change the final line from:

```make
.PHONY: all bundle serve serve-incremental generate-data generate-pages generate update-submodules clean
```

to:

```make
.PHONY: all bundle serve serve-incremental generate-data generate-pages generate validate update-submodules clean
```

- [ ] **Step 3: Verify `make validate` runs the script**

Run: `make validate; echo "exit=$?"`
Expected: it prints the 🔍 line and either a ✅ summary (exit=0) or ❌ lines (exit=1). On this branch, before the #141 submodule bump, expect `❌ 549.md → image 'hacknight_549.avif' not found ...` and `exit=1`. This confirms the target is wired and the check is live.

- [ ] **Step 4: Add the CI step**

In `.github/workflows/ci.yml`, locate this part of the `build` job:

```yaml
      - name: Generate tag and category data
        run: make generate

      - name: Build Jekyll site
        run: bundle exec jekyll build
```

Insert a step between them so it reads:

```yaml
      - name: Generate tag and category data
        run: make generate

      - name: Validate meetup image references
        run: make validate

      - name: Build Jekyll site
        run: bundle exec jekyll build
```

- [ ] **Step 5: Verify the workflow YAML parses**

Run: `ruby -ryaml -e "YAML.load_file('.github/workflows/ci.yml'); puts 'YAML OK'"`
Expected: `YAML OK`

- [ ] **Step 6: Verify step ordering**

Run: `grep -n "Validate meetup image references\|Build Jekyll site\|Generate tag and category data" .github/workflows/ci.yml`
Expected: `Validate meetup image references` appears at a line number greater than `Generate tag and category data` and less than `Build Jekyll site`.

- [ ] **Step 7: Commit**

```bash
git add Makefile .github/workflows/ci.yml
git commit -m "ci: run meetup image validation on PRs and via make validate (#142)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Document the validation

**Files:**
- Modify: `README.md` (add a note under `### Common Issues`, before `## Development Scripts`)
- Modify: `CLAUDE.md` (extend the Data Generation / scripts guidance)

**Interfaces:** none consumed by later tasks.

- [ ] **Step 1: Add a README note**

In `README.md`, immediately before the line `## Development Scripts`, insert:

```markdown
**Validating Meetup Images**
Run `make validate` to check that every meetup's `image:` front matter points at a real file in `archives/images/events/`. CI runs this on pull requests to `main` (including the daily submodule-update PR) and fails if a referenced image is missing, so broken references are caught before they reach the site.

```

- [ ] **Step 2: Add a CLAUDE.md note**

In `CLAUDE.md`, find the `### Data Generation Pipeline` section. Immediately before the `### Navigation and Site Data` heading that follows it, insert:

```markdown
### Image Validation

`_scripts/validate_images.sh` (exposed as `make validate`) checks that every meetup's `image:` front matter resolves to a file in `archives/images/events/`, skipping external `http(s)` URLs. It exits non-zero on a missing source and runs on pull requests via `ci.yml`. It is intentionally **not** part of `make generate` or `pages.yml`, so a missing image never blocks the production deploy. Run `bash _scripts/test_validate_images.sh` to exercise the validator against fixtures.

```

- [ ] **Step 3: Verify both edits landed**

Run: `grep -n "Validating Meetup Images" README.md && grep -n "### Image Validation" CLAUDE.md`
Expected: one match in each file.

- [ ] **Step 4: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: document make validate image check (#142)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Push the branch and open the PR

**Files:** none.

**Interfaces:** none.

- [ ] **Step 1: Re-run the test suite as a final gate**

Run: `bash _scripts/test_validate_images.sh; echo "exit=$?"`
Expected: `✅ all validate_images tests passed` and `exit=0`.

- [ ] **Step 2: Push the branch**

```bash
git push -u origin validate-image-sources
```

- [ ] **Step 3: Open the PR**

```bash
gh pr create --title "Validate meetup image sources at build time (#142)" --body "$(cat <<'EOF'
Closes #142.

Adds `_scripts/validate_images.sh` (with `_scripts/test_validate_images.sh`), exposed as `make validate` and run on pull requests via `ci.yml`. It checks that every meetup's `image:` front matter resolves to a file in `archives/images/events/`, skipping external `http(s)` URLs, and exits non-zero on a missing source. This is the guard that would have caught #549 before it shipped.

Scope is meetups only — projects use external image URLs and organizations' `image:` is unrendered and lives in the main repo (see the design doc). `pages.yml` and `make generate` are untouched, so production deploys are never gated by this check.

## Dependency / sequencing
This check correctly fails on the pre-existing #549 (`hacknight_549.avif`) until #141 (CivicTechTO/archives#26) is merged and the `archives` submodule pointer is updated. CI on this PR will go green once that fix is in the pinned submodule commit.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

### Task 5: Confirm sequencing with #141 (no code)

**Files:** none. This task records the cross-issue dependency for whoever merges.

- [ ] **Step 1: Note the merge order**

For #142's own CI to pass, the `archives` submodule pinned by this branch must already contain the #549 fix:

1. Merge CivicTechTO/archives#26 (the `.avif → .png` fix).
2. Update the civictech.ca `archives` submodule pointer to that commit — either via the daily `update-submodule.yml` PR, or by merging it into this branch.
3. Re-run CI on the #142 PR; `make validate` now exits 0 and the check passes.

Until then, a red `Validate meetup image references` check on this PR is the **expected, correct** signal that the guard works — not a defect to "fix" by weakening the check.

---

## Notes for the implementer

- The validator and its test are pure bash; no Ruby/Jekyll build is required to develop or test them. Run `bash _scripts/test_validate_images.sh` for fast feedback.
- Do not add the check to `make generate` or `pages.yml`, and do not relax the non-zero exit to make this branch's CI green — the correct path to green is landing #141 (Task 5).
