import sharp from "sharp";
import { readFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const SOURCE_SVG = "public/icons/icon-source.svg";
const OUTPUT_DIR = "public/icons";

const MARKER_SOURCE_REGULAR = "public/markers/marker-regular-source.svg";
const MARKER_SOURCE_FAVORITE = "public/markers/marker-favorite-source.svg";
const MARKER_OUTPUT_DIR = "public/markers";

// Icon sizes to generate
const ICON_SIZES = {
  favicons: [16, 32, 48],
  apple: [180],
  pwa: [192, 512],
};

// Marker size (PNG will be generated at this size)
const MARKER_SIZE = 48;

async function generateIcons() {
  console.log("🎨 Starting icon generation...\n");

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`✅ Created output directory: ${OUTPUT_DIR}\n`);
  }

  // Check if source SVG exists
  if (!existsSync(SOURCE_SVG)) {
    console.error(`❌ Source SVG not found at: ${SOURCE_SVG}`);
    console.log(
      `\nPlease place your source SVG at ${SOURCE_SVG} and run this script again.`
    );
    process.exit(1);
  }

  const svgBuffer = readFileSync(SOURCE_SVG);

  try {
    // Generate favicon sizes
    console.log("📱 Generating favicons...");
    for (const size of ICON_SIZES.favicons) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(join(OUTPUT_DIR, `favicon-${size}x${size}.png`));
      console.log(`  ✓ favicon-${size}x${size}.png`);
    }

    // Generate Apple touch icon
    console.log("\n🍎 Generating Apple touch icon...");
    await sharp(svgBuffer)
      .resize(ICON_SIZES.apple[0], ICON_SIZES.apple[0])
      .png()
      .toFile(join(OUTPUT_DIR, "apple-touch-icon.png"));
    console.log(`  ✓ apple-touch-icon.png`);

    // Generate PWA icons
    console.log("\n📦 Generating PWA icons...");
    for (const size of ICON_SIZES.pwa) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(join(OUTPUT_DIR, `icon-${size}x${size}.png`));
      console.log(`  ✓ icon-${size}x${size}.png`);
    }

    // Generate maskable icon (512x512 with padding for safe zone)
    console.log("\n🎭 Generating maskable icon...");
    const maskableSize = 512;
    const padding = Math.round(maskableSize * 0.1); // 10% padding on each side
    const iconSize = maskableSize - padding * 2;

    await sharp(svgBuffer)
      .resize(iconSize, iconSize)
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(join(OUTPUT_DIR, "icon-512x512-maskable.png"));
    console.log(`  ✓ icon-512x512-maskable.png`);

    // Copy the source SVG as favicon.svg
    console.log("\n🎨 Copying source SVG...");
    const fs = await import("fs/promises");
    await fs.copyFile(SOURCE_SVG, join(OUTPUT_DIR, "favicon.svg"));
    console.log(`  ✓ favicon.svg`);

    // Copy for Safari pinned tab
    await fs.copyFile(SOURCE_SVG, join(OUTPUT_DIR, "safari-pinned-tab.svg"));
    console.log(`  ✓ safari-pinned-tab.svg`);

    console.log("\n✨ All icons generated successfully!");
    console.log(`\nOutput directory: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error("\n❌ Error generating icons:", error);
    process.exit(1);
  }
}

async function generateMarkers() {
  console.log("📍 Starting marker generation...\n");

  // Ensure output directory exists
  if (!existsSync(MARKER_OUTPUT_DIR)) {
    mkdirSync(MARKER_OUTPUT_DIR, { recursive: true });
    console.log(`✅ Created output directory: ${MARKER_OUTPUT_DIR}\n`);
  }

  // Check if source SVGs exist
  const hasRegular = existsSync(MARKER_SOURCE_REGULAR);
  const hasFavorite = existsSync(MARKER_SOURCE_FAVORITE);

  if (!hasRegular && !hasFavorite) {
    console.log(
      `ℹ️  No marker sources found. Skipping marker generation.\n` +
        `   Place your marker SVGs at:\n` +
        `   - ${MARKER_SOURCE_REGULAR}\n` +
        `   - ${MARKER_SOURCE_FAVORITE}\n`
    );
    return;
  }

  try {
    if (hasRegular) {
      console.log("📍 Generating regular marker...");
      const regularSvg = readFileSync(MARKER_SOURCE_REGULAR);
      // Resize maintaining aspect ratio with transparent padding to make square
      await sharp(regularSvg)
        .resize(MARKER_SIZE, MARKER_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(join(MARKER_OUTPUT_DIR, "marker-regular.png"));
      console.log(`  ✓ marker-regular.png`);
    } else {
      console.log(`⚠️  Regular marker source not found: ${MARKER_SOURCE_REGULAR}`);
    }

    if (hasFavorite) {
      console.log("\n❤️  Generating favorite marker...");
      const favoriteSvg = readFileSync(MARKER_SOURCE_FAVORITE);
      // Resize maintaining aspect ratio with transparent padding to make square
      await sharp(favoriteSvg)
        .resize(MARKER_SIZE, MARKER_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(join(MARKER_OUTPUT_DIR, "marker-favorite.png"));
      console.log(`  ✓ marker-favorite.png`);
    } else {
      console.log(`⚠️  Favorite marker source not found: ${MARKER_SOURCE_FAVORITE}`);
    }

    console.log("\n✨ Markers generated successfully!");
    console.log(`\nOutput directory: ${MARKER_OUTPUT_DIR}`);
  } catch (error) {
    console.error("\n❌ Error generating markers:", error);
    process.exit(1);
  }
}

async function main() {
  await generateIcons();
  console.log("\n");
  await generateMarkers();
}

main();


