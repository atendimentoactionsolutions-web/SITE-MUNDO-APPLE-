import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { storeConfig } from "@/data/storeConfig";
import { ShieldCheck, Star, Award, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getWhatsAppGeneralUrl } from "@/utils/whatsapp";

export const metadata = {
  title: "Sobre a Mundo Apple Delivery | Nossa História",
  description: "Conheça a trajetória da Mundo Apple Delivery, loja referência em produtos Apple e assistência técnica na Santa Ifigênia, SP.",
};

export default function SobrePage() {
  return (
    <div className="pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        <SectionHeading
          eyebrow="Especialistas em Apple"
          title="Sobre a Mundo Apple Delivery"
          subtitle="Sua referência em vendas de aparelhos novos, seminovos certificados e assistência técnica de alta precisão."
        />

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-apple-border shadow-apple-card max-w-4xl mx-auto space-y-8 mb-16">
          <div className="space-y-4 text-apple-dark leading-relaxed">
            <h3 className="text-2xl font-semibold">Nossa Missão</h3>
            <p className="text-apple-muted">
              A **Mundo Apple Delivery** nasceu com o objetivo de transformar a experiência de compra e manutenção de produtos Apple no Brasil. Localizada estrategicamente no polo tecnológico da Santa Ifigênia, em São Paulo, oferecemos atendimento humanizado, transparência absoluta e os melhores preços em aparelhos lacrados e seminovos selecionados.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-apple-border">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-apple-dark flex items-center gap-2">
                <span>5.0</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <p className="text-xs text-apple-muted font-medium">{storeConfig.socialProof.googleReviewsLabel}</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-bold text-apple-dark">100%</div>
              <p className="text-xs text-apple-muted font-medium">Procedência & Garantia</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-bold text-apple-dark">Santa Ifigênia</div>
              <p className="text-xs text-apple-muted font-medium">Loja Física no Shopping 361</p>
            </div>
          </div>

          <div className="pt-6 border-t border-apple-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-apple-muted">
              <MapPin className="w-4 h-4 text-apple-blue shrink-0" />
              <span>{storeConfig.address.fullAddress}</span>
            </div>

            <Button href={getWhatsAppGeneralUrl()} external variant="whatsapp" size="md" icon={<MessageCircle className="w-4 h-4" />}>
              Falar com Nossos Especialistas
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
