"use client";

import React from "react";
import Link from "next/link";
import { createWhatsAppLink } from "@/utils/whatsapp";

export const AppleOfficialHeroSection: React.FC = () => {
  const duoWhatsAppUrl = createWhatsAppLink(
    "Olá! Vim pelo site da Mundo Apple Delivery e quero encomendar/comprar o novo *iPhone Duo*. Podem me passar os detalhes?"
  );

  const proWhatsAppUrl = createWhatsAppLink(
    "Olá! Vim pelo site da Mundo Apple Delivery e quero comprar o *iPhone 18 Pro*. Como funciona o pagamento e entrega expressa em SP?"
  );

  return (
    <section className="w-full flex flex-col space-y-3 bg-white pt-16 sm:pt-20">
      {/* ──────────────────────────────────────────────────────────────────────────
          HERO 1: iPhone Duo (Light Theme - Exact Apple.com Hero #1)
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[540px] sm:h-[650px] lg:h-[692px] bg-[#F5F5F7] text-[#1D1D1F] overflow-hidden flex flex-col items-center text-center group">
        {/* Top Copy & CTAs */}
        <div className="relative z-10 flex flex-col items-center px-4 max-w-3xl pt-11 sm:pt-14">
          <h2 className="text-[32px] sm:text-[48px] lg:text-[56px] font-semibold leading-[1.07] tracking-[-0.005em] font-display text-[#1D1D1F]">
            iPhone Duo
          </h2>
          <p className="mt-1 sm:mt-1.5 text-[19px] sm:text-[24px] lg:text-[28px] font-normal leading-[1.14] text-[#1D1D1F] tracking-[0.007em]">
            Alô. Olá.
          </p>
          <p className="mt-1.5 text-[14px] sm:text-[17px] text-[#6E6E73] font-normal">
            Disponível a partir de 23/10
          </p>

          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-5">
            <a
              href="#catalogo"
              className="inline-flex items-center justify-center min-w-[110px] sm:min-w-[130px] px-5 py-2 sm:px-6 sm:py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] sm:text-[17px] font-normal rounded-full transition-all duration-200"
            >
              Saiba mais
            </a>
            <a
              href={duoWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-w-[110px] sm:min-w-[130px] px-5 py-2 sm:px-6 sm:py-2.5 bg-transparent hover:bg-[#0071E3] text-[#0066CC] hover:text-white border border-[#0066CC] hover:border-[#0071E3] text-[14px] sm:text-[17px] font-normal rounded-full transition-all duration-200"
            >
              Reservar
            </a>
          </div>
        </div>

        {/* Responsive Official Apple Background Image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-end">
          <picture className="w-full h-full flex justify-center items-end">
            <source
              media="(max-width: 734px)"
              srcSet="/apple-official/images/hero_iphone_duo_small_2x.jpg"
            />
            <source
              media="(min-width: 735px)"
              srcSet="/apple-official/images/hero_iphone_duo_2x.jpg"
            />
            <img
              src="/apple-official/images/hero_iphone_duo_2x.jpg"
              alt="iPhone Duo — Alô. Olá."
              className="w-full h-full object-cover object-bottom pointer-events-none select-none"
            />
          </picture>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          HERO 2: iPhone 18 Pro (Dark OLED Theme - Exact Apple.com Hero #2)
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[540px] sm:h-[650px] lg:h-[692px] bg-black text-[#F5F5F7] overflow-hidden flex flex-col items-center text-center group">
        {/* Top Copy & CTAs */}
        <div className="relative z-10 flex flex-col items-center px-4 max-w-3xl pt-11 sm:pt-14">
          <h2 className="text-[32px] sm:text-[48px] lg:text-[56px] font-semibold leading-[1.07] tracking-[-0.005em] font-display text-[#F5F5F7]">
            iPhone 18 Pro
          </h2>
          <p className="mt-1 sm:mt-1.5 text-[19px] sm:text-[24px] lg:text-[28px] font-normal leading-[1.14] text-[#F5F5F7] tracking-[0.007em]">
            Muito mais Pro.
          </p>

          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-5">
            <Link
              href="/iphone-18-pro"
              className="inline-flex items-center justify-center min-w-[110px] sm:min-w-[130px] px-5 py-2 sm:px-6 sm:py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] sm:text-[17px] font-normal rounded-full transition-all duration-200"
            >
              Saiba mais
            </Link>
            <a
              href={proWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-w-[110px] sm:min-w-[130px] px-5 py-2 sm:px-6 sm:py-2.5 bg-transparent hover:bg-[#0071E3] text-[#2997FF] hover:text-white border border-[#2997FF] hover:border-[#0071E3] text-[14px] sm:text-[17px] font-normal rounded-full transition-all duration-200"
            >
              Comprar
            </a>
          </div>
        </div>

        {/* Responsive Official Apple Background Image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-end">
          <picture className="w-full h-full flex justify-center items-end">
            <source
              media="(max-width: 734px)"
              srcSet="/apple-official/images/hero_iphone_18_pro_small_2x.jpg"
            />
            <source
              media="(min-width: 735px)"
              srcSet="/apple-official/images/hero_iphone_18_pro_2x.jpg"
            />
            <img
              src="/apple-official/images/hero_iphone_18_pro_2x.jpg"
              alt="iPhone 18 Pro — Muito mais Pro"
              className="w-full h-full object-cover object-bottom pointer-events-none select-none"
            />
          </picture>
        </div>
      </div>
    </section>
  );
};
