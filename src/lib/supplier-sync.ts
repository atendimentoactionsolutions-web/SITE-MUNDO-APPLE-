import { getSiteSettings } from "./site-settings";
import { products as baseProducts } from "@/data/products";
import { Product, ProductVariant } from "@/types/product";
import { saveOverrides, getProductOverrides, ProductOverrideData } from "./products-store";

const SUPPLIER_API_URL = "https://srv2058756.hstgr.cloud/api/products";

export interface SupplierSyncResult {
  success: boolean;
  timestamp: string;
  totalSupplierItems: number;
  matchedProductsCount: number;
  updatedVariantsCount: number;
  errors?: string[];
}

// Memory cache for background sync timing
declare global {
  var __lastSupplierSync: SupplierSyncResult | undefined;
  var __syncInProgress: boolean | undefined;
}

// Normalize strings for matching
function normalize(str: string | undefined): string {
  if (!str) return "";
  return str
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]/g, "")
    .trim();
}

// Map color aliases between site and supplier
function normalizeColor(color: string | undefined): string {
  const norm = normalize(color);
  if (!norm) return "";
  if (norm.includes("COSMIC") || norm.includes("ORANGE") || norm.includes("LARANJA")) return "COSMICORANGE";
  if (norm.includes("DEEPBLUE") || norm.includes("DARKBLUE") || norm.includes("AZULESCURO")) return "DEEPBLUE";
  if (norm.includes("SILVER") || norm.includes("PRATEADO") || norm.includes("PRATA")) return "SILVER";
  if (norm.includes("NATURAL")) return "NATURAL";
  if (norm.includes("BLACK") || norm.includes("PRETO") || norm.includes("SPACEBLACK") || norm.includes("JETBLACK") || norm.includes("CEUNOTURNO") || norm.includes("NIGHTSKY") || norm.includes("SPACEGRAY") || norm.includes("CINZAESPACIAL")) return "BLACK";
  if (norm.includes("WHITE") || norm.includes("BRANCO") || norm.includes("STARLIGHT") || norm.includes("ESTRELA") || norm.includes("STARWHITE") || norm.includes("BRANCOESTRELA")) return "WHITE";
  if (norm.includes("DESERT") || norm.includes("DESERTO")) return "DESERT";
  if (norm.includes("PINK") || norm.includes("ROSA") || norm.includes("ROSE")) return "PINK";
  if (norm.includes("TEAL") || norm.includes("VERDEPETROLEO")) return "TEAL";
  if (norm.includes("ULTRAMARINE") || norm.includes("AZULMARINHO") || norm.includes("ULTRAMARINO")) return "ULTRAMARINE";
  if (norm.includes("BLUE") || norm.includes("AZUL")) return "BLUE";
  if (norm.includes("GREEN") || norm.includes("VERDE")) return "GREEN";
  if (norm.includes("YELLOW") || norm.includes("AMARELO")) return "YELLOW";
  if (norm.includes("GOLD") || norm.includes("DOURADO")) return "GOLD";
  if (norm.includes("PURPLE") || norm.includes("ROXO")) return "PURPLE";
  return norm;
}

// Map storage aliases (and watch case sizes)
function normalizeStorage(storage: string | undefined): string {
  const norm = normalize(storage);
  if (!norm) return "";
  if (norm === "128" || norm === "128GB") return "128GB";
  if (norm === "256" || norm === "256GB") return "256GB";
  if (norm === "512" || norm === "512GB") return "512GB";
  if (norm === "1TB" || norm === "1000GB" || norm === "1024GB") return "1TB";
  if (norm === "2TB") return "2TB";
  if (norm === "64" || norm === "64GB") return "64GB";
  if (norm === "40MM" || norm === "40") return "40MM";
  if (norm === "42MM" || norm === "42") return "42MM";
  if (norm === "44MM" || norm === "44") return "44MM";
  if (norm === "45MM" || norm === "45") return "45MM";
  if (norm === "46MM" || norm === "46") return "46MM";
  if (norm === "49MM" || norm === "49") return "49MM";
  return norm;
}


function getCategoryMargin(category: string): number {
  try {
    const settings = getSiteSettings();
    const margins = settings.categoryMargins || {
      iphone: 300,
      mac: 300,
      ipad: 200,
      watch: 200,
      airpods: 150,
      accessories: 100,
    };
    const cat = (category || "").toLowerCase();
    if (cat === "iphone") return margins.iphone ?? 300;
    if (cat === "mac") return margins.mac ?? 300;
    if (cat === "ipad") return margins.ipad ?? 200;
    if (cat === "watch") return margins.watch ?? 200;
    if (cat === "airpods") return margins.airpods ?? 150;
    if (cat === "accessories" || cat === "acessorios") return margins.accessories ?? 100;
    return 0;
  } catch (e) {
    return 0;
  }
}

// Map product models
function getModelKey(name: string): string {
  const norm = normalize(name);

  // Acessórios primeiro para evitar falsos positivos
  if (norm.includes("SMARTFOLIO")) return "SMARTFOLIO";
  if (norm.includes("SMARTKEYBOARD")) return "SMARTKEYBOARD";
  if (norm.includes("MAGICMOUSE3")) return "MAGICMOUSE3";
  if (norm.includes("MAGICMOUSE2")) return "MAGICMOUSE2";
  if (norm.includes("MAGICMOUSE")) return "MAGICMOUSE";
  if (norm.includes("MAGICTRACKPAD")) return "MAGICTRACKPAD";
  if (norm.includes("MAGICKEYBOARDNUMERICO") || norm.includes("TECLADONUMERICO")) return "MAGICKEYBOARDNUMERICO";
  if (norm.includes("MAGICKEYBOARDTOUCHID")) return "MAGICKEYBOARDTOUCHID";
  if (norm.includes("MAGICKEYBOARDFOLIO")) return "MAGICKEYBOARDFOLIO";
  if (norm.includes("MAGICKEYBOARD13") || norm.includes("MAGICKEYBOARDIPADAIR13")) return "MAGICKEYBOARD13";
  if (norm.includes("MAGICKEYBOARD129")) return "MAGICKEYBOARD129";
  if (norm.includes("MAGICKEYBOARD11") || norm.includes("MAGICKEYBOARDIPADAIR11")) return "MAGICKEYBOARD11";
  if (norm.includes("MAGICKEYBOARD")) return "MAGICKEYBOARD";
  if (norm.includes("PENCILPRO")) return "APPLEPENCILPRO";
  if (norm.includes("PENCILUSBC")) return "APPLEPENCILUSBC";
  if (norm.includes("PENCIL2") || norm.includes("PENCIL2AGERACAO")) return "APPLEPENCIL2";
  if (norm.includes("PENCIL1") || norm.includes("PENCIL1AGERACAO") || norm.includes("ADAPTADORUSBC")) return "APPLEPENCIL1";
  if (norm.includes("AIRTAG24PACK") || (norm.includes("AIRTAG2") && norm.includes("4PACK"))) return "AIRTAG24PACK";
  if (norm.includes("AIRTAG2") && (norm.includes("1PACK") || !norm.includes("4PACK"))) return "AIRTAG21PACK";
  if (norm.includes("AIRTAG4") || norm.includes("4PACK")) return "AIRTAG4PACK";
  if (norm.includes("AIRTAG1") || norm.includes("1PACK") || norm.includes("AIRTAG")) return "AIRTAG";
  if (norm.includes("APPLETV")) return "APPLETV";

  // Watch - priorizar modelos específicos
  if (norm.includes("ULTRA4")) return "APPLEWATCHULTRA4";
  if (norm.includes("ULTRA3")) return "APPLEWATCHULTRA3";
  if (norm.includes("ULTRA2")) return "APPLEWATCHULTRA2";
  if (norm.includes("ULTRA")) return "APPLEWATCHULTRA3";
  if (norm.includes("SERIES12") || norm.includes("WATCHS12") || norm.includes("S12")) return "APPLEWATCHS12";
  if (norm.includes("SERIES11") || norm.includes("WATCHS11") || norm.includes("S11")) return "APPLEWATCHS11";
  if (norm.includes("SERIES10") || norm.includes("WATCHS10") || norm.includes("S10")) return "APPLEWATCHS10";
  if (norm.includes("SERIES9") || norm.includes("WATCHS9") || norm.includes("S9")) return "APPLEWATCHS9";
  if (norm.includes("WATCHSE3") || (norm.includes("WATCH") && norm.includes("SE3")) || norm.startsWith("APPLEWATCHSE3")) return "APPLEWATCHSE3";
  if (norm.includes("WATCHSE2") || (norm.includes("WATCH") && norm.includes("SE2")) || norm.startsWith("APPLEWATCHSE2")) return "APPLEWATCHSE2";
  if (norm.includes("WATCHSE") || (norm.includes("WATCH") && norm.includes("SE"))) return "APPLEWATCHSE2";

  // AirPods
  if (norm.includes("AIRPODSPRO3")) return "AIRPODSPRO3";
  if (norm.includes("AIRPODSPROLIGHTNING")) return "AIRPODSPROLIGHTNING";
  if (norm.includes("AIRPODSPRO2") || norm.includes("AIRPODSPRO")) return "AIRPODSPRO2";
  if (norm.includes("AIRPODS4ANC")) return "AIRPODS4ANC";
  if (norm.includes("AIRPODS4")) return "AIRPODS4";
  if (norm.includes("AIRPODS5WIRELESS") || norm.includes("ESTOJODERECARGASEMFIO") || norm.includes("WIRELESSCHARGINGCASE")) return "AIRPODS5WIRELESS";
  if (norm.includes("AIRPODS5")) return "AIRPODS5";
  if (norm.includes("AIRPODS3")) return "AIRPODS3";
  if (norm.includes("AIRPODS2") || norm.includes("AIRPODSGERACAO2")) return "AIRPODS2";
  if (norm.includes("AIRPODSMAX2")) return "AIRPODSMAX2";
  if (norm.includes("AIRPODSMAXSMARTCASE") || norm.includes("SMARTCASE")) return "AIRPODSMAXSMARTCASE";
  if (norm.includes("AIRPODSMAX")) return "AIRPODSMAX";

  // iPad
  if (norm.includes("IPADPROM5")) return "IPADPROM5";
  if (norm.includes("IPADPROM4")) return "IPADPROM4";
  if (norm.includes("IPADPROM2") || norm.includes("IPADPRO129")) return "IPADPROM2";
  if (norm.includes("IPADPRO")) return "IPADPRO";
  if (norm.includes("IPADAIRM4")) return "IPADAIRM4";
  if (norm.includes("IPADAIRM3")) return "IPADAIRM3";
  if (norm.includes("IPADAIR5") || norm.includes("IPADAIR")) return "IPADAIR";
  if (norm.includes("IPADMINI7")) return "IPADMINI7";
  if (norm.includes("IPADMINI6") || norm.includes("IPADMINI")) return "IPADMINI";
  if (norm.includes("IPAD11")) return "IPAD11";
  if (norm.includes("IPAD10") || norm.includes("IPAD")) return "IPAD";

  // Mac
  if (norm.includes("MACBOOKPROM5MAX")) return "MACBOOKPROM5MAX";
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
  if (norm.includes("MACBOOKAIR")) return "MACBOOKAIR";
  if (norm.includes("MACBOOKNEO")) return "MACBOOKNEO";
  if (norm.includes("MACSTUDIO")) return "MACSTUDIO";
  if (norm.includes("MACMINIM4PRO")) return "MACMINIM4PRO";
  if (norm.includes("MACMINIM4")) return "MACMINIM4";
  if (norm.includes("MACMINIM6")) return "MACMINIM6";
  if (norm.includes("MACMINI")) return "MACMINI";
  if (norm.includes("IMAC")) return "IMAC";

  // iPhones
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

  return norm;
}

/**
 * Fetch and sync supplier prices into our products database without adding margin (pure live supplier price).
 * NEVER modifies used products or valuation tables.
 */
export async function syncSupplierPrices(): Promise<SupplierSyncResult> {
  if (global.__syncInProgress) {
    return {
      success: false,
      timestamp: new Date().toISOString(),
      totalSupplierItems: 0,
      matchedProductsCount: 0,
      updatedVariantsCount: 0,
      errors: ["Sincronização já em andamento."],
    };
  }

  global.__syncInProgress = true;

  try {
    const res = await fetch(SUPPLIER_API_URL, {
      headers: { "User-Agent": "MundoAppleSync/1.0" },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error(`Falha HTTP ao consultar fornecedor: ${res.status}`);
    }

    const json = await res.json();
    const rawItems: any[] = json.data || [];

    // Filter ONLY new products (condition NOVO, not seminovo, category not SEMI)
    const newItems = rawItems.filter(
      (item) =>
        !item.isSeminovo &&
        item.condition !== "SEMINOVO" &&
        item.category !== "SEMI" &&
        item.price &&
        item.price > 0
    );

    if (newItems.length === 0) {
      throw new Error("Nenhum produto novo retornado pelo fornecedor.");
    }

    // Index lowest price per:
    // 1. (modelKey, storageNorm, colorNorm) -> min price
    // 2. (modelKey, storageNorm) -> min price
    // 3. (modelKey) -> min price
    const priceMapSpecific = new Map<string, number>();
    const priceMapStorage = new Map<string, number>();
    const priceMapModel = new Map<string, number>();

    for (const item of newItems) {
      const modelKey = getModelKey(item.name || item.description || "");
      const stgKey = normalizeStorage(item.storage);
      const colKey = normalizeColor(item.color);
      const price = Number(item.price);

      if (!price || isNaN(price) || price <= 0) continue;

      // Model min
      const currModelMin = priceMapModel.get(modelKey) || Infinity;
      if (price < currModelMin) priceMapModel.set(modelKey, price);

      // Model + Storage min
      if (stgKey) {
        const keyStg = `${modelKey}__${stgKey}`;
        const currStgMin = priceMapStorage.get(keyStg) || Infinity;
        if (price < currStgMin) priceMapStorage.set(keyStg, price);
      }

      // Model + Storage + Color min
      if (stgKey && colKey) {
        const keySpec = `${modelKey}__${stgKey}__${colKey}`;
        const currSpecMin = priceMapSpecific.get(keySpec) || Infinity;
        if (price < currSpecMin) priceMapSpecific.set(keySpec, price);
      }
    }

    const currentOverrides = getProductOverrides();
    let matchedProductsCount = 0;
    let updatedVariantsCount = 0;

    // Iterate our products and match
    for (const prod of baseProducts) {
      // ONLY sync new products in storefront (never used / seminovos)
      if (prod.condition !== "new") continue;

      const prodModelKey = getModelKey(prod.name);
      const categoryMargin = getCategoryMargin(prod.category);
      let updatedVariants: ProductVariant[] = [];
      let minFoundPrice = Infinity;

      if (prod.variants && prod.variants.length > 0) {
        // Read base catalog variants
        const catalogVariants = prod.variants;

        updatedVariants = catalogVariants.map((v) => {
          // Normalize storage or size (for Watches/Keyboards)
          const vStg = normalizeStorage(v.storage || (v as any).size);
          const vCol = normalizeColor(v.color);

          let bestPrice: number | undefined;

          // Priority 1: exact model + storage/size + color
          if (vStg && vCol) {
            bestPrice = priceMapSpecific.get(`${prodModelKey}__${vStg}__${vCol}`);
          }

          // Priority 2: model + storage/size
          if (!bestPrice && vStg) {
            bestPrice = priceMapStorage.get(`${prodModelKey}__${vStg}`);
          }

          // Priority 3: Only for products without explicit storage or when model has uniform price
          // DO NOT apply priceMapModel across different storage capacities (e.g. 512GB vs 128GB)
          if (!bestPrice && !vStg) {
            bestPrice = priceMapModel.get(prodModelKey);
          }

          if (bestPrice && bestPrice > 0) {
            const finalWithMargin = bestPrice + categoryMargin;
            updatedVariantsCount++;
            if (finalWithMargin < minFoundPrice) minFoundPrice = finalWithMargin;
            return {
              ...v,
              price: finalWithMargin,
              available: true,
            };
          }

          // If supplier doesn't have this variant: keep yesterday/catalog price
          if (v.price > 0 && v.price < minFoundPrice) minFoundPrice = v.price;
          return v;
        });
      }

      // Product base priceFrom
      const modelMinPrice = priceMapModel.get(prodModelKey);
      let hasValidSupplierPrice = false;
      let finalPriceFrom = prod.priceFrom;

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
      }
    }

    // Save overrides to products_override.json
    saveOverrides(currentOverrides);

    const result: SupplierSyncResult = {
      success: true,
      timestamp: new Date().toISOString(),
      totalSupplierItems: newItems.length,
      matchedProductsCount,
      updatedVariantsCount,
    };

    global.__lastSupplierSync = result;
    return result;
  } catch (error: any) {
    console.error("Supplier sync error:", error);
    const result: SupplierSyncResult = {
      success: false,
      timestamp: new Date().toISOString(),
      totalSupplierItems: 0,
      matchedProductsCount: 0,
      updatedVariantsCount: 0,
      errors: [error?.message || "Erro desconhecido na sincronização."],
    };
    global.__lastSupplierSync = result;
    return result;
  } finally {
    global.__syncInProgress = false;
  }
}

export function getLastSupplierSync(): SupplierSyncResult | null {
  return global.__lastSupplierSync || null;
}
