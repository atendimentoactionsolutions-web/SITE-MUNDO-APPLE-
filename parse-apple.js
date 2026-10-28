const fs = require('fs');
const html = fs.readFileSync('apple_br_raw.html', 'utf8');

// Find all units/sections
// Apple uses: <section class="unit-wrapper ..."> or <div class="unit-wrapper ...">
const regex = /<section[^>]+class=["'][^"']*unit-wrapper[^"']*["'][^>]*>([\s\S]*?)<\/section>/g;
let match;
let count = 0;
while ((match = regex.exec(html)) !== null) {
  count++;
  const sectionContent = match[1];
  const h2 = sectionContent.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  const h3 = sectionContent.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
  const links = sectionContent.match(/<a[^>]+>([\s\S]*?)<\/a>/gi) || [];
  
  const clean = (s) => s ? s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
  console.log(`\n--- UNIT ${count} ---`);
  console.log('Title (H2):', clean(h2 ? h2[1] : ''));
  console.log('Subtitle (H3):', clean(h3 ? h3[1] : ''));
  console.log('CTAs:', links.map(clean).filter(Boolean).slice(0, 3));
}

if (count === 0) {
  // Try alternative classes
  const titles = html.match(/<(h2|h3)[^>]+class=["'][^"']*(headline|eyebrow|unit-title|copy)[^"']*["'][^>]*>([\s\S]*?)<\/\1>/gi) || [];
  console.log('Alternative headings count:', titles.length);
  titles.forEach(t => console.log(' ->', t.replace(/<[^>]+>/g, '').trim()));
}
