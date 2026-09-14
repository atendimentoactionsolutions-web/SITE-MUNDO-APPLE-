"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, RefreshCw, Zap } from "lucide-react";
import { Container } from "@/components/ui/Container";

export const AppleBentoGrid: React.FC = () => {
  return (
    <section className="w-full bg-[#F5F5F7] py-12 sm:py-16">
      <Container size="large" className="space-y-4 sm:space-y-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-apple-muted">
            Destaques de Linha
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-apple-dark font-display">
            Conheça o novo ecossistema.
          </h2>
          <p className="text-sm sm:text-base text-apple-muted">
            Toda a linha com garantia oficial Apple de 1 ano e pronta-entrega.
          </p>
        </div>

        {/* 2-Up Bento Grid (Apple Official 2-Column Module) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1: iPhone Duo */}
          <div className="group relative rounded-[28px] sm:rounded-[32px] overflow-hidden bg-white border border-[#D2D2D7]/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 min-h-[500px] sm:min-h-[560px] flex flex-col justify-between p-8 sm:p-10 text-center">
            {/* Text Header */}
            <div className="relative z-10 space-y-2">
              <h3 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight font-display">
                iPhone Duo
              </h3>
              <p className="text-base sm:text-lg text-[#6E6E73] font-medium max-w-sm mx-auto">
                Dobre as possibilidades. Duas telas, poder infinito.
              </p>
              <div className="flex items-center justify-center gap-4 pt-2">
                <a
                  href="#categoria-iphone"
                  className="inline-flex items-center text-sm font-semibold text-[#0071E3] hover:underline group-hover:gap-1.5 transition-all"
                >
                  <span>Ver modelos</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <Link
                  href="/troca"
                  className="inline-flex items-center text-sm font-semibold text-[#0071E3] hover:underline group-hover:gap-1.5 transition-all"
                >
                  <span>Simular Troca</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Image Showcase */}
            <div className="relative w-full h-[320px] sm:h-[380px] mt-4 flex items-center justify-center">
              <Image
                src="/images/apple-showcase/iphone-duo.jpg"
                alt="iPhone Duo"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain object-bottom group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>

          {/* Card 2: Apple Watch Series 12 */}
          <div className="group relative rounded-[28px] sm:rounded-[32px] overflow-hidden bg-white border border-[#D2D2D7]/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 min-h-[500px] sm:min-h-[560px] flex flex-col justify-between p-8 sm:p-10 text-center">
            {/* Text Header with Logo */}
            <div className="relative z-10 space-y-3 flex flex-col items-center">
              <div className="h-9 relative w-48">
                <Image
                  src="/images/apple-showcase/logo-watch-series-12.png"
                  alt="Apple Watch Series 12 Logo"
                  fill
                  className="object-contain object-center"
                />
              </div>
              <p className="text-base sm:text-lg text-[#6E6E73] font-medium max-w-sm mx-auto">
                Mais brilhante. Mais fino. Mais saúde e inteligência no pulso.
              </p>
              <div className="flex items-center justify-center gap-4 pt-1">
                <a
                  href="#categoria-watch"
                  className="inline-flex items-center text-sm font-semibold text-[#0071E3] hover:underline group-hover:gap-1.5 transition-all"
                >
                  <span>Comprar</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Image Showcase */}
            <div className="relative w-full h-[320px] sm:h-[380px] mt-4 flex items-center justify-center">
              <Image
                src="/images/apple-showcase/watch-series-12.jpg"
                alt="Apple Watch Series 12"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain object-bottom group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>

          {/* Card 3: Apple Watch Ultra 4 (Dark / Extreme Theme) */}
          <div className="group relative rounded-[28px] sm:rounded-[32px] overflow-hidden bg-[#000000] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-2xl transition-all duration-300 min-h-[500px] sm:min-h-[560px] flex flex-col justify-between p-8 sm:p-10 text-center text-white">
            {/* Text Header with Logo */}
            <div className="relative z-10 space-y-3 flex flex-col items-center">
              <div className="h-9 relative w-48 invert brightness-200">
                <Image
                  src="/images/apple-showcase/logo-watch-ultra-4.png"
                  alt="Apple Watch Ultra 4 Logo"
                  fill
                  className="object-contain object-center"
                />
              </div>
              <p className="text-base sm:text-lg text-zinc-300 font-medium max-w-sm mx-auto">
                Titânio extremo. Bateria incomparável. GPS de dupla precisão.
              </p>
              <div className="flex items-center justify-center gap-4 pt-1">
                <a
                  href="#categoria-watch"
                  className="inline-flex items-center text-sm font-semibold text-[#2997FF] hover:underline group-hover:gap-1.5 transition-all"
                >
                  <span>Comprar</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Image Showcase */}
            <div className="relative w-full h-[320px] sm:h-[380px] mt-4 flex items-center justify-center">
              <Image
                src="/images/apple-showcase/watch-ultra-4.jpg"
                alt="Apple Watch Ultra 4"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain object-bottom group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>

          {/* Card 4: AirPods 5 */}
          <div className="group relative rounded-[28px] sm:rounded-[32px] overflow-hidden bg-white border border-[#D2D2D7]/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 min-h-[500px] sm:min-h-[560px] flex flex-col justify-between p-8 sm:p-10 text-center">
            {/* Text Header */}
            <div className="relative z-10 space-y-2">
              <h3 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight font-display">
                AirPods 5
              </h3>
              <p className="text-base sm:text-lg text-[#6E6E73] font-medium max-w-sm mx-auto">
                Cancelamento Ativo de Ruído agora com Áudio Espacial transformador.
              </p>
              <div className="flex items-center justify-center gap-4 pt-2">
                <a
                  href="#categoria-airpods"
                  className="inline-flex items-center text-sm font-semibold text-[#0071E3] hover:underline group-hover:gap-1.5 transition-all"
                >
                  <span>Comprar</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Image Showcase */}
            <div className="relative w-full h-[320px] sm:h-[380px] mt-4 flex items-center justify-center">
              <Image
                src="/images/apple-showcase/airpods-5.jpg"
                alt="AirPods 5"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain object-bottom group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Banner Horizontal: Trade-In Oficial Mundo Apple */}
        <div className="rounded-[28px] sm:rounded-[32px] bg-gradient-to-r from-[#1D1D1F] via-[#121214] to-black text-white p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 border border-white/10 shadow-xl">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulador de Troca Oficial</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight font-display">
              Seu aparelho vale dinheiro na troca por um novo lacrado.
            </h3>
            <p className="text-sm sm:text-base text-zinc-300">
              Receba até R$ 6.500 de abatimento imediato ou pagamento à vista no PIX com avaliação técnica transparente.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/troca"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold rounded-full shadow-lg active:scale-95 transition-all text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Calcular Volta no Upgrade</span>
            </Link>
            <Link
              href="/vender"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-full border border-white/20 active:scale-95 transition-all text-sm sm:text-base"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Quero Apenas Vender (PIX)</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};
