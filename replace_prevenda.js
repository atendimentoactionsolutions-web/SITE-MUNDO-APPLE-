const fs = require('fs');

let cardCode = fs.readFileSync('src/components/products/ProductCard.tsx', 'utf8');

// Replace the Pré-Venda badge block with standard Lacrado / Seminovo badge
const targetBlock = `              {isPreOrder ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  Pré-Venda
                </span>
              ) : (
                <span
                  className={\`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider \${
                    isUsed
                      ? "bg-amber-50 text-amber-800 border border-amber-200/60"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                  }\`}
                >
                  {isUsed ? "Seminovo" : "Lacrado"}
                </span>
              )}`;

const replacementBlock = `              <span
                className={\`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider \${
                  isUsed
                    ? "bg-amber-50 text-amber-800 border border-amber-200/60"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                }\`}
              >
                {isUsed ? "Seminovo" : "Lacrado"}
              </span>`;

if (cardCode.includes(targetBlock)) {
  cardCode = cardCode.replace(targetBlock, replacementBlock);
  fs.writeFileSync('src/components/products/ProductCard.tsx', cardCode, 'utf8');
  console.log('Replaced Pré-Venda with Lacrado (LF)!');
} else {
  const targetCRLF = targetBlock.replace(/\n/g, '\r\n');
  const replacementCRLF = replacementBlock.replace(/\n/g, '\r\n');
  if (cardCode.includes(targetCRLF)) {
    cardCode = cardCode.replace(targetCRLF, replacementCRLF);
    fs.writeFileSync('src/components/products/ProductCard.tsx', cardCode, 'utf8');
    console.log('Replaced Pré-Venda with Lacrado (CRLF)!');
  } else {
    console.error('Target block not found in ProductCard.tsx');
  }
}
