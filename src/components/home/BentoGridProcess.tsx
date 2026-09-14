import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Zap, MessageCircle, MapPin, ShieldCheck, ArrowRight, CheckCircle2, CreditCard, Sparkles } from "lucide-react";
import { getWhatsAppGeneralUrl } from "@/utils/whatsapp";

export const BentoGridProcess: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#F5F5F7] relative overflow-hidden border-t border-[#E5E7EB]">
      <Container size="large" className="relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-[#0071E3] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Passo a Passo Simples & Seguro</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] font-display tracking-tight leading-tight">
            Como vender ou comprar seu Apple
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#475569] font-normal leading-relaxed">
            Processo 100% transparente, sem burocracia e com a garantia de quem tem loja física e tradição no mercado.
          </p>
        </div>

        {/* Bento Grid Layout (4 Clean White Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Card 1: Cotação e Escolha (Large - Col span 7) */}
          <div className="md:col-span-7 bg-white rounded-[24px] p-6 sm:p-8 border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0071E3] font-display font-extrabold text-lg flex items-center justify-center">
                  01
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50">
                  PIX na Hora ou Catálogo
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-display mb-2 group-hover:text-[#0071E3] transition-colors">
                Faça a cotação do seu usado ou escolha o modelo novo
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-6">
                Se você quer <strong>vender seu iPhone</strong>, faça nossa avaliação online em 9 etapas rápidas e receba a proposta na hora. Se deseja <strong>comprar</strong>, escolha modelos 100% novos e lacrados de fábrica.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Avaliação justa baseada no mercado</span>
              </div>
              <Link
                href="/vender"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-bold rounded-full shadow-sm transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Fazer Cotação Agora</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Atendimento WhatsApp VIP (Col span 5 - Clean White) */}
          <div className="md:col-span-5 bg-white rounded-[24px] p-6 sm:p-8 border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0071E3] font-display font-extrabold text-lg flex items-center justify-center">
                  02
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50">
                  Atendimento Instantâneo
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-display mb-2 group-hover:text-[#0071E3] transition-colors">
                Consulte disponibilidade e tire dúvidas
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-6">
                Nossos consultores especialistas estão prontos no WhatsApp para confirmar estoque de cores, tirar dúvidas sobre a vistoria ou orientar sobre sua entrega.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <a
                href={getWhatsAppGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00C853] hover:bg-[#00B048] text-white text-xs sm:text-sm font-bold rounded-full shadow-sm transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chamar no WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 3: Loja Física ou Delivery com Seguro (Col span 5) */}
          <div className="md:col-span-5 bg-white rounded-[24px] p-6 sm:p-8 border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0071E3] font-display font-extrabold text-lg flex items-center justify-center">
                  03
                </span>
                <span className="text-[11px] font-bold text-[#0071E3] bg-blue-50 px-3 py-1 rounded-full">
                  Flexibilidade Total
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-display mb-2 group-hover:text-[#0071E3] transition-colors">
                Retirada na loja física ou Delivery Express
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-6">
                Você escolhe: venha nos visitar em nossa loja na <strong>Rua Santa Ifigênia, 361</strong> com estacionamento e conforto, ou receba onde estiver via <strong>Delivery com seguro total em SP</strong>.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#475569]">
              <MapPin className="w-4 h-4 text-[#0071E3] shrink-0" />
              <span>Santa Ifigênia, 361 • Loja 24, São Paulo</span>
            </div>
          </div>

          {/* Card 4: Pagamento no PIX & Garantia (Col span 7) */}
          <div className="md:col-span-7 bg-white rounded-[24px] p-6 sm:p-8 border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-display font-extrabold text-lg flex items-center justify-center">
                  04
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50">
                  Segurança Máxima
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-display mb-2 group-hover:text-emerald-700 transition-colors">
                Pagamento no PIX na hora & 1 Ano de Garantia
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-6">
                Na venda do seu iPhone, o valor combinado é creditado <strong>via PIX no mesmo instante</strong> após a conferência. Na compra de produtos novos, você recebe nota, suporte e <strong>1 ano de garantia oficial Apple</strong>.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                  1 Ano Garantia Apple
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                  <CreditCard className="w-4 h-4 text-[#0071E3]" />
                  Até 18x no Cartão
                </span>
              </div>
              <Link
                href="/garantia"
                className="font-bold text-[#0071E3] hover:underline underline-offset-4 inline-flex items-center gap-1"
              >
                <span>Ver política de garantia</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
