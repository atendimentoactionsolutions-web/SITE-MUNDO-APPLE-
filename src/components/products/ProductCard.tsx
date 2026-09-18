"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ShieldCheck, Sparkles, CreditCard, RefreshCw } from "lucide-react";
import { Product, ProductVariant } from "@/types/product";
import { formatCurrency } from "@/utils/formatters";
import { createWhatsAppLink } from "@/utils/whatsapp";
import { getMaxInstallment } from "@/utils/installments";
import { InstallmentsModal } from "./InstallmentsModal";

const colorMap: Record<string, string> = {
  "Black": "#1D1D1F",
  "Space Black": "#18181A",
  "Midnight": "#1B212C",
  "White": "#F5F5F7",
  "Cloud White": "#FAFAFC",
  "Starlight": "#F0EBE3",
  "Silver": "#E3E4E6",
  "Space Gray": "#535150",
  "Natural": "#8E8B82",
  "Natural Titanium": "#8E8B82",
  "Black Titanium": "#1E1E20",
  "Desert Titanium": "#C5B49E",
  "Deep Blue": "#223854",
  "Dark Blue": "#223854",
  "Blue": "#3B6B96",
  "Mist Blue": "#6E93B2",
  "Sky Blue": "#7EA2C6",
  "Teal": "#43828A",
  "Ultramarine": "#38529A",
  "Pink": "#E8B2C0",
  "Soft Pink": "#EAC2CE",
  "Sage": "#829383",
  "Lavender": "#B1A1C6",
  "Light Gold": "#E5D4B3",
  "Gold": "#E5D4B3",
  "Cosmic Orange": "#D85E30",
  "Citrus": "#D9E24C",
  "Indigo": "#3B485A",
  "Blush": "#E8CBCB",
  "Green": "#4C8A68",
  "Yellow": "#F2D358",
  "Jet Black": "#121214",
  "Rose Gold": "#E5B09E",
  "Orange": "#D85E30",
  "Purple": "#A594B8",
  "Preto": "#1D1D1F",
  "Titânio Preto": "#1E1E20",
  "Prateado": "#E3E4E6",
  "Titânio Natural": "#8E8B82",
  "Bordô": "#5A1827",
  "Burgundy": "#5A1827",
  "Glacier": "#B5C8D5",
  "Céu Noturno": "#1C1F26",
  "Branco-Estrela": "#F0EBE3",
  "Branco": "#F5F5F7",
  "Bronze-escura": "#4A3B32",
  "Dourada-clara": "#E5D4B3",
  "Cinza-espacial": "#535150",
  "Preta": "#1D1D1F",
};

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  priority = false,
}) => {
  const [isInstallmentsModalOpen, setIsInstallmentsModalOpen] = useState(false);

  const hasVariants = Boolean(product.variants && product.variants.length > 0);

  // 1. Available Dimensions derived safely
  const sizeList = useMemo(() => {
    if (product.sizes && product.sizes.length > 0) return product.sizes;
    if (product.screenSizes && product.screenSizes.length > 0) return product.screenSizes;
    if (!hasVariants) return [];
    const set = new Set(
      product.variants!.map((v) => v.size || v.screenSize).filter(Boolean) as string[]
    );
    return Array.from(set);
  }, [product.sizes, product.screenSizes, product.variants, hasVariants]);

  const isWatchOrMm = useMemo(() => {
    return (
      sizeList.some((s) => s.toLowerCase().includes("mm")) ||
      product.category === "watch"
    );
  }, [sizeList, product.category]);

  const chipList = useMemo(() => {
    if (product.chips && product.chips.length > 0) return product.chips;
    if (!hasVariants) return [];
    const set = new Set(
      product.variants!.map((v) => v.chip).filter(Boolean) as string[]
    );
    return Array.from(set);
  }, [product.chips, product.variants, hasVariants]);

  const ramList = useMemo(() => {
    if (product.ramOptions && product.ramOptions.length > 0) return product.ramOptions;
    if (!hasVariants) return [];
    const set = new Set(
      product.variants!.map((v) => v.ram).filter(Boolean) as string[]
    );
    return Array.from(set);
  }, [product.ramOptions, product.variants, hasVariants]);

  const storageList = useMemo(() => {
    if (product.storage && product.storage.length > 0) return product.storage;
    if (!hasVariants) return [];
    const set = new Set(
      product.variants!.map((v) => v.storage).filter(Boolean) as string[]
    );
    return Array.from(set);
  }, [product.storage, product.variants, hasVariants]);

  const colorList = useMemo(() => {
    if (product.colors && product.colors.length > 0) return product.colors;
    if (!hasVariants) return [];
    const set = new Set(
      product.variants!.map((v) => v.color).filter(Boolean) as string[]
    );
    return Array.from(set);
  }, [product.colors, product.variants, hasVariants]);

  // 2. Active Variant & Fallback Custom Storage Selection (for products with or without variants)
  const [activeVariant, setActiveVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );

  const [customStorage, setCustomStorage] = useState<string>(
    product.variants?.[0]?.storage || product.storage?.[0] || ""
  );

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setActiveVariant((prev) => {
        if (prev && product.variants!.some((v) => v === prev)) return prev;
        return product.variants![0];
      });
      setCustomStorage(product.variants[0].storage || "");
    } else {
      setActiveVariant(undefined);
      setCustomStorage(product.storage?.[0] || "");
    }
  }, [product]);

  // Derived active properties
  const currentSize = activeVariant?.size || activeVariant?.screenSize || sizeList[0] || "";
  const currentChip = activeVariant?.chip || chipList[0] || "";
  const currentRam = activeVariant?.ram || ramList[0] || "";
  const currentStorage = hasVariants
    ? (activeVariant?.storage || customStorage || storageList[0] || "")
    : (customStorage || storageList[0] || "");
  const currentColor = activeVariant?.color || colorList[0] || product.colors?.[0] || "";
  const currentPrice = activeVariant?.price || product.priceFrom || 0;

  // 3. Dynamic options filtering — eliminates non-existent options so customers never get confused
  const availableChipList = useMemo(() => {
    if (!hasVariants || !product.variants) return chipList;
    const matching = product.variants.filter((v) => {
      const vSize = v.size || v.screenSize || "";
      if (currentSize && vSize && vSize !== currentSize) return false;
      return true;
    });
    const validChips = new Set(matching.map((v) => v.chip).filter(Boolean) as string[]);
    if (validChips.size === 0) return chipList;
    return chipList.filter((chip) => validChips.has(chip));
  }, [hasVariants, product.variants, currentSize, chipList]);

  const availableRamList = useMemo(() => {
    if (!hasVariants || !product.variants) return ramList;
    const matching = product.variants.filter((v) => {
      const vSize = v.size || v.screenSize || "";
      if (currentSize && vSize && vSize !== currentSize) return false;
      if (currentChip && v.chip && v.chip !== currentChip) return false;
      return true;
    });
    const validRams = new Set(matching.map((v) => v.ram).filter(Boolean) as string[]);
    if (validRams.size === 0) return ramList;
    return ramList.filter((ram) => validRams.has(ram));
  }, [hasVariants, product.variants, currentSize, currentChip, ramList]);

  const availableStorageList = useMemo(() => {
    if (!hasVariants || !product.variants) return storageList;
    const matching = product.variants.filter((v) => {
      const vSize = v.size || v.screenSize || "";
      if (currentSize && vSize && vSize !== currentSize) return false;
      if (currentChip && v.chip && v.chip !== currentChip) return false;
      if (currentRam && v.ram && v.ram !== currentRam) return false;
      return true;
    });
    const validStorages = new Set(matching.map((v) => v.storage).filter(Boolean) as string[]);
    if (validStorages.size === 0) return storageList;
    return storageList.filter((stg) => validStorages.has(stg));
  }, [hasVariants, product.variants, currentSize, currentChip, currentRam, storageList]);

  // 4. Bulletproof Best-Match Variant Selector
  const handleSelectOption = (
    attribute: "size" | "chip" | "ram" | "storage" | "color",
    value: string
  ) => {
    if (attribute === "storage") {
      setCustomStorage(value);
    }

    if (!hasVariants || !product.variants) return;

    // Filter variants that match the clicked attribute
    const candidates = product.variants.filter((v) => {
      if (attribute === "size") return (v.size || v.screenSize) === value;
      if (attribute === "chip") return v.chip === value;
      if (attribute === "ram") return v.ram === value;
      if (attribute === "storage") return v.storage === value;
      if (attribute === "color") return v.color === value;
      return true;
    });

    if (candidates.length === 0) return;

    // Score candidates based on preserving other current active attributes
    let best = candidates[0];
    let maxScore = -1;

    for (const c of candidates) {
      let score = 0;
      const cSize = c.size || c.screenSize || "";

      // Preservation weights
      if (attribute !== "size" && cSize && cSize === currentSize) score += 32;
      if (attribute !== "chip" && c.chip && c.chip === currentChip) score += 16;
      if (attribute !== "ram" && c.ram && c.ram === currentRam) score += 8;
      if (attribute !== "storage" && c.storage && c.storage === currentStorage) score += 4;
      if (attribute !== "color" && c.color && c.color === currentColor) score += 2;

      if (score > maxScore) {
        maxScore = score;
        best = c;
      }
    }

    setActiveVariant(best);
    if (best.storage) {
      setCustomStorage(best.storage);
    }
  };

  // 4. Color Swatches data with live prices
  const displayColors = useMemo(() => {
    if (colorList.length === 0) return [];
    return colorList.map((colorName) => {
      // Find variant matching current configuration
      const directMatch = product.variants?.find((v) => {
        const vSize = v.size || v.screenSize || "";
        if (currentSize && vSize && vSize !== currentSize) return false;
        if (currentChip && v.chip && v.chip !== currentChip) return false;
        if (currentRam && v.ram && v.ram !== currentRam) return false;
        if (currentStorage && v.storage && v.storage !== currentStorage) return false;
        return v.color === colorName;
      });

      const fallbackMatch = product.variants?.find((v) => v.color === colorName);
      return {
        color: colorName,
        price: directMatch?.price || fallbackMatch?.price,
      };
    });
  }, [colorList, product.variants, currentSize, currentChip, currentRam, currentStorage]);

  // 5. Dynamic image switching
  const displayedImage = useMemo(() => {
    if (activeVariant?.image) return activeVariant.image;
    if (currentColor && product.colorImages?.[currentColor]) return product.colorImages[currentColor];
    return product.image;
  }, [activeVariant, currentColor, product.colorImages, product.image]);

  const isUsed = product.condition === "used";

  // Check if product is on pre-order or announcement
  const isPreOrder = product.availability === "pre_order" || product.priceFrom === 0;

  // Calculate 18x installment preview
  const maxInstallment = currentPrice > 0 ? getMaxInstallment(currentPrice) : null;

  // Check if eligible for Trade-In (iPhone, Mac & iPad)
  const isTradeInEligible = product.category === "iphone" || product.category === "mac" || product.category === "ipad";

  // WhatsApp formatted lead
  const handleWhatsAppRedirect = () => {
    let details: string[] = [];
    if (currentSize) details.push(isWatchOrMm ? `Caixa: ${currentSize}` : `Tela: ${currentSize}`);
    if (currentChip) details.push(product.category === "ipad" ? `Conexão: ${currentChip}` : `Chip: ${currentChip}`);
    if (currentRam) details.push(`RAM: ${currentRam}`);
    if (currentStorage) details.push(`Armazenamento: ${currentStorage}`);
    if (currentColor) details.push(`Cor: ${currentColor}`);

    let messageText = `Olá! Tenho interesse no *${product.name}*`;

    if (details.length > 0) {
      messageText += ` (${details.join(", ")})`;
    }
    if (currentPrice > 0) {
      messageText += ` no valor de ${formatCurrency(currentPrice)} no PIX`;
    } else {
      messageText += `.\nCondição: ${isUsed ? "Seminovo certificado (100% original)" : "Novo e lacrado com 1 ano de garantia Apple"}\nGostaria de consultar os valores atualizados, disponibilidade e prazo de entrega.`;
    }
    if (currentPrice > 0) {
      messageText += `.\nCondição: ${isUsed ? "Seminovo certificado (100% original)" : "Novo e lacrado de fábrica"}\nGostaria de consultar disponibilidade e condições de pagamento.`;
    }

    const link = createWhatsAppLink(messageText);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div className="group relative bg-white rounded-[24px] p-5 sm:p-6 flex flex-col justify-between border border-[#E5E5E7] hover:border-[#D2D2D7] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
        {/* Top Section */}
        <div>
          {/* Top Badges */}
          <div className="flex items-center justify-between gap-2 mb-3 z-10">
            <div className="flex items-center gap-1.5 flex-wrap">
              {isPreOrder ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  Pré-Venda
                </span>
              ) : (
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isUsed
                      ? "bg-amber-50 text-amber-800 border border-amber-200/60"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                  }`}
                >
                  {isUsed ? "Seminovo" : "Lacrado"}
                </span>
              )}

              {product.featured && !isPreOrder && (
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0071E3] border border-blue-200/60 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#0071E3]" />
                  Destaque
                </span>
              )}
            </div>

            <span className="text-[11px] text-[#0071E3] font-semibold flex items-center gap-1 bg-blue-50/70 px-2 py-0.5 rounded-full border border-blue-100/80">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0071E3]" />
              {isUsed ? "90d Garantia" : "1 Ano Garantia Apple"}
            </span>
          </div>

          {/* Product Image Area with #F5F5F7 background */}
          <div className="relative w-full aspect-[4/3] my-2 flex items-center justify-center overflow-hidden rounded-2xl bg-[#F5F5F7] group-hover:bg-[#EFEFF2] transition-colors">
            <Image
              src={displayedImage}
              alt={`${product.name} ${currentColor || ""}`}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-4 group-hover:scale-106 transition-transform duration-500 ease-out"
            />
          </div>

          {/* Product Info & Specs */}
          <div className="space-y-3 mt-3">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[#1D1D1F] font-display tracking-[-0.022em] line-clamp-1 group-hover:text-[#0071E3] transition-colors">
                {product.name} {currentSize ? `(${currentSize})` : ""}
              </h3>
            </div>

            {/* Selector 1: Tamanho da Tela / Milimetragem */}
            {sizeList.length > 1 && (
              <div className="space-y-1.5">
                <span className="block text-[10px] font-semibold text-[#6E6E73] uppercase tracking-wider">
                  {isWatchOrMm ? "Milimetragem:" : "Tamanho da Tela:"}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {sizeList.map((size) => {
                    const isSelected = currentSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSelectOption("size", size)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#0071E3] text-white border-[#0071E3] shadow-sm"
                            : "bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border-[#D2D2D7]/60"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selector 2: Chip / Processador / Conectividade */}
            {availableChipList.length > 1 && (
              <div className="space-y-1.5">
                <span className="block text-[10px] font-semibold text-[#6E6E73] uppercase tracking-wider">
                  {product.category === "ipad" ? "Conectividade:" : "Chip / Processador:"}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {availableChipList.map((chip) => {
                    const isSelected = currentChip === chip;
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleSelectOption("chip", chip)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#0071E3] text-white border-[#0071E3] shadow-sm"
                            : "bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border-[#D2D2D7]/60"
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selector 3: Memória RAM */}
            {availableRamList.length > 0 && (
              <div className="space-y-1.5">
                <span className="block text-[10px] font-semibold text-[#6E6E73] uppercase tracking-wider">
                  Memória RAM:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {availableRamList.map((ram) => {
                    const isSelected = currentRam === ram;
                    return (
                      <button
                        key={ram}
                        type="button"
                        onClick={() => handleSelectOption("ram", ram)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#0071E3] text-white border-[#0071E3] shadow-sm"
                            : "bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border-[#D2D2D7]/60"
                        }`}
                      >
                        {ram}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selector 4: Armazenamento SSD / Memória Interna (Exibido para qualquer produto com opções de GB) */}
            {availableStorageList.length > 0 && (
              <div className="space-y-1.5">
                <span className="block text-[10px] font-semibold text-[#6E6E73] uppercase tracking-wider">
                  Armazenamento:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {availableStorageList.map((stg) => {
                    const isSelected = currentStorage === stg;
                    return (
                      <button
                        key={stg}
                        type="button"
                        onClick={() => handleSelectOption("storage", stg)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#0071E3] text-white border-[#0071E3] shadow-sm"
                            : "bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border-[#D2D2D7]/60"
                        }`}
                      >
                        {stg}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selector 5: Cores com Bolinhas (Circular Swatches) */}
            {displayColors.length > 0 && (
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#6E6E73] uppercase tracking-wider">
                    Cor:
                  </span>
                  {currentColor && (
                    <span className="text-[11px] font-semibold text-[#1D1D1F]">
                      {currentColor}
                    </span>
                  )}
                </div>

                {/* Circular Color Dots */}
                <div className="flex items-center gap-2 flex-wrap pt-0.5">
                  {displayColors.map((c) => {
                    const isSelected = currentColor === c.color;
                    const bgHex = colorMap[c.color] || "#6E93B2";
                    const isWhite =
                      c.color.toLowerCase().includes("white") ||
                      c.color.toLowerCase().includes("silver");

                    return (
                      <button
                        key={c.color}
                        type="button"
                        onClick={() => handleSelectOption("color", c.color)}
                        title={`${c.color}${c.price ? ` - ${formatCurrency(c.price)}` : ""}`}
                        className={`group/color relative w-7 h-7 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? "ring-2 ring-offset-2 ring-[#0071E3] scale-110 shadow-sm"
                            : "hover:scale-105 border border-[#D2D2D7]"
                        } ${isWhite ? "border border-[#D2D2D7]" : ""}`}
                        style={{ backgroundColor: bgHex }}
                        aria-label={`Selecionar cor ${c.color}`}
                      >
                        {isSelected && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              c.color.toLowerCase().includes("citrus") || isWhite
                                ? "bg-black/70"
                                : "bg-white"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Live Dynamic Price Display OR Under Consultation */}
            {currentPrice === 0 || isPreOrder ? (
              <div className="pt-3 pb-1 border-t border-[#E5E5E7] space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#0071E3] block leading-none mb-1">
                      Disponibilidade
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#1D1D1F] font-display tracking-[-0.02em]">
                      Consultar valores e disponibilidade
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 inline-block">
                    Sob Consulta
                  </span>
                </div>

                <p className="text-[11px] text-[#6E6E73] leading-tight">
                  Consulte valores atualizados e prazo de entrega direto com nossos especialistas.
                </p>

                {/* Trade-In Fast Trigger */}
                {isTradeInEligible && (
                  <Link
                    href={`/troca?categoria=${product.category}&produto=${encodeURIComponent(product.name)}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/90 border border-blue-200/60 text-[#0071E3] transition-all duration-200 text-[11px] font-medium group/trade cursor-pointer shadow-2xs hover:shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#0071E3] group-hover/trade:rotate-180 transition-transform duration-500 shrink-0" />
                    <span className="truncate">
                      Tem aparelho usado? <strong className="font-bold underline underline-offset-2">Simular abatimento na troca</strong>
                    </span>
                  </Link>
                )}
              </div>
            ) : currentPrice > 0 ? (
              <div className="pt-3 pb-1 border-t border-[#E5E5E7] space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#6E6E73] block leading-none mb-1">
                      Valor à vista
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-[#1D1D1F] font-display tracking-[-0.025em]">
                      {formatCurrency(currentPrice)}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#0071E3] font-semibold bg-blue-50/80 px-2.5 py-1 rounded-full border border-blue-200/60 inline-block">
                    no PIX
                  </span>
                </div>

                {/* Installments Option Preview & Modal Trigger */}
                {maxInstallment && (
                  <div className="bg-[#F5F5F7] rounded-xl p-2.5 border border-[#E5E5E7] flex items-center justify-between">
                    <div className="text-[11px] text-[#6E6E73]">
                      <span className="block font-medium">
                        ou em até <strong className="text-[#1D1D1F] font-semibold">18x de {formatCurrency(maxInstallment.installmentValue)}</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsInstallmentsModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0071E3] hover:underline cursor-pointer shrink-0"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Ver parcelas</span>
                    </button>
                  </div>
                )}

                {/* Trade-In Fast Trigger (iPhone, Mac & iPad) */}
                {isTradeInEligible && (
                  <Link
                    href={`/troca?categoria=${product.category}&produto=${encodeURIComponent(product.name)}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/90 border border-blue-200/60 text-[#0071E3] transition-all duration-200 text-[11px] font-medium group/trade cursor-pointer shadow-2xs hover:shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#0071E3] group-hover/trade:rotate-180 transition-transform duration-500 shrink-0" />
                    <span className="truncate">
                      Tem aparelho usado? <strong className="font-bold underline underline-offset-2">Simular abatimento na troca</strong>
                    </span>
                  </Link>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* WhatsApp Button */}
        <div className="pt-4 mt-2">
          <button
            type="button"
            onClick={handleWhatsAppRedirect}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm rounded-full shadow-sm hover:shadow transition-all duration-200 cursor-pointer bg-[#00C853] hover:bg-[#00B048]"
          >
            <MessageCircle className="w-4 h-4 fill-white shrink-0" />
            <span>
              {currentPrice > 0 ? "Consultar Disponibilidade" : "Consultar Valores e Disponibilidade"}
            </span>
          </button>
        </div>
      </div>

      {/* Installments Modal */}
      {isInstallmentsModalOpen && (
        <InstallmentsModal
          isOpen={isInstallmentsModalOpen}
          onClose={() => setIsInstallmentsModalOpen(false)}
          productName={`${product.name} ${currentSize ? `(${currentSize})` : ""}`}
          storage={currentStorage}
          color={currentColor}
          cashPrice={currentPrice}
        />
      )}
    </>
  );
};
