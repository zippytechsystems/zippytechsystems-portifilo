import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const distDir = path.resolve(rootDir, 'dist');
const apiDir = path.resolve(rootDir, 'api');
const packageDir = path.resolve(rootDir, 'hostinger-package');
const targetPublicHtml = path.resolve(packageDir, 'public_html');
const zipOutputFile = path.resolve(packageDir, 'zippysoftwares-hostinger-public_html.zip');

console.log('\n================================================================');
console.log('  ZippyTechSystems — Hostinger Production Packager (Phase 8)');
console.log('================================================================\n');

// 1. Verify build exists
if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('[ERROR] dist/ directory or dist/index.html not found!');
  console.error('Please run "npm run build" before packaging.');
  process.exit(1);
}

// Helper to recursively copy directory
function copyRecursiveSync(src, dest, ignoreList = []) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      if (ignoreList.includes(childItemName)) return;
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName),
        ignoreList
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 2. Clean and create package directory
console.log('1. Preparing package directories...');
if (fs.existsSync(packageDir)) {
  fs.rmSync(packageDir, { recursive: true, force: true });
}
fs.mkdirSync(targetPublicHtml, { recursive: true });

// 3. Copy dist/ into public_html/
console.log('2. Copying optimized frontend assets from dist/ to public_html/ ...');
copyRecursiveSync(distDir, targetPublicHtml);

// 4. Copy api/ into public_html/api/
console.log('3. Copying PHP REST backend and webhooks from api/ to public_html/api/ ...');
const targetApiDir = path.join(targetPublicHtml, 'api');
fs.mkdirSync(targetApiDir, { recursive: true });
copyRecursiveSync(apiDir, targetApiDir, ['.git', '.gitignore', 'tests', 'temp']);

// 5. Ensure uploads/ directory exists with security .htaccess
console.log('4. Initializing uploads directory with script execution protection...');
const targetUploadsDir = path.join(targetPublicHtml, 'uploads');
if (!fs.existsSync(targetUploadsDir)) {
  fs.mkdirSync(targetUploadsDir, { recursive: true });
}

// Add security .htaccess to prevent PHP execution in uploads
const uploadsHtaccess = `# Security: Prevent PHP execution in uploaded files
<FilesMatch "\\.(php|phtml|php3|php4|php5|phps)$">
  Order Deny,Allow
  Deny from all
</FilesMatch>
Options -Indexes
`;
fs.writeFileSync(path.join(targetUploadsDir, '.htaccess'), uploadsHtaccess, 'utf8');

// 6. Verify main .htaccess is present
const rootHtaccessPath = path.join(targetPublicHtml, '.htaccess');
if (!fs.existsSync(rootHtaccessPath)) {
  console.log('   Copying .htaccess from public/.htaccess ...');
  fs.copyFileSync(path.join(rootDir, 'public', '.htaccess'), rootHtaccessPath);
}

// 7. Write DEPLOY_GUIDE.md inside package
console.log('5. Generating step-by-step Hostinger Deployment Guide...');
const deployGuideContent = `# Hostinger Deployment Guide for ZippyTechSystems
**Domain**: https://zippysoftwares.in
**Target Directory**: /public_html
**Founder**: Lingaswamy Maddeboina (+91 63026 90251)

---

## Option A: 1-Click ZIP Upload via Hostinger hPanel File Manager (Recommended)

1. Log in to your Hostinger Account (https://hpanel.hostinger.com).
2. Go to **Websites** -> Select **zippysoftwares.in** -> Click **File Manager**.
3. Open the **\`public_html\`** folder.
4. If there is a default \`default.php\` or older placeholder, delete or backup it.
5. Click the **Upload** button (top right), choose **File**, and select:
   \`hostinger-package/zippysoftwares-hostinger-public_html.zip\`
6. Right-click the uploaded \`.zip\` and select **Extract** -> Extract into **\`public_html\`** (or extract files directly).
7. Ensure \`.htaccess\` is visible (enable "Show Hidden Files" in File Manager settings).

---

## Option B: Database Configuration

1. In Hostinger hPanel, go to **Databases** -> **MySQL Databases**.
2. Note your database credentials:
   - **DB Name**: \`u123456789_zippy\` (or your chosen name)
   - **DB Username**: \`u123456789_admin\`
   - **DB Password**: \`<your-password>\`
   - **DB Host**: \`localhost\`
3. Open \`public_html/api/config.example.php\`.
4. Copy or rename it to \`public_html/api/config.php\`:
   \`\`\`php
   <?php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'u123456789_admin');
   define('DB_PASS', 'your_password_here');
   define('DB_NAME', 'u123456789_zippy');
   define('GEMINI_API_KEY', 'your_gemini_api_key_here'); // Optional for AI Chat
   define('ADMIN_PASSWORD_HASH', password_hash('YourStrongPassword', PASSWORD_DEFAULT));
   \`\`\`
5. Open \`https://zippysoftwares.in/api/index.php\` to test DB connection. The bootstrap script will automatically create necessary tables on first launch if configured.

---

## Option C: Verification Checklist

- [ ] **Homepage**: https://zippysoftwares.in loads with HTTPS and glass animations.
- [ ] **Interactive Cost Estimator**: Test calculating customized packages in #packages section.
- [ ] **FAQ Live Search**: Test searching questions with instant matching highlights in #faq.
- [ ] **Deep-Link Routing**: Visit https://zippysoftwares.in/projects/saree-business-management-app directly (must not show 404).
- [ ] **Dynamic Sitemap**: Visit https://zippysoftwares.in/sitemap.xml (should output XML).
- [ ] **PWA Manifest**: Check DevTools Application tab -> Manifest -> Short Name: "ZippyTech".
- [ ] **Direct Contact**: WhatsApp CTAs point to +91 63026 90251.

---
Generated automatically by ZippyTechSystems Packager on ${new Date().toISOString()}.
`;

fs.writeFileSync(path.join(packageDir, 'DEPLOY_GUIDE.md'), deployGuideContent, 'utf8');

// 8. Count files and calculate size in public_html
let totalFiles = 0;
let totalBytes = 0;

function calculateStats(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      calculateStats(fullPath);
    } else {
      totalFiles++;
      totalBytes += stat.size;
    }
  }
}
calculateStats(targetPublicHtml);

// 9. Create deployment zip
console.log('6. Compressing public_html into ready-to-upload ZIP archive...');
try {
  // Use native tar.exe (available on Windows 10/11) to create zip
  execSync(`tar -a -cf "${zipOutputFile}" -C "${targetPublicHtml}" .`, { stdio: 'inherit' });
} catch (err) {
  console.log('   Falling back to PowerShell Compress-Archive...');
  execSync(
    `powershell -Command "Compress-Archive -Path '${targetPublicHtml}\\*' -DestinationPath '${zipOutputFile}' -Force"`,
    { stdio: 'inherit' }
  );
}

const zipExists = fs.existsSync(zipOutputFile);
const zipSizeMb = zipExists ? (fs.statSync(zipOutputFile).size / (1024 * 1024)).toFixed(2) : 0;

console.log('\n================================================================');
console.log('  Package Successfully Created!');
console.log('================================================================');
console.log(`  Target Folder : ${targetPublicHtml}`);
console.log(`  Total Files   : ${totalFiles} files`);
console.log(`  Unpacked Size : ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
if (zipExists) {
  console.log(`  Archive ZIP   : ${zipOutputFile} (${zipSizeMb} MB)`);
}
console.log(`  Deploy Guide  : ${path.join(packageDir, 'DEPLOY_GUIDE.md')}`);
console.log('================================================================\n');
console.log('Ready to upload to Hostinger! Simply drag zippysoftwares-hostinger-public_html.zip');
console.log('into Hostinger hPanel File Manager -> public_html and extract.\n');
