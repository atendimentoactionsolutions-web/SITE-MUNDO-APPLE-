import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { storeConfig } from "@/data/storeConfig";
import { Star, CheckCircle, ExternalLink } from "lucide-react";

const testimonials = [
  {
    name: "Marcelo Ribeiro",
    date: "Avaliação verificada no Google",
    comment: "Comprei meu iPhone 16 Pro Max e dei meu iPhone 13 na troca. A avaliação foi super justa, o atendimento via WhatsApp foi rápido e recebi o aparelho lacrado na hora. Recomendo demais!",
    rating: 5,
    device: "Trade-in iPhone 16 Pro Max"
  },
  {
    name: "Camila Santoro",
    date: "Avaliação verificada no Google",
    comment: "Troquei a tela e a bateria do meu MacBook Pro na Mundo Apple Delivery. Serviço impecável, rápido e com valor muito justo comparado às autorizadas. Nota 10!",
    rating: 5,
    device: "Manutenção MacBook Pro"
  },
  {
    name: "Rodrigo Almeida",
    date: "Avaliação verificada no Google",
    comment: "Adquiri um iPhone 15 Pro seminovo. Aparelho veio impecável, com saúde de bateria de 95% e nota fiscal. Transparência total da equipe.",
    rating: 5,
    device: "iPhone 15 Pro Seminovo"
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-apple-gray/40 border-t border-apple-border/40">
      <Container>
        <SectionHeading
          eyebrow="Satisfação Garantida"
          title="O que nossos clientes dizem"
          subtitle={`Mais de ${storeConfig.socialProof.googleReviewsCount.toLocaleString('pt-BR')} avaliações de 5 estrelas registradas no Google Maps.`}
        />

        {/* Rating Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-apple-border/60 shadow-apple-card max-w-2xl mx-auto mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="text-4xl sm:text-5xl font-bold text-apple-dark">
              {storeConfig.socialProof.googleRating.toFixed(1)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-apple-muted font-medium">
                {storeConfig.socialProof.googleReviewsLabel}
              </p>
            </div>
          </div>

          <a
            href={storeConfig.address.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-apple-gray hover:bg-apple-dark hover:text-white text-apple-dark text-xs sm:text-sm font-semibold transition-all"
          >
            <span>Ver no Google Maps</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-apple-border/60 hover:border-apple-border shadow-apple-card transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-apple-blue bg-apple-blue/10 px-2.5 py-0.5 rounded-full">
                    {t.device}
                  </span>
                </div>

                <p className="text-sm text-apple-dark leading-relaxed font-normal italic">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-apple-border/40 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-apple-dark">{t.name}</h4>
                  <span className="text-[11px] text-apple-muted">{t.date}</span>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
