import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { RefreshCw, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export const TradeInBanner: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <Container size="large">
        <div className="relative w-full rounded-3xl sm:rounded-[36px] overflow-hidden bg-[#F5F5F7] text-[#0F172A] p-8 sm:p-12 lg:p-16 border border-[#E5E7EB] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Content (Span 7) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-bold uppercase tracking-wider text-[#0071E3] shadow-sm">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Trade-in & Upgrade de iPhone</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-[#0F172A] leading-[1.12]">
                Aceitamos seu iPhone usado <br className="hidden sm:inline" />
                como parte do pagamento
              </h2>

              <p className="text-sm sm:text-base text-[#475569] font-normal max-w-xl leading-relaxed">
                Você avalia o seu aparelho usado e usamos o valor como desconto direto na compra de um seminovo ou lacrado. O processo é simples: fazemos uma avaliação rápida do estado do seu iPhone, e você paga somente a diferença na aquisição do seu novo aparelho.
              </p>

              {/* Action Buttons & Badges */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/vender"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-sm sm:text-base rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 group"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Faça sua avaliação</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/troca"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 text-[#1D1D1F] font-bold text-xs sm:text-sm rounded-full border border-[#D1D5DB] shadow-sm transition-all"
                >
                  <span>Simular Troca Direta</span>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-[#64748B]">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Avaliação em 9 etapas
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  PIX na Hora ou Desconto
                </span>
              </div>
            </div>

            {/* Right Graphic/Image (Span 5) */}
            <div className="lg:col-span-5 relative h-[260px] sm:h-[340px] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center p-2">
              <Image
                src="/images/trade-in/trade-in-hero.jpg"
                alt="Aceitamos seu iPhone usado como parte do pagamento na Mundo Apple Delivery"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center rounded-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
