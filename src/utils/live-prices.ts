import type { Product } from "@/types/product";
export const MAX_PRICE_AGE_MS = 120_000;
export function freshProduct(product: Product, now = Date.now()): Product {
  if (product.condition !== "new") return product;
  const fresh = (timestamp?: string) => {
    const age = now - Date.parse(timestamp || "");
    return Number.isFinite(age) && age >= 0 && age <= MAX_PRICE_AGE_MS;
  };
  const variants = product.variants?.map(v => fresh(v.supplierUpdatedAt) ? v : { ...v, price: 0, available: false });
  const prices = variants?.map(v => v.price).filter(price => price > 0) || [];
  const priceFrom = variants?.length ? (prices.length ? Math.min(...prices) : 0) : (fresh(product.supplierUpdatedAt) ? product.priceFrom : 0);
  return { ...product, variants, priceFrom };
}
