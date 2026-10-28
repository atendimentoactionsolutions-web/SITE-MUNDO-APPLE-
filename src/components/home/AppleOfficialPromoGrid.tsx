"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { createWhatsAppLink } from "@/utils/whatsapp";

export const AppleOfficialPromoGrid: React.FC = () => {
  const getProductWhatsAppUrl = (name: string) => {
    return createWhatsAppLink(
      `Olá! Vim pelo site da Mundo Apple Delivery e quero saber valores e disponibilidade do *${name}*. Pode me atender?`
    );
  };

  return (
    <section className="w-full bg-white py-1.5 px-0 sm:px-3">
      <div className="w-full mx-auto">
        {/* Apple Official 2-Column Promo Grid (12px gap) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* ────────────────────────────────────────────────────────────────
              CARD 1: iPhone Duo (Light Theme)
          ──────────────────────────────────────────────────────────────── */}
          <div className="relative h-[480px] sm:h-[580px] overflow-hidden bg-[#F5F5F7] text-[#1D1D1F] flex flex-col items-center text-center group">
            {/* Top Copy & CTAs */}
            <div className="relative z-10 pt-8 sm:pt-12 px-6 flex flex-col items-center">
              <h3 className="text-[28px] sm:text-[40px] font-semibold tracking-[-0.005em] font-display text-[#1D1D1F]">
                iPhone Duo
              </h3>
              <p className="mt-1 text-[16px] sm:text-[19px] text-[#1D1D1F] font-normal tracking-tight">
                Alô. Olá.
              </p>
              <div className="flex items-center justify-center gap-3 pt-3">
                <a
                  href="#categoria-iphone"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal rounded-full transition-colors shadow-sm"
                >
                  Saiba mais
                </a>
                <a
                  href={getProductWhatsAppUrl("iPhone Duo")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-transparent hover:bg-[#0071E3] text-[#0066CC] hover:text-white border border-[#0066CC] hover:border-[#0071E3] text-[14px] font-normal rounded-full transition-colors"
                >
                  Comprar
                </a>
              </div>
            </div>

            {/* Background Image: Duo in Hands (Responsive) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
              <picture className="w-full h-full">
                <source
                  media="(max-width: 734px)"
                  srcSet="/apple-official/images/promo_iphone_duo_announce__cc65fv056p8i_small_2x.jpg"
                />
                <source
                  media="(min-width: 735px)"
                  srcSet="/apple-official/images/promo_iphone_duo_announce__cc65fv056p8i_large_2x.jpg"
                />
                <img
                  src="/apple-official/images/promo_iphone_duo_announce__cc65fv056p8i_large.jpg"
                  alt="iPhone Duo"
                  className="w-full h-full object-cover object-bottom pointer-events-none select-none"
                />
              </picture>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────
              CARD 2: iPhone 18 Pro (Dark Theme)
          ──────────────────────────────────────────────────────────────── */}
          <div className="relative h-[480px] sm:h-[580px] overflow-hidden bg-black text-[#F5F5F7] flex flex-col items-center text-center group">
            {/* Top Copy & CTAs */}
            <div className="relative z-10 pt-8 sm:pt-12 px-6 flex flex-col items-center">
              <h3 className="text-[28px] sm:text-[40px] font-semibold tracking-[-0.005em] font-display text-white">
                iPhone 18 Pro
              </h3>
              <p className="mt-1 text-[16px] sm:text-[19px] text-[#F5F5F7] font-normal tracking-tight">
                Muito mais Pro.
              </p>
              <div className="flex items-center justify-center gap-3 pt-3">
                <Link
                  href="/iphone-18-pro"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal rounded-full transition-colors shadow-sm"
                >
                  Saiba mais
                </Link>
                <a
                  href={getProductWhatsAppUrl("iPhone 18 Pro")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-transparent hover:bg-[#0071E3] text-[#2997FF] hover:text-white border border-[#2997FF] hover:border-[#0071E3] text-[14px] font-normal rounded-full transition-colors"
                >
                  Comprar
                </a>
              </div>
            </div>

            {/* Background Image: iPhone 18 Pro (Responsive) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
              <picture className="w-full h-full">
                <source
                  media="(max-width: 734px)"
                  srcSet="/apple-official/images/promo_iphone_18_pro__9nn5m4mt2bmy_small_2x.jpg"
                />
                <source
                  media="(min-width: 735px)"
                  srcSet="/apple-official/images/promo_iphone_18_pro__9nn5m4mt2bmy_large_2x.jpg"
                />
                <img
                  src="/apple-official/images/promo_iphone_18_pro__9nn5m4mt2bmy_large.jpg"
                  alt="iPhone 18 Pro"
                  className="w-full h-full object-cover object-bottom pointer-events-none select-none"
                />
              </picture>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────
              CARD 3: Apple Watch Series 12 (Dark Theme - Top Logo & Bottom Copy)
          ──────────────────────────────────────────────────────────────── */}
          <div className="relative h-[480px] sm:h-[580px] overflow-hidden bg-black text-[#F5F5F7] flex flex-col justify-between items-center text-center group">
            {/* Top Logo */}
            <div className="relative z-10 pt-8 sm:pt-11 px-6 flex flex-col items-center">
              <div className="relative w-40 sm:w-52 h-7 sm:h-10">
                <Image
                  src="/apple-official/images/promo_logo_apple_watch_series_12__eck6698frlqq_large.png"
                  alt="Apple Watch Series 12"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Background Image: Watch Front & Back (Responsive) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
              <picture className="w-full h-full">
                <source
                  media="(max-width: 734px)"
                  srcSet="/apple-official/images/promo_apple_watch_series_12__gnlprtt8526a_small_2x.jpg"
                />
                <source
                  media="(min-width: 735px)"
                  srcSet="/apple-official/images/promo_apple_watch_series_12__gnlprtt8526a_large_2x.jpg"
                />
                <img
                  src="/apple-official/images/promo_apple_watch_series_12__gnlprtt8526a_large.jpg"
                  alt="Apple Watch Series 12"
                  className="w-full h-full object-cover object-center pointer-events-none select-none"
                />
              </picture>
            </div>

            {/* Bottom Copy & CTAs */}
            <div className="relative z-10 pb-7 sm:pb-10 px-6 flex flex-col items-center space-y-2.5 max-w-xs sm:max-w-sm">
              <p className="text-[14px] sm:text-[17px] leading-[1.25] text-[#F5F5F7] font-normal tracking-tight">
                Com a medição de frequência cardíaca mais precisa em um wearable¹.
              </p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <a
                  href="#categoria-watch"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal rounded-full transition-colors shadow-sm"
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
              CARD 4: iPad mini (Light Theme)
          ──────────────────────────────────────────────────────────────── */}
          <div className="relative h-[480px] sm:h-[580px] overflow-hidden bg-[#F5F5F7] text-[#1D1D1F] flex flex-col items-center text-center group">
            {/* Top Logo, Copy & CTAs */}
            <div className="relative z-10 pt-8 sm:pt-12 px-6 flex flex-col items-center space-y-1 max-w-md">
              <div className="relative w-24 sm:w-32 h-7 sm:h-9">
                <Image
                  src="/apple-official/images/promo_logo_ipad_mini_a20__dcndmemvplea_large.png"
                  alt="iPad mini"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-[15px] sm:text-[19px] text-[#1D1D1F] font-normal tracking-tight">
                O mini que é o máximo.
              </p>
              <p className="text-[12px] sm:text-[14px] text-[#6E6E73] font-normal">
                Confira em breve a disponibilidade
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <a
                  href="#categoria-ipad"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal rounded-full transition-colors shadow-sm"
                >
                  Saiba mais
                </a>
                <a
                  href={getProductWhatsAppUrl("iPad mini")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-transparent hover:bg-[#0071E3] text-[#0066CC] hover:text-white border border-[#0066CC] hover:border-[#0071E3] text-[14px] font-normal rounded-full transition-colors"
                >
                  Ver preços
                </a>
              </div>
            </div>

            {/* Background Image: Hand holding blue iPad mini (Responsive) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
              <picture className="w-full h-full">
                <source
                  media="(max-width: 734px)"
                  srcSet="/apple-official/images/promo_ipad_mini_a20_announce__efc6vmmxg58i_small_2x.jpg"
                />
                <source
                  media="(min-width: 735px)"
                  srcSet="/apple-official/images/promo_ipad_mini_a20_announce__efc6vmmxg58i_large_2x.jpg"
                />
                <img
                  src="/apple-official/images/promo_ipad_mini_a20_announce__efc6vmmxg58i_large.jpg"
                  alt="iPad mini"
                  className="w-full h-full object-cover object-bottom pointer-events-none select-none"
                />
              </picture>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────
              CARD 5: Apple TV 4K (Light Theme)
          ──────────────────────────────────────────────────────────────── */}
          <div className="relative h-[480px] sm:h-[580px] overflow-hidden bg-[#F5F5F7] text-[#1D1D1F] flex flex-col items-center text-center group">
            {/* Top Logo, Copy & CTAs */}
            <div className="relative z-10 pt-8 sm:pt-12 px-6 flex flex-col items-center space-y-1 max-w-md">
              <div className="relative w-24 sm:w-32 h-7 sm:h-9">
                <Image
                  src="/apple-official/images/promo_logo_apple_tv_4k__dmr11vmopro2_large.png"
                  alt="Apple TV 4K"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-[15px] sm:text-[19px] text-[#1D1D1F] font-normal tracking-tight">
                Imagem incrível. Simplicidade incrível.
              </p>
              <p className="text-[12px] sm:text-[14px] text-[#6E6E73] font-normal">
                Confira em breve a disponibilidade
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <a
                  href="#categoria-acessorios"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal rounded-full transition-colors shadow-sm"
                >
                  Saiba mais
                </a>
                <a
                  href={getProductWhatsAppUrl("Apple TV 4K")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-transparent hover:bg-[#0071E3] text-[#0066CC] hover:text-white border border-[#0066CC] hover:border-[#0071E3] text-[14px] font-normal rounded-full transition-colors"
                >
                  Ver preços
                </a>
              </div>
            </div>

            {/* Background Image: Apple TV 4K + Siri Remote (Responsive) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
              <picture className="w-full h-full">
                <source
                  media="(max-width: 734px)"
                  srcSet="/apple-official/images/promo_apple_tv_4k_preorder__d4z5g4tm3qoi_small_2x.jpg"
                />
                <source
                  media="(min-width: 735px)"
                  srcSet="/apple-official/images/promo_apple_tv_4k_preorder__d4z5g4tm3qoi_large_2x.jpg"
                />
                <img
                  src="/apple-official/images/promo_apple_tv_4k_preorder__d4z5g4tm3qoi_large.jpg"
                  alt="Apple TV 4K"
                  className="w-full h-full object-cover object-bottom pointer-events-none select-none"
                />
              </picture>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────
              CARD 6: AirPods Pro 3 (Light Theme)
          ──────────────────────────────────────────────────────────────── */}
          <div className="relative h-[480px] sm:h-[580px] overflow-hidden bg-[#F5F5F7] text-[#1D1D1F] flex flex-col items-center text-center group">
            {/* Top Copy & CTAs */}
            <div className="relative z-10 pt-8 sm:pt-12 px-6 flex flex-col items-center space-y-1 max-w-sm sm:max-w-md">
              <h3 className="text-[28px] sm:text-[40px] font-semibold tracking-[-0.005em] font-display text-[#1D1D1F]">
                AirPods Pro 3
              </h3>
              <p className="text-[14px] sm:text-[17px] leading-[1.25] text-[#1D1D1F] font-normal tracking-tight">
                O melhor Cancelamento Ativo de Ruído do mundo em fones intra-auriculares².
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <a
                  href="#categoria-airpods"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal rounded-full transition-colors shadow-sm"
                >
                  Saiba mais
                </a>
                <a
                  href={getProductWhatsAppUrl("AirPods Pro 3")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 bg-transparent hover:bg-[#0071E3] text-[#0066CC] hover:text-white border border-[#0066CC] hover:border-[#0071E3] text-[14px] font-normal rounded-full transition-colors"
                >
                  Comprar
                </a>
              </div>
            </div>

            {/* Background Image: AirPods Pro 3 pair (Responsive) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
              <picture className="w-full h-full">
                <source
                  media="(max-width: 734px)"
                  srcSet="/apple-official/images/promo_airpods_pro_3__e4755qofhnyq_small_2x.jpg"
                />
                <source
                  media="(min-width: 735px)"
                  srcSet="/apple-official/images/promo_airpods_pro_3__e4755qofhnyq_large_2x.jpg"
                />
                <img
                  src="/apple-official/images/promo_airpods_pro_3__e4755qofhnyq_large.jpg"
                  alt="AirPods Pro 3"
                  className="w-full h-full object-cover object-bottom pointer-events-none select-none"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
