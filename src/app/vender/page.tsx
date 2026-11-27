import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SellHub } from "@/components/sell/SellHub";

export const metadata: Metadata = {
  title: "Vender Produto Apple Usado ou Lacrado em SP (iPhone, MacBook, iPad, Watch) | PIX na Hora",
  description:
    "Venda seu iPhone, MacBook, iPad, Apple Watch ou AirPods na Mundo Apple Delivery com avaliação online e pagamento imediato via PIX em São Paulo.",
  keywords: [
    "vender iphone usado sp",
    "vender macbook usado sp",
    "vender ipad usado sp",
    "vender apple watch usado sp",
    "compramos seu apple usado sp",
    "vender produto apple pagamento na hora pix",
    "avaliação de iphone online",
    "quem compra macbook e iphone usado em sp",
  ],
  openGraph: {
    title: "Venda seu Produto Apple e Receba no PIX na Hora | Mundo Apple Delivery",
    description:
      "Compramos iPhone, MacBook, iPad, Apple Watch e AirPods com avaliação rápida e pagamento imediato via PIX na retirada presencial em São Paulo.",
    url: "https://mundoappledelivery.com/vender",
  },
};

export default function SellPage() {
  return (
    <div className="pt-20 sm:pt-28 pb-20 bg-[#F5F5F7] min-h-screen">
      <Container size="default">
        <div className="max-w-2xl mx-auto text-center mb-6 sm:mb-8 px-2">
          <h1 className="font-display text-[28px] sm:text-[40px] font-semibold text-[#1D1D1F] tracking-[-0.035em] leading-[1.08]">
            Venda seu Apple no PIX.
          </h1>
          <p className="text-sm text-[#6E6E73] mt-2 max-w-lg mx-auto leading-relaxed">
            Avaliação rápida, transparente e pagamento imediato na entrega em São Paulo.
          </p>
        </div>

        <Suspense fallback={<div className="max-w-2xl mx-auto py-14 text-center text-sm text-[#6E6E73]">Carregando...</div>}>
          <SellHub />
        </Suspense>
      </Container>
    </div>
  );
}
