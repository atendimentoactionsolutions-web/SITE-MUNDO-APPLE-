import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TradeInCalculator } from "@/components/trade-in/TradeInCalculator";
import { RefreshCw, ShieldCheck, Zap, ArrowRight } from "lucide-react";

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
    <div className="pt-20 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        

        

        {/* Trade-In Calculator Component */}
        <Suspense fallback={<div className="text-center py-12 text-sm text-gray-500">Carregando simulador de troca...</div>}>
          <TradeInCalculator />
        </Suspense>
      </Container>
    </div>
  );
}
