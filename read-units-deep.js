const fs = require('fs');
const html = fs.readFileSync('apple_br_raw.html', 'utf8');

// Inside section-hero:
const heroMatch = html.match(/<section[^>]+class="[^"]*section-hero[^"]*"[^>]*>([\s\S]*?)<\/section>/i);
if (heroMatch) {
  console.log('=== HERO SECTION ITEMS ===');
  // find units inside hero
  const units = heroMatch[1].match(/<div[^>]+class="[^"]*unit-[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi) || [];
  console.log('Hero units found:', units.length);
  // Find all h2 inside section-hero
  const h2s = heroMatch[1].match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
  h2s.forEach(h => console.log('Hero H2:', h.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()));
}

// Inside section-promo:
const promoMatch = html.match(/<section[^>]+class="[^"]*section-promo[^"]*"[^>]*>([\s\S]*?)<\/section>/i);
if (promoMatch) {
  console.log('\n=== PROMO GRID ITEMS ===');
  // Find all promo titles
  const h3s = promoMatch[1].match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || [];
  h3s.forEach(h => console.log('Promo H3:', h.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()));
}
