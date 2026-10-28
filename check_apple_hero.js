const https = require('https');

https.get('https://www.apple.com/br/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    // Find all hero units
    const heroes = data.match(/<div class="unit-wrapper">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi) || [];
    heroes.forEach((h, i) => {
      console.log(`=== HERO ${i} ===`);
      const imgs = h.match(/(?:src|srcset)="(?:https:\/\/www\.apple\.com)?([^"\s]+)/gi) || [];
      console.log(h.slice(0, 300).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
      console.log('Images:', imgs);
    });
  });
});
