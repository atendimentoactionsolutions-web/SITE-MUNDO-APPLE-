const https = require('https');
const fs = require('fs');

const url = 'https://www.apple.com/br/imac/';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('apple_imac_raw.html', data, 'utf8');
    console.log('Saved apple_imac_raw.html. Length:', data.length);
  });
}).on('error', (e) => console.error(e));
