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
    <div className="pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        <SectionHeading
          eyebrow="Upgrade Inteligente"
          title="Seu iPhone vale na troca."
          subtitle="A forma mais rápida, segura e econômica de atualizar seu aparelho na Mundo Apple Delivery."
        />

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-6 border border-apple-border/60 shadow-apple-card text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-apple-blue/10 text-apple-blue flex items-center justify-center mx-auto">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-apple-dark text-sm">Avaliação Imediata</h3>
            <p className="text-xs text-apple-muted leading-relaxed">
              Descubra o valor estimado do seu iPhone em menos de 2 minutos via WhatsApp.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-apple-border/60 shadow-apple-card text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-apple-dark text-sm">Cotação Justa</h3>
            <p className="text-xs text-apple-muted leading-relaxed">
              Valorizamos o cuidado do seu seminovo com a melhor avaliação do mercado.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-apple-border/60 shadow-apple-card text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-apple-dark text-sm">Troca Segura</h3>
            <p className="text-xs text-apple-muted leading-relaxed">
              Faça a migração dos seus dados com o suporte presencial de nossa equipe.
            </p>
          </div>
        </div>

        {/* Trade-In Calculator Component */}
        <Suspense fallback={<div className="text-center py-12 text-sm text-gray-500">Carregando simulador de troca...</div>}>
          <TradeInCalculator />
        </Suspense>
      </Container>
    </div>
  );
}
