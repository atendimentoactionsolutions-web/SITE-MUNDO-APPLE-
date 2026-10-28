const https = require('https');
const fs = require('fs');
const path = require('path');

const downloads = [
  // 1. Objeto 3D Oficial Apple MacBook Pro Silver (USDZ)
  {
    url: 'https://www.apple.com/105/media/us/macbook-pro/2026/2a290130-49ff-4459-984d-1feeda3d24cb/ar/macbook-pro-14-in-silver-variant.usdz',
    out: 'public/apple-official/macbook-pro-liquid/macbook-pro-14-silver.usdz'
  },
  // 2. Animação Hero M6 (Imagem do print: MacBook abrindo com o M6 iluminado em neon)
  {
    url: 'https://www.apple.com/105/media/us/macbook-pro/2026/2a290130-49ff-4459-984d-1feeda3d24cb/anim/hero/large_2x.mp4',
    out: 'public/apple-official/macbook-pro-liquid/anim-hero-m6.mp4'
  },
  // 3. Animação Chips M6 / M5 Pro / M5 Max
  {
    url: 'https://www.apple.com/105/media/us/macbook-pro/2026/2a290130-49ff-4459-984d-1feeda3d24cb/anim/pv-chips/large_2x.mp4',
    out: 'public/apple-official/macbook-pro-liquid/anim-pv-chips.mp4'
  },
  // 4. Animação Performance Hero M6
  {
    url: 'https://www.apple.com/105/media/us/macbook-pro/2026/2a290130-49ff-4459-984d-1feeda3d24cb/anim/performance-hero/large_2x.mp4',
    out: 'public/apple-official/macbook-pro-liquid/anim-performance.mp4'
  },
  // 5. Imagem Hero Startframe do M6 em Alta Resolução (idêntica ao print enviado)
  {
    url: 'https://www.apple.com/v/macbook-pro/ay/images/overview/welcome/hero_startframe__ek0dqbh61vau_xlarge.jpg',
    out: 'public/apple-official/macbook-pro-liquid/hero-m6-startframe.jpg'
  },
  // 6. Imagem Hero Endframe do M6 Aberto
  {
    url: 'https://www.apple.com/v/macbook-pro/ay/images/overview/welcome/hero_endframe__fwev9ebh42mq_xlarge.jpg',
    out: 'public/apple-official/macbook-pro-liquid/hero-m6-endframe.jpg'
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
  console.log('Liquid Retina assets downloaded successfully!');
}

run();
