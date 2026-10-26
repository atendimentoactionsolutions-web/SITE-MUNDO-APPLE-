const fs = require('fs');
const text = fs.readFileSync('src/data/products.ts', 'utf8');
const start = text.indexOf('"id": "iphone-17-pro"');
console.log(text.substring(start, start + 3000));
