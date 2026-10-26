const fs = require('fs');
let code = fs.readFileSync('src/data/products.ts', 'utf8');

// Target block in iphone-17-pro
const targetBlock = `    "priceFrom": 7050,
    "condition": "new",
    "storage": [
      "256GB",
      "512GB",
      "1TB"
    ],
    "colors": [
      "Cosmic Orange",
      "Deep Blue",
      "Silver"
    ],
    "variants": [
      {
        "storage": "256GB",
        "color": "Cosmic Orange",
        "price": 7050,
        "available": true
      },
      {
        "storage": "256GB",
        "color": "Deep Blue",
        "price": 7230,
        "available": true
      },
      {
        "storage": "256GB",
        "color": "Silver",
        "price": 7250,
        "available": true
      },
      {
        "storage": "512GB",
        "color": "Cosmic Orange",
        "price": 8350,
        "available": true
      },
      {
        "storage": "512GB",
        "color": "Silver",
        "price": 8600,
        "available": true
      },
      {
        "storage": "512GB",
        "color": "Deep Blue",
        "price": 8800,
        "available": true
      },`;

const replacementBlock = `    "priceFrom": 7500,
    "condition": "new",
    "storage": [
      "256GB",
      "512GB",
      "1TB"
    ],
    "colors": [
      "Cosmic Orange",
      "Deep Blue",
      "Silver"
    ],
    "variants": [
      {
        "storage": "256GB",
        "color": "Cosmic Orange",
        "price": 7500,
        "available": true
      },
      {
        "storage": "256GB",
        "color": "Deep Blue",
        "price": 7750,
        "available": true
      },
      {
        "storage": "256GB",
        "color": "Silver",
        "price": 7790,
        "available": true
      },
      {
        "storage": "512GB",
        "color": "Cosmic Orange",
        "price": 8850,
        "available": true
      },
      {
        "storage": "512GB",
        "color": "Silver",
        "price": 9200,
        "available": true
      },
      {
        "storage": "512GB",
        "color": "Deep Blue",
        "price": 9400,
        "available": true
      },`;

if (code.includes(targetBlock)) {
  code = code.replace(targetBlock, replacementBlock);
  fs.writeFileSync('src/data/products.ts', code, 'utf8');
  console.log('iPhone 17 Pro prices updated successfully with LF!');
} else {
  const targetCRLF = targetBlock.replace(/\n/g, '\r\n');
  const replacementCRLF = replacementBlock.replace(/\n/g, '\r\n');
  if (code.includes(targetCRLF)) {
    code = code.replace(targetCRLF, replacementCRLF);
    fs.writeFileSync('src/data/products.ts', code, 'utf8');
    console.log('iPhone 17 Pro prices updated successfully with CRLF!');
  } else {
    console.error('Target block not found in src/data/products.ts');
  }
}
