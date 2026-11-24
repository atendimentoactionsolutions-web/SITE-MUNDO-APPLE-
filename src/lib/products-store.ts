import fs from "fs";
import path from "path";
import { products as initialProducts } from "@/data/products";
import { Product, ProductVariant } from "@/types/product";
import { getSiteSettings } from "./site-settings";

// File where overrides are stored
const OVERRIDE_FILE = process.env.PRODUCT_OVERRIDES_FILE || path.join(process.cwd(), "products_override.json");

export interface ProductOverrideData {
  supplierUpdatedAt?: string;
  active?: boolean;
  priceFrom?: number;
  featured?: boolean;
  variants?: ProductVariant[];
}

type ProductOverrides = Record<string, ProductOverrideData>;

// In-memory cache with timestamp to reload fresh data from disk
declare global {
  var __productOverrides: ProductOverrides | undefined;
  var __productOverridesLastRead: number | undefined;
}

function loadOverrides(): ProductOverrides {
  const now = Date.now();
  // Invalidate cache every 10 seconds or read fresh from disk
  if (global.__productOverrides && global.__productOverridesLastRead && now - global.__productOverridesLastRead < 1000) {
    return global.__productOverrides;
  }
  try {
    if (fs.existsSync(OVERRIDE_FILE)) {
      const data = fs.readFileSync(OVERRIDE_FILE, "utf-8");
      global.__productOverrides = JSON.parse(data);
      global.__productOverridesLastRead = now;
      return global.__productOverrides || {};
    }
  } catch (err) {
    console.error("Error reading products_override.json:", err);
  }
  global.__productOverrides = {};
  global.__productOverridesLastRead = now;
  return global.__productOverrides;
}

export function saveOverrides(overrides: ProductOverrides): void {
  fs.mkdirSync(path.dirname(OVERRIDE_FILE), { recursive: true });
  const temporary = OVERRIDE_FILE + ".tmp";
  fs.writeFileSync(temporary, JSON.stringify(overrides, null, 2), "utf-8");
  fs.renameSync(temporary, OVERRIDE_FILE);
  global.__productOverrides = overrides;
  global.__productOverridesLastRead = Date.now();
}

function variantMergeKey(v: ProductVariant): string {
  const norm = (s?: string) => (s || "").trim().toLowerCase();
  return [
    norm(v.size),
    norm(v.screenSize),
    norm(v.chip),
    norm(v.ram),
    norm(v.storage),
    norm(v.color),
  ].join("|");
}

function mergeBaseVariantsWithOverride(
  baseVariants?: ProductVariant[],
  overrideVariants?: ProductVariant[]
): ProductVariant[] | undefined {
  if (!overrideVariants) return baseVariants;
  if (!baseVariants || baseVariants.length === 0) return overrideVariants;
  const overrideMap = new Map<string, ProductVariant>();
  for (const v of overrideVariants) {
    overrideMap.set(variantMergeKey(v), v);
  }
  const seen = new Set<string>();
  const merged: ProductVariant[] = [];
  for (const baseV of baseVariants) {
    const k = variantMergeKey(baseV);
    if (seen.has(k)) continue;
    seen.add(k);
    merged.push(overrideMap.get(k) || baseV);
  }
  for (const ovV of overrideVariants) {
    const k = variantMergeKey(ovV);
    if (seen.has(k)) continue;
    seen.add(k);
    merged.push(ovV);
  }
  return merged;
}

// Epoch marking the latest verified catalog price update baked into src/data/products.ts.
// Older persisted overrides in /app/data/products_override.json will yield to the fresh base prices
// until a newer admin/supplier update is saved after this timestamp.
const CATALOG_PRICE_EPOCH = Date.parse("2026-11-24T20:00:00.000Z");

/**
 * Returns all products with admin overrides applied (active toggles, custom prices, variant prices).
 * Also respects global hideAllPrices setting (sets priceFrom to 0 and variant prices to 0).
 */
export function getAllProductsWithOverrides(ignoreGlobalHidePrices = false): Product[] {
  const overrides = loadOverrides();
  const settings = getSiteSettings();
  const shouldHidePrices = !ignoreGlobalHidePrices && settings.hideAllPrices;

  return initialProducts.map((p) => {
    const override = overrides[p.id];
    const overrideTs = override?.supplierUpdatedAt ? Date.parse(override.supplierUpdatedAt) : 0;
    const useOverridePrices = Boolean(override && Number.isFinite(overrideTs) && overrideTs >= CATALOG_PRICE_EPOCH);

    let active = override?.active !== undefined ? override.active : p.active;
    let featured = override?.featured !== undefined ? override.featured : p.featured;
    let priceFrom = useOverridePrices && override?.priceFrom !== undefined ? override.priceFrom : p.priceFrom;
    let variants = useOverridePrices
      ? mergeBaseVariantsWithOverride(p.variants, override?.variants)
      : p.variants;

    const supplierUpdatedAt = override?.supplierUpdatedAt;
    if (shouldHidePrices) {
      priceFrom = 0;
      const maskedVariants = variants?.map((v) => ({
        ...v,
        price: 0,
      }));
      return {
        ...p,
        active,
        featured,
        priceFrom: 0,
        variants: maskedVariants,
      };
    }

    return {
      ...p,
      supplierUpdatedAt,
      active,
      featured,
      priceFrom,
      variants,
    };
  });
}

/**
 * Update single product price and variants
 */
export function updateProductPrices(
  productId: string,
  priceFrom: number,
  variants?: ProductVariant[]
): Product | null {
  const overrides = loadOverrides();
  overrides[productId] = {
    ...overrides[productId],
    priceFrom,
    ...(variants ? { variants } : {}),
    supplierUpdatedAt: new Date().toISOString(),
  };
  saveOverrides(overrides);

  const updated = getAllProductsWithOverrides(true).find((p) => p.id === productId);
  return updated || null;
}

/**
 * Toggle single product active status
 */
export function setProductActive(productId: string, active: boolean): Product | null {
  const overrides = loadOverrides();
  overrides[productId] = {
    ...overrides[productId],
    active,
  };
  saveOverrides(overrides);

  const updated = getAllProductsWithOverrides(true).find((p) => p.id === productId);
  return updated || null;
}

/**
 * Toggle all products or all products in a given category
 */
export function toggleProductsBatch(options: {
  active: boolean;
  category?: string; // "iphone" | "mac" | "ipad" | "watch" | "airpods" | "accessories" | "all"
  condition?: "new" | "used" | "all";
}): number {
  const overrides = loadOverrides();
  let affectedCount = 0;

  initialProducts.forEach((p) => {
    // Filter by condition (default: "new")
    if (options.condition && options.condition !== "all") {
      if (p.condition !== options.condition) return;
    }

    // Filter by category
    if (options.category && options.category !== "all") {
      const targetCat = options.category.toLowerCase();
      const normCat = targetCat === "acessorios" ? "accessories" : targetCat;
      if (p.category.toLowerCase() !== normCat) return;
    }

    overrides[p.id] = {
      ...overrides[p.id],
      active: options.active,
    };
    affectedCount++;
  });

  saveOverrides(overrides);
  return affectedCount;
}

/**
 * Get current overrides map
 */
export function getProductOverrides(): ProductOverrides {
  return loadOverrides();
}
