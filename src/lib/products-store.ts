import fs from "fs";
import path from "path";
import { products as initialProducts } from "@/data/products";
import { Product } from "@/types/product";
import { getSiteSettings } from "./site-settings";

// File where overrides are stored
const OVERRIDE_FILE = path.join(process.cwd(), "products_override.json");

// Structure: { [productId: string]: { active?: boolean, priceFrom?: number, featured?: boolean } }
type ProductOverrides = Record<string, { active?: boolean; priceFrom?: number; featured?: boolean }>;

// In-memory cache
declare global {
  var __productOverrides: ProductOverrides | undefined;
}

function loadOverrides(): ProductOverrides {
  if (global.__productOverrides) {
    return global.__productOverrides;
  }
  try {
    if (fs.existsSync(OVERRIDE_FILE)) {
      const data = fs.readFileSync(OVERRIDE_FILE, "utf-8");
      global.__productOverrides = JSON.parse(data);
      return global.__productOverrides || {};
    }
  } catch (err) {
    console.error("Error reading products_override.json:", err);
  }
  global.__productOverrides = {};
  return global.__productOverrides;
}

export function saveOverrides(overrides: ProductOverrides): void {
  try {
    global.__productOverrides = overrides;
    fs.writeFileSync(OVERRIDE_FILE, JSON.stringify(overrides, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving products_override.json:", err);
  }
}

/**
 * Returns all products with admin overrides applied (e.g. active toggles).
 * Also respects global hideAllPrices setting (sets priceFrom to 0 and variant prices to 0).
 */
export function getAllProductsWithOverrides(ignoreGlobalHidePrices = false): Product[] {
  const overrides = loadOverrides();
  const settings = getSiteSettings();
  const shouldHidePrices = !ignoreGlobalHidePrices && settings.hideAllPrices;

  return initialProducts.map((p) => {
    const override = overrides[p.id];
    let active = override?.active !== undefined ? override.active : p.active;
    let featured = override?.featured !== undefined ? override.featured : p.featured;
    let priceFrom = override?.priceFrom !== undefined ? override.priceFrom : p.priceFrom;

    if (shouldHidePrices) {
      priceFrom = 0;
      const maskedVariants = p.variants?.map((v) => ({
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
      active,
      featured,
      priceFrom,
    };
  });
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
