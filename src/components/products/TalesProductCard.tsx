"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useCardEntrance } from "./card-entrance";
import { useLiveProduct } from "./LivePricesProvider";
import { Product, ProductVariant } from "@/types/product";
import { storeConfig } from "@/data/storeConfig";
import { formatCurrency } from "@/utils/formatters";
import { createWhatsAppLink } from "@/utils/whatsapp";
import { getMaxInstallment } from "@/utils/installments";
import { getProductColorHex, getProductColorImage } from "@/utils/product-colors";
import { swatchColor } from "./tales-colors";

function pickDefaultVariant(variants?: ProductVariant[]): ProductVariant | undefined {
  if (!variants || variants.length === 0) return undefined;
  const priced = variants.filter((v) => v.price > 0);
  if (priced.length === 0) return variants[0];
  return priced.reduce((best, item) => (item.price < best.price ? item : best), priced[0]);
}

interface TalesProductCardProps {
  product: Product;
  priority?: boolean;
}

type OptionField = "size" | "chip" | "ram" | "storage" | "color";

export const TalesProductCard: React.FC<TalesProductCardProps> = ({
  product: initialProduct,
  priority = false,
}) => {
  const product = useLiveProduct(initialProduct);
  const cardRef = useCardEntrance();

  const showPrices = Boolean(storeConfig.showPrices);
  const hasVariants = Boolean(product.variants && product.variants.length > 0);

  const sizeList = useMemo(() => {
    if (!hasVariants && product.sizes && product.sizes.length > 0) return product.sizes;
    if (!hasVariants && product.screenSizes && product.screenSizes.length > 0) return product.screenSizes;
    if (!hasVariants) return [];
    return Array.from(
      new Set(product.variants!.map((v) => v.size || v.screenSize).filter(Boolean) as string[])
    );
  }, [product.sizes, product.screenSizes, product.variants, hasVariants]);

  const chipList = useMemo(() => {
    if (!hasVariants && product.chips && product.chips.length > 0) return product.chips;
    if (!hasVariants) return [];
    return Array.from(new Set(product.variants!.map((v) => v.chip).filter(Boolean) as string[]));
  }, [product.chips, product.variants, hasVariants]);

  const ramList = useMemo(() => {
    if (!hasVariants && product.ramOptions && product.ramOptions.length > 0) return product.ramOptions;
    if (!hasVariants) return [];
    return Array.from(new Set(product.variants!.map((v) => v.ram).filter(Boolean) as string[]));
  }, [product.ramOptions, product.variants, hasVariants]);

  const storageList = useMemo(() => {
    if (!hasVariants && product.storage && product.storage.length > 0) return product.storage;
    if (!hasVariants) return [];
    return Array.from(new Set(product.variants!.map((v) => v.storage).filter(Boolean) as string[]));
  }, [product.storage, product.variants, hasVariants]);

  const colorList = useMemo(() => {
    if (!hasVariants && product.colors && product.colors.length > 0) return product.colors;
    if (!hasVariants) return [];
    return Array.from(new Set(product.variants!.map((v) => v.color).filter(Boolean) as string[]));
  }, [product.colors, product.variants, hasVariants]);

  const [activeVariant, setActiveVariant] = useState<ProductVariant | undefined>(
    () => pickDefaultVariant(product.variants)
  );
  const [customOptions, setCustomOptions] = useState<Partial<Record<OptionField, string>>>({});

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setActiveVariant((prev) => {
        const matching =
          prev &&
          product.variants!.find((v) =>
            (["storage", "color", "size", "screenSize", "chip", "ram"] as const).every(
              (key) => v[key] === prev[key]
            )
          );
        return matching || pickDefaultVariant(product.variants);
      });
    } else {
      setActiveVariant(undefined);
    }
    setCustomOptions({});
  }, [product]);

  const currentSize =
    activeVariant?.size || activeVariant?.screenSize || customOptions.size || sizeList[0] || "";
  const currentChip = activeVariant?.chip || customOptions.chip || chipList[0] || "";
  const currentRam = activeVariant?.ram || customOptions.ram || ramList[0] || "";
  const currentStorage = activeVariant?.storage || customOptions.storage || storageList[0] || "";
  const currentColor = activeVariant?.color || customOptions.color || colorList[0] || "";
  const currentPrice = hasVariants ? (activeVariant?.price ?? 0) : (product.priceFrom ?? 0);
  const maxInstallment = showPrices && currentPrice > 0 ? getMaxInstallment(currentPrice) : null;

  const isWatch =
    product.category === "watch" || sizeList.some((s) => s.toLowerCase().includes("mm"));

  // Filter compatible options per dimension
  const availableChipList = useMemo(() => {
    if (!hasVariants || !product.variants) return chipList;
    const valid = new Set(
      product.variants
        .filter((v) => !currentSize || !(v.size || v.screenSize) || (v.size || v.screenSize) === currentSize)
        .map((v) => v.chip)
        .filter(Boolean) as string[]
    );
    return valid.size === 0 ? chipList : chipList.filter((c) => valid.has(c));
  }, [hasVariants, product.variants, currentSize, chipList]);

  const availableRamList = useMemo(() => {
    if (!hasVariants || !product.variants) return ramList;
    const valid = new Set(
      product.variants
        .filter((v) => {
          const vSize = v.size || v.screenSize || "";
          if (currentSize && vSize && vSize !== currentSize) return false;
          if (currentChip && v.chip && v.chip !== currentChip) return false;
          return true;
        })
        .map((v) => v.ram)
        .filter(Boolean) as string[]
    );
    return valid.size === 0 ? ramList : ramList.filter((r) => valid.has(r));
  }, [hasVariants, product.variants, currentSize, currentChip, ramList]);

  const availableStorageList = useMemo(() => {
    if (!hasVariants || !product.variants) return storageList;
    const valid = new Set(
      product.variants
        .filter((v) => {
          const vSize = v.size || v.screenSize || "";
          if (currentSize && vSize && vSize !== currentSize) return false;
          if (currentChip && v.chip && v.chip !== currentChip) return false;
          if (currentRam && v.ram && v.ram !== currentRam) return false;
          return true;
        })
        .map((v) => v.storage)
        .filter(Boolean) as string[]
    );
    return valid.size === 0 ? storageList : storageList.filter((s) => valid.has(s));
  }, [hasVariants, product.variants, currentSize, currentChip, currentRam, storageList]);

  const availableColorList = useMemo(() => {
    if (!hasVariants || !product.variants) return colorList;
    const valid = new Set(
      product.variants
        .filter((v) => {
          const vSize = v.size || v.screenSize || "";
          if (currentSize && vSize && vSize !== currentSize) return false;
          if (currentChip && v.chip && v.chip !== currentChip) return false;
          if (currentRam && v.ram && v.ram !== currentRam) return false;
          if (currentStorage && v.storage && v.storage !== currentStorage) return false;
          return true;
        })
        .map((v) => v.color)
        .filter(Boolean) as string[]
    );
    return valid.size === 0 ? colorList : colorList.filter((c) => valid.has(c));
  }, [hasVariants, product.variants, currentSize, currentChip, currentRam, currentStorage, colorList]);

  const handleSelectField = (field: OptionField, value: string) => {
    if (!hasVariants || !product.variants) {
      setCustomOptions((prev) => ({ ...prev, [field]: value }));
      return;
    }

    const candidates = product.variants.filter((v) => {
      if (field === "size") return (v.size || v.screenSize) === value;
      if (field === "chip") return v.chip === value;
      if (field === "ram") return v.ram === value;
      if (field === "storage") return v.storage === value;
      if (field === "color") return v.color === value;
      return true;
    });

    if (candidates.length === 0) return;

    let best = candidates[0];
    let maxScore = -1;

    for (const c of candidates) {
      let score = 0;
      const cSize = c.size || c.screenSize || "";
      if (field !== "size" && cSize && cSize === currentSize) score += 32;
      if (field !== "chip" && c.chip && c.chip === currentChip) score += 16;
      if (field !== "ram" && c.ram && c.ram === currentRam) score += 8;
      if (field !== "storage" && c.storage && c.storage === currentStorage) score += 4;
      if (field !== "color" && c.color && c.color === currentColor) score += 2;
      if (c.price > 0) score += 1;
      if (score > maxScore) {
        maxScore = score;
        best = c;
      }
    }

    setActiveVariant(best);
  };

  const displayedImage = useMemo(() => {
    return getProductColorImage(product, currentColor, activeVariant?.image, currentSize);
  }, [activeVariant, currentColor, currentSize, product]);

  const productHref = `/produtos/${product.slug}`;

  const handleWhatsApp = () => {
    const details: string[] = [];
    if (currentSize) details.push(isWatch ? `Caixa: ${currentSize}` : `Tela: ${currentSize}`);
    if (currentChip) details.push(product.category === "ipad" ? `Conexão: ${currentChip}` : `Chip: ${currentChip}`);
    if (currentRam) details.push(`RAM: ${currentRam}`);
    if (currentStorage) details.push(`Capacidade: ${currentStorage}`);
    if (currentColor) details.push(`Cor: ${currentColor}`);

    let msg = `Olá! Vim pelo site da Mundo Apple Delivery e gostaria de consultar o valor e a disponibilidade do *${product.name}*`;
    if (details.length > 0) {
      msg += ` (${details.join(", ")})`;
    }
    if (showPrices && currentPrice > 0) {
      msg += ` — ${formatCurrency(currentPrice)} no PIX`;
    }
    msg += `.\nCondição: Novo lacrado com 1 ano de garantia oficial Apple.`;

    window.open(createWhatsAppLink(msg), "_blank", "noopener,noreferrer");
  };

  const hasAnyConfig =
    availableStorageList.length > 0 ||
    availableRamList.length > 0 ||
    sizeList.length > 1 ||
    availableChipList.length > 1 ||
    availableColorList.length > 0;

  return (
    <article
      ref={cardRef}
      className={`product-card product-category-${product.category}`}
    >
      <div className="product-picture">
        <Link href={productHref} aria-label={`Ver ${product.name} ${currentStorage}`}>
          <img
            src={displayedImage}
            alt={`${product.name} ${currentColor}`.trim()}
            loading={priority ? "eager" : "lazy"}
          />
        </Link>
      </div>

      <div className="product-content">
        <Link href={productHref}>
          <h3>{product.name}</h3>
        </Link>

        {hasAnyConfig && (
          <div className="card-configurations" aria-label={`Configurações de ${product.name}`}>
            {/* Storage (Capacidade) */}
            {availableStorageList.length > 0 && (
              <fieldset className="variant-choices capacity-choices" data-field="storage">
                <legend>Capacidade</legend>
                <div className="variant-options" role="group" aria-label="Capacidade">
                  {availableStorageList.map((stg) => {
                    const selected = stg === currentStorage;
                    return (
                      <button
                        type="button"
                        key={stg}
                        title={stg}
                        className={`configuration-chip ${selected ? "is-selected" : ""}`}
                        aria-label={`Capacidade: ${stg}`}
                        aria-pressed={selected}
                        onClick={() => handleSelectField("storage", stg)}
                      >
                        {stg}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* RAM */}
            {availableRamList.length > 0 && (
              <fieldset className="variant-choices capacity-choices" data-field="ram">
                <legend>RAM</legend>
                <div className="variant-options" role="group" aria-label="RAM">
                  {availableRamList.map((ram) => {
                    const selected = ram === currentRam;
                    return (
                      <button
                        type="button"
                        key={ram}
                        title={ram}
                        className={`configuration-chip ${selected ? "is-selected" : ""}`}
                        aria-label={`RAM: ${ram}`}
                        aria-pressed={selected}
                        onClick={() => handleSelectField("ram", ram)}
                      >
                        {ram}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* Size / Screen Size / Case Size */}
            {sizeList.length > 1 && (
              <fieldset className="variant-choices capacity-choices" data-field="size">
                <legend>{isWatch ? "Caixa" : "Tela"}</legend>
                <div className="variant-options" role="group" aria-label={isWatch ? "Caixa" : "Tela"}>
                  {sizeList.map((size) => {
                    const selected = size === currentSize;
                    return (
                      <button
                        type="button"
                        key={size}
                        title={size}
                        className={`configuration-chip ${selected ? "is-selected" : ""}`}
                        aria-label={`${isWatch ? "Caixa" : "Tela"}: ${size}`}
                        aria-pressed={selected}
                        onClick={() => handleSelectField("size", size)}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* Chip / Connectivity */}
            {availableChipList.length > 1 && (
              <fieldset className="variant-choices capacity-choices" data-field="chip">
                <legend>{product.category === "ipad" ? "Conexão" : "Chip"}</legend>
                <div className="variant-options" role="group" aria-label={product.category === "ipad" ? "Conexão" : "Chip"}>
                  {availableChipList.map((chip) => {
                    const selected = chip === currentChip;
                    return (
                      <button
                        type="button"
                        key={chip}
                        title={chip}
                        className={`configuration-chip ${selected ? "is-selected" : ""}`}
                        aria-label={`${product.category === "ipad" ? "Conexão" : "Chip"}: ${chip}`}
                        aria-pressed={selected}
                        onClick={() => handleSelectField("chip", chip)}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* Colors */}
            {availableColorList.length > 0 && (
              <fieldset className="variant-choices color-choices" data-field="color">
                <legend>
                  Cor
                  {currentColor && <span className="selected-color-name">{currentColor}</span>}
                </legend>
                <div className="variant-options" role="group" aria-label="Cor">
                  {availableColorList.map((color) => {
                    const selected = color === currentColor;
                    const hex = swatchColor(color) || getProductColorHex(color);
                    return (
                      <button
                        type="button"
                        key={color}
                        title={color}
                        className={`color-swatch-button ${selected ? "is-selected" : ""}`}
                        aria-label={`Cor: ${color}`}
                        aria-pressed={selected}
                        onClick={() => handleSelectField("color", color)}
                      >
                        <span
                          className="color-swatch"
                          style={{ backgroundColor: hex }}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}
          </div>
        )}

        {/* Consultation message OR Price (controlled by storeConfig.showPrices & variant price) */}
        {showPrices && currentPrice > 0 ? (
          <div className="price-block">
            <small>À vista no PIX</small>
            <strong>{formatCurrency(currentPrice)}</strong>
            {maxInstallment && (
              <p>ou em até 18x de {formatCurrency(maxInstallment.installmentValue)} no cartão</p>
            )}
          </div>
        ) : (
          <div className="consultation-block">
            <p>Sob consulta • Novo lacrado</p>
          </div>
        )}

        <button
          type="button"
          className="button product-button"
          onClick={handleWhatsApp}
        >
          {showPrices && currentPrice > 0 ? "Consultar disponibilidade" : "Consultar valor"}
        </button>
      </div>
    </article>
  );
};
