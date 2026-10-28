const fs = require('fs');
const html = fs.readFileSync('apple_br_raw.html', 'utf8');

// Find all elements with class containing 'module' or 'unit'
const matches = html.match(/<section[^>]+class="[^"]*unit[^"]*"[^>]*>[\s\S]*?<\/section>/gi) || [];
console.log('Total unit sections:', matches.length);

matches.forEach((sec, idx) => {
  const h2 = sec.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  const h3 = sec.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
  const p = sec.match(/<p[^>]*class="[^"]*headline[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
  const subcopy = sec.match(/<p[^>]*class="[^"]*sub-copy[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
  const pictures = sec.match(/<source[^>]+srcset="([^"]+)"[^>]*>/gi) || [];
  
  const clean = (s) => s ? s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() : '';

  console.log(`\n=== UNIT #${idx + 1} ===`);
  console.log('H2:', clean(h2 ? h2[1] : ''));
  console.log('H3 / P:', clean(h3 ? h3[1] : p ? p[1] : ''));
  console.log('Subcopy:', clean(subcopy ? subcopy[1] : ''));
  if (pictures.length > 0) {
    console.log('Pictures:', pictures.slice(0, 2).map(p => p.match(/srcset="([^"]+)"/)?.[1]));
  }
});
