import React from "react";
import { Container } from "@/components/ui/Container";
import { Compass, Eye, ShieldCheck, Sparkles } from "lucide-react";

export const EssenceSection: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-28 bg-[#F5F5F7] text-[#0F172A] overflow-hidden border-t border-[#E5E7EB]">
      <Container size="large" className="relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-bold uppercase tracking-wider text-[#0071E3] shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Propósito & Compromisso</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#0F172A] font-display tracking-tight leading-tight">
            Nossa essência
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#475569] font-normal leading-relaxed">
            Na <strong>Mundo Apple Delivery</strong>, trabalhamos para tornar a compra de tecnologia mais simples, segura e transparente. Oferecemos produtos selecionados, procedência verificada, condições justas e atendimento próximo em todas as etapas da compra.
          </p>
        </div>

        {/* 3 Clean White Cards (Missão, Visão, Valores) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: MISSÃO */}
          <div className="bg-white hover:bg-slate-50 border border-[#E5E7EB] rounded-[22px] p-7 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#0071E3] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-[#0071E3]" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#0071E3] block mb-2 font-display">
              Nosso Propósito
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-[#0F172A] mb-3">
              MISSÃO
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
              Oferecer tecnologia com procedência, segurança e transparência, proporcionando uma experiência de compra confiável, desde o primeiro atendimento até o pós-venda.
            </p>
          </div>

          {/* Card 2: VISÃO */}
          <div className="bg-white hover:bg-slate-50 border border-[#E5E7EB] rounded-[22px] p-7 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-purple-600 block mb-2 font-display">
              Onde Queremos Chegar
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-[#0F172A] mb-3">
              VISÃO
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
              Ser reconhecida como uma das principais referências em produtos Apple, destacando-se pela confiança, qualidade dos produtos e excelência no atendimento.
            </p>
          </div>

          {/* Card 3: VALORES */}
          <div className="bg-white hover:bg-slate-50 border border-[#E5E7EB] rounded-[22px] p-7 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 block mb-2 font-display">
              O que nos Guia
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-[#0F172A] mb-3">
              VALORES
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
              Transparência em cada negociação, compromisso com o cliente, procedência dos produtos, atendimento humanizado, responsabilidade e busca constante pela melhor experiência de compra.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};
