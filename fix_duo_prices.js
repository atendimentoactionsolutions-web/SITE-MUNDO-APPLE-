const fs = require('fs');

// 1. Update ProductCard.tsx to show price if currentPrice > 0, even if isPreOrder was true
let cardCode = fs.readFileSync('src/components/products/ProductCard.tsx', 'utf8');
cardCode = cardCode.replace(
  'const isPreOrder = product.availability === "pre_order" || product.priceFrom === 0;',
  'const isPreOrder = product.priceFrom === 0 || (!product.priceFrom && product.availability === "pre_order");'
);
cardCode = cardCode.replace(
  '{currentPrice === 0 || isPreOrder ? (',
  '{currentPrice === 0 ? ('
);
fs.writeFileSync('src/components/products/ProductCard.tsx', cardCode, 'utf8');
console.log('ProductCard.tsx updated!');

// 2. Update supplier-sync.ts to map DUO and its colors
let syncCode = fs.readFileSync('src/lib/supplier-sync.ts', 'utf8');

// Add DUO to getModelKey
syncCode = syncCode.replace(
  'function getModelKey(name: string): string {\n  const norm = normalize(name);',
  'function getModelKey(name: string): string {\n  const norm = normalize(name);\n  if (norm.includes("DUO")) return "IPHONEDUO";'
);
if (!syncCode.includes('if (norm.includes("DUO"))')) {
  syncCode = syncCode.replace(
    'function getModelKey(name: string): string {\r\n  const norm = normalize(name);',
    'function getModelKey(name: string): string {\r\n  const norm = normalize(name);\r\n  if (norm.includes("DUO")) return "IPHONEDUO";'
  );
}

// Add CEUNOTURNO, NIGHTSKY, BRANCOESTRELA, STARWHITE to color normalizer
syncCode = syncCode.replace(
  'if (norm.includes("BLACK") || norm.includes("PRETO") || norm.includes("SPACEBLACK") || norm.includes("JETBLACK")) return "BLACK";',
  'if (norm.includes("BLACK") || norm.includes("PRETO") || norm.includes("SPACEBLACK") || norm.includes("JETBLACK") || norm.includes("CEUNOTURNO") || norm.includes("NIGHTSKY")) return "BLACK";'
);
syncCode = syncCode.replace(
  'if (norm.includes("WHITE") || norm.includes("BRANCO") || norm.includes("STARLIGHT") || norm.includes("ESTRELA")) return "WHITE";',
  'if (norm.includes("WHITE") || norm.includes("BRANCO") || norm.includes("STARLIGHT") || norm.includes("ESTRELA") || norm.includes("STARWHITE")) return "WHITE";'
);

fs.writeFileSync('src/lib/supplier-sync.ts', syncCode, 'utf8');
console.log('supplier-sync.ts updated!');

// 3. Update products.ts for iPhone Duo initial availability from pre_order to available
let prodCode = fs.readFileSync('src/data/products.ts', 'utf8');
prodCode = prodCode.replace(
  '"id": "iphone-duo",\r\n    "slug": "iphone-duo",\r\n    "name": "iPhone Duo",\r\n    "category": "iphone",\r\n    "subcategory": "iPhone Duo",\r\n    "image": "/images/products/iphone/iphone-duo-v2.png",\r\n    "priceFrom": 0,\r\n    "condition": "new",\r\n    "availability": "pre_order",',
  '"id": "iphone-duo",\r\n    "slug": "iphone-duo",\r\n    "name": "iPhone Duo",\r\n    "category": "iphone",\r\n    "subcategory": "iPhone Duo",\r\n    "image": "/images/products/iphone/iphone-duo-v2.png",\r\n    "priceFrom": 23300,\r\n    "condition": "new",\r\n    "availability": "available",'
);
prodCode = prodCode.replace(
  '"id": "iphone-duo",\n    "slug": "iphone-duo",\n    "name": "iPhone Duo",\n    "category": "iphone",\n    "subcategory": "iPhone Duo",\n    "image": "/images/products/iphone/iphone-duo-v2.png",\n    "priceFrom": 0,\n    "condition": "new",\n    "availability": "pre_order",',
  '"id": "iphone-duo",\n    "slug": "iphone-duo",\n    "name": "iPhone Duo",\n    "category": "iphone",\n    "subcategory": "iPhone Duo",\n    "image": "/images/products/iphone/iphone-duo-v2.png",\n    "priceFrom": 23300,\n    "condition": "new",\n    "availability": "available",'
);
fs.writeFileSync('src/data/products.ts', prodCode, 'utf8');
console.log('products.ts updated for iPhone Duo!');
