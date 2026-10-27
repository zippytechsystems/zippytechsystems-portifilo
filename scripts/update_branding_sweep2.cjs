const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/madya/.gemini/antigravity-ide/scratch/zippytechsystems-portifilo-website';

function updateFile(relPath, fn) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    console.warn('File not found:', fullPath);
    return;
  }
  const original = fs.readFileSync(fullPath, 'utf8');
  const updated = fn(original);
  if (original !== updated) {
    fs.writeFileSync(fullPath, updated, 'utf8');
    console.log('Successfully updated:', relPath);
  } else {
    console.log('No changes needed in:', relPath);
  }
}

// 1. AboutSection.jsx
updateFile('src/components/AboutSection.jsx', (c) => {
  return c.replace(/ABOUT ZIPPYTECHSYSTEMS/g, 'ABOUT ZIPPY ENTERPRISES');
});

// 2. CostEstimator.jsx
updateFile('src/components/CostEstimator.jsx', (c) => {
  return c.replace(/ZippyTechSystems/g, 'Zippy Enterprises');
});

// 3. Hero.jsx
updateFile('src/components/Hero.jsx', (c) => {
  return c
    .replace(/title="ZippyTech"/g, 'title="Zippy Enterprises"')
    .replace(/ZippyTech Company Logo/g, 'Zippy Enterprises Company Logo')
    .replace(/ZippyTech/g, 'Zippy Enterprises');
});

// 4. Navbar.jsx
updateFile('src/components/Navbar.jsx', (c) => {
  return c
    .replace(/alt="ZippyTech Logo"/g, 'alt="Zippy Enterprises Logo"')
    .replace(/alt="ZippyTech Systems Logo"/g, 'alt="Zippy Enterprises Logo"');
});

// 5. ServiceSelectionBuilder.jsx
updateFile('src/components/ServiceSelectionBuilder.jsx', (c) => {
  return c.replace(/ZippyTechSystems/g, 'Zippy Enterprises');
});

// 6. SkillsOrbitCloud.jsx
updateFile('src/components/SkillsOrbitCloud.jsx', (c) => {
  return c
    .replace(/ZippyTech Softwares Official Badge/g, 'Zippy Enterprises Official Badge')
    .replace(/alt="ZippyTech Softwares Logo"/g, 'alt="Zippy Enterprises Logo"')
    .replace(/ZIPPYTECH/g, 'ZIPPY ENTERPRISES');
});

// 7. TechMarquee.jsx
updateFile('src/components/TechMarquee.jsx', (c) => {
  return c
    .replace(/ZippyTechSoftwares/g, 'Zippy Enterprises')
    .replace(/ZippyTech Softwares/g, 'Zippy Enterprises');
});

// 8. DataContext.jsx
updateFile('src/context/DataContext.jsx', (c) => {
  return c
    .replace(/https:\/\/www\.instagram\.com\/zippytechsystems/g, 'https://www.instagram.com/zippysoftwares.in')
    .replace(/https:\/\/www\.youtube\.com\/@zippytechsystems/g, 'https://www.youtube.com/@zippysoftwares');
});

// 9. servicesData.js
updateFile('src/data/servicesData.js', (c) => {
  return c
    .replace(/At ZippyTechSystems/g, 'At Zippy Enterprises')
    .replace(/ZippyTechSystems designs and builds/g, 'Zippy Enterprises designs and builds')
    .replace(/ZippyTechSystems designs and deploys/g, 'Zippy Enterprises designs and deploys')
    .replace(/ZippyTechSystems/g, 'Zippy Enterprises');
});

// 10. api.js
updateFile('src/lib/api.js', (c) => {
  return c
    .replace(/https:\/\/www\.instagram\.com\/zippytechsystems/g, 'https://www.instagram.com/zippysoftwares.in')
    .replace(/https:\/\/www\.youtube\.com\/@zippytechsystems/g, 'https://www.youtube.com/@zippysoftwares');
});

// 11. motion.js
updateFile('src/lib/motion.js', (c) => {
  return c.replace(/ZippyTechSystems Motion Engine/g, 'Zippy Enterprises Motion Engine');
});

// 12. ProjectsPage.jsx
updateFile('src/pages/ProjectsPage.jsx', (c) => {
  return c
    .replace(/Case Study - ZippyTechSystems/g, 'Case Study - Zippy Enterprises')
    .replace(/Showcase \| ZippyTechSystems/g, 'Showcase \| Zippy Enterprises');
});

// 13. SettingsTab.jsx
updateFile('src/pages/admin/SettingsTab.jsx', (c) => {
  return c
    .replace(/zippytechsystems/g, 'zippysoftwares.in');
});

// 14. styles
updateFile('src/styles/chatbot.css', (c) => {
  return c.replace(/ZippyTechSystems/g, 'Zippy Enterprises');
});
updateFile('src/styles/tokens.css', (c) => {
  return c.replace(/ZippyTechSystems Pvt\. Ltd\./g, 'Zippy Enterprises Private Limited');
});

console.log('Second sweep completed successfully!');
