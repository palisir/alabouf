# Icons Directory

This directory contains all icon assets for the alabouf website.

## Usage

1. Place your source SVG at `icon-source.svg` in this directory
2. Run `bun run generate-icons` from the project root
3. The script will generate all required icon variants automatically

## Generated Files

The generation script creates the following icons:

### Favicons
- `favicon-16x16.png` - Standard favicon (16x16)
- `favicon-32x32.png` - Standard favicon (32x32)
- `favicon-48x48.png` - Standard favicon (48x48)
- `favicon.svg` - SVG favicon for modern browsers

### Apple Touch Icons
- `apple-touch-icon.png` - Apple touch icon (180x180)

### PWA Icons
- `icon-192x192.png` - PWA icon (192x192)
- `icon-512x512.png` - PWA icon (512x512)
- `icon-512x512-maskable.png` - Maskable PWA icon with safe zone padding

### Safari
- `safari-pinned-tab.svg` - Safari pinned tab icon

## Notes

- All icons are automatically declared in `app/layout.tsx` via Next.js metadata API
- The PWA manifest is located at `public/manifest.json`
- Maskable icons have 10% padding to ensure content fits within the safe zone


