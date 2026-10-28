const fs = require('fs');
const html = fs.readFileSync('apple_br_raw.html', 'utf8');

// Inside section-hero:
const heroMatch = html.match(/<section[^>]+class="[^"]*section-hero[^"]*"[^>]*>([\s\S]*?)<\/section>/i);
if (heroMatch) {
  const heroHtml = heroMatch[1];
  console.log('Hero inner classes:', Array.from(heroHtml.matchAll(/class="([^"]+)"/g)).map(m => m[1]).slice(0, 20));
}

// Inside section-promo:
const promoMatch = html.match(/<section[^>]+class="[^"]*section-promo[^"]*"[^>]*>([\s\S]*?)<\/section>/i);
if (promoMatch) {
  const promoHtml = promoMatch[1];
  console.log('Promo inner classes:', Array.from(promoHtml.matchAll(/class="([^"]+)"/g)).map(m => m[1]).slice(0, 20));
}
