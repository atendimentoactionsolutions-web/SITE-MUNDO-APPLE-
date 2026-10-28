const fs = require('fs');
const html = fs.readFileSync('apple_br_raw.html', 'utf8');

// Search for each product section block
const targets = [
  'MacBook Pro',
  'iMac',
  'iPhone Duo',
  'iPhone 18 Pro',
  'Apple Watch Series 12',
  'iPad mini',
  'Apple TV 4K',
  'AirPods Pro'
];

targets.forEach(t => {
  const idx = html.indexOf(t);
  if (idx !== -1) {
    const snippet = html.substring(Math.max(0, idx - 250), Math.min(html.length, idx + 600));
    // extract clean text & image paths
    const cleanSnippet = snippet
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    
    // find pictures or images in this snippet
    const imgs = snippet.match(/src=["']([^"']+)["']|srcset=["']([^"']+)["']/gi) || [];
    
    // find copy
    const text = cleanSnippet.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`\n================== TARGET: ${t} ==================`);
    console.log('TEXT:', text.substring(0, 300));
    console.log('IMAGES/SRC:', imgs.slice(0, 4));
  }
});
