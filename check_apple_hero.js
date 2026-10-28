const https = require('https');

https.get('https://www.apple.com/br/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const idx = data.indexOf('Modelo de 14 polegadas agora com M6');
    console.log(data.slice(idx - 200, idx + 2000));
  });
});
