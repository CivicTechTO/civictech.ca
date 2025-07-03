thumb_dir="assets/images/hacknights/thumbnails"
thumbs=($thumb_dir/*.jpg)

touch "$thumb_dir/thumbs.json"
truncate -s 0 "$thumb_dir/thumbs.json"
echo "{" >> "$thumb_dir/thumbs.json"

for thumb in "${thumbs[@]}" ; do
  filename=$(basename "$thumb")

  echo $filename

  # Record dimensions
  dimensions=$(magick identify -format "%w,%h\n" "$thumb")

  echo "  \"$filename\": \"$dimensions\"," >> "$thumb_dir/thumbs.json"
done

echo "  \"coda\": \"\"\n}" >> "$thumb_dir/thumbs.json"
