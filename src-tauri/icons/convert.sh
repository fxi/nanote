#!/bin/bash
for size in 16 20 24 32 40 48 64 96 128 256 512 1024; do
  magick  -background none -density 300  logo.svg -define png:color-type=6 -resize ${size}x${size} icon-${size}x${size}.png
done
