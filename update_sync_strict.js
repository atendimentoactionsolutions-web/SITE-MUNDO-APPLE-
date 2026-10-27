const fs = require('fs');

let code = fs.readFileSync('src/lib/supplier-sync.ts', 'utf8');

// 1. Precise Model Keys to avoid any cross-matching between base, Pro and Max
const targetMacMini = 'if (norm.includes("MACMINI")) return "MACMINI";';
const replacementMacMini = `if (norm.includes("MACMINIM4PRO")) return "MACMINIM4PRO";
  if (norm.includes("MACMINIM4")) return "MACMINIM4";
  if (norm.includes("MACMINIM6")) return "MACMINIM6";
  if (norm.includes("MACMINI")) return "MACMINI";`;

code = code.replace(targetMacMini, replacementMacMini);

// 2. Also ensure MacBook Pro and Air chips don't cross match
const targetMacBook = `if (norm.includes("MACBOOKPROM5")) return "MACBOOKPROM5";
  if (norm.includes("MACBOOKPROM4") || norm.includes("MACBOOKPRO")) return "MACBOOKPRO";
  if (norm.includes("MACBOOKAIRM5")) return "MACBOOKAIRM5";
  if (norm.includes("MACBOOKAIRM4") || norm.includes("MACBOOKAIRM3") || norm.includes("MACBOOKAIR")) return "MACBOOKAIR";`;

const replacementMacBook = `if (norm.includes("MACBOOKPROM5MAX")) return "MACBOOKPROM5MAX";
  if (norm.includes("MACBOOKPROM5PRO")) return "MACBOOKPROM5PRO";
  if (norm.includes("MACBOOKPROM5")) return "MACBOOKPROM5";
  if (norm.includes("MACBOOKPROM4MAX")) return "MACBOOKPROM4MAX";
  if (norm.includes("MACBOOKPROM4PRO")) return "MACBOOKPROM4PRO";
  if (norm.includes("MACBOOKPROM4")) return "MACBOOKPROM4";
  if (norm.includes("MACBOOKPROM3")) return "MACBOOKPROM3";
  if (norm.includes("MACBOOKPRO")) return "MACBOOKPRO";
  if (norm.includes("MACBOOKAIRM5")) return "MACBOOKAIRM5";
  if (norm.includes("MACBOOKAIRM4")) return "MACBOOKAIRM4";
  if (norm.includes("MACBOOKAIRM3")) return "MACBOOKAIRM3";
  if (norm.includes("MACBOOKAIRM2")) return "MACBOOKAIRM2";
  if (norm.includes("MACBOOKAIRM1")) return "MACBOOKAIRM1";
  if (norm.includes("MACBOOKAIR")) return "MACBOOKAIR";`;

code = code.replace(targetMacBook, replacementMacBook);

// 3. RULE: ONLY overwrite product price if supplier has a real matching price!
// If no matching supplier price was found, KEEP the original product price (yesterday's price)!
const targetLoop = `      // Product base priceFrom
      const modelMinPrice = priceMapModel.get(prodModelKey);
      let finalPriceFrom = prod.priceFrom;

      if (minFoundPrice !== Infinity) {
        finalPriceFrom = minFoundPrice;
      } else if (modelMinPrice && modelMinPrice > 0) {
        finalPriceFrom = modelMinPrice + categoryMargin;
      }

      if (finalPriceFrom && finalPriceFrom > 0) {
        matchedProductsCount++;
        currentOverrides[prod.id] = {
          ...currentOverrides[prod.id],
          priceFrom: finalPriceFrom,
          variants: updatedVariants.length > 0 ? updatedVariants : currentOverrides[prod.id]?.variants,
        };
      }`;

const replacementLoop = `      // Product base priceFrom
      const modelMinPrice = priceMapModel.get(prodModelKey);
      let hasValidSupplierPrice = false;
      let finalPriceFrom = currentOverrides[prod.id]?.priceFrom || prod.priceFrom;

      if (minFoundPrice !== Infinity) {
        finalPriceFrom = minFoundPrice;
        hasValidSupplierPrice = true;
      } else if (modelMinPrice && modelMinPrice > 0) {
        finalPriceFrom = modelMinPrice + categoryMargin;
        hasValidSupplierPrice = true;
      }

      // If supplier has price: update it with margin.
      // If supplier DOES NOT have this product: KEEP yesterday's price untouched!
      if (hasValidSupplierPrice) {
        matchedProductsCount++;
        currentOverrides[prod.id] = {
          ...currentOverrides[prod.id],
          priceFrom: finalPriceFrom,
          variants: updatedVariants.length > 0 ? updatedVariants : (currentOverrides[prod.id]?.variants || prod.variants),
        };
      } else {
        // Retain original price & variants from catalog/yesterday
        currentOverrides[prod.id] = {
          ...currentOverrides[prod.id],
          priceFrom: currentOverrides[prod.id]?.priceFrom || prod.priceFrom,
          variants: currentOverrides[prod.id]?.variants || prod.variants,
        };
      }`;

code = code.replace(targetLoop, replacementLoop);

fs.writeFileSync('src/lib/supplier-sync.ts', code, 'utf8');
console.log('supplier-sync.ts updated with strict matching and retention rule!');
