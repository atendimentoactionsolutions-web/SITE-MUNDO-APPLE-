const https = require('https');

https.get('https://www.apple.com/br/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const fs = require('fs');
    fs.writeFileSync('apple_br_raw.html', data, 'utf8');
    console.log('Saved apple_br_raw.html. Length:', data.length);
  });
}).on('error', (e) => console.error(e));
