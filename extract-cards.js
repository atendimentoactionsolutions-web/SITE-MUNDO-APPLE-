const fs = require('fs');
const html = fs.readFileSync('apple_br_raw.html', 'utf8');

// Inside section-hero:
const heroMatch = html.match(/<section[^>]+class="[^"]*section-hero[^"]*"[^>]*>([\s\S]*?)<\/section>/i);
if (heroMatch) {
  const heroHtml = heroMatch[1];
  // extract units
  const units = heroHtml.split(/class="unit-wrapper/);
  console.log('Hero units splitted:', units.length - 1);
  units.slice(1).forEach((u, i) => {
    const title = u.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1]?.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    const sub = u.match(/<p[^>]*class="[^"]*headline[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1]?.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    const callout = u.match(/<p[^>]*class="[^"]*callout[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1]?.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    const imgs = Array.from(u.matchAll(/src="([^"]+\.(?:jpg|png|webp))"/gi)).map(m => m[1]);
    console.log(`Hero #${i+1}: Title="${title}" Sub="${sub}" Callout="${callout}" Imgs:`, imgs.slice(0, 2));
  });
}

// Inside section-promo:
const promoMatch = html.match(/<section[^>]+class="[^"]*section-promo[^"]*"[^>]*>([\s\S]*?)<\/section>/i);
if (promoMatch) {
  const promoHtml = promoMatch[1];
  const units = promoHtml.split(/class="unit-wrapper/);
  console.log('\nPromo units splitted:', units.length - 1);
  units.slice(1).forEach((u, i) => {
    const title = u.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)?.[1]?.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    const sub = u.match(/<p[^>]*class="[^"]*sub-copy[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1]?.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    const callout = u.match(/<p[^>]*class="[^"]*callout[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1]?.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    const imgs = Array.from(u.matchAll(/src="([^"]+\.(?:jpg|png|webp))"/gi)).map(m => m[1]);
    console.log(`Promo #${i+1}: Title="${title}" Sub="${sub}" Callout="${callout}" Imgs:`, imgs.slice(0, 2));
  });
}
