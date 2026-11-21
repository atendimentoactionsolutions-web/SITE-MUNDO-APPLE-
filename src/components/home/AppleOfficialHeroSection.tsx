"use client";

import Link from "next/link";
import { AppleHomeBanner } from "./AppleHomeBanner";
import { useLivePrice } from "@/components/products/LivePricesProvider";
import { formatCurrency } from "@/utils/formatters";
import { createWhatsAppLink } from "@/utils/whatsapp";

export function AppleOfficialHeroSection({ duoPrice: initialDuoPrice = 0 }: { duoPrice?: number }) {
  const duoPrice = useLivePrice("iphone-duo", initialDuoPrice);
  return (
    <section aria-label="Destaques Mundo Apple" className="flex w-full flex-col gap-3 bg-white pt-11 sm:pt-12">
      <article className="relative isolate flex h-[540px] flex-col items-center justify-end overflow-hidden bg-[#55112d] px-5 pb-10 text-center text-white sm:h-[650px] sm:pb-12 lg:h-[692px]">
        <img src="/apple-official/home/holiday-large.jpg" alt="Produtos Apple para presentear, com laço branco e detalhes em vermelho e magenta" fetchPriority="high" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <h1 className="font-display text-[36px] font-semibold leading-tight tracking-tight sm:text-[56px]">Presentes para amar</h1>
        <p className="mt-2 text-xl sm:text-[28px]">Encontre a escolha perfeita do Natal.</p>
        <Link href="#catalogo" className="mt-5 rounded-full bg-[#0071e3] px-6 py-3 text-base text-white transition-colors hover:bg-[#0077ed]">Comprar presentes</Link>
      </article>
      <AppleHomeBanner image="duo" title="iPhone Duo" subtitle="Alô. Olá." href="/iphone" hero
        price={duoPrice > 0 ? <p className="mt-2 text-lg font-semibold" data-testid="iphone-duo-price">A partir de {formatCurrency(duoPrice)} <span className="text-sm font-normal">à vista</span></p> : undefined}
        purchaseHref={createWhatsAppLink(`Olá! Quero comprar o iPhone Duo${duoPrice > 0 ? ` a partir de ${formatCurrency(duoPrice)}` : ""}. Pode confirmar a capacidade e a cor disponíveis?`)} />
      <AppleHomeBanner image="proled" title="MacBook Pro" subtitle="Tela PROLED XDR" href="/macbook-pro/proled-xdr-display" dark hero availability purchaseLabel="Ver preços" />
    </section>
  );
}
