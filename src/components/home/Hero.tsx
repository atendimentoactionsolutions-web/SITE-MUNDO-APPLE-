import React from "react";
import Link from "next/link";
import { ArrowDown, Zap, RefreshCw, ShieldCheck, CreditCard, Store } from "lucide-react";
import { Container } from "@/components/ui/Container";

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-24 sm:pt-28 pb-8 sm:pb-12 bg-white overflow-hidden flex flex-col items-center">
      <Container size="large" className="w-full">
        {/* Main Hero Card Container — Apple Store Clean Editorial Layout */}
        <div className="relative w-full rounded-3xl sm:rounded-[36px] overflow-hidden bg-gradient-to-b from-[#FBFBFD] via-[#F8F8FA] to-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.03)] px-5 py-8 sm:px-12 sm:py-16 lg:px-16 lg:py-20 flex flex-col items-center text-center gap-6 sm:gap-10">
          {/* Typography */}
          <div className="max-w-4xl space-y-3 sm:space-y-6">
            <h1 className="text-2xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-[#1D1D1F] font-display tracking-[-0.03em] sm:tracking-[-0.035em] leading-[1.12] sm:leading-[1.08]">
              Apple com confiança, garantia e procedência.
            </h1>

            <p className="text-xs sm:text-base md:text-lg text-[#6E6E73] font-normal leading-relaxed tracking-[-0.011em] max-w-2xl mx-auto">
              Dispositivos novos e lacrados de fábrica com <strong className="text-[#1D1D1F] font-semibold">1 ano de garantia oficial Apple</strong>. Avaliação justa do seu seminovo com <strong className="text-emerald-700 font-semibold">PIX na hora</strong> ou desconto imediato no upgrade.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 w-full max-w-2xl">
            {/* Ver Catálogo (Primary Apple Blue) */}
            <a
              href="#catalogo"
              className="w-full sm:w-auto h-12 sm:h-13 inline-flex items-center justify-center gap-2 px-6 sm:px-8 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-sm sm:text-base rounded-full shadow-sm hover:shadow active:scale-95 transition-all duration-200 group tracking-tight whitespace-nowrap"
            >
              <span>Explorar Catálogo</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </a>

            {/* Vender meu Produto Apple */}
            <Link
              href="/vender"
              className="w-full sm:w-auto h-12 sm:h-13 inline-flex items-center justify-center px-6 sm:px-7 bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] font-semibold text-sm sm:text-base rounded-full border border-[#D2D2D7] shadow-2xs hover:border-[#86868B] active:scale-95 transition-all duration-200 tracking-tight whitespace-nowrap"
            >
              <span>Vender meu Produto Apple</span>
            </Link>

            {/* Simular Upgrade */}
            <Link
              href="/troca"
              className="w-full sm:w-auto h-12 sm:h-13 inline-flex items-center justify-center gap-2 px-6 sm:px-7 bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] font-semibold text-sm sm:text-base rounded-full border border-[#D2D2D7] shadow-2xs hover:border-[#86868B] active:scale-95 transition-all duration-200 tracking-tight whitespace-nowrap"
            >
              <RefreshCw className="w-4 h-4 text-[#0071E3]" />
              <span>Simular Upgrade</span>
            </Link>
          </div>

          {/* Trust Pillars Grid */}
          <div className="w-full pt-6 sm:pt-10 border-t border-[#D2D2D7]/60 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl text-left">
            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-2xl bg-white/90 border border-[#E5E5EA] shadow-2xs">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-sm font-semibold text-[#1D1D1F] leading-tight">Novos & Lacrados</p>
                <p className="text-[10px] sm:text-xs text-[#86868B] leading-tight mt-0.5">1 ano garantia Apple</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-2xl bg-white/90 border border-[#E5E5EA] shadow-2xs">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-sm font-semibold text-[#1D1D1F] leading-tight">PIX na Hora</p>
                <p className="text-[10px] sm:text-xs text-[#86868B] leading-tight mt-0.5">Pagamento imediato</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-2xl bg-white/90 border border-[#E5E5EA] shadow-2xs">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-sm font-semibold text-[#1D1D1F] leading-tight">Até 18x no Cartão</p>
                <p className="text-[10px] sm:text-xs text-[#86868B] leading-tight mt-0.5">Condições especiais</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-2xl bg-white/90 border border-[#E5E5EA] shadow-2xs">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Store className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-sm font-semibold text-[#1D1D1F] leading-tight">Loja Física & SP</p>
                <p className="text-[10px] sm:text-xs text-[#86868B] leading-tight mt-0.5">Retirada ou express</p>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};
