import React from "react";
import { Container } from "@/components/ui/Container";
import { storeConfig } from "@/data/storeConfig";
import {
  MapPin,
  Clock,
  Navigation,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
  Star,
  Store,
  ArrowUpRight,
} from "lucide-react";
import { getWhatsAppGeneralUrl } from "@/utils/whatsapp";

const STORE_PILLARS = [
  {
    icon: Star,
    title: "Nota 5.0 no Google",
    subtitle: storeConfig.socialProof.googleReviewsLabel,
    accent: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: ShieldCheck,
    title: "Garantia Oficial Apple",
    subtitle: "1 ano em todos os aparelhos novos lacrados",
    accent: "text-[#0071E3]",
    bg: "bg-blue-50",
  },
  {
    icon: Truck,
    title: "Delivery Express SP",
    subtitle: "Motoboy próprio com pagamento na entrega",
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Store,
    title: "Loja Física em SP",
    subtitle: "Retirada imediata no Shopping 361",
    accent: "text-[#1D1D1F]",
    bg: "bg-[#EFEFF4]",
  },
];

export const StoreLocationSection: React.FC = () => {
  return (
    <section
      className="py-16 sm:py-24 bg-white border-t border-[#E6E6EB] overflow-x-clip scroll-mt-16"
      id="localizacao"
    >
      <Container size="large">
        {/* Section Header — Choreographed Lead / Support / Decoration */}
        <div className="max-w-3xl mb-10 sm:mb-14 space-y-3">
          <span
            data-reveal="fade"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F5F7] border border-[#E6E6EB] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6E6E73]"
          >
            <MapPin className="w-3.5 h-3.5 text-[#0071E3]" />
            Sobre a Loja · São Paulo
          </span>

          <h2
            data-reveal="lead"
            className="text-[28px] sm:text-[40px] lg:text-[44px] font-semibold text-[#1D1D1F] font-display tracking-[-0.035em] leading-[1.12]"
          >
            Conheça a {storeConfig.shortName}.{" "}
            <span className="text-[#6E6E73] font-normal">
              Loja física na Santa Ifigênia e entrega rápida em toda SP.
            </span>
          </h2>

          <p
            data-reveal="support"
            data-reveal-delay="75"
            className="text-sm sm:text-base text-[#6E6E73] leading-relaxed max-w-2xl"
          >
            Atendimento transparente, aparelhos 100% originais e lacrados com conferência presencial na hora, além de equipe dedicada no WhatsApp para tirar dúvidas e agilizar seu pedido.
          </p>
        </div>

        {/* 4 Clean Trust Pillars (shrinking organic stagger: 0, 55, 100, 135ms) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {STORE_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            const shrinkingDelays = ["0", "55", "100", "135"];
            return (
              <div
                key={pillar.title}
                data-reveal="support"
                data-reveal-delay={shrinkingDelays[idx] ?? "135"}
                className="interactive-card bg-[#F5F5F7] rounded-[22px] p-4 sm:p-6 border border-[#E6E6EB]/90 flex flex-col justify-between gap-3"
              >
                <div
                  className={`w-10 h-10 rounded-2xl ${pillar.bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${pillar.accent}`} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-[#1D1D1F] tracking-[-0.02em] leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#6E6E73] mt-1 leading-snug">
                    {pillar.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main 2-Column Bento: Store Details + Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Left: Store Details Card */}
          <div
            data-reveal="left"
            className="interactive-card lg:col-span-5 bg-[#F5F5F7] rounded-[28px] p-6 sm:p-9 border border-[#E6E6EB] flex flex-col justify-between gap-8"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3 pb-5 border-b border-[#E2E2E8]">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#1D1D1F] tracking-[-0.03em]">
                    {storeConfig.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E6E73] mt-0.5">
                    {storeConfig.address.complement} · {storeConfig.address.storeNumber}
                  </p>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2E2E8] text-[11px] font-semibold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Presencial
                </span>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-[#E6E6EB] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#1D1D1F]" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#86868B] mb-1">
                      Endereço
                    </span>
                    <p className="text-sm font-medium text-[#1D1D1F] leading-snug">
                      {storeConfig.address.street} · {storeConfig.address.storeNumber}
                    </p>
                    <p className="text-xs sm:text-[13px] text-[#6E6E73] mt-0.5">
                      {storeConfig.address.complement} — {storeConfig.address.neighborhood}, {storeConfig.address.city}/{storeConfig.address.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-[#E6E6EB] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#1D1D1F]" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#86868B] mb-1">
                      Horário de Atendimento
                    </span>
                    <p className="text-sm font-medium text-[#1D1D1F]">
                      {storeConfig.openingHours.weekdays}
                    </p>
                    <p className="text-xs sm:text-[13px] text-[#6E6E73] mt-0.5">
                      {storeConfig.openingHours.saturday} · {storeConfig.openingHours.sunday}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-[#E6E6EB] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#1D1D1F]" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#86868B] mb-1">
                      WhatsApp Direto
                    </span>
                    <p className="text-sm font-medium text-[#1D1D1F]">
                      {storeConfig.contact.whatsappFormatted}
                    </p>
                    <p className="text-xs sm:text-[13px] text-[#6E6E73] mt-0.5">
                      Consulte disponibilidade, valores atualizados e agende sua visita
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Apple-style Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={storeConfig.address.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#1D1D1F] hover:bg-black text-white font-semibold text-xs sm:text-[13px] rounded-full"
              >
                <Navigation className="w-4 h-4 shrink-0" />
                <span>Como chegar</span>
              </a>

              <a
                href={getWhatsAppGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-[#1D1D1F] text-[#1D1D1F] hover:text-white border border-[#D2D2D7] hover:border-[#1D1D1F] font-semibold text-xs sm:text-[13px] rounded-full"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right: Interactive Map with Floating Frosted Address Bar */}
          <div
            data-reveal="right"
            className="interactive-card lg:col-span-7 bg-[#F5F5F7] rounded-[28px] border border-[#E6E6EB] overflow-hidden min-h-[340px] sm:min-h-[440px] relative flex flex-col"
          >
            <iframe
              src="https://maps.google.com/maps?q=Rua%20Santa%20Ifigenia%20361%20Sao%20Paulo%20SP&z=18&output=embed"
              width="100%"
              height="100%"
              className="flex-1 min-h-[340px] sm:min-h-[440px]"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Localização Mundo Apple Delivery"
            />

            <a
              href={storeConfig.address.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md border border-[#E6E6EB] rounded-2xl px-4 py-3 flex items-center justify-between gap-4 shadow-md hover:bg-white transition-all"
            >
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-[#1D1D1F] truncate">
                  {storeConfig.address.street} · {storeConfig.address.storeNumber}
                </p>
                <p className="text-[11px] text-[#6E6E73] truncate">
                  {storeConfig.address.complement} · Santa Ifigênia, SP
                </p>
              </div>
              <span className="shrink-0 w-8 h-8 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};
