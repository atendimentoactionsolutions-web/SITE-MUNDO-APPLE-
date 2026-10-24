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
    <div className="pt-24 sm:pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container size="default">
        <SellWizard />
      </Container>
    </div>
  );
}
