"use client";

import Link from "next/link";
import { AppleHomeBanner } from "./AppleHomeBanner";
import { useLivePrice } from "@/components/products/LivePricesProvider";
import { storeConfig } from "@/data/storeConfig";
import { formatCurrency } from "@/utils/formatters";
import { createWhatsAppLink } from "@/utils/whatsapp";

export function AppleOfficialHeroSection({ duoPrice: initialDuoPrice = 0 }: { duoPrice?: number }) {
  const duoPrice = useLivePrice("iphone-duo", initialDuoPrice);
  const showPrices = Boolean(storeConfig.showPrices);
  return (
    <section aria-label="Destaques Mundo Apple" className="flex w-full flex-col gap-3 bg-white pt-0">
      <article className="apple-banner relative isolate flex h-[540px] flex-col items-center justify-end overflow-hidden bg-[#55112d] px-5 pb-10 text-center text-white sm:h-[650px] sm:pb-12 lg:h-[692px]" data-scroll-state="visible">
        <img src="/apple-official/home/holiday-large.jpg" alt="Produtos Apple para presentear, com laço branco e detalhes em vermelho e magenta" fetchPriority="high" className="animate-hero-image apple-banner-img absolute inset-0 -z-10 h-full w-full object-cover" />
        <h1 className="animate-hero-title font-display text-[36px] font-semibold leading-tight tracking-tight sm:text-[56px]">Presentes para amar</h1>
        <p className="animate-hero-subtitle mt-2 text-xl sm:text-[28px]">Encontre a escolha perfeita do Natal.</p>
        <Link href="#catalogo" className="animate-hero-cta mt-5 rounded-full bg-[#0071e3] px-6 py-3 text-base text-white transition-colors hover:bg-[#0077ed]">Ver catálogo</Link>
      </article>
      <AppleHomeBanner image="duo" title="iPhone Duo" subtitle="Alô. Olá." href="/iphone" hero
        availability={!showPrices}
        price={showPrices && duoPrice > 0 ? <p className="mt-2 text-lg font-semibold" data-testid="iphone-duo-price">A partir de {formatCurrency(duoPrice)} <span className="text-sm font-normal">à vista</span></p> : undefined}
        purchaseLabel={showPrices ? "Comprar" : "Consultar valor"}
        purchaseHref={createWhatsAppLink(`Olá! Gostaria de consultar o valor e a disponibilidade do iPhone Duo${showPrices && duoPrice > 0 ? ` a partir de ${formatCurrency(duoPrice)}` : ""}. Pode confirmar a capacidade e a cor disponíveis?`)} />
      <AppleHomeBanner image="proled" title="MacBook Pro" subtitle="Tela PROLED XDR" href="/macbook-pro/proled-xdr-display" dark hero availability purchaseLabel={showPrices ? "Ver preços" : "Consultar valor"} />
    </section>
  );
}
