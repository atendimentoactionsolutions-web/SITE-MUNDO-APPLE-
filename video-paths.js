const fs = require('fs');
const html = fs.readFileSync('apple_proled_raw.html', 'utf8');

// Find all data-inline-media-basepath and data-video-basepath
const basepaths = Array.from(html.matchAll(/(?:data-inline-media-basepath|data-video-basepath)="([^"]+)"/gi)).map(m => m[1]);
console.log('Unique video basepaths:', Array.from(new Set(basepaths)));

// Inspect one video tag completely
const video1 = html.match(/<video id="media-hero-video"[^>]*>[\s\S]*?<\/video>/i);
console.log('\nHero Video Tag:', video1 ? video1[0] : 'not found');
