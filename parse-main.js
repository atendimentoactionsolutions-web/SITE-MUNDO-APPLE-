const fs = require('fs');
const html = fs.readFileSync('apple_br_raw.html', 'utf8');

// Find all elements with class containing 'module' or 'collection-module' or 'ribbon' or 'hero'
const unitRegex = /<(section|div)[^>]+class=["']([^"']*(?:unit|module|hero|promo|collection)[^"']*)["'][^>]*>([\s\S]*?)<\/\1>/gi;

let m;
let found = 0;
// Search specifically for main elements
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (mainMatch) {
  const mainContent = mainMatch[1];
  console.log('Main content length:', mainContent.length);

  // Search all h2, h3, h4 inside main
  const headings = mainContent.match(/<(h2|h3)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
  console.log('Found headings in main:', headings.length);
  headings.forEach(h => {
    const text = h.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    if (text) console.log('Heading:', text);
  });
}
