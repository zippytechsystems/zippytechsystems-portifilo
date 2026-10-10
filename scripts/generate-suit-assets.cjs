const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function main() {
  // New bright, radiant executive suit portrait
  const src = 'C:/Users/madya/.gemini/antigravity-ide/brain/4f049cab-39be-4065-8b3c-e33824cca7d7/founder_bright_suit_1791659724471.jpg';

  const rootDir = 'C:/Users/madya/.gemini/antigravity-ide/scratch/zippytechsystems-portifilo-website';
  const dirs = [
    path.join(rootDir, 'public/images'),
    path.join(rootDir, 'images'),
    path.join(rootDir, 'dist/images')
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // 1. founder-suit files
    await sharp(src)
      .resize(800, 800, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 95, mozjpeg: true })
      .toFile(path.join(dir, 'founder-suit.jpg'));

    await sharp(src)
      .resize(400, 400, { fit: 'cover', position: 'center' })
      .webp({ quality: 92 })
      .toFile(path.join(dir, 'founder-suit.webp'));

    await sharp(src)
      .resize(800, 800, { fit: 'cover', position: 'center' })
      .webp({ quality: 94 })
      .toFile(path.join(dir, 'founder-suit@2x.webp'));

    // 2. founder-portrait files (legacy paths)
    await sharp(src)
      .resize(800, 800, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 95, mozjpeg: true })
      .toFile(path.join(dir, 'founder-portrait.jpg'));

    await sharp(src)
      .resize(400, 400, { fit: 'cover', position: 'center' })
      .webp({ quality: 92 })
      .toFile(path.join(dir, 'founder-portrait.webp'));

    await sharp(src)
      .resize(800, 800, { fit: 'cover', position: 'center' })
      .webp({ quality: 94 })
      .toFile(path.join(dir, 'founder-portrait@2x.webp'));
  }

  console.log('Processed new bright radiant founder suit portrait successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
