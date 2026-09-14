"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { formatBRL, formatConditionLabel } from "@/utils/formatters";
import { getWhatsAppProductUrl } from "@/utils/whatsapp";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MessageCircle, ShieldCheck, FileText, RefreshCw, BatteryCharging, Check } from "lucide-react";
import Link from "next/link";

interface ProductDetailOptionsProps {
  product: Product;
}

export const ProductDetailOptions: React.FC<ProductDetailOptionsProps> = ({ product }) => {
  const [selectedStorage, setSelectedStorage] = useState<string>(
    product.storage?.[0] || ""
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0] || ""
  );

  const whatsappUrl = getWhatsAppProductUrl(
    product.name,
    selectedStorage,
    selectedColor,
    product.priceFrom
  );

  return (
    <div className="space-y-6">
      {/* Category & Name */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-apple-blue block mb-1">
          {product.subcategory || product.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold text-apple-dark tracking-tight">
          {product.name}
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

      {/* Price Block */}
      <div className="p-6 rounded-3xl bg-apple-gray/60 border border-apple-border/60 space-y-1">
        <span className="text-xs text-apple-muted block">Preço à vista ou Pix</span>
        <div className="text-3xl sm:text-4xl font-bold text-apple-dark tracking-tight">
          {formatBRL(product.priceFrom)}
        </div>
        <p className="text-xs text-apple-muted pt-1">
          Aceitamos pagamento na entrega ou retirada na loja na Santa Ifigênia.
        </p>
      </div>

      {/* Storage Options */}
      {product.storage && product.storage.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-apple-dark">
            Capacidade de Armazenamento:
          </label>
          <div className="flex items-center gap-2.5 flex-wrap">
            {product.storage.map((stg) => (
              <button
                key={stg}
                type="button"
                onClick={() => setSelectedStorage(stg)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all ${
                  selectedStorage === stg
                    ? "bg-apple-dark text-white border-apple-dark shadow-sm"
                    : "bg-white text-apple-dark border-apple-border hover:bg-gray-100"
                }`}
              >
                {stg}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors Options */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-apple-dark">
            Cor Selecionada: <span className="text-apple-blue font-bold">{selectedColor}</span>
          </label>
          <div className="flex items-center gap-2.5 flex-wrap">
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  selectedColor === color
                    ? "bg-apple-blue/10 text-apple-blue border-apple-blue font-semibold"
                    : "bg-white text-apple-dark border-apple-border hover:bg-gray-100"
                }`}
              >
                {selectedColor === color && <Check className="w-3.5 h-3.5 text-apple-blue" />}
                <span>{color}</span>
              </button>
            ))}
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
      <div className="space-y-3 pt-2">
        <Button
          href={whatsappUrl}
          external
          variant="whatsapp"
          size="lg"
          className="w-full"
          icon={<MessageCircle className="w-5 h-5" />}
        >
          Comprar pelo WhatsApp
        </Button>

        {/* Trade in CTA Box */}
        <div className="p-4 rounded-2xl bg-apple-gray border border-apple-border/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-apple-dark">
            <RefreshCw className="w-4 h-4 text-apple-blue shrink-0" />
            <span>Tem um iPhone usado? Aceitamos na troca!</span>
          </div>
          <Link
            href="/troca"
            className="text-xs font-semibold text-apple-blue hover:underline whitespace-nowrap"
          >
            Avaliar meu iPhone
          </Link>
        </div>
      </div>
    </div>
  );
};
