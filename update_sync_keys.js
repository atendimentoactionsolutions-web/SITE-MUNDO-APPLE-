const fs = require('fs');

let code = fs.readFileSync('src/lib/supplier-sync.ts', 'utf8');

// Replace getModelKey function with expanded matchers
const oldKeyFunc = `// Map product models
function getModelKey(name: string): string {
  const norm = normalize(name);
  if (norm.includes("DUO")) return "IPHONEDUO";
  if (norm.includes("18PROMAX")) return "IPHONE18PROMAX";
  if (norm.includes("18PRO")) return "IPHONE18PRO";
  if (norm.includes("18PLUS")) return "IPHONE18PLUS";
  if (norm.includes("18")) return "IPHONE18";
  if (norm.includes("17PROMAX")) return "IPHONE17PROMAX";
  if (norm.includes("17PRO")) return "IPHONE17PRO";
  if (norm.includes("17AIR")) return "IPHONE17AIR";
  if (norm.includes("17E")) return "IPHONE17E";
  if (norm.includes("17PLUS")) return "IPHONE17PLUS";
  if (norm.includes("17")) return "IPHONE17";
  if (norm.includes("16PROMAX")) return "IPHONE16PROMAX";
  if (norm.includes("16PRO")) return "IPHONE16PRO";
  if (norm.includes("16PLUS")) return "IPHONE16PLUS";
  if (norm.includes("16E")) return "IPHONE16E";
  if (norm.includes("16")) return "IPHONE16";
  if (norm.includes("15PROMAX")) return "IPHONE15PROMAX";
  if (norm.includes("15PRO")) return "IPHONE15PRO";
  if (norm.includes("15PLUS")) return "IPHONE15PLUS";
  if (norm.includes("15")) return "IPHONE15";
  if (norm.includes("14PROMAX")) return "IPHONE14PROMAX";
  if (norm.includes("14PRO")) return "IPHONE14PRO";
  if (norm.includes("14PLUS")) return "IPHONE14PLUS";
  if (norm.includes("14")) return "IPHONE14";
  if (norm.includes("13PROMAX")) return "IPHONE13PROMAX";
  if (norm.includes("13PRO")) return "IPHONE13PRO";
  if (norm.includes("13MINI")) return "IPHONE13MINI";
  if (norm.includes("13")) return "IPHONE13";

  // Watch
  if (norm.includes("ULTRA3") || norm.includes("ULTRA4")) return "APPLEWATCHULTRA";
  if (norm.includes("WATCHS12") || norm.includes("SERIES12")) return "APPLEWATCHS12";
  if (norm.includes("WATCHS11") || norm.includes("SERIES11")) return "APPLEWATCHS11";
  if (norm.includes("WATCHS10") || norm.includes("SERIES10")) return "APPLEWATCHS10";
  if (norm.includes("WATCHSE3") || norm.includes("SE3")) return "APPLEWATCHSE3";

  // AirPods
  if (norm.includes("AIRPODSPRO2") || norm.includes("AIRPODSPRO3")) return "AIRPODSPRO";
  if (norm.includes("AIRPODS4ANC")) return "AIRPODS4ANC";
  if (norm.includes("AIRPODS4")) return "AIRPODS4";
  if (norm.includes("AIRPODSMAX")) return "AIRPODSMAX";

  // iPad
  if (norm.includes("IPADPROM5") || norm.includes("IPADPROM4")) return "IPADPRO";
  if (norm.includes("IPADAIR")) return "IPADAIR";
  if (norm.includes("IPADMINI")) return "IPADMINI";
  if (norm.includes("IPAD11") || norm.includes("IPAD10")) return "IPAD";

  // Mac
  if (norm.includes("MACBOOKPROM5") || norm.includes("MACBOOKPROM4")) return "MACBOOKPRO";
  if (norm.includes("MACBOOKAIRM4") || norm.includes("MACBOOKAIRM3")) return "MACBOOKAIR";
  if (norm.includes("MACMINI")) return "MACMINI";
  if (norm.includes("IMAC")) return "IMAC";

  // Acessórios
  if (norm.includes("AIRTAG4")) return "AIRTAG4PACK";
  if (norm.includes("AIRTAG1") || norm.includes("AIRTAG")) return "AIRTAG";
  if (norm.includes("PENCILPRO")) return "APPLEPENCILPRO";
  if (norm.includes("PENCILUSBC")) return "APPLEPENCILUSBC";
  if (norm.includes("PENCIL2")) return "APPLEPENCIL2";
  if (norm.includes("MAGICMOUSE")) return "MAGICMOUSE";

  return norm;
}`;

const newKeyFunc = `// Map product models
function getModelKey(name: string): string {
  const norm = normalize(name);
  if (norm.includes("DUO")) return "IPHONEDUO";
  if (norm.includes("18PROMAX")) return "IPHONE18PROMAX";
  if (norm.includes("18PRO")) return "IPHONE18PRO";
  if (norm.includes("18PLUS")) return "IPHONE18PLUS";
  if (norm.includes("18")) return "IPHONE18";
  if (norm.includes("17PROMAX")) return "IPHONE17PROMAX";
  if (norm.includes("17PRO")) return "IPHONE17PRO";
  if (norm.includes("17AIR")) return "IPHONE17AIR";
  if (norm.includes("17E")) return "IPHONE17E";
  if (norm.includes("17PLUS")) return "IPHONE17PLUS";
  if (norm.includes("17")) return "IPHONE17";
  if (norm.includes("16PROMAX")) return "IPHONE16PROMAX";
  if (norm.includes("16PRO")) return "IPHONE16PRO";
  if (norm.includes("16PLUS")) return "IPHONE16PLUS";
  if (norm.includes("16E")) return "IPHONE16E";
  if (norm.includes("16")) return "IPHONE16";
  if (norm.includes("15PROMAX")) return "IPHONE15PROMAX";
  if (norm.includes("15PRO")) return "IPHONE15PRO";
  if (norm.includes("15PLUS")) return "IPHONE15PLUS";
  if (norm.includes("15")) return "IPHONE15";
  if (norm.includes("14PROMAX")) return "IPHONE14PROMAX";
  if (norm.includes("14PRO")) return "IPHONE14PRO";
  if (norm.includes("14PLUS")) return "IPHONE14PLUS";
  if (norm.includes("14")) return "IPHONE14";
  if (norm.includes("13PROMAX")) return "IPHONE13PROMAX";
  if (norm.includes("13PRO")) return "IPHONE13PRO";
  if (norm.includes("13MINI")) return "IPHONE13MINI";
  if (norm.includes("13")) return "IPHONE13";

  // Watch
  if (norm.includes("ULTRA4")) return "APPLEWATCHULTRA4";
  if (norm.includes("ULTRA3") || norm.includes("ULTRA")) return "APPLEWATCHULTRA3";
  if (norm.includes("WATCHS12") || norm.includes("SERIES12") || norm.includes("S12")) return "APPLEWATCHS12";
  if (norm.includes("WATCHS11") || norm.includes("SERIES11") || norm.includes("S11")) return "APPLEWATCHS11";
  if (norm.includes("WATCHS10") || norm.includes("SERIES10") || norm.includes("S10")) return "APPLEWATCHS10";
  if (norm.includes("WATCHS9") || norm.includes("SERIES9") || norm.includes("S9")) return "APPLEWATCHS9";
  if (norm.includes("WATCHSE3") || norm.includes("SE3")) return "APPLEWATCHSE3";
  if (norm.includes("WATCHSE2") || norm.includes("SE2") || norm.includes("WATCHSE")) return "APPLEWATCHSE";

  // AirPods
  if (norm.includes("AIRPODSPRO3")) return "AIRPODSPRO3";
  if (norm.includes("AIRPODSPRO2") || norm.includes("AIRPODSPRO")) return "AIRPODSPRO2";
  if (norm.includes("AIRPODS4ANC")) return "AIRPODS4ANC";
  if (norm.includes("AIRPODS4")) return "AIRPODS4";
  if (norm.includes("AIRPODS5")) return "AIRPODS5";
  if (norm.includes("AIRPODS3")) return "AIRPODS3";
  if (norm.includes("AIRPODS2") || norm.includes("AIRPODSGERACAO2")) return "AIRPODS2";
  if (norm.includes("AIRPODSMAX2")) return "AIRPODSMAX2";
  if (norm.includes("AIRPODSMAX")) return "AIRPODSMAX";

  // iPad
  if (norm.includes("IPADPROM5")) return "IPADPROM5";
  if (norm.includes("IPADPROM4")) return "IPADPROM4";
  if (norm.includes("IPADPROM2") || norm.includes("IPADPRO")) return "IPADPRO";
  if (norm.includes("IPADAIRM4") || norm.includes("IPADAIR5") || norm.includes("IPADAIR13") || norm.includes("IPADAIR11") || norm.includes("IPADAIR")) return "IPADAIR";
  if (norm.includes("IPADMINI7") || norm.includes("IPADMINI6") || norm.includes("IPADMINI")) return "IPADMINI";
  if (norm.includes("IPAD11") || norm.includes("IPAD10") || norm.includes("IPAD")) return "IPAD";

  // Mac
  if (norm.includes("MACBOOKPROM5")) return "MACBOOKPROM5";
  if (norm.includes("MACBOOKPROM4") || norm.includes("MACBOOKPRO")) return "MACBOOKPRO";
  if (norm.includes("MACBOOKAIRM5")) return "MACBOOKAIRM5";
  if (norm.includes("MACBOOKAIRM4") || norm.includes("MACBOOKAIRM3") || norm.includes("MACBOOKAIR")) return "MACBOOKAIR";
  if (norm.includes("MACBOOKNEO")) return "MACBOOKNEO";
  if (norm.includes("MACSTUDIO")) return "MACSTUDIO";
  if (norm.includes("MACMINI")) return "MACMINI";
  if (norm.includes("IMAC")) return "IMAC";

  // Acessórios
  if (norm.includes("AIRTAG4") || norm.includes("4PACK")) return "AIRTAG4PACK";
  if (norm.includes("AIRTAG1") || norm.includes("1PACK") || norm.includes("AIRTAG")) return "AIRTAG";
  if (norm.includes("PENCILPRO")) return "APPLEPENCILPRO";
  if (norm.includes("PENCILUSBC")) return "APPLEPENCILUSBC";
  if (norm.includes("PENCIL2") || norm.includes("PENCIL")) return "APPLEPENCIL2";
  if (norm.includes("MAGICMOUSE3") || norm.includes("MAGICMOUSE2") || norm.includes("MAGICMOUSE")) return "MAGICMOUSE";
  if (norm.includes("MAGICTRACKPAD")) return "MAGICTRACKPAD";
  if (norm.includes("MAGICKEYBOARDNUMERICO")) return "MAGICKEYBOARDNUMERICO";
  if (norm.includes("MAGICKEYBOARDTOUCHID")) return "MAGICKEYBOARDTOUCHID";
  if (norm.includes("MAGICKEYBOARD13")) return "MAGICKEYBOARD13";
  if (norm.includes("MAGICKEYBOARD11")) return "MAGICKEYBOARD11";
  if (norm.includes("MAGICKEYBOARD")) return "MAGICKEYBOARD";
  if (norm.includes("SMARTFOLIO")) return "SMARTFOLIO";
  if (norm.includes("APPLETV")) return "APPLETV";

  return norm;
}`;

if (code.includes(oldKeyFunc)) {
  code = code.replace(oldKeyFunc, newKeyFunc);
} else {
  code = code.replace(oldKeyFunc.replace(/\n/g, '\r\n'), newKeyFunc.replace(/\n/g, '\r\n'));
}

fs.writeFileSync('src/lib/supplier-sync.ts', code, 'utf8');
console.log('supplier-sync.ts successfully updated with full catalog mapping!');
