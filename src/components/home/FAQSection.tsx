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
    answer: "Sim! Trabalhamos com produtos 100% novos e lacrados de fábrica com 1 ano de garantia oficial Apple com suporte em qualquer assistência autorizada. Seminovos contam com 90 dias de garantia e procedência rigorosamente testada.",
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
    answer: "Sim! Parcelamos em até 18x no cartão de crédito com taxas super competitivas e oferecemos desconto especial para pagamento à vista no PIX.",
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
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden border-t border-[#E5E7EB]">
      <Container size="large">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Title and Support Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F5F7] border border-[#E5E7EB] text-[#0071E3] text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Tire suas Dúvidas</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] font-display tracking-tight leading-tight">
              Perguntas Frequentes
            </h2>

            <p className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed">
              Tudo o que você precisa saber sobre compra, venda, cotação via PIX, garantia de 1 ano e retirada na loja física.
            </p>

            {/* Support CTA Box */}
            <div className="bg-[#F5F5F7] p-6 rounded-3xl border border-[#E5E7EB] space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-[#0F172A] font-display">
                Não encontrou o que procurava?
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Nossa equipe de especialistas está online no WhatsApp pronta para tirar qualquer dúvida na hora.
              </p>
              <a
                href={getWhatsAppGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#00C853] hover:bg-[#00B048] text-white font-bold text-xs sm:text-sm rounded-full shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Falar com um Especialista</span>
              </a>
            </div>
          </div>

          {/* Right Column: Accordion List */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "bg-[#F5F5F7] border-[#0071E3]/30 shadow-sm"
                      : "bg-white border-[#E5E7EB] hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(idx)}
                    className="w-full py-4 sm:py-5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 font-display font-bold text-sm sm:text-base text-[#0F172A]"
                  >
                    <span>{faq.question}</span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? "bg-[#0071E3] text-white rotate-180" : "bg-[#F5F5F7] text-gray-500"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 text-xs sm:text-sm text-[#475569] leading-relaxed pt-1 border-t border-[#E5E7EB]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
