"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { Product } from "@/types/product";
import { products } from "@/data/products";
import { formatCurrency } from "@/utils/formatters";
import { createWhatsAppLink } from "@/utils/whatsapp";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState<Product[]>(products);

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    fetch("/api/products/live", { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Cat?logo indispon?vel");
        return response.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.products)) setCatalog(data.products);
      })
      .catch(() => { /* Retain the last available catalog while offline. */ });
    return () => controller.abort();
  }, [isOpen]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen]);

  // Keyboard shortcut listener (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const storefrontProducts = catalog.filter((p) => p.active && p.condition === "new");
  const filteredProducts = normalizedQuery
    ? storefrontProducts.filter((p) =>
        [p.name, p.category, p.subcategory, p.description].some((value) =>
          value?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(normalizedQuery)
        )
      )
    : storefrontProducts.filter((p) => p.featured).slice(0, 6);

  const handleWhatsAppProduct = (productName: string, price: number) => {
    const text = `Olá! Vi o *${productName}* no site (${price > 0 ? formatCurrency(price) : "Preço sob consulta"}) e gostaria de saber mais informações e disponibilidade!`;
    window.open(createWhatsAppLink(text), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div role="dialog" aria-modal="true" aria-label="Busca de produtos" className="relative z-10 w-full min-w-0 max-w-2xl bg-white rounded-3xl shadow-2xl border border-apple-border overflow-hidden flex flex-col max-h-[calc(100dvh-5rem)] sm:max-h-[80dvh] animate-in zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-4 border-b border-apple-border/70 bg-apple-gray/30">
          <Search className="w-5 h-5 text-apple-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar iPhone, MacBook, iPad, AirPods, Watch..."
            aria-label="Buscar produtos"
            className="min-w-0 flex-1 bg-transparent text-base font-medium text-apple-dark focus:outline-none placeholder:text-apple-muted"
          />
          {query ? (
            <button
              type="button"
              aria-label="Limpar busca"
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-apple-muted hover:bg-apple-gray"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-[10px] font-semibold text-apple-muted bg-white px-2 py-0.5 rounded-md border border-apple-border">
              ESC
            </kbd>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar busca"
            className="shrink-0 p-1.5 text-apple-dark hover:bg-apple-gray rounded-full transition-colors ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-2">
          <div className="px-2 py-1 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-apple-muted">
            <span>{query.trim() ? "Resultados da busca" : "Modelos em destaque"}</span>
            <span className="text-[11px] font-normal lowercase">
              {filteredProducts.length} {filteredProducts.length === 1 ? "produto" : "produtos"}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center space-y-3 break-words">
              <p className="text-sm font-semibold text-apple-dark">
                Nenhum produto encontrado para &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-apple-muted max-w-xs mx-auto">
                Tente buscar por termos como iPhone 16, MacBook, AirPods, iPad Pro ou consulte nossa equipe no WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => handleWhatsAppProduct(query, 0)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-whatsapp-green text-white text-xs font-semibold rounded-full hover:bg-emerald-600 transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Consultar &ldquo;{query}&rdquo; no WhatsApp</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-apple-border/40">
              {filteredProducts.map((product) => {
                const price = product.priceFrom ?? product.variants?.[0]?.price ?? 0;
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-apple-gray/60 transition-colors group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl bg-white border border-apple-border/60 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider block">
                          {product.subcategory || product.category}
                        </span>
                        <Link href={`/produtos/${product.slug}`} onClick={onClose} className="block text-sm font-semibold text-apple-dark truncate group-hover:text-apple-blue transition-colors">
                          {product.name}
                        </Link>
                        <div className="flex flex-wrap items-center gap-x-2 text-xs">
                          {price > 0 ? (
                            <span className="font-extrabold text-apple-dark">
                              {formatCurrency(price)}
                            </span>
                          ) : (
                            <span className="text-apple-muted font-medium">Consulte condições</span>
                          )}
                          <span className="text-apple-muted text-[11px]">
                            • {product.condition === "used" ? "Seminovo" : "Novo Lacrado"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleWhatsAppProduct(product.name, price)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-whatsapp-green text-white text-xs font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Comprar</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 px-5 py-3 bg-apple-gray/40 border-t border-apple-border/60 flex flex-wrap gap-3 items-center justify-between text-xs text-apple-muted">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
            <span>Mundo Apple Delivery • Pronta Entrega</span>
          </div>
          <Link
            href="/produtos"
            onClick={onClose}
            className="font-semibold text-apple-dark hover:text-apple-blue flex items-center gap-1 transition-colors"
          >
            <span>Ver todo o catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
