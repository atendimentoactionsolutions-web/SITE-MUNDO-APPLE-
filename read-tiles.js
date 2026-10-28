const fs = require('fs');
const html = fs.readFileSync('apple_br_raw.html', 'utf8');

// Search for each 'tile-wrapper'
const tiles = html.split(/class="tile-wrapper/);
console.log('Total tiles found:', tiles.length - 1);

tiles.slice(1).forEach((t, idx) => {
  const isDark = t.includes('theme-dark');
  const headline = t.match(/class="[^"]*typography-tile-headline[^"]*"[^>]*>([\s\S]*?)<\/(?:h2|h3)>/i)?.[1]?.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  const subhead = t.match(/class="[^"]*typography-tile-subhead[^"]*"[^>]*>([\s\S]*?)<\/(?:p|h3|h4)>/i)?.[1]?.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  const callout = t.match(/class="[^"]*typography-tile-callout[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1]?.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Find images
  const imgs = Array.from(t.matchAll(/src="([^"]+\.(?:jpg|png|webp))"/gi)).map(m => m[1]);
  const srcset = Array.from(t.matchAll(/srcset="([^"]+\.(?:jpg|png|webp))\s+2x"/gi)).map(m => m[1]);

  console.log(`\n================ TILE #${idx + 1} (${isDark ? 'DARK' : 'LIGHT'}) ================`);
  console.log('Headline:', headline);
  console.log('Subhead:', subhead);
  console.log('Callout:', callout || 'Nenhum');
  console.log('Imgs:', imgs.filter(i => !i.includes('data:image')).slice(0, 2));
  console.log('Srcset:', srcset.slice(0, 2));
});
