const fs = require('fs');
const https = require('https');
const path = require('path');

const html = fs.readFileSync('apple_homepage.html', 'utf-8');

// Find all promo units
const lines = html.split('\n');
const targets = [];

for (let i = 1420; i < 1660; i++) {
  if (lines[i]) {
    const imgMatches = lines[i].match(/src="([^"]+)"/g) || [];
    imgMatches.forEach(m => {
      const src = m.replace('src="', '').replace('"', '');
      targets.push(src);
    });
  }
}

console.log('Targets:', [...new Set(targets)]);

const destDir = path.join(__dirname, 'public', 'apple-official', 'images');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

async function download(urlPath) {
  const fullUrl = urlPath.startsWith('http') ? urlPath : 'https://www.apple.com' + urlPath;
  const filename = path.basename(urlPath);
  const dest = path.join(destDir, filename);
  console.log(`Downloading ${fullUrl} to ${filename}...`);
  return new Promise((resolve) => {
    https.get(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Saved: ${filename}`);
          resolve(filename);
        });
      } else {
        console.log(`Status ${res.statusCode} for ${fullUrl}`);
        resolve(null);
      }
    }).on('error', err => {
      console.error(err);
      resolve(null);
    });
  });
}

(async () => {
  for (const t of [...new Set(targets)]) {
    // Also try _large_2x.jpg
    await download(t);
    const highRes = t.replace('_large.jpg', '_large_2x.jpg');
    if (highRes !== t) {
      await download(highRes);
    }
  }
})();
