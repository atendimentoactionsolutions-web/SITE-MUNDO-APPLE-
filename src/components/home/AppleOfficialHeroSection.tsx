"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Play, Pause } from "lucide-react";
import { createWhatsAppLink } from "@/utils/whatsapp";

export const AppleOfficialHeroSection: React.FC = () => {
  const [playingHero1, setPlayingHero1] = useState(true);
  const videoRef1 = useRef<HTMLVideoElement>(null);

  const toggleVideo1 = () => {
    if (!videoRef1.current) return;
    if (playingHero1) {
      videoRef1.current.pause();
      setPlayingHero1(false);
    } else {
      videoRef1.current.play();
      setPlayingHero1(true);
    }
  };

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
    <section className="w-full flex flex-col space-y-3 bg-white pt-20 sm:pt-24">
      {/* ──────────────────────────────────────────────────────────────────────────
          HERO 1: MacBook Pro com Tela PROLED XDR (Dark Theme - Apple Hero #1)
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[580px] sm:h-[650px] lg:h-[692px] bg-black text-[#F5F5F7] overflow-hidden flex flex-col items-center text-center group">
        {/* Top Copy & CTAs */}
        <div className="relative z-10 flex flex-col items-center px-4 max-w-3xl pt-10 sm:pt-14">
          <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-semibold leading-[1.07] tracking-[-0.005em] font-display text-white">
            MacBook Pro
          </h2>
          <p className="mt-1 sm:mt-1.5 text-[20px] sm:text-[24px] lg:text-[28px] font-normal leading-[1.14] text-[#F5F5F7] tracking-[0.007em]">
            Tela PROLED XDR
          </p>
          <p className="mt-1.5 text-[14px] sm:text-[16px] text-[#86868B] font-normal">
            Confira em breve a disponibilidade
          </p>

          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-5">
            <Link
              href="/macbook-pro/proled-xdr-display"
              className="inline-flex items-center justify-center min-w-[110px] sm:min-w-[125px] px-5 py-2 sm:px-6 sm:py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] sm:text-[17px] font-normal rounded-full transition-all duration-200"
            >
              Saiba mais
            </Link>
            <a
              href={proledWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-w-[110px] sm:min-w-[125px] px-5 py-2 sm:px-6 sm:py-2.5 bg-transparent hover:bg-[#0071E3] text-[#2997FF] hover:text-white border border-[#2997FF] hover:border-[#0071E3] text-[14px] sm:text-[17px] font-normal rounded-full transition-all duration-200"
            >
              Ver preços
            </a>
          </div>
        </div>

        {/* Media Background: Official Apple PROLED XDR Video / Picture */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-end">
          <picture className="w-full h-full flex justify-center items-end">
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
      <div className="relative w-full h-[580px] sm:h-[650px] lg:h-[692px] bg-black text-[#F5F5F7] overflow-hidden flex flex-col items-center text-center group">
        {/* Top Copy & CTAs */}
        <div className="relative z-10 flex flex-col items-center px-4 max-w-3xl pt-10 sm:pt-14">
          <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-semibold leading-[1.07] tracking-[-0.005em] font-display text-white">
            MacBook Pro
          </h2>
          <p className="mt-1 sm:mt-1.5 text-[20px] sm:text-[24px] lg:text-[28px] font-normal leading-[1.14] text-[#F5F5F7] tracking-[0.007em]">
            Modelo de 14 polegadas agora com M6.
          </p>
          <p className="mt-1.5 text-[14px] sm:text-[16px] text-[#86868B] font-normal">
            Confira em breve a disponibilidade
          </p>

          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-5">
            <Link
              href="/macbook-pro/proled-xdr-display"
              className="inline-flex items-center justify-center min-w-[110px] sm:min-w-[125px] px-5 py-2 sm:px-6 sm:py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] sm:text-[17px] font-normal rounded-full transition-all duration-200"
            >
              Saiba mais
            </Link>
            <a
              href={m6WhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-w-[110px] sm:min-w-[125px] px-5 py-2 sm:px-6 sm:py-2.5 bg-transparent hover:bg-[#0071E3] text-[#2997FF] hover:text-white border border-[#2997FF] hover:border-[#0071E3] text-[14px] sm:text-[17px] font-normal rounded-full transition-all duration-200"
            >
              Comprar
            </a>
          </div>
        </div>

        {/* Media Background: Official Apple Opening Laptop with Neon M6 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-end">
          <picture className="w-full h-full flex justify-center items-end">
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
      <div className="relative w-full h-[580px] sm:h-[650px] lg:h-[692px] bg-[#F5F5F7] text-[#1D1D1F] overflow-hidden flex flex-col items-center text-center group">
        {/* Top Copy & CTAs */}
        <div className="relative z-10 flex flex-col items-center px-4 max-w-3xl pt-10 sm:pt-14">
          <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-semibold leading-[1.07] tracking-[-0.005em] font-display text-[#1D1D1F]">
            iMac
          </h2>
          <p className="mt-1 sm:mt-1.5 text-[20px] sm:text-[26px] lg:text-[30px] font-normal leading-[1.14] text-[#1D1D1F] tracking-[0.007em] flex items-center justify-center flex-wrap gap-x-1">
            <span>Compl</span>
            <span className="inline-flex font-semibold tracking-widest text-[#0071E3]">
              <span className="text-[#34C759]">l</span>
              <span className="text-[#FF9500]">l</span>
              <span className="text-[#FF2D55]">l</span>
              <span className="text-[#AF52DE]">l</span>
              <span className="text-[#007AFF]">l</span>
            </span>
            <span>etão.</span>
            <span className="w-full text-[18px] sm:text-[22px] text-[#1D1D1F] font-normal">
              E de chip novo.
            </span>
          </p>
          <p className="mt-1.5 text-[14px] sm:text-[16px] text-[#6E6E73] font-normal">
            Confira em breve a disponibilidade
          </p>

          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-5">
            <a
              href="#categoria-mac"
              className="inline-flex items-center justify-center min-w-[110px] sm:min-w-[125px] px-5 py-2 sm:px-6 sm:py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] sm:text-[17px] font-normal rounded-full transition-all duration-200"
            >
              Saiba mais
            </a>
            <a
              href={imacWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-w-[110px] sm:min-w-[125px] px-5 py-2 sm:px-6 sm:py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] sm:text-[17px] font-normal rounded-full transition-all duration-200"
            >
              Ver preços
            </a>
          </div>
        </div>

        {/* Media Background: Official Apple Fan of 7 Colored iMacs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-end">
          <picture className="w-full h-full flex justify-center items-end">
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
