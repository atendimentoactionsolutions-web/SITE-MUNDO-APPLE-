const https = require('https');

https.get('https://www.apple.com/br/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const idx = data.indexOf('MacBook Pro');
    console.log(data.slice(idx - 200, idx + 2000));
  });
});
