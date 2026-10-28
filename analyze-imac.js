const fs = require('fs');
const html = fs.readFileSync('apple_imac_raw.html', 'utf8');

// Title
const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
console.log('Title:', title ? title[1].trim() : '');

// USDZ models
const usdz = html.match(/[a-zA-Z0-9_\-\.\/]+\.usdz/gi) || [];
console.log('USDZ models:', Array.from(new Set(usdz)));

// Video basepaths & inline media
const basepaths = Array.from(html.matchAll(/(?:data-inline-media-basepath|data-video-basepath)="([^"]+)"/gi)).map(m => m[1]);
console.log('Video basepaths:', Array.from(new Set(basepaths)));

// High-res images
const imgs = Array.from(html.matchAll(/(?:src|srcset)="([^"]+\.(?:jpg|png|webp))"/gi)).map(m => m[1]);
const uniqueImgs = Array.from(new Set(imgs)).filter(i => !i.includes('data:image'));
console.log('Unique images count:', uniqueImgs.length);
console.log('Sample images (first 10):', uniqueImgs.slice(0, 10));
