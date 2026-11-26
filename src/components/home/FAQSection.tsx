"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { getWhatsAppGeneralUrl } from "@/utils/whatsapp";

interface FAQItem {
  question: string;
  answer: string;
  category: "venda" | "compra" | "entrega" | "garantia";
}

const faqs: FAQItem[] = [
  {
    question: "Os aparelhos possuem garantia?",
    answer: "Sim! Trabalhamos com produtos 100% novos e lacrados de fábrica com 1 ano de garantia oficial Apple com suporte em qualquer assistência autorizada.",
    category: "garantia",
  },
  {
    question: "Os produtos são originais?",
    answer: "Todos os produtos são 100% originais Apple, homologados e lacrados na caixa de fábrica. Não trabalhamos com aparelhos recondicionados não oficiais.",
    category: "compra",
  },
  {
    question: "Vocês emitem nota fiscal?",
    answer: "Sim, todas as nossas vendas acompanham nota fiscal e conferência completa de IMEI para sua total segurança jurídica e garantia.",
    category: "compra",
  },
  {
    question: "Posso usar meu iPhone como parte do pagamento?",
    answer: "Com certeza! Fazemos avaliação imediata do seu iPhone usado e aplicamos o valor como desconto direto na aquisição do seu novo aparelho, pagando apenas a diferença.",
    category: "venda",
  },
  {
    question: "Vocês parcelam?",
    answer: "Sim! Parcelamos em até 18x no cartão de crédito com taxas super competitivas e oferecemos condição especial para pagamento à vista no PIX.",
    category: "compra",
  },
  {
    question: "Vocês possuem loja física?",
    answer: "Sim! Nossa loja física está localizada na Rua Santa Ifigênia, 361 (Loja 24, Shopping 361), no centro de São Paulo. Atendemos de segunda a sábado.",
    category: "compra",
  },
  {
    question: "Vocês fazem entrega?",
    answer: "Sim! Oferecemos Delivery Express com motoboy próprio e seguro de transporte para toda a capital e Grande São Paulo.",
    category: "entrega",
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F5F5F7] relative overflow-x-clip border-t border-[#E6E6EB]">
      <Container size="large">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Title and Support Box */}
          <div className="lg:col-span-5 space-y-6" data-reveal="left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E6E6EB] text-[#6E6E73] text-[11px] font-semibold uppercase tracking-[0.08em]">
              <HelpCircle className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>Tire suas Dúvidas</span>
            </div>

            <h2 className="text-[28px] sm:text-[40px] font-semibold text-[#1D1D1F] font-display tracking-[-0.035em] leading-[1.12]">
              Perguntas Frequentes
            </h2>

            <p className="text-sm sm:text-base text-[#6E6E73] font-normal leading-relaxed">
              Tudo o que você precisa saber sobre aparelhos lacrados, garantia oficial Apple, entrega em São Paulo e retirada na loja física.
            </p>

            {/* Support CTA Box */}
            <div className="interactive-card bg-white p-6 rounded-[24px] border border-[#E6E6EB] space-y-4">
              <h3 className="text-base font-semibold text-[#1D1D1F] font-display tracking-[-0.02em]">
                Não encontrou o que procurava?
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                Nossa equipe de especialistas está online no WhatsApp pronta para tirar qualquer dúvida na hora.
              </p>
              <a
                href={getWhatsAppGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#1D1D1F] hover:bg-black text-white font-semibold text-xs sm:text-sm rounded-full"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Falar com um Especialista</span>
              </a>
            </div>
          </div>

          {/* Right Column: Accordion List */}
          <div className="lg:col-span-7 space-y-3" data-reveal="right">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`interactive-card rounded-[20px] border transition-[border-color,box-shadow,transform] duration-200 overflow-hidden ${
                    isOpen
                      ? "bg-white border-[#C8C8D2] shadow-xs"
                      : "bg-white border-[#E6E6EB] hover:border-[#C8C8D2]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(idx)}
                    aria-expanded={isOpen}
                    className="w-full py-4 sm:py-5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 font-display font-semibold text-sm sm:text-base text-[#1D1D1F] cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-[transform,background-color,color] duration-200 ${
                        isOpen ? "bg-[#1D1D1F] text-white rotate-180" : "bg-[#F5F5F7] text-[#6E6E73]"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-5 text-xs sm:text-sm text-[#6E6E73] leading-relaxed pt-2 border-t border-[#F0F0F5]">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
