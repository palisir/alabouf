# Map Markers

This directory contains source SVGs and generated PNG markers for the map.

## Source Files (SVG)

Place your source SVG files here:

- **`marker-regular-source.svg`** - Source SVG for regular restaurants
- **`marker-favorite-source.svg`** - Source SVG for favorite restaurants (same design with different colored part)

## Generated Files (PNG)

The generation script creates optimized PNG markers:

- **`marker-regular.png`** - Generated PNG for regular restaurants (48x48px)
- **`marker-favorite.png`** - Generated PNG for favorite restaurants (48x48px)

## Usage

1. Place your source SVG files in this directory with the `-source.svg` suffix
2. Run `bun run generate-icons` from the project root
3. The script will generate optimized PNG markers
4. The Map component automatically loads the PNGs and uses them based on the `favorite` property

## SVG Requirements

- SVGs should be optimized and ready for use as map markers
- Recommended viewBox: 24x24px to 48x48px
- The anchor point will be at the bottom center of the icon (typical for map pins)
- Ensure SVGs are properly formatted

## Why PNG Instead of SVG?

- **Better performance**: PNG markers are faster to load and render, especially with many markers
- **GPU optimized**: Already rasterized, no conversion needed
- **Consistent rendering**: No browser differences in SVG rendering

## Notes

- The markers are loaded asynchronously when the map initializes
- The `icon-anchor` is set to `"bottom"` so the marker point aligns with the coordinates
- Icon size can be adjusted via the `icon-size` property in `Map.tsx` (currently set to 1)
- Marker size is set to 48x48px in the generation script - adjust `MARKER_SIZE` in `scripts/generate-icons.ts` if needed

