const fs = require('fs');
const html = fs.readFileSync('apple_homepage.html', 'utf-8');

const matches = html.match(/class="[^"]*(?:promo|hero|module|collection)[^"]*"/gi) || [];
console.log('Class matches:', [...new Set(matches)].slice(0, 30));

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('iPad mini') || l.includes('AirPods Pro') || l.includes('Apple TV') || l.includes('iPhone 16') || l.includes('iPhone')) {
    console.log(`Line ${i}:`, l.trim().slice(0, 120));
  }
});
