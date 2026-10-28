const fs = require('fs');

const html = fs.readFileSync('apple_homepage.html', 'utf-8');

// Find sections or units
const promoRegex = /<section[^>]*class="[^"]*unit[^"]*"[^>]*>([\s\S]*?)<\/section>/gi;
let match;
while ((match = promoRegex.exec(html)) !== null) {
  console.log('--- FOUND SECTION ---');
  const text = match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(text.slice(0, 150));
  const imgs = match[1].match(/(?:src|srcset|data-src|url\()=?["']?([^"')\s]+)/gi) || [];
  console.log('Images:', imgs.slice(0, 5));
}
