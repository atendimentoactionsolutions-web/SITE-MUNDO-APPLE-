/**
 * Live Pricing Engine
 * Connects to the Render supplier catalog API (https://mundo-apple-buscador.onrender.com/api/products),
 * matches prices for existing store products per variant (including color differentiation),
 * and applies the user-defined profit margins:
 *   - iPhones: + R$ 750,00
 *   - MacBooks / Mac / iMac: + R$ 1.300,00
 *   - AirPods: + R$ 500,00
 *   - Apple Watch: + R$ 500,00
 *   - Accessories: DO NOT TOUCH (static catalog prices)
 *   - iPads: DO NOT TOUCH (static catalog prices)
 */

import { Product, ProductVariant } from "@/types/product";

// Profit margins configured by store owner
export const CATEGORY_MARGINS: Record<string, number> = {
  iphone: 750,
  mac: 1300,
  imac: 1300,
  airpods: 500,
  watch: 500,
  // accessories: DO NOT TOUCH
  // ipad: DO NOT TOUCH
};

export interface RenderSupplierItem {
  id: string;
  name: string;
  category: "IPH" | "MCB" | "IMAC" | "RLG" | "PODS" | "IPAD" | "ACSS" | string;
  storage?: string;
  color?: string;
  price: number;
  isActive?: boolean;
  supplier?: {
    name?: string;
  };
}

// Map color names from storefront (PT-BR / EN) to Render API uppercase standards
const COLOR_ALIAS_MAP: Record<string, string> = {
  preto: "BLACK",
  black: "BLACK",
  "space black": "SPACE BLACK",
  "space-black": "SPACE BLACK",
  "cinza-espacial": "SPACE GRAY",
  "space gray": "SPACE GRAY",
  "space-gray": "SPACE GRAY",
  prateado: "SILVER",
  silver: "SILVER",
  branco: "WHITE",
  white: "WHITE",
  "branco-estrela": "STARLIGHT",
  estelar: "STARLIGHT",
  starlight: "STARLIGHT",
  "meia-noite": "MIDNIGHT",
  midnight: "MIDNIGHT",
  azul: "BLUE",
  blue: "BLUE",
  "deep blue": "DEEP BLUE",
  "sky blue": "SKY BLUE",
  "mist blue": "MIST BLUE",
  rosa: "PINK",
  pink: "PINK",
  "soft pink": "SOFT PINK",
  "rose gold": "ROSE GOLD",
  verde: "GREEN",
  green: "GREEN",
  sage: "SAGE",
  teal: "TEAL",
  amarelo: "YELLOW",
  yellow: "YELLOW",
  ultramarine: "ULTRAMARINE",
  ultramarino: "ULTRAMARINE",
  laranja: "ORANGE",
  orange: "ORANGE",
  "cosmic orange": "COSMIC ORANGE",
  lavender: "LAVENDER",
  lavanda: "LAVENDER",
  "light gold": "LIGHT GOLD",
  dourado: "LIGHT GOLD",
  "cloud white": "CLOUD WHITE",
  citrus: "CITRUS",
  blush: "BLUSH",
  indigo: "INDIGO",
  índigo: "INDIGO",
  roxo: "PURPLE",
  purple: "PURPLE",
  "jet black": "JET BLACK",
  natural: "NATURAL",
  "titânio natural": "NATURAL",
  "natural titanium": "NATURAL",
  "black titanium": "BLACK",
  "titânio preto": "BLACK",
  "desert titanium": "DESERT TITANIUM",
  "titânio deserto": "DESERT TITANIUM",
  "white titanium": "WHITE TITANIUM",
  "titânio branco": "WHITE TITANIUM",
  red: "RED",
  vermelho: "RED",
};

export function normalizeColor(color?: string): string {
  if (!color) return "";
  const cleaned = color.trim().toLowerCase();
  return COLOR_ALIAS_MAP[cleaned] || cleaned.toUpperCase();
}

export function normalizeStorage(storage?: string): string {
  if (!storage) return "";
  return storage.trim().toUpperCase().replace(/\s+/g, "");
}

export function normalizeSize(size?: string): string {
  if (!size) return "";
  return size.trim().toUpperCase().replace(/\s+/g, "");
}

// In-memory cache for fast, resilient serving
let cachedEnrichedProducts: Product[] | null = null;
let lastFetchTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

/**
 * Fetch products from the Render Buscador API with timeout protection
 */
export async function fetchRenderSupplierProducts(): Promise<RenderSupplierItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

  try {
    const res = await fetch("https://mundo-apple-buscador.onrender.com/api/products", {
      signal: controller.signal,
      next: { revalidate: 300 }, // Next.js ISR cache: 5 minutes
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[LivePricing] Render API returned status ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (data && Array.isArray(data.data)) {
      return data.data.filter((item: RenderSupplierItem) => item.price > 0);
    }
    return [];
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("[LivePricing] Failed to fetch Render API, falling back to static catalog:", err);
    return [];
  }
}

/**
 * Map our site product to corresponding Render API items.
 */
function findBestSupplierPrice(
  product: Product,
  variant: ProductVariant | undefined,
  supplierItems: RenderSupplierItem[]
): number | null {
  const prodSlug = product.slug.toLowerCase();
  const prodCat = product.category.toLowerCase();

  // If accessory or ipad, owner instructed not to touch
  if (prodCat === "accessories" || prodCat === "ipad") {
    return null;
  }

  const vStorage = normalizeStorage(variant?.storage);
  const vColor = normalizeColor(variant?.color);
  const vSize = normalizeSize(variant?.size || variant?.screenSize);

  // Filter candidates from supplier list
  const candidates = supplierItems.filter((item) => {
    const itemName = item.name.toUpperCase();

    // 1. IPHONES
    if (prodCat === "iphone") {
      if (item.category !== "IPH") return false;

      // Match specific iPhone model
      if (prodSlug === "iphone-17-pro-max") {
        if (!itemName.includes("IPHONE 17 PRO MAX")) return false;
      } else if (prodSlug === "iphone-17-pro") {
        if (!itemName.includes("IPHONE 17 PRO") || itemName.includes("MAX")) return false;
      } else if (prodSlug === "iphone-17-air") {
        if (!itemName.includes("IPHONE 17 AIR")) return false;
      } else if (prodSlug === "iphone-17e") {
        if (!itemName.includes("IPHONE 17E")) return false;
      } else if (prodSlug === "iphone-17") {
        if (
          !itemName.includes("IPHONE 17") ||
          itemName.includes("PRO") ||
          itemName.includes("AIR") ||
          itemName.includes("17E")
        )
          return false;
      } else if (prodSlug === "iphone-16") {
        if (
          !itemName.includes("IPHONE 16") ||
          itemName.includes("PRO") ||
          itemName.includes("16E") ||
          itemName.includes("PLUS")
        )
          return false;
      } else if (prodSlug === "iphone-15") {
        if (
          !itemName.includes("IPHONE 15") ||
          itemName.includes("PRO") ||
          itemName.includes("PLUS")
        )
          return false;
      } else {
        return false;
      }

      // Check storage match
      if (vStorage && normalizeStorage(item.storage) !== vStorage) return false;

      // Check color match
      if (vColor && normalizeColor(item.color) !== vColor) return false;

      return true;
    }

    // 2. MAC & MACBOOK & IMAC
    if (prodCat === "mac") {
      if (item.category !== "MCB" && item.category !== "IMAC") return false;

      if (prodSlug === "imac-24-m4") {
        if (!itemName.includes("IMAC M4 24")) return false;
        // Check 4-saidas distinction if present in chip
        if (variant?.chip?.includes("4 Saídas") && !itemName.includes("4 SAIDAS")) return false;
        if (variant?.chip?.includes("2 Portas") && itemName.includes("4 SAIDAS")) return false;
      } else if (prodSlug === "mac-mini-m4") {
        if (!itemName.includes("MAC MINI M4")) return false;
      } else if (prodSlug === "macbook-neo-13") {
        if (!itemName.includes("MACBOOK NEO 13")) return false;
      } else if (prodSlug === "macbook-air-m5") {
        if (!itemName.includes("MACBOOK AIR M5")) return false;
        if (vSize && !itemName.includes(vSize.replace(/["\s]/g, ""))) return false;
      } else if (prodSlug === "macbook-pro-m5-pro") {
        if (!itemName.includes("MACBOOK PRO M5 PRO")) return false;
        if (vSize && !itemName.includes(vSize.replace(/["\s]/g, ""))) return false;
      } else if (prodSlug === "macbook-pro-m5-max") {
        if (!itemName.includes("MACBOOK PRO M5 MAX")) return false;
        if (vSize && !itemName.includes(vSize.replace(/["\s]/g, ""))) return false;
      } else if (prodSlug === "macbook-pro-m5") {
        if (!itemName.includes("MACBOOK PRO M5") || itemName.includes("PRO") || itemName.includes("MAX")) return false;
        if (vSize && !itemName.includes(vSize.replace(/["\s]/g, ""))) return false;
      } else {
        return false;
      }

      // Check storage match
      if (vStorage && normalizeStorage(item.storage) !== vStorage) return false;

      // Check color match if supplier has color
      if (vColor && item.color && normalizeColor(item.color) !== vColor) return false;

      return true;
    }

    // 3. APPLE WATCH
    if (prodCat === "watch") {
      if (item.category !== "RLG") return false;

      if (prodSlug === "apple-watch-s11") {
        if (!itemName.includes("APPLE WATCH S11")) return false;
        if (vSize && normalizeSize(item.storage) !== vSize) return false;
      } else if (prodSlug === "apple-watch-ultra-3") {
        if (!itemName.includes("APPLE WATCH ULTRA 3")) return false;
      } else if (prodSlug === "apple-watch-se-3") {
        if (!itemName.includes("APPLE WATCH SE 3")) return false;
        if (vSize && normalizeSize(item.storage) !== vSize) return false;
      } else {
        return false;
      }

      // Color check
      if (vColor && item.color && normalizeColor(item.color) !== vColor) return false;

      return true;
    }

    // 4. AIRPODS
    if (prodCat === "airpods") {
      if (item.category !== "PODS") return false;

      if (prodSlug === "airpods-4") {
        if (itemName !== "AIRPODS 4") return false;
      } else if (prodSlug === "airpods-4-anc") {
        if (itemName !== "AIRPODS 4 ANC") return false;
      } else if (prodSlug === "airpods-pro-3") {
        if (itemName !== "AIRPODS PRO 3") return false;
      } else if (prodSlug === "airpods-max-2") {
        if (itemName !== "AIRPODS MAX 2" && itemName !== "AIRPODS MAX SMART CASE") return false;
      } else {
        return false;
      }

      if (vColor && item.color && normalizeColor(item.color) !== vColor) return false;

      return true;
    }

    return false;
  });

  if (!candidates.length) return null;

  // Return lowest supplier price among matching items
  const lowestPrice = Math.min(...candidates.map((c) => c.price));
  return lowestPrice > 0 ? lowestPrice : null;
}

/**
 * Enriches the base products list with live supplier prices + profit margins.
 * Falls back safely to base prices if no supplier price is found.
 */
export function applyLivePrices(
  baseProducts: Product[],
  supplierItems: RenderSupplierItem[]
): Product[] {
  if (!supplierItems || supplierItems.length === 0) {
    return baseProducts;
  }

  return baseProducts.map((product) => {
    const margin = CATEGORY_MARGINS[product.category.toLowerCase()];

    // If no margin rule or product is seminovo / accessory / ipad, preserve static data
    if (margin === undefined || product.condition === "used") {
      return product;
    }

    // Clone product
    const updatedProduct: Product = { ...product };

    // Update variants if present
    if (product.variants && product.variants.length > 0) {
      const updatedVariants = product.variants.map((variant) => {
        const supplierPrice = findBestSupplierPrice(product, variant, supplierItems);
        if (supplierPrice !== null && supplierPrice > 0) {
          const finalPrice = Math.round(supplierPrice + margin);
          return {
            ...variant,
            price: finalPrice,
          };
        }
        return variant;
      });

      updatedProduct.variants = updatedVariants;

      // Recalculate priceFrom as lowest variant price > 0
      const activePrices = updatedVariants
        .map((v) => v.price)
        .filter((p) => p > 0);

      if (activePrices.length > 0) {
        updatedProduct.priceFrom = Math.min(...activePrices);
      }
    } else {
      // Product without explicit variants (e.g. single AirPods 4)
      const supplierPrice = findBestSupplierPrice(product, undefined, supplierItems);
      if (supplierPrice !== null && supplierPrice > 0) {
        updatedProduct.priceFrom = Math.round(supplierPrice + margin);
      }
    }

    return updatedProduct;
  });
}

/**
 * Main cached entry point to get live-enriched products
 */
export async function getLiveEnrichedProducts(baseProducts: Product[]): Promise<Product[]> {
  const now = Date.now();

  // Return cached result if fresh
  if (cachedEnrichedProducts && now - lastFetchTimestamp < CACHE_TTL_MS) {
    return cachedEnrichedProducts;
  }

  try {
    const supplierItems = await fetchRenderSupplierProducts();
    if (supplierItems && supplierItems.length > 0) {
      const enriched = applyLivePrices(baseProducts, supplierItems);
      cachedEnrichedProducts = enriched;
      lastFetchTimestamp = now;
      return enriched;
    }
  } catch (err) {
    console.error("[LivePricing] Error enriching products:", err);
  }

  // Fallback to previous cache or original baseProducts
  return cachedEnrichedProducts || baseProducts;
}
