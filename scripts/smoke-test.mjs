import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const apiDir = path.resolve(rootDir, 'api');

console.log('\n======================================================');
console.log('  ZippyTechSystems — Phase 7 Production Smoke Test');
console.log('======================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failCount++;
  }
}

// 1. Verify Build Output Directory
console.log('1. Checking Build Artifacts...');
assert(fs.existsSync(distDir), 'dist/ directory exists');
const indexHtmlPath = path.join(distDir, 'index.html');
assert(fs.existsSync(indexHtmlPath), 'dist/index.html exists');

const htaccessPath = path.join(distDir, '.htaccess');
assert(fs.existsSync(htaccessPath), 'dist/.htaccess exists');

const manifestPath = path.join(distDir, 'manifest.json');
assert(fs.existsSync(manifestPath), 'dist/manifest.json exists');

const sitemapPath = path.join(distDir, 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'dist/sitemap.xml exists');

const robotsPath = path.join(distDir, 'robots.txt');
assert(fs.existsSync(robotsPath), 'dist/robots.txt exists');

// 2. Validate HTML & SEO Elements
console.log('\n2. Validating HTML, SEO & Structured Data...');
if (fs.existsSync(indexHtmlPath)) {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');

  assert(html.includes('<title>ZippyTechSystems'), 'Title contains ZippyTechSystems');
  assert(html.includes('rel="canonical"') && html.includes('https://zippysoftwares.in/'), 'Canonical URL tag points to zippysoftwares.in');
  assert(html.includes('name="description"'), 'Meta description exists');
  assert(html.includes('property="og:image"'), 'OpenGraph image tag exists');
  assert(html.includes('name="twitter:card"'), 'Twitter card tag exists');
  assert(html.includes('rel="manifest"'), 'Web App Manifest link exists');
  assert(html.includes('@type": "ProfessionalService') || html.includes('schema.org'), 'Schema.org JSON-LD structured data exists');
  assert(html.includes('Lingaswamy'), 'Founder Lingaswamy referenced in markup/schema');
  assert(html.includes('6302690251'), 'Official contact number referenced');
}

// 3. Validate Hostinger .htaccess Rules
console.log('\n3. Validating Hostinger Server Configuration (.htaccess)...');
if (fs.existsSync(htaccessPath)) {
  const htaccess = fs.readFileSync(htaccessPath, 'utf8');
  assert(htaccess.includes('RewriteEngine On'), 'RewriteEngine enabled');
  assert(htaccess.includes('HTTPS') || htaccess.includes('301'), 'HTTPS redirect rules present');
  assert(htaccess.includes('RewriteRule . /index.html'), 'React Router SPA fallback rule present');
  assert(htaccess.includes('mod_deflate.c'), 'Gzip / Deflate compression rules present');
  assert(htaccess.includes('X-Content-Type-Options') && htaccess.includes('X-Frame-Options'), 'Security headers present');
}

// 4. Validate PWA Web Manifest
console.log('\n4. Validating Web App Manifest (manifest.json)...');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert(manifest.name && manifest.name.includes('ZippyTechSystems'), 'Manifest name configured');
    assert(manifest.short_name === 'ZippyTech', 'Manifest short_name configured');
    assert(manifest.start_url === '/', 'Manifest start_url set to root');
    assert(Array.isArray(manifest.icons) && manifest.icons.length > 0, 'Manifest icons configured');
    assert(Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 2, 'Manifest quick shortcuts configured');
  } catch (err) {
    assert(false, `Manifest parsing failed: ${err.message}`);
  }
}

// 5. Validate Sitemap XML Structure
console.log('\n5. Validating Sitemap XML...');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  assert(sitemap.includes('<urlset') && sitemap.includes('http://www.sitemaps.org/schemas/sitemap/0.9'), 'Sitemap urlset namespace valid');
  assert(sitemap.includes('https://zippysoftwares.in/'), 'Homepage in sitemap');
  assert(sitemap.includes('/projects/saree-business-management-app'), 'Project deep-link in sitemap');
  assert(sitemap.includes('/services/web-development'), 'Service deep-link in sitemap');
}

// 6. Inspect Bundle Size & Performance Budget
console.log('\n6. Checking Asset Bundles & Gzip Budgets...');
const assetsDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  let totalRawSize = 0;
  let totalGzipSize = 0;

  files.forEach((file) => {
    const filePath = path.join(assetsDir, file);
    const content = fs.readFileSync(filePath);
    const rawSize = content.length;
    const gzipped = zlib.gzipSync(content);
    const gzipSize = gzipped.length;

    totalRawSize += rawSize;
    totalGzipSize += gzipSize;

    const rawKb = (rawSize / 1024).toFixed(1);
    const gzipKb = (gzipSize / 1024).toFixed(1);

    if (file.endsWith('.js')) {
      if (file.startsWith('index-')) {
        console.log(`     Main App JS: ${file} (${rawKb} kB raw / ${gzipKb} kB gzip)`);
        assert(gzipSize < 80 * 1024, `Main JS bundle (${gzipKb} kB gzip) < 80 kB budget`);
      } else if (file.startsWith('vendor-')) {
        console.log(`     Vendor JS:   ${file} (${rawKb} kB raw / ${gzipKb} kB gzip)`);
        assert(gzipSize < 75 * 1024, `Vendor bundle (${gzipKb} kB gzip) < 75 kB budget`);
      }
    } else if (file.endsWith('.css')) {
      console.log(`     CSS Bundle:  ${file} (${rawKb} kB raw / ${gzipKb} kB gzip)`);
      assert(gzipSize < 15 * 1024, `CSS bundle (${gzipKb} kB gzip) < 15 kB budget`);
    }
  });

  console.log(`\n     Total Dist Assets: ${(totalRawSize / 1024).toFixed(1)} kB raw, ${(totalGzipSize / 1024).toFixed(1)} kB gzipped`);
}

// 7. Verify PHP API Backend Readiness
console.log('\n7. Checking PHP Backend Files for Hostinger Deployment...');
const apiFiles = [
  'index.php',
  'bootstrap.php',
  'auth.php',
  'chat.php',
  'voice.php',
  'sitemap.php',
  'upload.php'
];

apiFiles.forEach((file) => {
  const p = path.join(apiDir, file);
  assert(fs.existsSync(p), `api/${file} exists and ready`);
});

assert(fs.existsSync(path.join(rootDir, 'database', 'schema.sql')), 'database/schema.sql exists and up to date');

// Summary
console.log('\n======================================================');
console.log(`  Summary: ${passCount} Passed, ${failCount} Failed`);
console.log('======================================================\n');

if (failCount > 0) {
  console.error('Smoke test finished with errors. Please address failures above.');
  process.exit(1);
} else {
  console.log('All smoke tests passed! Ready for production deployment on Hostinger.\n');
  process.exit(0);
}
