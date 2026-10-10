import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, '../public/sitemap.xml');

// Static & deep-link routes per project specification (build-time sitemap, no database connection needed)
const staticRoutes = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: 'about', priority: '0.8', changefreq: 'monthly' },
  { path: 'services', priority: '0.9', changefreq: 'weekly' },
  { path: 'services/web-development', priority: '0.85', changefreq: 'weekly' },
  { path: 'services/app-development', priority: '0.85', changefreq: 'weekly' },
  { path: 'services/ai-automation', priority: '0.85', changefreq: 'weekly' },
  { path: 'projects', priority: '0.85', changefreq: 'weekly' },
  { path: 'projects/saree-business-management-app', priority: '0.8', changefreq: 'monthly' },
  { path: 'projects/clinic-appointment-booking-portal', priority: '0.8', changefreq: 'monthly' },
  { path: 'projects/automated-invoicing-followup-system', priority: '0.8', changefreq: 'monthly' },
  { path: 'projects/staff-attendance-salary-tracker', priority: '0.8', changefreq: 'monthly' },
  { path: 'projects/wholesale-trader-accounting-app', priority: '0.8', changefreq: 'monthly' },
  { path: 'contact', priority: '0.8', changefreq: 'monthly' },
  { path: 'privacy', priority: '0.3', changefreq: 'yearly' },
  { path: 'terms', priority: '0.3', changefreq: 'yearly' }
];

const baseUrl = 'https://zippysoftwares.in';
const today = new Date().toISOString().split('T')[0];

const xmlEntries = staticRoutes.map(route => {
  const loc = route.path ? `${baseUrl}/${route.path}` : `${baseUrl}/`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`;

fs.writeFileSync(outputPath, xml, 'utf8');
console.log(`Generated static build sitemap with ${staticRoutes.length} routes at ${outputPath}`);
