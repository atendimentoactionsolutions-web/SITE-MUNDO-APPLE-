const fs = require('fs');
const html = fs.readFileSync('proled_page.html', 'utf-8');

const mp4s = html.match(/[\w\-\/\.]+\.mp4/gi) || [];
console.log('MP4 paths:', [...new Set(mp4s)]);

// Also check all overview images
const heroImages = html.match(/[\w\-\/\.]*hero[\w\-\/\.]*\.(?:jpg|png)/gi) || [];
console.log('Hero images:', [...new Set(heroImages)]);

const highlightImages = html.match(/\/v\/macbook-pro\/proled-xdr-display\/a\/images\/overview\/[\w\-\/]+\.(?:jpg|png)/gi) || [];
console.log('Highlight images total:', highlightImages.length, [...new Set(highlightImages)].slice(0, 15));
