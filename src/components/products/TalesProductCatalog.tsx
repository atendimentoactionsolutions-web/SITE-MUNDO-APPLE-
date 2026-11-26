"use client";

import React, { useState, useMemo, useRef, useLayoutEffect, useEffect } from "react";
import { Product } from "@/types/product";
import { storeConfig } from "@/data/storeConfig";
import { TalesProductCard } from "./TalesProductCard";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import "./tales-catalog.css";

interface TalesProductCatalogProps {
  products: Product[];
}

const CATEGORIES = [
  { id: "iphone", label: "iPhones novos" },
  { id: "mac", label: "MacBooks e Macs" },
  { id: "ipad", label: "iPad" },
  { id: "watch", label: "Apple Watch" },
  { id: "airpods", label: "AirPods" },
  { id: "accessories", label: "Acessórios" },
];

export const TalesProductCatalog: React.FC<TalesProductCatalogProps> = ({ products }) => {
  const showPrices = Boolean(storeConfig.showPrices);
  const [category, setCategory] = useState<string>("iphone");
  const [query, setQuery] = useState<string>("");
  const [order, setOrder] = useState<string>("destaques");
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [capacity, setCapacity] = useState<string>("todas");
  const [hasSwitchedCategory, setHasSwitchedCategory] = useState<boolean>(false);

  // Emil Kowalski sliding pill indicator state for category tabs
  const tabsTrackRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; ready: boolean; animate: boolean }>({
    left: 0,
    width: 0,
    ready: false,
    animate: false,
  });

  useLayoutEffect(() => {
    const updatePill = (animate: boolean) => {
      const btn = tabButtonRefs.current[category];
      if (!btn) return;
      setPillStyle({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
        ready: true,
        animate,
      });
    };

    updatePill(hasSwitchedCategory);

    const handleResize = () => updatePill(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [category, hasSwitchedCategory]);

  useEffect(() => {
    const track = tabsTrackRef.current;
    if (!track || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const btn = tabButtonRefs.current[category];
      if (!btn) return;
      setPillStyle((prev) => ({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
        ready: true,
        animate: prev.ready ? prev.animate : false,
      }));
    });
    ro.observe(track);
    return () => ro.disconnect();
  }, [category]);

  // Filter ONLY new products (Seminovos 100% removed)
  const scopedProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.condition !== "new") return false;

      if (category) {
        const cat = p.category.toLowerCase();
        const target = category.toLowerCase();
        if (target === "accessories") {
          if (cat !== "accessories" && cat !== "acessorios") return false;
        } else if (cat !== target) {
          return false;
        }
      }

      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesDesc = (p.description || "").toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesDesc) return false;
      }

      if (capacity !== "todas") {
        const hasStorage = p.storage?.includes(capacity);
        const hasVariantStorage = p.variants?.some((v) => v.storage === capacity);
        const hasSize = p.sizes?.includes(capacity) || p.screenSizes?.includes(capacity);
        const hasVariantSize = p.variants?.some(
          (v) => (v.size || v.screenSize) === capacity
        );
        if (!hasStorage && !hasVariantStorage && !hasSize && !hasVariantSize) {
          return false;
        }
      }

      return true;
    });
  }, [products, category, query, capacity]);

  // Sorting
  const sortedProducts = useMemo(() => {
    return [...scopedProducts].sort((a, b) => {
      if (showPrices && order === "menor-preco") {
        return (a.priceFrom || 0) - (b.priceFrom || 0);
      }
      if (showPrices && order === "maior-preco") {
        return (b.priceFrom || 0) - (a.priceFrom || 0);
      }
      if (order === "recentes") {
        return (b.id || "").localeCompare(a.id || "");
      }
      return Number(b.featured || false) - Number(a.featured || false);
    });
  }, [scopedProducts, order, showPrices]);

  const availableCapacities = useMemo(() => {
    const set = new Set<string>();
    products
      .filter((p) => {
        if (p.condition !== "new") return false;
        const cat = p.category.toLowerCase();
        const target = category.toLowerCase();
        return target === "accessories" ? (cat === "accessories" || cat === "acessorios") : cat === target;
      })
      .forEach((p) => {
        p.storage?.forEach((s) => set.add(s));
        p.variants?.forEach((v) => {
          if (v.storage) set.add(v.storage);
          if (v.size) set.add(v.size);
          if (v.screenSize) set.add(v.screenSize);
        });
        p.sizes?.forEach((s) => set.add(s));
        p.screenSizes?.forEach((s) => set.add(s));
      });
    return Array.from(set);
  }, [products, category]);

  const clear = () => {
    setCapacity("todas");
    setQuery("");
  };

  return (
    <section className="catalog-section" id="catalogo">
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="section-heading">
          <h2>Novos lacrados.</h2>
          <span
            key={hasSwitchedCategory ? `${category}-${sortedProducts.length}` : "initial"}
            className={`result-count ${hasSwitchedCategory ? "animate-price-pop" : ""}`}
          >
            {sortedProducts.length} {sortedProducts.length === 1 ? "produto" : "produtos"}
          </span>
        </div>

        <div className="catalog-toolbar">
          <div className="catalog-tabs" aria-label="Categorias">
            <div className="catalog-tabs-track" ref={tabsTrackRef}>
              <span
                aria-hidden="true"
                className="catalog-tab-indicator"
                data-animated={pillStyle.animate ? "true" : "false"}
                style={{
                  transform: `translate3d(${pillStyle.left}px, 0, 0)`,
                  width: `${pillStyle.width}px`,
                  opacity: pillStyle.ready ? 1 : 0,
                }}
              />
              {CATEGORIES.map((tab) => {
                const active = category === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabButtonRefs.current[tab.id] = el;
                    }}
                    type="button"
                    className={active ? "active" : ""}
                    aria-pressed={active}
                    onClick={(e) => {
                      setHasSwitchedCategory(true);
                      setCategory(tab.id);
                      setCapacity("todas");
                      e.currentTarget.scrollIntoView({
                        behavior: "smooth",
                        inline: "center",
                        block: "nearest",
                      });
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="catalog-tools">
            <button
              type="button"
              className={`filter-button ${filtersOpen || capacity !== "todas" ? "selected" : ""}`}
              onClick={() => setFiltersOpen(!filtersOpen)}
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal size={15} />
              Filtros
            </button>

            <label className="sort-select">
              <span className="sr-only">Ordenar produtos</span>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              >
                <option value="destaques">Destaques</option>
                {showPrices && <option value="menor-preco">Menor preço</option>}
                {showPrices && <option value="maior-preco">Maior preço</option>}
                <option value="recentes">Mais recentes</option>
              </select>
              <ChevronDown size={14} />
            </label>
          </div>
        </div>

        <div
          className={`filter-panel-wrap ${filtersOpen ? "is-open" : ""}`}
          aria-hidden={!filtersOpen}
        >
          <div className="filter-panel-inner">
            <div className="filter-panel">
              <label>
                {category === "watch" ? "Tamanho da caixa" : "Capacidade"}
                <select
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  tabIndex={filtersOpen ? 0 : -1}
                >
                  <option value="todas">Todas as opções</option>
                  {availableCapacities.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Buscar por modelo
                <input
                  type="text"
                  placeholder="Ex: Pro Max, Air, Ultra..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  tabIndex={filtersOpen ? 0 : -1}
                />
              </label>

              <button
                type="button"
                className="text-button"
                onClick={clear}
                tabIndex={filtersOpen ? 0 : -1}
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>

        {query.trim() && (
          <div className="search-result">
            <span>Resultados para “{query}”</span>
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpar busca"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {sortedProducts.length > 0 ? (
          <div className="product-grid" id="catalogo-produtos">
            {sortedProducts.map((p, idx) => (
              <TalesProductCard key={`${category}-${p.id}`} product={p} priority={idx < 4} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-[#d8d8de]">
            <p className="text-sm font-medium text-[#1d1d1f]">
              Nenhum produto novo encontrado com esses filtros.
            </p>
            <button
              type="button"
              onClick={clear}
              className="mt-3 text-xs font-semibold text-[#0071e3] hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
