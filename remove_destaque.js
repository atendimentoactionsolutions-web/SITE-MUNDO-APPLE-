const fs = require('fs');

let cardCode = fs.readFileSync('src/components/products/ProductCard.tsx', 'utf8');

// Target the Destaque badge block
const targetLF = `              {product.featured && !isPreOrder && (
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0071E3] border border-blue-200/60 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#0071E3]" />
                  Destaque
                </span>
              )}`;

const targetCRLF = targetLF.replace(/\n/g, '\r\n');

if (cardCode.includes(targetLF)) {
  cardCode = cardCode.replace(targetLF, '');
  fs.writeFileSync('src/components/products/ProductCard.tsx', cardCode, 'utf8');
  console.log('Removed Destaque badge (LF)!');
} else if (cardCode.includes(targetCRLF)) {
  cardCode = cardCode.replace(targetCRLF, '');
  fs.writeFileSync('src/components/products/ProductCard.tsx', cardCode, 'utf8');
  console.log('Removed Destaque badge (CRLF)!');
} else {
  console.error('Target not found in ProductCard.tsx');
}
