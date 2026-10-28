const fs = require('fs');
const html = fs.readFileSync('apple_proled_raw.html', 'utf8');

// Title
const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
console.log('Page Title:', title ? title[1].trim() : '');

// Find 3D models (.usdz, .gltf, .glb, model-viewer, canvas, interactive)
const usdz = html.match(/[a-zA-Z0-9_\-\.\/]+\.usdz/gi) || [];
const gltf = html.match(/[a-zA-Z0-9_\-\.\/]+\.(?:gltf|glb)/gi) || [];
const mp4 = html.match(/[a-zA-Z0-9_\-\.\/]+\.mp4/gi) || [];
const webm = html.match(/[a-zA-Z0-9_\-\.\/]+\.webm/gi) || [];

console.log('USDZ models:', Array.from(new Set(usdz)));
console.log('GLTF/GLB models:', Array.from(new Set(gltf)));
console.log('MP4 videos count:', Array.from(new Set(mp4)).length);
console.log('Sample MP4:', Array.from(new Set(mp4)).slice(0, 5));
console.log('WEBM videos count:', Array.from(new Set(webm)).length);

// Find headings
const h1s = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
const h2s = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
console.log('H1s:', h1s.map(h => h.replace(/<[^>]+>/g, '').trim()));
console.log('H2s (first 10):', h2s.map(h => h.replace(/<[^>]+>/g, '').trim()).slice(0, 10));
