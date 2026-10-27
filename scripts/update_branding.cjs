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

// 1. Update index.html & index.source.html
function transformIndexHtml(html) {
  let content = html;

  content = content.replace(
    /<title>ZippyTechSystems \| Nearby IT Service Office &amp; Software Company in Hyderabad<\/title>/g,
    '<title>Zippy Enterprises | Nearby IT Service Office &amp; Software Company in Hyderabad</title>'
  );

  content = content.replace(/ZippyTechSystems provides affordable/g, 'Zippy Enterprises provides affordable');
  content = content.replace(
    /Lingaswamy ZippyTechSystems, affordable software company India/g,
    'Lingaswamy Zippy Enterprises, affordable software company India, Zippy Enterprises Private Limited, Zippy Enterprises'
  );
  content = content.replace(
    /Lingaswamy Maddeboina, ZippyTechSystems Pvt\. Ltd\./g,
    'Lingaswamy Maddeboina, Zippy Enterprises Private Limited'
  );

  content = content.replace(
    /property="og:title" content="ZippyTechSystems \| Nearby IT Service Office &amp; Software Company in Hyderabad"/g,
    'property="og:title" content="Zippy Enterprises | Nearby IT Service Office &amp; Software Company in Hyderabad"'
  );
  content = content.replace(
    /property="og:site_name" content="ZippyTechSystems Pvt\. Ltd\."/g,
    'property="og:site_name" content="Zippy Enterprises Private Limited"'
  );
  content = content.replace(
    /content="Looking for a reliable nearby IT service office or software company in Hyderabad\? ZippyTechSystems provides/g,
    'content="Looking for a reliable nearby IT service office or software company in Hyderabad? Zippy Enterprises provides'
  );

  content = content.replace(
    /name="twitter:title" content="ZippyTechSystems \| Nearby IT Service Office &amp; Software Company in Hyderabad"/g,
    'name="twitter:title" content="Zippy Enterprises | Nearby IT Service Office &amp; Software Company in Hyderabad"'
  );
  content = content.replace(
    /content="Looking for a reliable nearby IT service office or software development company in Hyderabad\? Affordable Web, App, and AI solutions\."/g,
    'content="Looking for a reliable nearby IT service office or software development company in Hyderabad? Affordable Web, App, and AI solutions from Zippy Enterprises."'
  );

  // Favicons replacement
  const newFavicons = `<!-- Favicon: Multi-size Favicons & App Icons for Google Search & Browsers -->
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
    <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.json" />`;

  content = content.replace(
    /<!-- Favicon:[^>]*-->\s*<link\s+rel="icon"[^>]+href="data:image\/svg\+xml,[^>]+>\s*<link rel="manifest" href="\/manifest\.json" \/>/m,
    newFavicons
  );

  // Schema updates
  content = content.replace(/"name": "ZippyTechSystems Pvt\. Ltd\."/g, '"name": "Zippy Enterprises Private Limited"');
  content = content.replace(/"legalName": "ZippyTechSystems Pvt\. Ltd\."/g, '"legalName": "Zippy Enterprises Private Limited"');
  content = content.replace(
    /"alternateName": \[\s*"ZippyTechSystems",\s*"Nearby IT Service Office Hyderabad",\s*"Zippy Softwares",\s*"ZippyTech Systems"\s*\]/m,
    `"alternateName": [
              "Zippy Enterprises",
              "Zippy Enterprises Pvt. Ltd.",
              "Zippy Softwares",
              "zippysoftwares.in",
              "Nearby IT Service Office Hyderabad"
            ]`
  );
  content = content.replace(
    /"logo": "https:\/\/zippysoftwares\.in\/og-image\.png"/g,
    `"logo": {
              "@type": "ImageObject",
              "url": "https://zippysoftwares.in/images/company-logo-2026.png",
              "width": 1024,
              "height": 1024
            }`
  );
  content = content.replace(
    /"image": "https:\/\/zippysoftwares\.in\/og-image\.png"/g,
    '"image": "https://zippysoftwares.in/images/company-logo-2026.png"'
  );

  return content;
}

updateFile('index.html', transformIndexHtml);
updateFile('index.source.html', transformIndexHtml);

// 2. Update manifest.json & public/manifest.json
function transformManifest(raw) {
  let json = JSON.parse(raw);
  json.name = "Zippy Enterprises Private Limited | Web, Apps & AI Solutions";
  json.short_name = "Zippy Enterprises";
  json.icons = [
    {
      src: "/favicon-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/favicon-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/images/company-logo-2026.png",
      sizes: "1024x1024",
      type: "image/png",
      purpose: "any"
    }
  ];
  return JSON.stringify(json, null, 2);
}

updateFile('manifest.json', transformManifest);
updateFile('public/manifest.json', transformManifest);

// 3. Update companyData.js
updateFile('src/data/companyData.js', (c) => {
  return c
    .replace(/brandName: 'ZippyTechSystems'/g, "brandName: 'Zippy Enterprises'")
    .replace(/legalName: 'ZippyTechSystems Digital Solutions'/g, "legalName: 'Zippy Enterprises Private Limited'")
    .replace(/ZippyTechSystems helps businesses/g, 'Zippy Enterprises helps businesses')
    .replace(/discussing%20a%20new%20project%20with%20ZippyTechSystems/g, 'discussing%20a%20new%20project%20with%20Zippy%20Enterprises');
});

// 4. Update content.js
updateFile('src/data/content.js', (c) => {
  return c
    .replace(/ZippyTechSystems Pvt\. Ltd\./g, 'Zippy Enterprises Private Limited')
    .replace(/shortName: 'ZippyTechSystems'/g, "shortName: 'Zippy Enterprises'")
    .replace(/legalName: 'ZippyTechSystems Pvt\. Ltd\.'/g, "legalName: 'Zippy Enterprises Private Limited'")
    .replace(/ZippyTechSystems was founded/g, 'Zippy Enterprises was founded')
    .replace(/What makes ZippyTechSystems different/g, 'What makes Zippy Enterprises different')
    .replace(/discuss a project with ZippyTechSystems/g, 'discuss a project with Zippy Enterprises')
    .replace(/\*New Project Enquiry — ZippyTechSystems\*/g, '*New Project Enquiry — Zippy Enterprises*')
    .replace(/https:\/\/www\.instagram\.com\/zippytechsystems/g, 'https://www.instagram.com/zippysoftwares.in')
    .replace(/https:\/\/www\.youtube\.com\/@zippytechsystems/g, 'https://www.youtube.com/@zippysoftwares');
});

// 5. Update Navbar.jsx
updateFile('src/components/Navbar.jsx', (c) => {
  let updated = c;
  // Brand title
  updated = updated.replace(
    /ZippyTech<span style=\{\{ color: '#1d5cf0' \}\}>Systems<\/span>/g,
    'Zippy<span style={{ color: \'#1d5cf0\' }}>Enterprises</span>'
  );
  updated = updated.replace(/alt="ZippyTech Systems Logo"/g, 'alt="Zippy Enterprises Logo"');
  updated = updated.replace(/aria-label="ZippyTechSystems Home"/g, 'aria-label="Zippy Enterprises Home"');
  updated = updated.replace(/visited ZippyTechSystems website/g, 'visited Zippy Enterprises website');

  // Add Dashboard link to Desktop nav if not present
  if (!updated.includes("to=\"/dashboard\"") && !updated.includes("href=\"/dashboard\"")) {
    const target = `<a\n                    key={link.label}`;
    const dashboardLink = `{/* Owner Dashboard Link */}\n              <Link\n                to="/dashboard"\n                style={{\n                  fontFamily: 'var(--font-display)',\n                  fontWeight: location.pathname === '/dashboard' || location.pathname === '/admin' ? 700 : 600,\n                  fontSize: '0.80rem',\n                  padding: '0.36rem 0.72rem',\n                  borderRadius: '9999px',\n                  color: location.pathname === '/dashboard' || location.pathname === '/admin' ? '#ffe500' : '#ffffff',\n                  background: location.pathname === '/dashboard' || location.pathname === '/admin' ? 'rgba(29, 92, 240, 0.4)' : 'rgba(255, 255, 255, 0.08)',\n                  border: '1px solid rgba(255, 229, 0, 0.4)',\n                  textDecoration: 'none',\n                  display: 'inline-flex',\n                  alignItems: 'center',\n                  gap: '0.35rem',\n                  transition: 'all 0.2s ease'\n                }}\n                title="Portfolio & Management Dashboard"\n              >\n                <Shield size={13} color="#ffe500" />\n                <span>Dashboard</span>\n              </Link>\n              \n              <a\n                    key={link.label}`;
    updated = updated.replace(target, dashboardLink);
  }

  // Add Dashboard button in Mobile Drawer
  if (!updated.includes("to=\"/dashboard\" className=\"mobile-nav-dashboard\"")) {
    const mobileCtaTarget = `{/* Fast Quote CTA in Mobile Menu */}`;
    const mobileDashboardBtn = `{/* Direct Dashboard Link in Mobile Drawer */}\n            <div style={{ padding: '0.5rem 0', width: '100%' }}>\n              <Link\n                to="/dashboard"\n                className="mobile-nav-dashboard"\n                onClick={() => setMobileMenuOpen(false)}\n                style={{\n                  display: 'flex',\n                  alignItems: 'center',\n                  justifyContent: 'center',\n                  gap: '0.5rem',\n                  width: '100%',\n                  padding: '0.75rem 1rem',\n                  borderRadius: '10px',\n                  background: 'linear-gradient(135deg, rgba(29, 92, 240, 0.2) 0%, rgba(255, 229, 0, 0.1) 100%)',\n                  border: '1px solid rgba(255, 229, 0, 0.5)',\n                  color: '#ffffff',\n                  fontWeight: 700,\n                  fontSize: '0.92rem',\n                  textDecoration: 'none'\n                }}\n              >\n                <Shield size={16} color="#ffe500" />\n                <span>Portfolio Dashboard</span>\n              </Link>\n            </div>\n\n            {/* Fast Quote CTA in Mobile Menu */}`;
    updated = updated.replace(mobileCtaTarget, mobileDashboardBtn);
  }

  return updated;
});

// 6. Update Footer.jsx
updateFile('src/components/Footer.jsx', (c) => {
  let updated = c;
  updated = updated.replace(
    /ZippyTech<span style=\{\{ color: '#1d5cf0' \}\}>Systems<\/span>/g,
    'Zippy<span style={{ color: \'#1d5cf0\' }}>Enterprises</span>'
  );
  updated = updated.replace(/alt="ZippyTech Softwares"/g, 'alt="Zippy Enterprises"');
  updated = updated.replace(/visited ZippyTechSystems and would like/g, 'visited Zippy Enterprises and would like');
  
  // Update admin link text in footer
  updated = updated.replace(
    /<Link\s+to="\/admin"\s+style=\{\{[\s\S]*?\}\}\s+title="Admin Portal"\s*>\s*admin\s*<\/Link>/,
    `<Link
              to="/dashboard"
              style={{
                color: '#ffe500',
                fontSize: '0.75rem',
                textDecoration: 'none',
                opacity: 0.75,
                transition: 'opacity 0.2s ease',
                letterSpacing: '0.02em',
                userSelect: 'none',
                padding: '2px 6px',
                border: '1px solid rgba(255, 229, 0, 0.3)',
                borderRadius: '4px'
              }}
              onMouseEnter={(e) => (e.target.style.opacity = '1')}
              onMouseLeave={(e) => (e.target.style.opacity = '0.75')}
              title="Portfolio & Admin Dashboard"
            >
              Dashboard
            </Link>`
  );

  return updated;
});

// 7. Update ChatWidget.jsx
updateFile('src/components/ChatWidget.jsx', (c) => {
  return c
    .replace(/ZippyTechSystems/g, 'Zippy Enterprises')
    .replace(/ZippyTech Systems/g, 'Zippy Enterprises')
    .replace(/ZippyTech/g, 'Zippy Enterprises');
});

// 8. Update ContactForm.jsx & ContactSection.jsx & AboutSection.jsx & CTASection.jsx & FAQSection.jsx & TestimonialsSection.jsx & Hero.jsx & Hero3DCircle.jsx & SkillsOrbitCluster.jsx
const componentFiles = [
  'src/components/ContactForm.jsx',
  'src/components/ContactSection.jsx',
  'src/components/AboutSection.jsx',
  'src/components/CTASection.jsx',
  'src/components/FAQSection.jsx',
  'src/components/TestimonialsSection.jsx',
  'src/components/Hero.jsx',
  'src/components/Hero3DCircle.jsx',
  'src/components/SkillsOrbitCluster.jsx',
  'src/components/TechMarquee.jsx',
  'src/components/CostEstimatorModal.jsx',
  'src/components/ServiceSelectorModal.jsx'
];

componentFiles.forEach((file) => {
  updateFile(file, (c) => {
    return c
      .replace(/ZippyTechSystems Pvt\. Ltd\./g, 'Zippy Enterprises Private Limited')
      .replace(/ZippyTechSystems/g, 'Zippy Enterprises')
      .replace(/ZippyTech Systems/g, 'Zippy Enterprises');
  });
});

// 9. Update AdminPage.jsx and admin tabs
updateFile('src/pages/AdminPage.jsx', (c) => {
  return c
    .replace(/ZippyTechSystems Pvt\. Ltd\. Management Console/g, 'Zippy Enterprises Private Limited Management Console')
    .replace(/ZippyTechSystems/g, 'Zippy Enterprises')
    .replace(/ZippyTech Systems/g, 'Zippy Enterprises');
});

const adminTabFiles = [
  'src/pages/admin/DashboardTab.jsx',
  'src/pages/admin/SettingsTab.jsx',
  'src/pages/admin/ChatbotTab.jsx',
  'src/pages/admin/EnquiriesTab.jsx',
  'src/pages/admin/ServiceAreasTab.jsx',
  'src/pages/admin/TestimonialsTab.jsx'
];

adminTabFiles.forEach((file) => {
  updateFile(file, (c) => {
    return c
      .replace(/ZippyTechSystems Pvt\. Ltd\./g, 'Zippy Enterprises Private Limited')
      .replace(/ZippyTechSystems/g, 'Zippy Enterprises')
      .replace(/ZippyTech Systems/g, 'Zippy Enterprises');
  });
});

// 10. Update DataContext.jsx & AdminAuthContext.jsx
updateFile('src/context/DataContext.jsx', (c) => {
  return c
    .replace(/ZippyTechSystems Pvt\. Ltd\./g, 'Zippy Enterprises Private Limited')
    .replace(/ZippyTechSystems/g, 'Zippy Enterprises')
    .replace(/ZippyTech Systems/g, 'Zippy Enterprises');
});

updateFile('src/context/AdminAuthContext.jsx', (c) => {
  return c.replace(/matchesUser =\s*cleanId === ADMIN_CREDENTIALS\.username \|\|\s*cleanId === ADMIN_CREDENTIALS\.email \|\|\s*cleanId === 'lingaswamy';/m,
    `matchesUser =
      cleanId === ADMIN_CREDENTIALS.username ||
      cleanId === ADMIN_CREDENTIALS.email ||
      cleanId === 'lingaswamy' ||
      cleanId === 'admin' ||
      cleanId === 'zippy' ||
      cleanId === 'zippyenterprises';`
  );
});

// 11. Update lib files
const libFiles = [
  'src/lib/api.js',
  'src/lib/chatApi.js',
  'src/lib/knowledgeBuilder.js'
];
libFiles.forEach((file) => {
  updateFile(file, (c) => {
    return c
      .replace(/ZippyTechSystems Pvt\. Ltd\./g, 'Zippy Enterprises Private Limited')
      .replace(/ZippyTechSystems/g, 'Zippy Enterprises')
      .replace(/ZippyTech Systems/g, 'Zippy Enterprises');
  });
});

// 12. Update App.jsx to register /dashboard routes
updateFile('src/App.jsx', (c) => {
  let updated = c;
  updated = updated.replace(
    /const isAdminRoute = location\.pathname\.startsWith\('\/admin'\);/,
    "const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');"
  );

  const adminRouteTarget = `<Route\n                  path="/admin"`;
  if (!updated.includes('path="/dashboard"')) {
    const dashboardRoutes = `<Route
                  path="/dashboard"
                  element={
                    <React.Suspense
                      fallback={
                        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: '0.95rem' }}>
                          Loading Admin Dashboard...
                        </div>
                      }
                    >
                      <AdminPage />
                    </React.Suspense>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <React.Suspense
                      fallback={
                        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: '0.95rem' }}>
                          Loading Admin Dashboard...
                        </div>
                      }
                    >
                      <AdminPage />
                    </React.Suspense>
                  }
                />
                <Route
                  path="/portfolio/dashboard"
                  element={
                    <React.Suspense
                      fallback={
                        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: '0.95rem' }}>
                          Loading Admin Dashboard...
                        </div>
                      }
                    >
                      <AdminPage />
                    </React.Suspense>
                  }
                />
                <Route
                  path="/admin"`;
    updated = updated.replace(adminRouteTarget, dashboardRoutes);
  }
  return updated;
});

// 13. Update .htaccess and public/.htaccess
const htaccessFiles = ['.htaccess', 'public/.htaccess'];
htaccessFiles.forEach((file) => {
  updateFile(file, (c) => {
    return c
      .replace(
        /RewriteRule \^\(projects\|portfolio\)\(\/\.\*\)\?\$ \/index\.html \[L,QSA\]/g,
        'RewriteRule ^(projects|portfolio|admin|dashboard)(/.*)?$ /index.html [L,QSA]'
      )
      .replace(/ZippyTech Systems/g, 'Zippy Enterprises');
  });
});

console.log('All branding and dashboard updates completed!');
