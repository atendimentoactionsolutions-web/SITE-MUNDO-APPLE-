const fs = require('fs');
let code = fs.readFileSync('src/lib/sell/pricing-engine.ts', 'utf8');

if (!code.includes('import { getSiteSettings }')) {
  code = 'import { getSiteSettings } from "@/lib/site-settings";\r\n' + code;
}

const target = `  return {
    basePrice,
    minimumPrice,
    calculatedPrice,
    percentageDiscountTotal: totalDiscountAmount,
    fixedDiscountTotal: 0,
    finalPrice,
    deflatorsApplied: appliedDeflators,
    manualReview,
    blocked: false,
    blockReason: "",
  };`;

const replacement = `  const siteSettings = getSiteSettings();
  const isHidden = siteSettings.hideAllPrices;

  return {
    basePrice: isHidden ? 0 : basePrice,
    minimumPrice: isHidden ? 0 : minimumPrice,
    calculatedPrice: isHidden ? 0 : calculatedPrice,
    percentageDiscountTotal: isHidden ? 0 : totalDiscountAmount,
    fixedDiscountTotal: 0,
    finalPrice: isHidden ? 0 : finalPrice,
    deflatorsApplied: appliedDeflators,
    manualReview: isHidden ? true : manualReview,
    blocked: false,
    blockReason: "",
  };`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/lib/sell/pricing-engine.ts', code, 'utf8');
  console.log('pricing-engine.ts updated with LF!');
} else {
  const targetCRLF = target.replace(/\n/g, '\r\n');
  const replacementCRLF = replacement.replace(/\n/g, '\r\n');
  if (code.includes(targetCRLF)) {
    code = code.replace(targetCRLF, replacementCRLF);
    fs.writeFileSync('src/lib/sell/pricing-engine.ts', code, 'utf8');
    console.log('pricing-engine.ts updated with CRLF!');
  } else {
    console.error('Target not found in pricing-engine.ts');
  }
}
