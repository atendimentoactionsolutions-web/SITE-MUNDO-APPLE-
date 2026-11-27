import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { TradeInCalculator } from "@/components/trade-in/TradeInCalculator";

export const metadata = {
  title: "Upgrade e Troca de iPhone (Trade-In) em SP | Mundo Apple Delivery",
  description: "Dê seu iPhone usado como entrada na troca por um iPhone, MacBook, iPad ou Apple Watch novo lacrado. Simule online em 1 minuto o valor da volta!",
  keywords: [
    "upgrade iphone sp",
    "troca de iphone são paulo",
    "dar iphone usado na troca",
    "trade in apple são paulo",
    "simulador de troca iphone",
    "trocar iphone usado por novo sp",
    "loja que aceita iphone como entrada sp",
    "mundo apple troca",
  ],
  openGraph: {
    title: "Simulador de Upgrade Apple | Seu iPhone Usado Vale na Troca",
    description: "Simule agora quanto vale seu iPhone usado na troca por um Apple novo lacrado com entrega e retirada simultânea em SP!",
    url: "https://mundoappledelivery.com/troca",
  },
};

export default function TradeInPage() {
  return (
    <div className="pt-20 sm:pt-24 pb-20 bg-[#F5F5F7] min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-8 px-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0071E3] mb-3">
            Trade-In · Upgrade Apple
          </span>
          <h1 className="font-display text-[26px] sm:text-[38px] font-semibold text-[#1D1D1F] tracking-[-0.035em] leading-[1.1]">
            Dê seu iPhone na troca por um novo.
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-2 max-w-lg mx-auto leading-relaxed">
            Escolha o Apple novo desejado e calcule o valor da diferença no PIX ou em até 18x.
          </p>
        </div>

        {/* Trade-In Calculator Component */}
        <Suspense fallback={<div className="text-center py-12 text-sm text-[#6E6E73]">Carregando simulador de troca...</div>}>
          <TradeInCalculator />
        </Suspense>
      </Container>
    </div>
  );
}
