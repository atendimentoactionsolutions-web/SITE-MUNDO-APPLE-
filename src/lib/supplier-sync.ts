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
  if (norm.includes("BLACK") || norm.includes("PRETO") || norm.includes("SPACEBLACK") || norm.includes("JETBLACK") || norm.includes("CEUNOTURNO") || norm.includes("NIGHTSKY")) return "BLACK";
  if (norm.includes("WHITE") || norm.includes("BRANCO") || norm.includes("STARLIGHT") || norm.includes("ESTRELA") || norm.includes("STARWHITE")) return "WHITE";
  if (norm.includes("DESERT") || norm.includes("DESERTO")) return "DESERT";
  if (norm.includes("PINK") || norm.includes("ROSA")) return "PINK";
  if (norm.includes("TEAL") || norm.includes("VERDEPETROLEO")) return "TEAL";
  if (norm.includes("ULTRAMARINE") || norm.includes("AZULMARINHO") || norm.includes("ULTRAMARINO")) return "ULTRAMARINE";
  if (norm.includes("BLUE") || norm.includes("AZUL")) return "BLUE";
  if (norm.includes("GREEN") || norm.includes("VERDE")) return "GREEN";
  if (norm.includes("YELLOW") || norm.includes("AMARELO")) return "YELLOW";
  if (norm.includes("GOLD") || norm.includes("DOURADO")) return "GOLD";
  if (norm.includes("PURPLE") || norm.includes("ROXO")) return "PURPLE";
  return norm;
}

// Map storage aliases
function normalizeStorage(storage: string | undefined): string {
  const norm = normalize(storage);
  if (!norm) return "";
  if (norm === "128" || norm === "128GB") return "128GB";
  if (norm === "256" || norm === "256GB") return "256GB";
  if (norm === "512" || norm === "512GB") return "512GB";
  if (norm === "1TB" || norm === "1000GB" || norm === "1024GB") return "1TB";
  if (norm === "2TB") return "2TB";
  if (norm === "64" || norm === "64GB") return "64GB";
  return norm;
}

// Map product models
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
      let updatedVariants: ProductVariant[] = [];
      let minFoundPrice = Infinity;

      if (prod.variants && prod.variants.length > 0) {
        // Read existing overrides for this product if any
        const existingProdOverride = currentOverrides[prod.id]?.variants || prod.variants;

        updatedVariants = existingProdOverride.map((v) => {
          const vStg = normalizeStorage(v.storage);
          const vCol = normalizeColor(v.color);

          let bestPrice: number | undefined;

          // Priority 1: exact model + storage + color
          if (vStg && vCol) {
            bestPrice = priceMapSpecific.get(`${prodModelKey}__${vStg}__${vCol}`);
          }

          // Priority 2: model + storage
          if (!bestPrice && vStg) {
            bestPrice = priceMapStorage.get(`${prodModelKey}__${vStg}`);
          }

          // Priority 3: model
          if (!bestPrice) {
            bestPrice = priceMapModel.get(prodModelKey);
          }

          if (bestPrice && bestPrice > 0) {
            updatedVariantsCount++;
            if (bestPrice < minFoundPrice) minFoundPrice = bestPrice;
            return {
              ...v,
              price: bestPrice, // Pure price without margin
              available: true,
            };
          }

          if (v.price > 0 && v.price < minFoundPrice) minFoundPrice = v.price;
          return v;
        });
      }

      // Product base priceFrom
      const modelMinPrice = priceMapModel.get(prodModelKey);
      let finalPriceFrom = prod.priceFrom;

      if (minFoundPrice !== Infinity) {
        finalPriceFrom = minFoundPrice;
      } else if (modelMinPrice && modelMinPrice > 0) {
        finalPriceFrom = modelMinPrice;
      }

      if (finalPriceFrom && finalPriceFrom > 0) {
        matchedProductsCount++;
        currentOverrides[prod.id] = {
          ...currentOverrides[prod.id],
          priceFrom: finalPriceFrom,
          variants: updatedVariants.length > 0 ? updatedVariants : currentOverrides[prod.id]?.variants,
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
