import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, RefreshCw, ShieldCheck, CreditCard, Store } from "lucide-react";
import { Container } from "@/components/ui/Container";

export const Hero: React.FC = () => {
  return (
    <section className="bg-white pt-20 sm:pt-24 pb-10 sm:pb-14">
      <Container size="large">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <p className="mb-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[#0071E3]">
              Mundo Apple Delivery · Santa Ifigênia
            </p>
            <h1 className="mx-auto max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#1D1D1F] font-display sm:text-5xl lg:mx-0 lg:text-6xl">
              Seu próximo Apple começa com confiança.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#6E6E73] sm:text-lg lg:mx-0">
              Produtos novos e lacrados com 1 ano de garantia oficial Apple. Avalie seu usado e receba via PIX ou use o valor no seu upgrade.
            </p>

            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
              <a
                href="#catalogo"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0071E3] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#0077ED] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
              >
                Explorar produtos
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/vender"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#D2D2D7] bg-white px-7 text-sm font-semibold text-[#1D1D1F] transition-colors hover:bg-[#F5F5F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
              >
                Avaliar meu aparelho
              </Link>
              <Link
                href="/troca"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-[#0071E3] transition-colors hover:text-[#005BB5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
              >
                <RefreshCw className="h-4 w-4" />
                Fazer upgrade
              </Link>
            </div>
          </div>

          <div className="relative min-h-[280px] overflow-hidden rounded-[28px] bg-[#F5F5F7] sm:min-h-[400px] lg:min-h-[460px]">
            <Image
              src="/images/hero/hero-main.jpg"
              alt="Fachada da loja Mundo Apple Delivery na Santa Ifigênia"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-x-5 gap-y-6 border-t border-[#D2D2D7]/70 pt-7 sm:mt-12 sm:grid-cols-4 sm:gap-6">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0071E3]" />
            <div>
              <p className="text-sm font-semibold leading-tight text-[#1D1D1F]">Novos e lacrados</p>
              <p className="mt-1 text-xs leading-tight text-[#86868B]">1 ano de garantia Apple</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Zap className="mt-0.5 h-5 w-5 shrink-0 fill-emerald-600 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold leading-tight text-[#1D1D1F]">PIX na hora</p>
              <p className="mt-1 text-xs leading-tight text-[#86868B]">Na venda do seu usado</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-[#0071E3]" />
            <div>
              <p className="text-sm font-semibold leading-tight text-[#1D1D1F]">Até 18x no cartão</p>
              <p className="mt-1 text-xs leading-tight text-[#86868B]">Consulte as condições</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Store className="mt-0.5 h-5 w-5 shrink-0 text-[#0071E3]" />
            <div>
              <p className="text-sm font-semibold leading-tight text-[#1D1D1F]">Loja física em SP</p>
              <p className="mt-1 text-xs leading-tight text-[#86868B]">Retirada ou delivery</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
