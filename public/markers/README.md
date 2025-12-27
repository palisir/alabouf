# Map Markers

This directory contains custom SVG markers for the map.

## Required Files

Place your SVG files here:

- **`marker-regular.svg`** - Marker icon for regular restaurants
- **`marker-favorite.svg`** - Marker icon for favorite restaurants (currently displayed in red)

## Usage

The Map component automatically loads these SVGs and uses them based on the `favorite` property of each restaurant.

## SVG Requirements

- SVGs should be optimized and ready for use as map markers
- Recommended size: 24x24px to 48x48px viewBox
- The anchor point will be at the bottom center of the icon (typical for map pins)
- Ensure SVGs are properly formatted and can be loaded by Mapbox GL JS

## Notes

- The markers are loaded asynchronously when the map initializes
- The `icon-anchor` is set to `"bottom"` so the marker point aligns with the coordinates
- Icon size can be adjusted via the `icon-size` property in `Map.tsx` (currently set to 1)

