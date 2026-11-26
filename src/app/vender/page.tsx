import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SellWizard } from "@/components/sell/SellWizard";

export const metadata: Metadata = {
  title: "Vender Meu iPhone Usado em SP | Avaliação Online e PIX na Hora",
  description:
    "Venda seu iPhone usado na Mundo Apple Delivery com cotação online imediata e pagamento à vista via PIX na retirada presencial em São Paulo.",
  keywords: [
    "vender iphone usado sp",
    "onde vender iphone usado em são paulo",
    "compramos seu iphone usado sp",
    "vender iphone pagamento na hora pix",
    "avaliação de iphone online",
    "vender iphone 15 pro max usado",
    "vender iphone 14 pro max usado",
    "vender iphone 13 usado sp",
    "vender iphone 12 usado sp",
    "quem compra iphone usado em sp",
  ],
  openGraph: {
    title: "Venda seu iPhone Usado e Receba no PIX na Hora | Mundo Apple Delivery",
    description:
      "Descubra em 1 minuto quanto vale o seu iPhone usado! Pagamento imediato via PIX na retirada presencial em São Paulo.",
    url: "https://mundoappledelivery.com/vender",
  },
};

export default function SellPage() {
  return (
    <div className="pt-20 sm:pt-24 pb-20 bg-[#F5F5F7] min-h-screen">
      <Container size="default">
        <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-8 px-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E5E5EA] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0071E3] shadow-[0_1px_2px_rgba(0,0,0,0.03)] mb-3">
            Avaliação Online Instantânea
          </span>
          <h1 className="font-display text-[26px] sm:text-[36px] font-semibold text-[#1D1D1F] tracking-[-0.035em] leading-[1.12]">
            Venda seu iPhone com PIX na hora.
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-2 max-w-lg mx-auto leading-relaxed">
            Responda 8 perguntas rápidas e descubra o valor do seu aparelho em menos de 1 minuto.
          </p>
        </div>
        <SellWizard />
      </Container>
    </div>
  );
}
