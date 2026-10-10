async function checkLive() {
  try {
    const res1 = await fetch('https://zippysoftwares.in/images/logo.png', { cache: 'no-store' });
    console.log('logo.png status:', res1.status, res1.headers.get('content-type'), res1.headers.get('content-length'));
    const res2 = await fetch('https://zippysoftwares.in/images/logo.webp', { cache: 'no-store' });
    console.log('logo.webp status:', res2.status, res2.headers.get('content-type'), res2.headers.get('content-length'));
    const res3 = await fetch('https://zippysoftwares.in/images/founder-suit.webp', { cache: 'no-store' });
    console.log('founder-suit.webp status:', res3.status, res3.headers.get('content-type'), res3.headers.get('content-length'));
    const htmlRes = await fetch('https://zippysoftwares.in/', { cache: 'no-store' });
    const html = await htmlRes.text();
    console.log('Live index.html contains:');
    const matches = html.match(/src="[^"]*index[^"]*\.js"/g);
    console.log('Scripts:', matches);

    if (matches && matches[0]) {
      const scriptUrl = 'https://zippysoftwares.in' + matches[0].replace('src="', '').replace('"', '');
      console.log('Fetching live bundle:', scriptUrl);
      const jsRes = await fetch(scriptUrl, { cache: 'no-store' });
      const jsText = await jsRes.text();
      console.log('Bundle length:', jsText.length);
      const imgMatches = jsText.match(/\/images\/[a-zA-Z0-9_\-\.]+/g);
      console.log('Distinct image paths in live bundle:', [...new Set(imgMatches)]);

      // Find occurrences of Hero3DCircle or imageSrc
      const snippets = [];
      let idx = 0;
      while ((idx = jsText.indexOf('logo.png', idx)) !== -1) {
        snippets.push(jsText.substring(idx - 60, idx + 100));
        idx += 8;
      }
      console.log('logo.png snippets in live bundle:');
      snippets.forEach((s, i) => console.log(`[${i}]: ${s}`));
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}
checkLive();
