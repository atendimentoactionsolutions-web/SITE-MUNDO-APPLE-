"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { createWhatsAppLink } from "@/utils/whatsapp";
import { Zap } from "lucide-react";

export const AppleOfficialPromoGrid: React.FC = () => {
  const getProductWhatsAppUrl = (name: string) => {
    return createWhatsAppLink(
      `Olá! Vim pelo site da Mundo Apple Delivery e tenho interesse no *${name}*. Podem me passar os detalhes, disponibilidade e condições?`
    );
  };

  return (
    <section className="w-full bg-white py-3 px-0 sm:px-3">
      <div className="w-full mx-auto">
        {/* Apple Official 2-Column Promo Grid (12px gap like apple.com) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* ────────────────────────────────────────────────────────────────
              ROW 1 - TILE 1: Apple Watch Series 12 (Dark Theme - Split Top/Bottom)
          ──────────────────────────────────────────────────────────────── */}
          <div className="relative h-[500px] sm:h-[580px] overflow-hidden bg-black text-[#F5F5F7] flex flex-col justify-between items-center text-center group">
            {/* Top Logo */}
            <div className="relative z-10 pt-10 sm:pt-13 px-6 flex flex-col items-center">
              <div className="relative w-44 sm:w-52 h-9 sm:h-11">
                <Image
                  src="/apple-official/images/promo_logo_watch_s12_2x.png"
                  alt="Apple Watch Series 12"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Background Image */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
              <picture className="w-full h-full">
                <source
                  media="(max-width: 734px)"
                  srcSet="/apple-official/images/promo_watch_s12_small_2x.jpg"
                />
                <img
                  src="/apple-official/images/promo_watch_s12_2x.jpg"
                  alt="Apple Watch Series 12"
                  className="w-full h-full object-cover object-center pointer-events-none select-none"
                />
              </picture>
            </div>

            {/* Bottom Copy & CTAs */}
            <div className="relative z-10 pb-9 sm:pb-11 px-6 flex flex-col items-center space-y-3 max-w-xs sm:max-w-sm">
              <p className="text-[17px] sm:text-[19px] leading-[1.21] text-[#F5F5F7] font-normal tracking-tight">
                Com a medição de frequência cardíaca mais precisa em um wearable.
              </p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <a
                  href="#categoria-watch"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal rounded-full transition-colors"
                >
                  Saiba mais
                </a>
                <a
                  href={getProductWhatsAppUrl("Apple Watch Series 12")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-transparent hover:bg-[#0071E3] text-[#2997FF] hover:text-white border border-[#2997FF] hover:border-[#0071E3] text-[14px] font-normal rounded-full transition-colors"
                >
                  Comprar
                </a>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────
              ROW 1 - TILE 2: Apple Watch Ultra 4 (Dark Theme - Top Copy)
          ──────────────────────────────────────────────────────────────── */}
          <div className="relative h-[500px] sm:h-[580px] overflow-hidden bg-black text-[#F5F5F7] flex flex-col items-center text-center group">
            {/* Top Copy & CTAs */}
            <div className="relative z-10 pt-10 sm:pt-13 px-6 flex flex-col items-center space-y-2 max-w-md">
              <div className="relative w-44 sm:w-52 h-9 sm:h-11">
                <Image
                  src="/apple-official/images/promo_logo_watch_ultra4_2x.png"
                  alt="Apple Watch Ultra 4"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-[17px] sm:text-[19px] text-[#F5F5F7] font-normal tracking-tight">
                Bateria que nem você ultrapassa.
              </p>
              <div className="flex items-center justify-center gap-3 pt-1.5">
                <a
                  href="#categoria-watch"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal rounded-full transition-colors"
                >
                  Saiba mais
                </a>
                <a
                  href={getProductWhatsAppUrl("Apple Watch Ultra 4")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-transparent hover:bg-[#0071E3] text-[#2997FF] hover:text-white border border-[#2997FF] hover:border-[#0071E3] text-[14px] font-normal rounded-full transition-colors"
                >
                  Comprar
                </a>
              </div>
            </div>

            {/* Background Image */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
              <picture className="w-full h-full">
                <source
                  media="(max-width: 734px)"
                  srcSet="/apple-official/images/promo_watch_ultra4_small_2x.jpg"
                />
                <img
                  src="/apple-official/images/promo_watch_ultra4_2x.jpg"
                  alt="Apple Watch Ultra 4"
                  className="w-full h-full object-cover object-bottom pointer-events-none select-none"
                />
              </picture>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────
              ROW 2 - TILE 3: iPad Air M4 (Light Blue Gradient Theme)
          ──────────────────────────────────────────────────────────────── */}
          <div className="relative h-[500px] sm:h-[580px] overflow-hidden bg-[#E5F2FA] text-[#1D1D1F] flex flex-col items-center text-center group">
            {/* Top Copy & CTAs */}
            <div className="relative z-10 pt-10 sm:pt-13 px-6 flex flex-col items-center space-y-2 max-w-md">
              <div className="relative w-32 sm:w-36 h-8 sm:h-10">
                <Image
                  src="/apple-official/images/promo_logo_ipad_air_2x.png"
                  alt="iPad Air"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-[17px] sm:text-[19px] text-[#1D1D1F] font-normal tracking-tight">
                Agora com a potência do M4.
              </p>
              <div className="flex items-center justify-center gap-3 pt-1.5">
                <a
                  href="#categoria-ipad"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal rounded-full transition-colors"
                >
                  Saiba mais
                </a>
                <a
                  href={getProductWhatsAppUrl("iPad Air M4")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-transparent hover:bg-[#0071E3] text-[#0066CC] hover:text-white border border-[#0066CC] hover:border-[#0071E3] text-[14px] font-normal rounded-full transition-colors"
                >
                  Comprar
                </a>
              </div>
            </div>

            {/* Background Image */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
              <picture className="w-full h-full">
                <source
                  media="(max-width: 734px)"
                  srcSet="/apple-official/images/promo_ipad_air_m4_small_2x.jpg"
                />
                <img
                  src="/apple-official/images/promo_ipad_air_m4_2x.jpg"
                  alt="iPad Air M4"
                  className="w-full h-full object-cover object-bottom pointer-events-none select-none"
                />
              </picture>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────
              ROW 2 - TILE 4: Trade-In & Ofertas Apple (Exact Carrier/Trade-in Tile)
          ──────────────────────────────────────────────────────────────── */}
          <div className="relative h-[500px] sm:h-[580px] overflow-hidden bg-[#F5F5F7] text-[#1D1D1F] flex flex-col items-center text-center group">
            {/* Top Copy & CTAs */}
            <div className="relative z-10 pt-10 sm:pt-13 px-6 flex flex-col items-center space-y-2 max-w-md">
              <h3 className="text-[28px] sm:text-[36px] font-semibold leading-[1.1] tracking-[-0.005em] font-display text-[#1D1D1F]">
                Ofertas incríveis de<br />Upgrade na Mundo Apple
              </h3>
              <p className="text-[15px] sm:text-[17px] leading-[1.3] text-[#1D1D1F] font-normal max-w-sm">
                Use seu iPhone usado na troca por um novo ou receba o valor via PIX na hora.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Link
                  href="/troca"
                  className="px-5 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal rounded-full transition-colors"
                >
                  Simular troca
                </Link>
                <Link
                  href="/vender"
                  className="px-5 py-2 bg-transparent hover:bg-[#0071E3] text-[#0066CC] hover:text-white border border-[#0066CC] hover:border-[#0071E3] text-[14px] font-normal rounded-full transition-colors"
                >
                  Vender aparelho
                </Link>
              </div>
            </div>

            {/* Background Image (Official 5 iPhones Lineup) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
              <picture className="w-full h-full">
                <source
                  media="(max-width: 734px)"
                  srcSet="/apple-official/images/promo_carriers_small_2x.jpg"
                />
                <img
                  src="/apple-official/images/promo_carriers_2x.jpg"
                  alt="Ofertas de Upgrade e Trade-In Mundo Apple"
                  className="w-full h-full object-cover object-bottom pointer-events-none select-none"
                />
              </picture>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────
              ROW 3 - TILE 5: MacBook Pro M5 (Dark Theme)
          ──────────────────────────────────────────────────────────────── */}
          <div className="relative h-[500px] sm:h-[580px] overflow-hidden bg-black text-[#F5F5F7] flex flex-col items-center text-center group">
            <div className="relative z-10 pt-10 sm:pt-13 px-6 flex flex-col items-center space-y-2 max-w-md">
              <h3 className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.005em] font-display text-white">
                MacBook Pro
              </h3>
              <p className="text-[17px] sm:text-[19px] text-[#F5F5F7] font-normal tracking-tight">
                Agora com M5, M5 Pro e M5 Max.
              </p>
              <div className="flex items-center justify-center gap-3 pt-1.5">
                <a
                  href="#categoria-macbook"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal rounded-full transition-colors"
                >
                  Saiba mais
                </a>
                <a
                  href={getProductWhatsAppUrl("MacBook Pro M5")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-transparent hover:bg-[#0071E3] text-[#2997FF] hover:text-white border border-[#2997FF] hover:border-[#0071E3] text-[14px] font-normal rounded-full transition-colors"
                >
                  Comprar
                </a>
              </div>
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
              <img
                src="/apple-official/images/promo_macbook_pro.jpg"
                alt="MacBook Pro"
                className="w-full h-full object-cover object-bottom pointer-events-none select-none"
              />
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────
              ROW 3 - TILE 6: AirPods 5 (Full Bleed Official Apple Tile)
          ──────────────────────────────────────────────────────────────── */}
          <div className="relative h-[500px] sm:h-[580px] overflow-hidden group">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <img
                src="/apple-official/images/promo_airpods_5.jpg"
                alt="AirPods 5"
                className="w-full h-full object-cover object-center pointer-events-none select-none"
              />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-end h-full pb-10 sm:pb-12 text-center text-white px-6 space-y-2">
              <h3 className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.005em] font-display text-white">
                AirPods 5
              </h3>
              <p className="text-[15px] sm:text-[17px] text-zinc-100 font-normal max-w-xs">
                Descubra a magia do Cancelamento Ativo de Ruído.
              </p>
              <div className="flex items-center justify-center gap-3 pt-1.5">
                <a
                  href="#categoria-airpods"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal rounded-full transition-colors"
                >
                  Saiba mais
                </a>
                <a
                  href={getProductWhatsAppUrl("AirPods 5")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-transparent hover:bg-[#0071E3] text-white border border-white/80 hover:border-[#0071E3] text-[14px] font-normal rounded-full transition-colors"
                >
                  Comprar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
