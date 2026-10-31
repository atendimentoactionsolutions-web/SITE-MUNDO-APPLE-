/** Live supplier prices for existing catalog models, without markups. */
import { Product, ProductVariant } from "@/types/product";

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
  preta: "BLACK",
  black: "BLACK",
  "space black": "SPACE BLACK",
  "space-black": "SPACE BLACK",
  "cinza-espacial": "SPACE GRAY",
  "space gray": "SPACE GRAY",
  "space-gray": "SPACE GRAY",
  "bronze-escura": "DARK BRONZE",
  "bronze escura": "DARK BRONZE",
  "dark bronze": "DARK BRONZE",
  "dourada-clara": "LIGHT GOLD",
  "dourada clara": "LIGHT GOLD",
  "light gold": "LIGHT GOLD",
  dourado: "LIGHT GOLD",
  dourada: "LIGHT GOLD",
  prateado: "SILVER",
  prateada: "SILVER",
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

// In-memory cache for fast, resilient serving (60 seconds = near real time)
let cachedEnrichedProducts: Product[] | null = null;
let lastFetchTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000;
const BUSCADOR_URL = "https://mundo-apple-buscador.onrender.com";

/**
 * Fetch products from the Render Buscador API with timeout protection
 */
export async function fetchRenderSupplierProducts(): Promise<RenderSupplierItem[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const res = await fetch(`${BUSCADOR_URL}/api/products?limit=10000`, {
      signal: controller.signal,
      next: { revalidate: 60 }, // atualização a cada 60s
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

  const vStorage = normalizeStorage(variant?.storage);
  const vColor = normalizeColor(variant?.color);
  const vSize = normalizeSize(variant?.size || variant?.screenSize);
  const vChip = variant?.chip ? variant.chip.toLowerCase() : "";

  // Filter candidates from supplier list
  const candidates = supplierItems.filter((item) => {
    const itemName = item.name.toUpperCase();

    // 1. IPHONES
    if (prodCat === "iphone") {
      if (item.category !== "IPH") return false;

      // Match specific iPhone model
      if (prodSlug === "iphone-18-pro-max") {
        if (!itemName.includes("IPHONE 18 PRO MAX")) return false;
      } else if (prodSlug === "iphone-18-pro") {
        if (!itemName.includes("IPHONE 18 PRO") || itemName.includes("MAX")) return false;
      } else if (prodSlug === "iphone-17-pro-max") {
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
      } else if (prodSlug === "iphone-16-pro-max") {
        if (!itemName.includes("IPHONE 16 PRO MAX")) return false;
      } else if (prodSlug === "iphone-16-plus") {
        if (!itemName.includes("IPHONE 16 PLUS")) return false;
      } else if (prodSlug === "iphone-16e") {
        if (!itemName.includes("IPHONE 16E")) return false;
      } else if (prodSlug === "iphone-16") {
        if (
          !itemName.includes("IPHONE 16") ||
          itemName.includes("PRO") ||
          itemName.includes("16E") ||
          itemName.includes("PLUS")
        )
          return false;
      } else if (prodSlug === "iphone-15-plus") {
        if (!itemName.includes("IPHONE 15 PLUS")) return false;
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

    // 2. MAC & MACBOOK & IMAC & MAC STUDIO
    if (prodCat === "mac") {
      if (item.category !== "MCB" && item.category !== "IMAC") return false;

      if (prodSlug === "mac-studio-m4-max") {
        if (!itemName.includes("MAC STUDIO M4 MAX") && !itemName.includes("STUDIO M4 MAX")) return false;
      } else if (prodSlug === "mac-mini-m4-pro") {
        if (!itemName.includes("MAC MINI M4 PRO")) return false;
      } else if (prodSlug === "mac-mini-m4") {
        if (!itemName.includes("MAC MINI M4") || itemName.includes("PRO")) return false;
      } else if (prodSlug === "imac-24-m4") {
        if (!itemName.includes("IMAC M4 24")) return false;
        if (variant?.chip?.includes("4 Saídas") && !itemName.includes("4 SAIDAS")) return false;
        if (variant?.chip?.includes("2 Portas") && itemName.includes("4 SAIDAS")) return false;
      } else if (prodSlug === "macbook-neo-13") {
        if (!itemName.includes("MACBOOK NEO 13") && !itemName.includes("NEO 13")) return false;
      } else if (prodSlug === "macbook-air-m5") {
        if (!itemName.includes("MACBOOK AIR M5")) return false;
        if (vSize && !itemName.includes(vSize.replace(/["\s]/g, ""))) return false;
      } else if (prodSlug === "macbook-pro-m5-pro") {
        if (!itemName.includes("MACBOOK PRO M5 PRO")) return false;
        if (vSize && !itemName.includes(vSize.replace(/["\s]/g, ""))) return false;
      } else if (prodSlug === "macbook-pro-m5-max") {
        if (!itemName.includes("MACBOOK PRO M5 MAX")) return false;
        if (vSize && !itemName.includes(vSize.replace(/["\s]/g, ""))) return false;
        // RAM differentiation (48GB vs 36GB)
        if (variant?.ram === "48GB" && item.price < 35000) return false;
        if (variant?.ram === "36GB" && item.price >= 35000) return false;
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

    // 3. IPAD
    if (prodCat === "ipad") {
      if (item.category !== "IPAD" && item.category !== "IPD") return false;

      if (prodSlug === "ipad-11") {
        if (!itemName.includes("IPAD 11")) return false;
      } else if (prodSlug === "ipad-mini-7") {
        if (!itemName.includes("MINI 7") && !itemName.includes("IPAD MINI 7")) return false;
      } else if (prodSlug === "ipad-air-m4") {
        if (!itemName.includes("IPAD AIR M4") && !itemName.includes("AIR M4")) return false;
        if (vSize && !itemName.includes(vSize.replace(/["\s]/g, ""))) return false;
        const isCellular = vChip.includes("celular") || vChip.includes("cellular");
        if (isCellular && !itemName.includes("CELULAR")) return false;
        if (!isCellular && itemName.includes("CELULAR")) return false;
      } else if (prodSlug === "ipad-pro-m5") {
        if (!itemName.includes("IPAD PRO M5") && !itemName.includes("PRO M5")) return false;
        if (vSize && !itemName.includes(vSize.replace(/["\s]/g, ""))) return false;
        // Match Cellular vs Wifi
        const isCellular = vChip.includes("celular") || vChip.includes("cellular");
        if (isCellular && !itemName.includes("CELULAR")) return false;
        if (!isCellular && itemName.includes("CELULAR")) return false;
      } else {
        return false;
      }

      // Check storage match
      if (vStorage && normalizeStorage(item.storage) !== vStorage) return false;

      // Check color match if supplier has color
      if (vColor && item.color && normalizeColor(item.color) !== vColor) return false;

      return true;
    }

    // 4. APPLE WATCH
    if (prodCat === "watch") {
      if (item.category !== "RLG") return false;

      if (prodSlug === "apple-watch-s12") {
        if (!itemName.includes("APPLE WATCH S12") && !itemName.includes("WATCH S12")) return false;
        if (vSize && normalizeSize(item.storage) !== vSize) return false;
      } else if (prodSlug === "apple-watch-s11") {
        if (!itemName.includes("APPLE WATCH S11")) return false;
        if (vSize && normalizeSize(item.storage) !== vSize) return false;
      } else if (prodSlug === "apple-watch-ultra-4") {
        if (!itemName.includes("APPLE WATCH ULTRA 4") && !itemName.includes("ULTRA 4")) return false;
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

    // 5. AIRPODS
    if (prodCat === "airpods") {
      if (item.category !== "PODS") return false;

      if (prodSlug === "airpods-5") {
        if (!itemName.includes("AIRPODS 5") && !itemName.includes("PODS 5")) return false;
      } else if (prodSlug === "airpods-4") {
        if (itemName !== "AIRPODS 4") return false;
      } else if (prodSlug === "airpods-4-anc") {
        if (itemName !== "AIRPODS 4 ANC") return false;
      } else if (prodSlug === "airpods-pro-3") {
        if (itemName !== "AIRPODS PRO 3") return false;
      } else if (prodSlug === "airpods-pro-2") {
        if (!itemName.includes("AIRPODS PRO 2") && !itemName.includes("PRO 2")) return false;
      } else if (prodSlug === "airpods-max-2") {
        if (itemName !== "AIRPODS MAX 2" && itemName !== "AIRPODS MAX SMART CASE") return false;
      } else {
        return false;
      }

      if (vColor && item.color && normalizeColor(item.color) !== vColor) return false;

      return true;
    }

    // 6. ACCESSORIES
    if (prodCat === "accessories" || prodCat === "acessorios") {
      if (item.category !== "ACSS") return false;

      if (prodSlug === "airtag-1pack" || prodSlug === "airtag-1-pack") {
        if (itemName !== "AIRTAG 1 PACK" && !itemName.includes("AIRTAG 1")) return false;
        if (itemName.includes("AIRTAG 2")) return false;
      } else if (prodSlug === "airtag-4pack" || prodSlug === "airtag-4-pack") {
        if (itemName !== "AIRTAG 4 PACK" && !itemName.includes("AIRTAG 4")) return false;
        if (itemName.includes("AIRTAG 2")) return false;
      } else if (prodSlug === "airtag-2-1pack") {
        if (!itemName.includes("AIRTAG 2 1 PACK") && !itemName.includes("AIRTAG 2 1PACK") && itemName !== "AIRTAG 2") return false;
      } else if (prodSlug === "airtag-2-4pack") {
        if (!itemName.includes("AIRTAG 2 4 PACK") && !itemName.includes("AIRTAG 2 4PACK")) return false;
      } else if (prodSlug === "apple-pencil-pro") {
        if (!itemName.includes("PENCIL PRO")) return false;
      } else if (prodSlug === "apple-pencil-usbc") {
        if (!itemName.includes("PENCIL USB-C") && !itemName.includes("PENCIL TYPE C")) return false;
      } else if (prodSlug === "apple-pencil-2") {
        if (!itemName.includes("PENCIL 2") && !itemName.includes("PENCIL 2A")) return false;
      } else if (prodSlug.includes("magic-mouse")) {
        if (!itemName.includes("MAGIC MOUSE")) return false;
      } else {
        return false;
      }

      return true;
    }

    return false;
  });

  if (!candidates.length) return null;

  // Use the lowest matching supplier offer without markup or rounding.
  const retailPrices = candidates
    .filter((c) => c.price > 0)
    .map((c) => c.price);
  if (!retailPrices.length) return null;
  return Math.min(...retailPrices);
}

/**
 * Enriches the base products list with exact live supplier prices.
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
    // Seminovos mantêm dados estáticos
    if (product.condition === "used") {
      return product;
    }

    const updatedProduct: Product = { ...product };

    if (product.variants && product.variants.length > 0) {
      const updatedVariants = product.variants.map((variant) => {
        const retail = findBestSupplierPrice(product, variant, supplierItems);
        return retail !== null && retail > 0 ? { ...variant, price: retail } : variant;
      });

      updatedProduct.variants = updatedVariants;

      const activePrices = updatedVariants.map((v) => v.price).filter((p) => p > 0);
      if (activePrices.length > 0) {
        updatedProduct.priceFrom = Math.min(...activePrices);
      }
    } else {
      const retail = findBestSupplierPrice(product, undefined, supplierItems);
      if (retail !== null && retail > 0) {
        updatedProduct.priceFrom = retail;
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

  return cachedEnrichedProducts || baseProducts;
}


