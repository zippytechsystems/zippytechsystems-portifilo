import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const imagesDir = path.resolve(rootDir, 'public/images');
const projectsDir = path.resolve(rootDir, 'public/projects');
const manifestPath = path.resolve(rootDir, 'src/data/imageManifest.json');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Ensure essential placeholders exist if not provided
const EXPECTED_IMAGES = [
  'hero-base.jpg',
  'hero-reveal.jpg',
  'founder-portrait.jpg',
  'tech-illustration.png',
  'logo.png'
];

async function ensureBrandedPlaceholders() {
  const missing = [];

  // 1. Hero Base Placeholder (1920x1080) - Deep navy elegant technical grid
  const heroBasePath = path.join(imagesDir, 'hero-base.jpg');
  if (!fs.existsSync(heroBasePath)) {
    missing.push('hero-base.jpg');
    console.log('[Placeholder] Generating hero-base.jpg...');
    const svg = `
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#070e24" />
            <stop offset="50%" stop-color="#0b1b4a" />
            <stop offset="100%" stop-color="#030818" />
          </linearGradient>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(29, 92, 240, 0.08)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
        <rect width="100%" height="100%" fill="url(#grid)"/>
        <circle cx="960" cy="540" r="420" fill="none" stroke="rgba(255, 255, 255, 0.03)" stroke-width="1.5"/>
        <circle cx="960" cy="540" r="280" fill="none" stroke="rgba(29, 92, 240, 0.12)" stroke-width="1.5"/>
      </svg>`;
    await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(heroBasePath);
  }

  // 2. Hero Reveal Placeholder (1920x1080) - Vibrant glowing neon circuit overlay
  const heroRevealPath = path.join(imagesDir, 'hero-reveal.jpg');
  if (!fs.existsSync(heroRevealPath)) {
    missing.push('hero-reveal.jpg');
    console.log('[Placeholder] Generating hero-reveal.jpg...');
    const svg = `
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="revealBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0b1b4a" />
            <stop offset="40%" stop-color="#1d5cf0" />
            <stop offset="80%" stop-color="#7a2fd0" />
            <stop offset="100%" stop-color="#070e24" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#revealBg)" opacity="0.95"/>
        <circle cx="960" cy="540" r="480" fill="none" stroke="#ffe500" stroke-width="2" opacity="0.3" filter="url(#glow)"/>
        <circle cx="960" cy="540" r="320" fill="none" stroke="#12a150" stroke-width="2" opacity="0.4" filter="url(#glow)"/>
        <circle cx="960" cy="540" r="160" fill="none" stroke="#1d5cf0" stroke-width="3" opacity="0.6" filter="url(#glow)"/>
      </svg>`;
    await sharp(Buffer.from(svg)).jpeg({ quality: 92 }).toFile(heroRevealPath);
  }

  // 3. Tech Illustration Placeholder (800x800 transparent)
  const techIllPath = path.join(imagesDir, 'tech-illustration.png');
  if (!fs.existsSync(techIllPath)) {
    missing.push('tech-illustration.png');
    console.log('[Placeholder] Generating tech-illustration.png...');
    const svg = `
      <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="400" cy="400" r="320" fill="rgba(29, 92, 240, 0.06)" />
        <circle cx="400" cy="400" r="240" stroke="rgba(29, 92, 240, 0.2)" stroke-width="2" stroke-dasharray="8 8" />
        <circle cx="400" cy="400" r="140" fill="linear-gradient(135deg, #0b1b4a 0%, #1d5cf0 100%)" />
        <rect x="320" y="320" width="160" height="160" rx="28" fill="#0b1b4a" stroke="#ffe500" stroke-width="3"/>
        <path d="M360 360 H440 L370 440 H440" stroke="#ffe500" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    await sharp(Buffer.from(svg)).png().toFile(techIllPath);
  }

  return missing;
}

async function optimizeDirectory(dir, manifest) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir);

  for (const file of entries) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await optimizeDirectory(fullPath, manifest);
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
    if (file.includes('@2x') || file.includes('.webp')) continue;

    const baseName = path.basename(file, ext);
    const relPath = path.relative(path.resolve(rootDir, 'public'), fullPath).replace(/\\/g, '/');

    try {
      const img = sharp(fullPath);
      const meta = await img.metadata();

      const webp1xName = `${baseName}.webp`;
      const webp2xName = `${baseName}@2x.webp`;
      const webp1xPath = path.join(dir, webp1xName);
      const webp2xPath = path.join(dir, webp2xName);

      // Generate 1x WebP
      const targetWidth = meta.width > 1920 ? 1920 : meta.width;
      await sharp(fullPath)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(webp1xPath);

      // Generate 2x WebP (if large enough)
      if (meta.width > 800) {
        await sharp(fullPath)
          .resize({ width: Math.min(meta.width, 3840), withoutEnlargement: true })
          .webp({ quality: 78 })
          .toFile(webp2xPath);
      }

      // Generate tiny blur placeholder (16px)
      const blurBuffer = await sharp(fullPath)
        .resize({ width: 16, height: 16, fit: 'inside' })
        .jpeg({ quality: 40 })
        .toBuffer();
      const blurDataUrl = `data:image/jpeg;base64,${blurBuffer.toString('base64')}`;

      manifest[relPath] = {
        original: `/${relPath}`,
        webp1x: `/${path.relative(path.resolve(rootDir, 'public'), webp1xPath).replace(/\\/g, '/')}`,
        webp2x: fs.existsSync(webp2xPath)
          ? `/${path.relative(path.resolve(rootDir, 'public'), webp2xPath).replace(/\\/g, '/')}`
          : null,
        width: meta.width,
        height: meta.height,
        blurPlaceholder: blurDataUrl,
        format: meta.format
      };

      console.log(`✓ Processed ${relPath} -> ${webp1xName}`);
    } catch (err) {
      console.warn(`! Skipped ${file}: ${err.message}`);
    }
  }
}

async function main() {
  console.log('=== Zippy Image Optimization Pipeline ===');
  const missing = await ensureBrandedPlaceholders();

  const manifest = {};
  await optimizeDirectory(imagesDir, manifest);
  await optimizeDirectory(projectsDir, manifest);

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\nManifest written to src/data/imageManifest.json with ${Object.keys(manifest).length} entries.`);

  if (missing.length > 0) {
    console.log('\n[Notice] Generated branded placeholders for files not yet provided:');
    missing.forEach(m => console.log(` - public/images/${m}`));
    console.log('You can replace any of the above files anytime and re-run this script!');
  }
}

main().catch(err => {
  console.error('Fatal optimization error:', err);
  process.exit(1);
});
