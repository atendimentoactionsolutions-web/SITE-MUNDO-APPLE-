const https = require('https');

https.get('https://www.apple.com/br/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const idx1 = data.indexOf('class="section section-hero"');
    const idx2 = data.indexOf('class="section section-promo"');
    const heroSection = data.slice(idx1, idx2);
    console.log('Hero section length:', heroSection.length);
    const media = heroSection.match(/(?:src|srcset)="([^"]+)"/g) || [];
    console.log('Media:', media);
    const headlines = heroSection.match(/<h2[^>]*>([\s\S]*?)<\/h2>/g) || [];
    console.log('Headlines:', headlines);
    const subheads = heroSection.match(/<p class="tile-subhead[^"]*">([\s\S]*?)<\/p>/g) || [];
    console.log('Subheads:', subheads);
  });
});
