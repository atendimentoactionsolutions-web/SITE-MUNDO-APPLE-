const fs = require('fs');
const html = fs.readFileSync('apple_br_raw.html', 'utf8');

// Search for all elements with class 'section-hero' or 'section-promo'
const sections = html.match(/<section[^>]+class="[^"]*(?:section-hero|section-promo)[^"]*"[^>]*>[\s\S]*?<\/section>/gi) || [];
console.log('Total sections with section-hero/promo:', sections.length);

sections.forEach((s, i) => {
  const cls = s.match(/class="([^"]+)"/)?.[1];
  const h2 = s.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  const h3 = s.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
  const p = s.match(/<p[^>]*class="[^"]*headline[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
  const clean = (str) => str ? str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() : '';

  // Find images
  const imgs = Array.from(s.matchAll(/(?:src|srcset)="([^"]+)"/gi)).map(m => m[1]);

  console.log(`\n------------------- SECTION ${i + 1} [${cls}] -------------------`);
  console.log('Title (H2):', clean(h2 ? h2[1] : ''));
  console.log('Subtitle:', clean(h3 ? h3[1] : p ? p[1] : ''));
  console.log('Images count:', imgs.length);
  if (imgs.length > 0) {
    console.log('First 2 images:', imgs.slice(0, 2));
  }
});
