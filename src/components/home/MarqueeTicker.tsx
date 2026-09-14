import React from "react";
import { AppleLogo } from "@/components/ui/AppleLogo";

const marqueePhrases = [
  "iPhones Novos e Lacrados com 1 Ano de Garantia Apple",
  "MacBooks com Chips M4 e M5 com Máxima Performance",
  "Troca Inteligente: Avaliação Justa do Seu Usado",
  "São Paulo: Entrega Expressa via Delivery Seguro",
  "Pagamento Facilitado: Até 18x no Cartão ou Desconto no PIX",
  "Assistência Técnica Especializada na Santa Ifigênia",
  "iPads e Apple Watch com Pronta Entrega Imediata",
  "Atendimento Humanizado e Consultivo via WhatsApp",
];

export const MarqueeTicker: React.FC = () => {
  return (
    <section className="w-full bg-[#F5F5F7] text-[#1D1D1F] py-3.5 sm:py-4 overflow-hidden border-y border-[#D2D2D7] select-none relative z-20">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center gap-8 sm:gap-12">
        {/* First Loop */}
        {marqueePhrases.map((phrase, idx) => (
          <div key={`p1-${idx}`} className="inline-flex items-center gap-6 sm:gap-8 shrink-0">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest font-display text-[#1D1D1F]/90 hover:text-[#0071E3] transition-colors">
              {phrase}
            </span>
            {/* Official Apple Logo Separator */}
            <AppleLogo className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0071E3] shrink-0 opacity-75" />
          </div>
        ))}

        {/* Second Loop for seamless infinite marquee */}
        {marqueePhrases.map((phrase, idx) => (
          <div key={`p2-${idx}`} className="inline-flex items-center gap-6 sm:gap-8 shrink-0">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest font-display text-[#1D1D1F]/90 hover:text-[#0071E3] transition-colors">
              {phrase}
            </span>
            {/* Official Apple Logo Separator */}
            <AppleLogo className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0071E3] shrink-0 opacity-75" />
          </div>
        ))}
      </div>
    </section>
  );
};
