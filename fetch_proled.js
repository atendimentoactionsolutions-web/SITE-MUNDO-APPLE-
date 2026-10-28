const fs = require('fs');
const html = fs.readFileSync('proled_page.html', 'utf-8');

const regex = /<section[^>]*class="[^"]*section-([a-z\-]+)[^"]*"[^>]*>([\s\S]*?)<\/section>/gi;
let m;
while ((m = regex.exec(html)) !== null) {
  const sectionName = m[1];
  const content = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`\n=== SECTION: ${sectionName} ===`);
  console.log(content.slice(0, 200));
}
