"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { createWhatsAppLink } from "@/utils/whatsapp";

export const AppleLaunchesSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const getReserveLink = (productName: string) => {
    return createWhatsAppLink(
      `Olá! Vim pelo site da Mundo Apple Delivery e gostaria de garantir minha reserva na Pré-Venda oficial do *${productName}*. Podem me passar a prioridade e detalhes?`
    );
  };

  return (
    <section id="lancamentos" className="w-full py-12 sm:py-16 bg-[#FBFBFD] border-y border-[#E5E5EA]">
      <Container size="large" className="space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F] font-display">
            A nova geração da Apple chegou.
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#6E6E73] font-normal max-w-2xl mx-auto leading-relaxed">
            Reserve seu modelo com prioridade exclusiva de entrega, nota fiscal e 1 ano de garantia mundial Apple.
          </p>
        </div>

        {/* 1. Main Billboard Showcase: iPhone 18 Pro & Pro Max (Video / High-Res Showcase) */}
        <div className="relative w-full rounded-3xl sm:rounded-[36px] overflow-hidden bg-black text-white shadow-xl border border-white/10 group">
          {/* Background Video */}
          <div className="relative w-full h-[420px] sm:h-[500px] md:h-[560px] overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster="/images/apple-showcase/hero-main.jpg"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-90 group-hover:scale-[1.01] transition-transform duration-1000 ease-out"
            >
              <source src="/videos/hero-iphone18pro.mp4" type="video/mp4" />
              <Image
                src="/images/apple-showcase/hero-main.jpg"
                alt="iPhone 18 Pro Showcase"
                fill
                className="object-cover object-center"
              />
            </video>

            {/* Subtle Gradient Overlays for perfect legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            {/* Content overlay */}
            <div className="absolute inset-0 p-6 sm:p-10 md:p-14 flex flex-col justify-end max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-white w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Pré-Venda Aberta</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-display leading-[1.08]">
                  iPhone 18 Pro
                </h3>
                <p className="text-base sm:text-xl text-zinc-200 font-medium leading-relaxed">
                  Titânio escovado grau 5, chip A20 Pro e sistema teleobjetiva periscópica revolucionário.
                </p>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Cores: Preto, Bordô, Glacier e Prateado · 256GB, 512GB, 1TB e 2TB
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={getReserveLink("iPhone 18 Pro")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Garantir Reserva na Pré-Venda</span>
                </a>

                <a
                  href="#categoria-iphone"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-medium text-sm sm:text-base transition-all active:scale-95"
                >
                  <span>Ver cores e capacidades</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Grid for the Other 3 Big Launches: iPhone Duo, Apple Watch Series 12 & AirPods 5 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: iPhone Duo */}
          <div className="group relative rounded-3xl overflow-hidden bg-white border border-[#D2D2D7]/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between p-7 sm:p-8 text-center">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 inline-block">
                Nova Categoria
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight font-display">
                iPhone Duo
              </h3>
              <p className="text-sm text-[#6E6E73] font-normal max-w-xs mx-auto">
                Duas telas integradas, formato expansível revolucionário com silício Apple A20 Pro.
              </p>
              <p className="text-xs text-[#86868B]">
                Branco-Estrela & Céu Noturno · 256GB, 512GB, 1TB
              </p>
            </div>

            <div className="relative w-full h-[240px] sm:h-[280px] my-4 flex items-center justify-center">
              <Image
                src="/images/products/iphone/iphone-duo-v2.png"
                alt="iPhone Duo"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={getReserveLink("iPhone Duo")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-sm shadow-sm active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Reservar iPhone Duo</span>
              </a>
              <a
                href="#categoria-iphone"
                className="text-xs text-[#0071E3] hover:underline font-medium py-1"
              >
                Ver na lista de iPhones ↓
              </a>
            </div>
          </div>

          {/* Card 2: Apple Watch Series 12 */}
          <div className="group relative rounded-3xl overflow-hidden bg-white border border-[#D2D2D7]/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between p-7 sm:p-8 text-center">
            <div className="space-y-2 flex flex-col items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 inline-block">
                Nova Geração Watch
              </span>
              <div className="h-7 relative w-40 mt-1">
                <Image
                  src="/images/apple-showcase/logo-watch-series-12.png"
                  alt="Apple Watch Series 12"
                  fill
                  className="object-contain object-center"
                />
              </div>
              <p className="text-sm text-[#6E6E73] font-normal max-w-xs mx-auto">
                Mais fino, tela de cristal OLED ultrabrilhante e monitoramento avançado de saúde.
              </p>
              <p className="text-xs text-[#86868B]">
                Tamanhos 42mm e 46mm · 5 acabamentos premium
              </p>
            </div>

            <div className="relative w-full h-[240px] sm:h-[280px] my-4 flex items-center justify-center">
              <Image
                src="/images/products/watch/apple-watch-s12-v2.png"
                alt="Apple Watch Series 12"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={getReserveLink("Apple Watch Series 12")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-sm shadow-sm active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Reservar Apple Watch S12</span>
              </a>
              <Link
                href="/apple-watch"
                className="text-xs text-[#0071E3] hover:underline font-medium py-1"
              >
                Ver também Ultra 4 (49mm) →
              </Link>
            </div>
          </div>

          {/* Card 3: AirPods 5 */}
          <div className="group relative rounded-3xl overflow-hidden bg-white border border-[#D2D2D7]/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between p-7 sm:p-8 text-center">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 inline-block">
                Áudio de Nova Geração
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight font-display">
                AirPods 5
              </h3>
              <p className="text-sm text-[#6E6E73] font-normal max-w-xs mx-auto">
                Cancelamento Ativo de Ruído de nível profissional e Áudio Espacial imersivo.
              </p>
              <p className="text-xs text-[#86868B]">
                Padrão & Com Cancelamento Ativo de Ruído (ANC)
              </p>
            </div>

            <div className="relative w-full h-[240px] sm:h-[280px] my-4 flex items-center justify-center">
              <Image
                src="/images/products/airpods/airpods-4-official.png"
                alt="AirPods 5"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={getReserveLink("AirPods 5")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-sm shadow-sm active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Reservar AirPods 5</span>
              </a>
              <Link
                href="/airpods"
                className="text-xs text-[#0071E3] hover:underline font-medium py-1"
              >
                Ver todos os fones Apple →
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
