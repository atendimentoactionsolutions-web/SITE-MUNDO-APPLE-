const https = require('https');
const fs = require('fs');

https.get('https://www.apple.com/br/macbook-pro/proled-xdr-display/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    fs.writeFileSync('proled_page.html', data);
    console.log('Saved proled_page.html, size:', data.length);
  });
});
