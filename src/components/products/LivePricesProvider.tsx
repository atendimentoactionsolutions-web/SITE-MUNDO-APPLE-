"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { freshProduct, MAX_PRICE_AGE_MS } from "@/utils/live-prices";
import type { Product } from "@/types/product";

const LivePricesContext = createContext<{ products: Product[] | null; now: number; startedAt: number } | null>(null);
export function LivePricesProvider({ children }: { children: React.ReactNode }) {
  const [startedAt] = useState(Date.now);
  const [now, setNow] = useState(Date.now);
  const [products, setProducts] = useState<Product[] | null>(null);
  useEffect(() => {
    let active = true;
    let busy = false;
    const refresh = async () => {
      setNow(Date.now());
      if (busy) return;
      busy = true;
      try {
        const response = await fetch("/api/products/live", { cache: "no-store", signal: AbortSignal.timeout(10000) });
        const data = await response.json();
        if (active && response.ok && data.success && Array.isArray(data.products)) setProducts(data.products);
      } catch (error) { console.warn("Nao foi possivel atualizar os precos da pagina."); }
      finally { busy = false; }
    };
    refresh();
    const timer = setInterval(refresh, 15000);
    window.addEventListener("focus", refresh);
    return () => { active = false; clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, []);
  return <LivePricesContext.Provider value={{ products, now, startedAt }}>{children}</LivePricesContext.Provider>;
}
export function useLiveProduct(product: Product): Product {
  const live = useContext(LivePricesContext);
  return React.useMemo(() => live ? freshProduct(live.products?.find(p => p.id === product.id) || product, live.now) : product, [live?.products, live?.now, product]);
}
export function useLiveCatalog(fallback: Product[]): Product[] {
  const live = useContext(LivePricesContext);
  return React.useMemo(() => live ? (live.products || fallback).map(p => freshProduct(p, live.now)) : fallback, [live?.products, live?.now, fallback]);
}
export function useLivePrice(id: string, fallback: number): number {
  const live = useContext(LivePricesContext);
  const product = live?.products?.find(p => p.id === id);
  return product ? freshProduct(product, live!.now).priceFrom : (live && live.now - live.startedAt > MAX_PRICE_AGE_MS ? 0 : fallback);
}
