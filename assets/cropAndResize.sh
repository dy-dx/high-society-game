#!/bin/bash
set -euo pipefail

crop_w="1232"
crop_h="1864"
crop_reso="${crop_w}x${crop_h}"
# 1/2 the crop resolution
resize_reso="616x932"
# 1/4
# resize_reso="308x466"

for srcfile in source/*.png; do
  w="$(identify -format "%w" "$srcfile")"
  h="$(identify -format "%h" "$srcfile")"
  if [ -z "$w" ] || (( w < crop_w )); then echo "$srcfile width $w not less than $crop_w"; exit 1; fi
  if [ -z "$h" ] || (( h < crop_h )); then echo "$srcfile height $h not less than $crop_h"; exit 1; fi
  echo "'$srcfile' has suitable dimensions ${w}x${h}"
done

mkdir -p images
for srcpath in source/*.png; do
  filename="$(basename "$srcpath" .png)"
  outpath="images/$filename.jpg"
  echo "converting $filename.png to $outpath"
  convert "$srcpath" -gravity center -crop "$crop_reso+0+0" -resize "$resize_reso" -strip -quality "85%" +repage "$outpath"
done
