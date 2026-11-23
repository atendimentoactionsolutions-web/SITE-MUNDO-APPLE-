"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/types/product";
import { storeConfig } from "@/data/storeConfig";
import { TalesProductCard } from "./TalesProductCard";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import "./tales-catalog.css";

interface TalesProductCatalogProps {
  products: Product[];
}

const CATEGORIES = [
  { id: "todos", label: "Todos os novos" },
  { id: "iphone", label: "iPhones novos" },
  { id: "mac", label: "MacBooks e Macs" },
  { id: "ipad", label: "iPad" },
  { id: "watch", label: "Apple Watch" },
  { id: "airpods", label: "AirPods" },
  { id: "accessories", label: "Acessórios" },
];

export const TalesProductCatalog: React.FC<TalesProductCatalogProps> = ({ products }) => {
  const showPrices = Boolean(storeConfig.showPrices);
  const [category, setCategory] = useState<string>("todos");
  const [query, setQuery] = useState<string>("");
  const [order, setOrder] = useState<string>("destaques");
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [capacity, setCapacity] = useState<string>("todas");

  // Filter ONLY new products (Seminovos 100% removed)
  const scopedProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.condition !== "new") return false;

      if (category !== "todos") {
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
      .filter((p) => p.condition === "new" && (category === "todos" || p.category.toLowerCase() === category.toLowerCase()))
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
          <span className="result-count">
            {sortedProducts.length} {sortedProducts.length === 1 ? "produto" : "produtos"}
          </span>
        </div>

        <div className="catalog-toolbar">
          <div className="catalog-tabs" aria-label="Categorias">
            {CATEGORIES.map((tab) => {
              const active = category === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={active ? "active" : ""}
                  aria-pressed={active}
                  onClick={() => {
                    setCategory(tab.id);
                    setCapacity("todas");
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
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

        {filtersOpen && (
          <div className="filter-panel">
            <label>
              {category === "watch" ? "Tamanho da caixa" : "Capacidade"}
              <select
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
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
              />
            </label>

            <button type="button" className="text-button" onClick={clear}>
              Limpar filtros
            </button>
          </div>
        )}

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
              Limpar filtros e ver todos
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
