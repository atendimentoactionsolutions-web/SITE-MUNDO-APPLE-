const fs = require('fs');
const content = fs.readFileSync('./src/data/products.ts', 'utf8');
const regex = /"name":\s*"([^"]+)"/g;
let match;
const names = [];
while ((match = regex.exec(content)) !== null) {
  names.push(match[1]);
}
console.log('Total names:', names.length);
console.log(names);
