const https = require('https');
const fs = require('fs');

const url = 'https://www.apple.com/br/macbook-pro/liquid-retina-xdr-display/';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  console.log('Status:', res.statusCode);
  if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
    console.log('Redirect to:', res.headers.location);
  }
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('apple_liquid_raw.html', data, 'utf8');
    console.log('Saved apple_liquid_raw.html. Length:', data.length);
  });
}).on('error', (e) => console.error(e));
