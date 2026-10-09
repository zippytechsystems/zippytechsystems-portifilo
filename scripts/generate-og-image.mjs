import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as chromeLauncher from 'chrome-launcher';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.resolve(__dirname, 'og-template.html');
const outputPath = path.resolve(__dirname, '../public/og-image.png');

async function run() {
  console.log('Launching headless Chrome...');
  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--window-size=1200,630',
      '--hide-scrollbars'
    ],
    chromePath: fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe') 
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
      : undefined
  });

  try {
    // Query /json to get WebSocket debugger URL
    const targets = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${chrome.port}/json`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    const wsUrl = pageTarget.webSocketDebuggerUrl;
    console.log('Connecting to WebSocket CDP:', wsUrl);

    // Simple WS client
    const { WebSocket } = await import('undici').then(u => ({ WebSocket: globalThis.WebSocket || u.WebSocket })).catch(() => ({ WebSocket: globalThis.WebSocket }));
    
    const ws = new WebSocket(wsUrl);
    let idCounter = 1;

    const sendCmd = (method, params = {}) => {
      return new Promise((resolve, reject) => {
        const id = idCounter++;
        const onMsg = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener('message', onMsg);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    await new Promise(resolve => ws.addEventListener('open', resolve));

    await sendCmd('Page.enable');
    await sendCmd('Emulation.setDeviceMetricsOverride', {
      width: 1200,
      height: 630,
      deviceScaleFactor: 1,
      mobile: false
    });

    const fileUrl = 'file:///' + templatePath.replace(/\\/g, '/');
    console.log('Navigating to', fileUrl);
    await sendCmd('Page.navigate', { url: fileUrl });

    // Wait for load
    await new Promise(r => setTimeout(r, 1000));

    console.log('Capturing screenshot...');
    const shot = await sendCmd('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 }
    });

    const buffer = Buffer.from(shot.data, 'base64');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Successfully generated og-image.png (${buffer.length} bytes) at: ${outputPath}`);
    ws.close();
  } finally {
    await chrome.kill();
  }
}

run().catch(err => {
  console.error('Error generating og-image:', err);
  process.exit(1);
});
