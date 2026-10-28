const https = require('https');
const fs = require('fs');
const path = require('path');

const downloads = [
  // 1. Objeto 3D Oficial Apple do iMac (Azul e Prata com acessórios)
  {
    url: 'https://www.apple.com/105/media/us/imac/2026/0911ce49-99a8-4b75-a2da-ef3de434e5f9/ar/imac-with-accessories-blue.usdz',
    out: 'public/apple-official/imac/imac-with-accessories-blue.usdz'
  },
  {
    url: 'https://www.apple.com/105/media/us/imac/2026/0911ce49-99a8-4b75-a2da-ef3de434e5f9/ar/imac-with-accessories-silver.usdz',
    out: 'public/apple-official/imac/imac-with-accessories-silver.usdz'
  },
  // 2. Animação Hero Oficial do iMac (Os 7 iMacs alinhados em leque com todas as cores do print)
  {
    url: 'https://www.apple.com/105/media/ww/imac/2026/0911ce49-99a8-4b75-a2da-ef3de434e5f9/anim/hero/large_2x.mp4',
    out: 'public/apple-official/imac/anim-hero-imac.mp4'
  },
  // 3. Animação Design 360 do iMac
  {
    url: 'https://www.apple.com/105/media/us/imac/2026/0911ce49-99a8-4b75-a2da-ef3de434e5f9/anim/highlights-design/large_2x.mp4',
    out: 'public/apple-official/imac/anim-design.mp4'
  },
  // 4. Animação Chip MX / Performance
  {
    url: 'https://www.apple.com/105/media/us/imac/2026/0911ce49-99a8-4b75-a2da-ef3de434e5f9/anim/highlights-mx/large_2x.mp4',
    out: 'public/apple-official/imac/anim-mx.mp4'
  },
  // 5. Imagem Hero Oficial de Alta Resolução (idêntica ao print com o leque de cores)
  {
    url: 'https://www.apple.com/br/imac/images/overview/welcome/welcome_hero_startframe__chij3faz783m_large.jpg',
    out: 'public/apple-official/imac/hero-imac-startframe.jpg'
  },
  {
    url: 'https://www.apple.com/br/imac/images/overview/welcome/welcome_hero_endframe__d52o4xucwrki_large.jpg',
    out: 'public/apple-official/imac/hero-imac-endframe.jpg'
  },
  // 6. Tipografia Oficial "Complllllletão. E de chip novo."
  {
    url: 'https://www.apple.com/br/imac/images/overview/welcome/welcome_hero_headline__92kp6tw4ilei_large.png',
    out: 'public/apple-official/imac/imac-headline.png'
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
  console.log('All iMac assets downloaded successfully!');
}

run();
