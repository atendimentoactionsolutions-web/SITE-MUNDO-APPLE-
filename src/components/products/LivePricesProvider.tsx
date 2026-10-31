"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/types/product";

const LivePricesContext = createContext<Product[] | null>(null);
export function LivePricesProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  useEffect(() => {
    let active = true;
    let busy = false;
    const refresh = async () => {
      if (busy) return;
      busy = true;
      try {
        const response = await fetch("/api/products/live", { cache: "no-store", signal: AbortSignal.timeout(10000) });
        const data = await response.json();
        if (active && response.ok && data.success && Array.isArray(data.products) && data.products.length > 0) setProducts(data.products);
      } catch { console.warn("Mantendo os ultimos precos conhecidos."); }
      finally { busy = false; }
    };
    refresh();
    const timer = setInterval(refresh, 600000);
    window.addEventListener("focus", refresh);
    return () => { active = false; clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, []);
  return <LivePricesContext.Provider value={products}>{children}</LivePricesContext.Provider>;
}
export function useLiveProduct(product: Product): Product {
  return useContext(LivePricesContext)?.find(p => p.id === product.id) || product;
}
export function useLiveCatalog(fallback: Product[]): Product[] {
  return useContext(LivePricesContext) || fallback;
}
export function useLivePrice(id: string, fallback: number): number {
  return useContext(LivePricesContext)?.find(p => p.id === id)?.priceFrom ?? fallback;
}
