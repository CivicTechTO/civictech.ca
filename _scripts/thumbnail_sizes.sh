# In order to avoid layout shift when lazy loading the images
# on the hacknights page, we need to make their dimensions
# available to the server so we can render correct placeholder.
#
# This script runs as part of the build process.

thumb_dir="assets/images/hacknights/thumbnails"
thumbs=($thumb_dir/*.jpg)

file=$thumb_dir/thumbs.json

# wipe the contents
touch $file
truncate -s 0 $file
echo "{" >> $file

for thumb in "${thumbs[@]}" ; do
  filename=$(basename "$thumb")
  dimensions=$(magick identify -format "%w,%h\n" "$thumb")
  echo "  \"$filename\": \"$dimensions\"," >> $file
done

echo "  \"coda\": \"\"\n}" >> $file
