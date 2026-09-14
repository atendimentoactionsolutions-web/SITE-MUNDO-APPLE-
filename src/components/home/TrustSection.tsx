import React from "react";
import { Container } from "@/components/ui/Container";
import { ShieldCheck, FileCheck, Award, CreditCard, Headphones, MapPin, Truck, RefreshCw, Sparkles } from "lucide-react";

const differentials = [
  {
    icon: <Award className="w-6 h-6 text-[#0071E3]" />,
    title: "Produtos Selecionados",
    description: "Aparelhos 100% originais com garantia de fábrica e procedência rigorosamente verificada.",
  },
  {
    icon: <FileCheck className="w-6 h-6 text-emerald-600" />,
    title: "Nota Fiscal & Procedência",
    description: "Transparência absoluta em cada venda com IMEI conferido e nota fiscal.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#0071E3]" />,
    title: "1 Ano de Garantia Apple",
    description: "Cobertura oficial em qualquer Apple Store ou centro de serviço autorizado do país.",
  },
  {
    icon: <CreditCard className="w-6 h-6 text-purple-600" />,
    title: "Pagamento Seguro",
    description: "Desconto especial no PIX à vista ou parcelamento em até 18x no cartão de crédito.",
  },
  {
    icon: <Headphones className="w-6 h-6 text-emerald-600" />,
    title: "Atendimento Especializado",
    description: "Consultores técnicos que entendem do ecossistema Apple prontos para ajudar no WhatsApp.",
  },
  {
    icon: <MapPin className="w-6 h-6 text-rose-500" />,
    title: "Loja Física em SP",
    description: "Atendimento presencial na Rua Santa Ifigênia, 361 (Loja 24), no centro de São Paulo.",
  },
  {
    icon: <Truck className="w-6 h-6 text-amber-500" />,
    title: "Delivery Express com Seguro",
    description: "Entrega rápida via motoboy próprio com seguro total para a capital e Grande SP.",
  },
  {
    icon: <RefreshCw className="w-6 h-6 text-[#0071E3]" />,
    title: "Trade-in & Avaliação Justa",
    description: "Aceitamos seu iPhone usado como parte do pagamento ou compramos com PIX na hora.",
  },
];

export const TrustSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#F5F5F7] border-t border-[#E5E7EB]">
      <Container size="large">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-bold uppercase tracking-wider text-[#0071E3] shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Por que escolher a Mundo Apple Delivery</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] font-display tracking-tight leading-tight">
            Excelência, garantia e segurança
          </h2>

          <p className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed">
            Estrutura completa para você comprar, vender ou trocar seu produto Apple com tranquilidade absoluta.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {differentials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[22px] p-6 sm:p-7 border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 transform hover:-translate-y-1 space-y-3 flex flex-col justify-between"
            >
              <div className="p-3 bg-[#F5F5F7] rounded-2xl w-fit border border-[#E5E7EB]">
                {item.icon}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A] font-display mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
