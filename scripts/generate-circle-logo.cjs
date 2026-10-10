const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createTransparentCircleLogo() {
  const input = 'C:/Users/madya/.gemini/antigravity-ide/brain/4f049cab-39be-4065-8b3c-e33824cca7d7/.user_uploaded/media_1791660433725.jpg';
  const size = 1024;
  const radius = 506;
  const svgMask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="512" cy="512" r="${radius}" fill="white"/></svg>`
  );

  console.log('Processing uploaded logo with sharp...');
  const masked = await sharp(input)
    .composite([{ input: svgMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const publicImgDir = path.resolve(__dirname, '../public/images');
  const rootImgDir = path.resolve(__dirname, '../images');

  await sharp(masked).toFile(path.join(publicImgDir, 'logo.png'));
  await sharp(masked).webp({ quality: 95 }).toFile(path.join(publicImgDir, 'logo.webp'));
  await sharp(masked).resize(512, 512).webp({ quality: 90 }).toFile(path.join(publicImgDir, 'logo@2x.webp'));

  await sharp(masked).toFile(path.join(rootImgDir, 'logo.png'));
  await sharp(masked).webp({ quality: 95 }).toFile(path.join(rootImgDir, 'logo.webp'));
  await sharp(masked).resize(512, 512).webp({ quality: 90 }).toFile(path.join(rootImgDir, 'logo@2x.webp'));

  // Also replace any legacy founder-portrait files with the logo as requested by user
  // "total website lo ekadaekada vunnayo passphoto images anni remove chese na company logo pettu"
  await sharp(masked).jpeg({ quality: 95 }).toFile(path.join(publicImgDir, 'founder-portrait.jpg'));
  await sharp(masked).webp({ quality: 95 }).toFile(path.join(publicImgDir, 'founder-portrait.webp'));
  await sharp(masked).resize(512, 512).webp({ quality: 90 }).toFile(path.join(publicImgDir, 'founder-portrait@2x.webp'));
  await sharp(masked).jpeg({ quality: 95 }).toFile(path.join(publicImgDir, 'founder-portrait-blazer.jpg'));
  await sharp(masked).webp({ quality: 95 }).toFile(path.join(publicImgDir, 'founder-portrait-blazer.webp'));

  await sharp(masked).jpeg({ quality: 95 }).toFile(path.join(rootImgDir, 'founder-portrait.jpg'));
  await sharp(masked).webp({ quality: 95 }).toFile(path.join(rootImgDir, 'founder-portrait.webp'));
  await sharp(masked).resize(512, 512).webp({ quality: 90 }).toFile(path.join(rootImgDir, 'founder-portrait@2x.webp'));
  await sharp(masked).jpeg({ quality: 95 }).toFile(path.join(rootImgDir, 'founder-portrait-blazer.jpg'));
  await sharp(masked).webp({ quality: 95 }).toFile(path.join(rootImgDir, 'founder-portrait-blazer.webp'));

  console.log('Successfully generated transparent circular logo and replaced legacy portrait files!');
}

createTransparentCircleLogo().catch(err => {
  console.error('Error generating logo:', err);
  process.exit(1);
});
