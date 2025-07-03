#!/bin/bash
#
# Image Processing Script for Hacknight Images and Sponsor Logos
#
# Make this script executable:
#   chmod +x img.sh
#
# Requirements:
#   - ImageMagick must be installed (for the `magick` command)
#
# Installation (on macOS using Homebrew):
#   brew install imagemagick
#
# Usage:
#   Run this script and follow the prompts to process a single image or a folder
#   into full-size and thumbnail variants for Hacknights (.jpg) or Sponsor Logos (.png).
#
# Output folders are hardcoded to:
#   - assets/images/hacknights/
#   - assets/images/hacknights/thumbnails/
#   - assets/images/organizations/
#   - assets/images/organizations/thumbnails/

echo "📷 Welcome to the Image Processing Script!"

# Step 1: Choose image type
echo "What type of images are you processing?"
echo "1) Hacknight event images (→ .jpg)"
echo "2) Sponsor logos (→ .png)"
read -p "Enter 1 or 2: " img_type

# Set defaults based on selection
if [ "$img_type" == "1" ]; then
  TYPE_NAME="Hacknight"
  FULL_SIZE="1200x1200" # Full size for Hacknight images
  THUMB_SIZE="300x300" # Thumbnail size
  OUTPUT_EXT="jpg"
  FULL_DIR="assets/images/hacknights"
  THUMB_DIR="assets/images/hacknights/thumbnails"
elif [ "$img_type" == "2" ]; then
  TYPE_NAME="Sponsor"
  FULL_SIZE="1024x1024" # Full size for Sponsor logos
  THUMB_SIZE="256x256" # Thumbnail size
  OUTPUT_EXT="png"
  FULL_DIR="assets/images/organizations"
  THUMB_DIR="assets/images/organizations/thumbnails"
else
  echo "❌ Invalid option. Exiting."
  exit 1
fi

# Step 2: Choose input type
echo "Select input type:"
echo "1) A single image file"
echo "2) A folder of images"
read -p "Enter 1 or 2: " input_type

if [ "$input_type" == "1" ]; then
  read -p "Enter the full path to the image file: " IMAGE_FILE
  if [ ! -f "$IMAGE_FILE" ]; then
    echo "❌ File not found. Exiting."
    exit 1
  fi
  FILE_LIST=("$IMAGE_FILE")
elif [ "$input_type" == "2" ]; then
  read -p "Enter the path to the folder containing images: " INPUT_DIR
  if [ ! -d "$INPUT_DIR" ]; then
    echo "❌ Folder not found. Exiting."
    exit 1
  fi
  FILE_LIST=("$INPUT_DIR"/*.{jpg,jpeg,png})
else
  echo "❌ Invalid option. Exiting."
  exit 1
fi

# Create output folders if needed
mkdir -p "$FULL_DIR"
mkdir -p "$THUMB_DIR"

# Step 3: Process images
echo "🚀 Processing ${#FILE_LIST[@]} image(s) for $TYPE_NAME..."

for img in "${FILE_LIST[@]}"; do
  [ -e "$img" ] || continue

  filename=$(basename "$img")
  base="${filename%.*}"

  echo "→ Processing $filename..."

  # Standard image
  magick "$img" -resize "$FULL_SIZE"\> -strip "$FULL_DIR/$base.$OUTPUT_EXT"

  # Thumbnail image
  magick "$img" -resize "$THUMB_SIZE"\> -strip "$THUMB_DIR/$base.$OUTPUT_EXT"
done


echo "✅ Done! Images saved to:"
echo "   - $FULL_DIR"
echo "   - $THUMB_DIR"
