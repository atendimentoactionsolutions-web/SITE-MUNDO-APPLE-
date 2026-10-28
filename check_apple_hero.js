const https = require('https');

https.get('https://www.apple.com/br/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    // Find all hero titles
    const matches = data.match(/<h2[^>]*class="[^"]*headline[^"]*"[^>]*>([\s\S]*?)<\/h2>/gi) || [];
    console.log('H2s:', matches.map(m => m.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()));
  });
});
