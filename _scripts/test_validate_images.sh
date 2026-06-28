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
