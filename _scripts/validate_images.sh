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
