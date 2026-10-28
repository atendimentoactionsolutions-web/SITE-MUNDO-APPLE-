const fs = require('fs');
const html = fs.readFileSync('apple_br_raw.html', 'utf8');

// Search for class names used inside <main>
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (mainMatch) {
  const main = mainMatch[1];
  const classes = main.match(/class="([^"]+)"/g) || [];
  const uniqueClasses = Array.from(new Set(classes.map(c => c.replace(/class="|"/g, '').split(' ')).flat()));
  console.log('Main unique classes count:', uniqueClasses.length);
  console.log('Sample classes:', uniqueClasses.filter(c => c.includes('module') || c.includes('unit') || c.includes('hero') || c.includes('promo') || c.includes('collection')).slice(0, 30));
}
