"use client";

import React from "react";
import Link from "next/link";
import { createWhatsAppLink } from "@/utils/whatsapp";

export const AppleOfficialHeroSection: React.FC = () => {
  const proledWhatsAppUrl = createWhatsAppLink(
    "Olá! Vim pelo site da Mundo Apple Delivery e quero consultar valores e disponibilidade do novo *MacBook Pro com Tela PROLED XDR*. Podem me passar mais detalhes?"
  );

  const m6WhatsAppUrl = createWhatsAppLink(
    "Olá! Vim pelo site da Mundo Apple Delivery e quero encomendar o novo *MacBook Pro de 14 polegadas com M6*. Como funciona a pronta entrega?"
  );

  const imacWhatsAppUrl = createWhatsAppLink(
    "Olá! Vim pelo site da Mundo Apple Delivery e quero consultar valores e cores disponíveis do novo *iMac*. Podem me enviar o catálogo?"
  );

  return (
    <section className="w-full flex flex-col space-y-3 bg-white pt-11 sm:pt-12">
      {/* ──────────────────────────────────────────────────────────────────────────
          HERO 1: MacBook Pro com Tela PROLED XDR (Dark Theme - Apple Hero #1)
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[520px] sm:h-[650px] lg:h-[692px] bg-black text-[#F5F5F7] overflow-hidden flex flex-col items-center text-center group">
        {/* Top Copy & CTAs */}
        <div className="relative z-10 flex flex-col items-center px-4 max-w-3xl pt-8 sm:pt-14">
          <h2 className="text-[32px] sm:text-[48px] lg:text-[56px] font-semibold leading-[1.07] tracking-[-0.005em] font-display text-white">
            MacBook Pro
          </h2>
          <p className="mt-1 sm:mt-1.5 text-[18px] sm:text-[24px] lg:text-[28px] font-normal leading-[1.14] text-[#F5F5F7] tracking-[0.007em]">
            Tela PROLED XDR
          </p>
          <p className="mt-1 text-[13px] sm:text-[16px] text-[#86868B] font-normal">
            Confira em breve a disponibilidade
          </p>

          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-5">
            <Link
              href="/macbook-pro/proled-xdr-display"
              className="inline-flex items-center justify-center min-w-[105px] sm:min-w-[125px] px-4 py-2 sm:px-6 sm:py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] sm:text-[17px] font-normal rounded-full transition-all duration-200 shadow-sm"
            >
              Saiba mais
            </Link>
            <a
              href={proledWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-w-[105px] sm:min-w-[125px] px-4 py-2 sm:px-6 sm:py-2.5 bg-transparent hover:bg-[#0071E3] text-[#2997FF] hover:text-white border border-[#2997FF] hover:border-[#0071E3] text-[14px] sm:text-[17px] font-normal rounded-full transition-all duration-200"
            >
              Ver preços
            </a>
          </div>
        </div>

        {/* Media Background: Responsive Mobile & Desktop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-end">
          <picture className="w-full h-full flex justify-center items-end">
            <source
              media="(max-width: 734px)"
              srcSet="/apple-official/images/hero_macbook_pro_proled_xdr_animated_preorder__c7dgzbk10sqe_small_2x.jpg"
            />
            <source
              media="(min-width: 735px)"
              srcSet="/apple-official/images/hero_macbook_pro_proled_xdr_animated_preorder__c7dgzbk10sqe_large_2x.jpg"
            />
            <img
              src="/apple-official/images/hero_macbook_pro_proled_xdr_animated_preorder__c7dgzbk10sqe_large.jpg"
              alt="MacBook Pro Tela PROLED XDR"
              className="w-full h-full object-cover object-bottom pointer-events-none select-none"
            />
          </picture>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          HERO 2: MacBook Pro 14" M6 (Dark OLED Theme - Apple Hero #2)
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[520px] sm:h-[650px] lg:h-[692px] bg-black text-[#F5F5F7] overflow-hidden flex flex-col items-center text-center group">
        {/* Top Copy & CTAs */}
        <div className="relative z-10 flex flex-col items-center px-4 max-w-3xl pt-8 sm:pt-14">
          <h2 className="text-[32px] sm:text-[48px] lg:text-[56px] font-semibold leading-[1.07] tracking-[-0.005em] font-display text-white">
            MacBook Pro
          </h2>
          <p className="mt-1 sm:mt-1.5 text-[18px] sm:text-[24px] lg:text-[28px] font-normal leading-[1.14] text-[#F5F5F7] tracking-[0.007em]">
            Modelo de 14 polegadas agora com M6.
          </p>
          <p className="mt-1 text-[13px] sm:text-[16px] text-[#86868B] font-normal">
            Confira em breve a disponibilidade
          </p>

          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-5">
            <Link
              href="/macbook-pro/proled-xdr-display"
              className="inline-flex items-center justify-center min-w-[105px] sm:min-w-[125px] px-4 py-2 sm:px-6 sm:py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] sm:text-[17px] font-normal rounded-full transition-all duration-200 shadow-sm"
            >
              Saiba mais
            </Link>
            <a
              href={m6WhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-w-[105px] sm:min-w-[125px] px-4 py-2 sm:px-6 sm:py-2.5 bg-transparent hover:bg-[#0071E3] text-[#2997FF] hover:text-white border border-[#2997FF] hover:border-[#0071E3] text-[14px] sm:text-[17px] font-normal rounded-full transition-all duration-200"
            >
              Comprar
            </a>
          </div>
        </div>

        {/* Media Background: Responsive Mobile & Desktop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-end">
          <picture className="w-full h-full flex justify-center items-end">
            <source
              media="(max-width: 734px)"
              srcSet="/apple-official/images/hero_macbook_pro_m6_announce__b04jni815ck2_small_2x.jpg"
            />
            <source
              media="(min-width: 735px)"
              srcSet="/apple-official/images/hero_macbook_pro_m6_announce__b04jni815ck2_large_2x.jpg"
            />
            <img
              src="/apple-official/images/hero_macbook_pro_m6_announce__b04jni815ck2_large.jpg"
              alt="MacBook Pro de 14 polegadas com M6"
              className="w-full h-full object-cover object-bottom pointer-events-none select-none"
            />
          </picture>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          HERO 3: iMac (Light Theme - Apple Hero #3)
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[520px] sm:h-[650px] lg:h-[692px] bg-[#F5F5F7] text-[#1D1D1F] overflow-hidden flex flex-col items-center text-center group">
        {/* Top Copy & CTAs */}
        <div className="relative z-10 flex flex-col items-center px-4 max-w-3xl pt-8 sm:pt-14">
          <h2 className="text-[32px] sm:text-[48px] lg:text-[56px] font-semibold leading-[1.07] tracking-[-0.005em] font-display text-[#1D1D1F]">
            iMac
          </h2>
          <p className="mt-1 sm:mt-1.5 text-[18px] sm:text-[26px] lg:text-[30px] font-normal leading-[1.14] text-[#1D1D1F] tracking-[0.007em] flex items-center justify-center flex-wrap gap-x-1">
            <span>Compl</span>
            <span className="inline-flex font-semibold tracking-widest text-[#0071E3]">
              <span className="text-[#34C759]">l</span>
              <span className="text-[#FF9500]">l</span>
              <span className="text-[#FF2D55]">l</span>
              <span className="text-[#AF52DE]">l</span>
              <span className="text-[#007AFF]">l</span>
            </span>
            <span>etão.</span>
            <span className="w-full text-[16px] sm:text-[22px] text-[#1D1D1F] font-normal">
              E de chip novo.
            </span>
          </p>
          <p className="mt-1 text-[13px] sm:text-[16px] text-[#6E6E73] font-normal">
            Confira em breve a disponibilidade
          </p>

          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-5">
            <a
              href="#categoria-mac"
              className="inline-flex items-center justify-center min-w-[105px] sm:min-w-[125px] px-4 py-2 sm:px-6 sm:py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] sm:text-[17px] font-normal rounded-full transition-all duration-200 shadow-sm"
            >
              Saiba mais
            </a>
            <a
              href={imacWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-w-[105px] sm:min-w-[125px] px-4 py-2 sm:px-6 sm:py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] sm:text-[17px] font-normal rounded-full transition-all duration-200 shadow-sm"
            >
              Ver preços
            </a>
          </div>
        </div>

        {/* Media Background: Responsive Mobile & Desktop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-end">
          <picture className="w-full h-full flex justify-center items-end">
            <source
              media="(max-width: 734px)"
              srcSet="/apple-official/images/hero_imac_m6_announce__bboowaq6op6q_small_2x.jpg"
            />
            <source
              media="(min-width: 735px)"
              srcSet="/apple-official/images/hero_imac_m6_announce__bboowaq6op6q_large_2x.jpg"
            />
            <img
              src="/apple-official/images/hero_imac_m6_announce__bboowaq6op6q_large_2x.jpg"
              alt="iMac — Complllllletão. E de chip novo."
              className="w-full h-full object-cover object-bottom pointer-events-none select-none"
            />
          </picture>
        </div>
      </div>
    </section>
  );
};
