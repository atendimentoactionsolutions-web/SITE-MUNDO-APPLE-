const fs = require('fs');
const html = fs.readFileSync('proled_page.html', 'utf-8');

// Find title, sections, headlines, videos and images
const title = html.match(/<title>([^<]+)<\/title>/i);
console.log('Title:', title ? title[1] : 'none');

const headings = html.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi) || [];
console.log('Headings:', headings.slice(0, 15).map(h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()));

const videos = html.match(/https:\/\/[^"'\s)]+\.mp4/gi) || [];
console.log('Videos:', [...new Set(videos)]);

const images = html.match(/(?:src|srcset)="(?:https:\/\/www\.apple\.com)?(\/v\/macbook-pro\/[^"'\s)]+\.(?:jpg|png|webp))"/gi) || [];
console.log('Images sample:', [...new Set(images)].slice(0, 20));
