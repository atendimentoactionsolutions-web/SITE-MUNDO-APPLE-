import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ShieldCheck, CheckCircle2, XCircle, Wrench, MessageCircle, Award, Zap } from "lucide-react";
import { getWhatsAppGeneralUrl } from "@/utils/whatsapp";

export const metadata: Metadata = {
  title: "Política de Garantia Oficial & Procedência | Mundo Apple Delivery",
  description: "Entenda como funciona a garantia de 1 ano oficial Apple e a procedência de todos os aparelhos na Mundo Apple Delivery.",
};

export default function GarantiaPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] py-16 sm:py-24 text-[#0F172A]">
      <Container size="large">
        {/* Header Breadcrumb & Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-[#0071E3] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Garantia & Procedência 100% Garantida</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight leading-tight text-[#0F172A]">
            1 Ano de Garantia Oficial Apple
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#475569] leading-relaxed">
            Na <strong>Mundo Apple Delivery</strong>, você tem a tranquilidade de adquirir produtos 100% novos, lacrados de fábrica e com cobertura total da própria Apple em todo o território nacional e mundial.
          </p>
        </div>

        {/* 3 Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-7 rounded-[22px] border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#0F172A]">Produtos Novos, Lacrados</h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Todos os iPhones, MacBooks, iPads e AirPods são novos, nunca ativados, com selos originais de fábrica e homologação Anatel.
            </p>
          </div>

          <div className="bg-white p-7 rounded-[22px] border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0071E3] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#0F172A]">Cobertura Nacional & Global</h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              A garantia de 1 ano é vinculada diretamente ao número de série do aparelho no sistema oficial da Apple, válida em qualquer Apple Store.
            </p>
          </div>

          <div className="bg-white p-7 rounded-[22px] border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#0F172A]">Suporte Especializado</h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Além da garantia de fábrica, nossa equipe na Santa Ifigênia auxilia na transferência de dados, configuração inicial e suporte pós-venda.
            </p>
          </div>
        </div>

        {/* What is covered vs what is not covered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Covered */}
          <div className="bg-white p-8 rounded-[22px] border border-emerald-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-bold font-display text-lg">
              <CheckCircle2 className="w-5 h-5" />
              <span>O que é coberto pela garantia:</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-[#475569]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Defeitos de fabricação em hardware interno (placa, processador, memória).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Falhas no módulo de câmeras, sensores de proximidade e Face ID.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Problemas de bateria e retenção de carga anormais de fábrica.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Defeitos no painel Super Retina OLED e touch screen.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Falhas de conectividade Wi-Fi, 5G e Bluetooth.</span>
              </li>
            </ul>
          </div>

          {/* Not Covered */}
          <div className="bg-white p-8 rounded-[22px] border border-rose-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-bold font-display text-lg">
              <XCircle className="w-5 h-5" />
              <span>O que não é coberto (mau uso):</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-[#475569]">
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Danos físicos decorrentes de quedas, trincas na tela ou carcaça amassada.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Contato excessivo ou imersão em líquidos com violação dos selos de vedação.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Tentativa de abertura do aparelho ou reparo por técnicos não autorizados.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Uso de cabos e carregadores paralelos de má qualidade que danifiquem a placa.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* How to activate warranty CTA (Clean White Card) */}
        <div className="bg-white text-[#0F172A] p-8 sm:p-12 rounded-[24px] border border-[#E5E7EB] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#0F172A]">
              Precisa acionar a garantia ou tirar dúvidas?
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] max-w-xl">
              Nossa equipe está pronta para orientar você no atendimento oficial Apple ou prestar suporte imediato em nossa loja física na Santa Ifigênia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href={getWhatsAppGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#00C853] hover:bg-[#00B048] text-white font-bold rounded-full text-xs sm:text-sm transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Suporte no WhatsApp</span>
            </a>
            <Link
              href="/vender"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#F5F5F7] hover:bg-slate-200 text-[#1D1D1F] font-bold rounded-full text-xs sm:text-sm border border-[#E5E7EB] transition-all"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Vender meu iPhone</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
