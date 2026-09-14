"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, MapPin, Sparkles } from "lucide-react";

const announcements = [
  {
    icon: <ShieldCheck className="w-3.5 h-3.5 text-[#0071E3] shrink-0" />,
    text: "Produtos Novos e Lacrados com 1 Ano de Garantia Oficial Apple",
    highlight: "Garantia Oficial",
  },
  {
    icon: <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
    text: "Loja Física na Santa Ifigênia, 361 • Loja 24 • Retirada Imediata",
    highlight: "Loja Física SP",
  },
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = announcements[currentIndex];

  return (
    <div className="bg-[#F5F5F7] text-[#1D1D1F] text-[11px] sm:text-xs py-2 px-4 border-b border-[#E5E7EB] relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center transition-all duration-300">
        <span className="hidden sm:inline-flex items-center gap-1 font-bold text-[#0071E3] tracking-wider uppercase text-[10px] bg-white border border-[#E5E7EB] px-2 py-0.5 rounded-full shadow-sm">
          <Sparkles className="w-3 h-3 text-amber-500" />
          {current.highlight}
        </span>
        <span className="flex items-center gap-1.5 font-medium text-[#475569]">
          {current.icon}
          <span>{current.text}</span>
        </span>
      </div>
    </div>
  );
};
