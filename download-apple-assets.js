const https = require('https');
const fs = require('fs');
const path = require('path');

const downloads = [
  // 1. Objeto 3D Oficial Apple (USDZ para Realidade Aumentada / QuickLook e Viewer 3D)
  {
    url: 'https://www.apple.com/105/media/us/macbook-pro/proled-xdr-display/2026/6d28dc1b-b32e-419e-8706-47639678b6da/ar/macbook-pro-14-in-space-black-variant.usdz',
    out: 'public/apple-official/macbook-pro-proled/macbook-pro-14-space-black.usdz'
  },
  // 2. Animação Hero Oficial (Welcome) em 4K/Retina
  {
    url: 'https://www.apple.com/105/media/us/macbook-pro/proled-xdr-display/2026/6d28dc1b-b32e-419e-8706-47639678b6da/anim/welcome/large_2x.mp4',
    out: 'public/apple-official/macbook-pro-proled/anim-welcome.mp4'
  },
  // 3. Animação Oficial PROLED XDR
  {
    url: 'https://www.apple.com/105/media/us/macbook-pro/proled-xdr-display/2026/6d28dc1b-b32e-419e-8706-47639678b6da/anim/highlights-proled/large_2x.mp4',
    out: 'public/apple-official/macbook-pro-proled/anim-proled.mp4'
  },
  // 4. Animação Oficial Touch
  {
    url: 'https://www.apple.com/105/media/us/macbook-pro/proled-xdr-display/2026/6d28dc1b-b32e-419e-8706-47639678b6da/anim/highlights-touch/large_2x.mp4',
    out: 'public/apple-official/macbook-pro-proled/anim-touch.mp4'
  },
  // 5. Animação Oficial Chip M5/M6 Performance
  {
    url: 'https://www.apple.com/105/media/us/macbook-pro/proled-xdr-display/2026/6d28dc1b-b32e-419e-8706-47639678b6da/anim/highlights-chip/large_2x.mp4',
    out: 'public/apple-official/macbook-pro-proled/anim-chip.mp4'
  },
  // 6. Animação Apple Intelligence AI
  {
    url: 'https://www.apple.com/105/media/us/macbook-pro/proled-xdr-display/2026/6d28dc1b-b32e-419e-8706-47639678b6da/anim/highlights-ai/large_2x.mp4',
    out: 'public/apple-official/macbook-pro-proled/anim-ai.mp4'
  },
  // 7. Poster/Hero Image Startframe Oficial
  {
    url: 'https://www.apple.com/v/homepage/images/macbook-pro-proled-xdr/a/hero_macbook_pro_proled_xdr_animated_preorder_startframe__dnrzzn9ywj2a_large.jpg',
    out: 'public/apple-official/macbook-pro-proled/hero-startframe.jpg'
  },
  // 8. Hero MacBook Pro M6 Oficial
  {
    url: 'https://www.apple.com/v/homepage/images/macbook-pro-m6/a/hero_macbook_pro_m6_announce__b04jni815ck2_large.jpg',
    out: 'public/apple-official/macbook-pro-proled/hero-macbook-pro-m6.jpg'
  },
  // 9. Hero iMac Oficial
  {
    url: 'https://www.apple.com/v/homepage/images/imac-m6/a/hero_imac_m6_announce__bboowaq6op6q_large.jpg',
    out: 'public/apple-official/macbook-pro-proled/hero-imac.jpg'
  }
];

function downloadFile(item) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(item.out);
    https.get(item.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Failed ${item.url} -> HTTP ${res.statusCode}`);
        return resolve(false);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const size = fs.statSync(item.out).size;
        console.log(`Downloaded ${path.basename(item.out)} (${(size / 1024 / 1024).toFixed(2)} MB)`);
        resolve(true);
      });
    }).on('error', (err) => {
      fs.unlink(item.out, () => {});
      console.error(`Error downloading ${item.url}:`, err);
      resolve(false);
    });
  });
}

async function run() {
  for (const item of downloads) {
    await downloadFile(item);
  }
  console.log('All downloads completed!');
}

run();
