const sharp = require('sharp');
const fs = require('fs');

async function testCrop() {
  const src = 'C:/Users/madya/.gemini/antigravity-ide/brain/4f049cab-39be-4065-8b3c-e33824cca7d7/founder_suit_portrait_1791657443069.jpg';
  const out = 'C:/Users/madya/.gemini/antigravity-ide/brain/4f049cab-39be-4065-8b3c-e33824cca7d7/scratch/circle_test.png';

  const circleSvg = Buffer.from('<svg width="400" height="400"><circle cx="200" cy="200" r="200" fill="white"/></svg>');

  await sharp(src)
    .resize(400, 400)
    .composite([{ input: circleSvg, blend: 'dest-in' }])
    .png()
    .toFile(out);

  console.log('Saved circle test successfully');
}

testCrop().catch(console.error);
