"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { getWhatsAppGeneralUrl } from "@/utils/whatsapp";

export const FloatingWhatsApp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 900);

    const tooltipTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 3200);

    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <aside aria-label="Atendimento rápido" className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 select-none">
      {/* Interactive Tooltip Callout */}
      {showTooltip && (
        <div className="animate-chip-in relative bg-white text-[#1D1D1F] text-xs font-medium px-4 py-2.5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#E5E5E7] flex items-center gap-3 max-w-[260px] sm:max-w-none">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00C853] shrink-0" aria-hidden="true" />
            <span className="text-[11px] sm:text-xs leading-tight">
              Precisa de ajuda ou cotação? <strong className="font-semibold text-[#1D1D1F]">Fale com um especialista.</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-[#86868B] hover:text-[#1D1D1F] p-0.5 rounded-full transition-colors cursor-pointer"
            aria-label="Fechar dica"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Little Triangle Pointer pointing down */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-[#E5E5E7] rotate-45"></div>
        </div>
      )}

      {/* Main Floating Button */}
      <a
        href={getWhatsAppGeneralUrl("Olá! Vim pelo site da Mundo Apple Delivery e gostaria de tirar dúvidas sobre produtos, vendas ou disponibilidade.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com especialista no WhatsApp"
        className="group relative flex items-center gap-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-[0_6px_22px_rgba(22,163,74,0.38)] transition-[background-color,transform] duration-200 active:scale-95 cursor-pointer"
      >
        <span className="h-2 w-2 rounded-full bg-white/90 shrink-0" aria-hidden="true" />
        <MessageCircle className="w-5 h-5 fill-white text-transparent shrink-0" />
        <span className="hidden sm:inline text-xs font-semibold tracking-tight text-white pr-0.5">
          WhatsApp Loja
        </span>
      </a>
    </aside>
  );
};
