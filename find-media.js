const fs = require('fs');
const html = fs.readFileSync('apple_proled_raw.html', 'utf8');

// Find all video/animation sources or blob/canvas
const videoTags = html.match(/<video[^>]*>[\s\S]*?<\/video>/gi) || [];
console.log('Video tags count:', videoTags.length);
videoTags.forEach((v, i) => {
  console.log(`Video #${i+1}:`, v.substring(0, 200));
});

// Find high res images
const imgs = Array.from(html.matchAll(/(?:src|srcset)="([^"]+\.(?:jpg|png|webp))"/gi)).map(m => m[1]);
const uniqueImgs = Array.from(new Set(imgs)).filter(i => !i.includes('data:image'));
console.log('Unique images count:', uniqueImgs.length);
console.log('Sample images (first 10):', uniqueImgs.slice(0, 10));

// Check if USDZ URL is complete or relative
const usdzMatch = html.match(/(?:href|src|data-[^=]+)="([^"]+\.usdz)"/i);
console.log('USDZ full attr:', usdzMatch ? usdzMatch[0] : 'not found');
