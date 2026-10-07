"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Product, ProductVariant } from "@/types/product";
import { formatCurrency, formatConditionLabel } from "@/utils/formatters";
import { createWhatsAppLink } from "@/utils/whatsapp";
import { getMaxInstallment } from "@/utils/installments";
import { InstallmentsModal } from "./InstallmentsModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  MessageCircle,
  ShieldCheck,
  FileText,
  BatteryCharging,
  Check,
  CreditCard,
} from "lucide-react";

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
  "Red": "#D32F2F",
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
  "Charcoal gray": "#36454F",
};

interface ProductDetailOptionsProps {
  product: Product;
}

export const ProductDetailOptions: React.FC<ProductDetailOptionsProps> = ({ product }) => {
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

  // 2. Active Variant & Fallback Custom Storage Selection
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

  // 3. Dynamic options filtering
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

  // Live installments
  const maxInstallment = useMemo(() => {
    return currentPrice > 0 ? getMaxInstallment(currentPrice) : null;
  }, [currentPrice]);

  // Color Swatches data with live prices
  const displayColors = useMemo(() => {
    if (colorList.length === 0) return [];
    return colorList.map((colorName) => {
      const directMatch = product.variants?.find((v) => {
        const vSize = v.size || v.screenSize || "";
        return (
          (!currentSize || !vSize || vSize === currentSize) &&
          (!currentChip || !v.chip || v.chip === currentChip) &&
          (!currentRam || !v.ram || v.ram === currentRam) &&
          (!currentStorage || !v.storage || v.storage === currentStorage) &&
          v.color === colorName
        );
      });
      return {
        color: colorName,
        price: directMatch?.price,
      };
    });
  }, [colorList, product.variants, currentSize, currentChip, currentRam, currentStorage]);

  const handleWhatsAppRedirect = () => {
    let messageText = `Olá! Tenho interesse no *${product.name}*`;
    const details = [
      currentSize ? `Tamanho: ${currentSize}` : "",
      currentChip ? `Versão/Chip: ${currentChip}` : "",
      currentRam ? `RAM: ${currentRam}` : "",
      currentStorage ? `Capacidade: ${currentStorage}` : "",
      currentColor ? `Cor: ${currentColor}` : "",
    ].filter(Boolean);

    if (details.length > 0) {
      messageText += ` (${details.join(", ")})`;
    }

    if (currentPrice > 0) {
      messageText += ` no valor de ${formatCurrency(currentPrice)} no PIX`;
    }

    messageText += `. Está disponível para pronta entrega?`;
    window.open(createWhatsAppLink(messageText), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      {/* Category & Name */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-apple-blue block mb-1">
          {product.subcategory || product.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold text-apple-dark tracking-tight">
          {product.name} {currentSize ? `(${currentSize})` : ""}
        </h1>

        {/* Badges */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge variant={product.condition === "new" ? "new" : "used"}>
            {formatConditionLabel(product.condition)}
          </Badge>

          {product.condition === "used" && product.batteryHealth && (
            <Badge variant="battery">
              <BatteryCharging className="w-3.5 h-3.5 mr-1" />
              {product.batteryHealth}% Saúde da Bateria
            </Badge>
          )}

          {product.availability === "available" && (
            <Badge variant="available">Pronta Entrega</Badge>
          )}
        </div>
      </div>

      {/* Price Block & Installments */}
      <div className="p-6 rounded-3xl bg-apple-gray/60 border border-apple-border/60 space-y-3">
        <div>
          <span className="text-xs text-apple-muted block mb-0.5">Preço à vista ou Pix</span>
          <div className="text-3xl sm:text-4xl font-bold text-apple-dark tracking-tight">
            {currentPrice > 0 ? formatCurrency(currentPrice) : "Sob Consulta"}
          </div>
        </div>

        {maxInstallment && (
          <div className="bg-white/80 rounded-2xl p-3 border border-apple-border/80 flex items-center justify-between gap-3">
            <div className="text-xs text-apple-muted">
              <span>
                ou em até{" "}
                <strong className="text-apple-dark font-semibold">
                  18x de {formatCurrency(maxInstallment.installmentValue)}
                </strong>{" "}
                no cartão
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsInstallmentsModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-apple-blue hover:underline cursor-pointer shrink-0"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Ver parcelas</span>
            </button>
          </div>
        )}

        <p className="text-xs text-apple-muted pt-1">
          Aceitamos pagamento na entrega ou retirada na loja na Santa Ifigênia.
        </p>
      </div>

      {/* Selector 1: Screen Size / Milimetragem */}
      {sizeList.length > 1 && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-apple-dark">
            {isWatchOrMm ? "Milimetragem:" : "Tamanho da Tela:"}
          </label>
          <div className="flex items-center gap-2.5 flex-wrap">
            {sizeList.map((size) => {
              const isSelected = currentSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSelectOption("size", size)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-apple-dark text-white border-apple-dark shadow-sm"
                      : "bg-white text-apple-dark border-apple-border hover:bg-gray-100"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selector 2: Connectivity / Chip / Version */}
      {availableChipList.length > 1 && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-apple-dark">
            {product.category === "ipad" ? "Conectividade:" : "Processador / Versão:"}
          </label>
          <div className="flex items-center gap-2.5 flex-wrap">
            {availableChipList.map((chip) => {
              const isSelected = currentChip === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSelectOption("chip", chip)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-apple-dark text-white border-apple-dark shadow-sm"
                      : "bg-white text-apple-dark border-apple-border hover:bg-gray-100"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selector 3: RAM Memory */}
      {availableRamList.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-apple-dark">
            Memória RAM:
          </label>
          <div className="flex items-center gap-2.5 flex-wrap">
            {availableRamList.map((ram) => {
              const isSelected = currentRam === ram;
              return (
                <button
                  key={ram}
                  type="button"
                  onClick={() => handleSelectOption("ram", ram)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-apple-dark text-white border-apple-dark shadow-sm"
                      : "bg-white text-apple-dark border-apple-border hover:bg-gray-100"
                  }`}
                >
                  {ram}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selector 4: Storage Options */}
      {availableStorageList.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-apple-dark">
            Capacidade de Armazenamento:
          </label>
          <div className="flex items-center gap-2.5 flex-wrap">
            {availableStorageList.map((stg) => {
              const isSelected = currentStorage === stg;
              return (
                <button
                  key={stg}
                  type="button"
                  onClick={() => handleSelectOption("storage", stg)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-apple-dark text-white border-apple-dark shadow-sm"
                      : "bg-white text-apple-dark border-apple-border hover:bg-gray-100"
                  }`}
                >
                  {stg}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selector 5: Colors Options with dynamic price hints */}
      {displayColors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-apple-dark">
              Cor Selecionada: <span className="text-apple-blue font-bold">{currentColor}</span>
            </label>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {displayColors.map((c) => {
              const isSelected = currentColor === c.color;
              const bgHex = colorMap[c.color] || "#6E93B2";
              const isWhite =
                c.color.toLowerCase().includes("white") ||
                c.color.toLowerCase().includes("silver") ||
                c.color.toLowerCase().includes("branco") ||
                c.color.toLowerCase().includes("prateado");

              return (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => handleSelectOption("color", c.color)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-apple-blue/10 text-apple-blue border-apple-blue font-semibold shadow-2xs"
                      : "bg-white text-apple-dark border-apple-border hover:bg-gray-100"
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full inline-block shrink-0 ${
                      isWhite ? "border border-[#D2D2D7]" : ""
                    }`}
                    style={{ backgroundColor: bgHex }}
                  />
                  <span>{c.color}</span>
                  {c.price && c.price > 0 && (
                    <span className="text-[11px] opacity-80 font-normal">
                      ({formatCurrency(c.price)})
                    </span>
                  )}
                  {isSelected && <Check className="w-3.5 h-3.5 text-apple-blue ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Guarantee & Invoice info */}
      <div className="space-y-3 pt-2 text-xs text-apple-dark border-t border-b border-apple-border/60 py-4">
        {product.warranty && (
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{product.warranty}</span>
          </div>
        )}
        {product.invoice && (
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-apple-blue shrink-0" />
            <span>Acompanha Nota Fiscal / Termo de Procedência</span>
          </div>
        )}
      </div>

      {/* Primary WhatsApp Action */}
      <div className="pt-2">
        <Button
          onClick={handleWhatsAppRedirect}
          variant="whatsapp"
          size="lg"
          className="w-full font-bold shadow-md hover:shadow-lg transition-all"
          icon={<MessageCircle className="w-5 h-5" />}
        >
          {currentPrice > 0 ? "Comprar pelo WhatsApp" : "Consultar Valores e Disponibilidade"}
        </Button>
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
    </div>
  );
};
