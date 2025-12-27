import sharp from "sharp";
import { readFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const SOURCE_SVG = "public/icons/icon-source.svg";
const OUTPUT_DIR = "public/icons";

// Icon sizes to generate
const ICON_SIZES = {
  favicons: [16, 32, 48],
  apple: [180],
  pwa: [192, 512],
};

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

generateIcons();


