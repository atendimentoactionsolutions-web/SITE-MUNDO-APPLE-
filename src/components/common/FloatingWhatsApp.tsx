"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { getWhatsAppGeneralUrl } from "@/utils/whatsapp";

export const FloatingWhatsApp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show after slight delay to ensure smooth page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1200);

    // Show tooltip briefly after 3 seconds to draw attention
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 3500);

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
        <div className="relative bg-white text-[#1D1D1F] text-xs font-medium px-4 py-2.5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#E5E5E7] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[260px] sm:max-w-none">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C853] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C853]"></span>
            </span>
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
        href={getWhatsAppGeneralUrl("Olá! Vim pelo site da Mundo Apple Delivery e gostaria de tirar dúvidas sobre produtos e disponibilidade.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com especialista no WhatsApp"
        className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-[0_6px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_32px_rgba(37,211,102,0.55)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        {/* Pulsing Status Dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>

        {/* WhatsApp Icon */}
        <MessageCircle className="w-5 h-5 fill-white text-transparent group-hover:rotate-6 transition-transform" />

        {/* Text for desktop and tablet */}
        <span className="hidden sm:inline text-xs font-semibold tracking-tight text-white pr-1">
          WhatsApp Loja
        </span>
      </a>
    </aside>
  );
};
