import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

// Start simple static file server for dist
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || !path.extname(reqPath)) {
    reqPath = '/index.html';
  }
  const filePath = path.join(distDir, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // SPA fallback
    const indexHtml = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexHtml).pipe(res);
  }
});

const PORT = 4173;
server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Audit server running at http://127.0.0.1:${PORT}`);
  const targetUrl = `http://127.0.0.1:${PORT}/`;
  const outputFile = process.argv[2] || './lh-report.json';
  const label = process.argv[3] || 'Lighthouse Audit';

  let chrome;
  try {
    chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
      chromePath: fs.existsSync('C:\\Program Files\\Google\Chrome\\Application\\chrome.exe') 
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
        : undefined
    });

    const options = {
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance'],
      port: chrome.port,
      formFactor: 'mobile',
      screenEmulation: {
        mobile: true,
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        disabled: false
      },
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        cpuSlowdownMultiplier: 4,
        requestLatencyMs: 150,
        downloadThroughputKbps: 1638.4,
        uploadThroughputKbps: 750
      }
    };

    console.log(`Running mobile Lighthouse audit against ${targetUrl}...`);
    const runnerResult = await lighthouse(targetUrl, options);
    const reportJson = runnerResult.report;
    fs.writeFileSync(outputFile, reportJson);

    const r = JSON.parse(reportJson);
    console.log(`\n=== ${label} ===`);
    console.log('Performance Score:', Math.round(r.categories.performance.score * 100));
    console.log('LCP (Largest Contentful Paint):', r.audits['largest-contentful-paint']?.displayValue, `(${Math.round(r.audits['largest-contentful-paint']?.numericValue || 0)} ms)`);
    console.log('CLS (Cumulative Layout Shift):', r.audits['cumulative-layout-shift']?.displayValue, `(${r.audits['cumulative-layout-shift']?.numericValue?.toFixed(4)})`);
    console.log('FCP (First Contentful Paint):', r.audits['first-contentful-paint']?.displayValue);
    console.log('TBT (Total Blocking Time):', r.audits['total-blocking-time']?.displayValue);
    console.log('Speed Index:', r.audits['speed-index']?.displayValue);
  } catch (err) {
    console.error('Lighthouse audit error:', err);
  } finally {
    if (chrome) await chrome.kill();
    server.close();
    process.exit(0);
  }
});
