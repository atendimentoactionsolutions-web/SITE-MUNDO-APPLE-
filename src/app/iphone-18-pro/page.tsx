import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { IPhone18Pro3DViewer } from "@/components/products/iPhone18Pro3DViewer";
import { createWhatsAppLink } from "@/utils/whatsapp";
import { storeConfig } from "@/data/storeConfig";
import {
  ShieldCheck,
  Truck,
  Zap,
  RefreshCw,
  Camera,
  Cpu,
  BatteryCharging,
  Sparkles,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "iPhone 18 Pro e iPhone 18 Pro Max | Mundo Apple Delivery",
  description:
    "Descubra o novo iPhone 18 Pro. Estrutura unibody em titânio, chip A19 Pro, câmera com abertura variável e 1 ano de garantia oficial Apple. Entrega expressa em São Paulo e pagamento via PIX ou até 18x.",
};

export default function IPhone18ProPage() {
  const buyWhatsAppUrl = createWhatsAppLink(
    "Olá! Vim pela página oficial do iPhone 18 Pro no site da Mundo Apple Delivery e quero comprar. Podem me passar a disponibilidade e formas de pagamento?"
  );

  return (
    <div className="bg-black text-white min-h-screen pt-20 sm:pt-24 selection:bg-[#0071E3] selection:text-white">
      {/* ────────────────────────────────────────────────────────────────────────
          1. Apple Sticky LocalNav Bar
      ──────────────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-16 sm:top-20 z-40 bg-[#161617]/80 backdrop-blur-xl border-b border-white/10 text-xs">
        <div className="max-w-[1024px] mx-auto px-4 h-12 flex items-center justify-between">
          <span className="font-semibold text-sm sm:text-base tracking-tight font-display text-white">
            iPhone 18 Pro
          </span>
          <div className="flex items-center gap-3 sm:gap-5 text-zinc-300">
            <a href="#destaques" className="hidden sm:inline hover:text-white transition-colors">
              Destaques
            </a>
            <a href="#design-3d" className="hidden sm:inline hover:text-white transition-colors">
              Design & 3D
            </a>
            <a href="#camera" className="hidden sm:inline hover:text-white transition-colors">
              Câmera
            </a>
            <Link
              href="/troca"
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-[11px] font-semibold"
            >
              Simular Troca
            </Link>
            <a
              href={buyWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full transition-colors text-[11px] font-semibold shadow-sm"
            >
              Comprar
            </a>
          </div>
        </div>
      </nav>

      {/* ────────────────────────────────────────────────────────────────────────
          2. Hero Section: iPhone 18 Pro
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 text-center flex flex-col items-center">
        <div className="relative z-10 max-w-4xl px-4 space-y-4">
          <p className="text-sm sm:text-base font-semibold uppercase tracking-widest text-zinc-400">
            Novo
          </p>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-[-0.04em] font-display text-white">
            iPhone 18 Pro
          </h1>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-normal text-zinc-300 tracking-[-0.02em]">
            Muito mais Pro.
          </p>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto pt-2">
            Disponível a pronta entrega na Mundo Apple Delivery com 1 ano de garantia oficial Apple e entrega expressa em São Paulo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href={buyWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-sm sm:text-base rounded-full transition-all shadow-lg shadow-[#0071E3]/25"
            >
              Comprar no WhatsApp
            </a>
            <Link
              href="/troca"
              className="px-6 py-3 bg-transparent hover:bg-white/10 text-[#2997FF] hover:text-white border border-[#2997FF] hover:border-white font-semibold text-sm sm:text-base rounded-full transition-all"
            >
              Simular Troca de Aparelho
            </Link>
          </div>
        </div>

        {/* Hero Visual Asset */}
        <div className="relative w-full max-w-[1280px] h-[340px] sm:h-[460px] lg:h-[560px] mt-8 flex items-end justify-center pointer-events-none">
          <img
            src="/apple-official/images/hero_iphone_18_pro.jpg"
            alt="iPhone 18 Pro unibody titânio"
            className="h-full w-auto max-w-none pointer-events-none select-none object-contain object-bottom"
          />
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          3. Highlights Section (Comece pelos destaques)
      ──────────────────────────────────────────────────────────────────────── */}
      <section id="destaques" className="w-full py-16 sm:py-24 bg-[#0A0A0A] border-t border-white/10">
        <div className="max-w-[1220px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12 sm:mb-16">
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2">
              Destaques
            </p>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] font-display text-white">
              Comece pelos destaques.
            </h2>
          </div>

          {/* Bento Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Tile 1: Câmera com Abertura Variável */}
            <div className="relative rounded-3xl bg-[#161617] p-8 sm:p-10 border border-white/10 flex flex-col justify-between overflow-hidden group">
              <div className="space-y-3 z-10">
                <div className="w-10 h-10 rounded-2xl bg-[#0071E3]/20 flex items-center justify-center text-[#2997FF]">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Abertura Variável de ƒ/1.48 a ƒ/4.0
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Quatro paradas mecânicas de abertura na câmera principal de 48 MP. Controle a profundidade de campo e a iluminação como em uma lente de cinema profissional.
                </p>
              </div>
              <div className="relative w-full h-44 mt-6 rounded-2xl overflow-hidden">
                <img
                  src="/apple-official/iphone-18-pro/camera_system_startframe.jpg"
                  alt="Sistema de câmera iPhone 18 Pro"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Tile 2: Chip A19 Pro */}
            <div className="relative rounded-3xl bg-[#161617] p-8 sm:p-10 border border-white/10 flex flex-col justify-between overflow-hidden group">
              <div className="space-y-3 z-10">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Chip A19 Pro. Poder monumental.
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Arquitetura de 3 nanômetros de última geração com Ray Tracing acelerado por hardware para jogos AAA e inteligência pessoal ultra veloz sem esquentar.
                </p>
              </div>
              <div className="relative w-full h-44 mt-6 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                <img
                  src="/apple-official/iphone-18-pro/chip_startframe.jpg"
                  alt="Chip A19 Pro"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Tile 3: Bateria Recorde */}
            <div className="relative rounded-3xl bg-[#161617] p-8 sm:p-10 border border-white/10 flex flex-col justify-between overflow-hidden group">
              <div className="space-y-3 z-10">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <BatteryCharging className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Até 33 horas de reprodução.
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  A maior autonomia já vista em um iPhone Pro. Bateria que te acompanha o dia inteiro de trabalho intenso, gravações em ProRes e games.
                </p>
              </div>
              <div className="relative w-full h-44 mt-6 rounded-2xl overflow-hidden">
                <img
                  src="/apple-official/iphone-18-pro/hero.jpg"
                  alt="Bateria iPhone 18 Pro"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          4. Visualizador 3D Interativo (Design & Cores)
      ──────────────────────────────────────────────────────────────────────── */}
      <section id="design-3d" className="w-full py-16 sm:py-24 bg-black border-t border-white/10">
        <div className="max-w-[1220px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
            <p className="text-xs uppercase tracking-widest text-[#2997FF] font-semibold">
              Design Unibody
            </p>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] font-display text-white">
              Estrutura unibody. Uma obra única.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 pt-1">
              Forjado em Titânio aeroespacial. Gire o modelo em 3D, selecione o acabamento e veja em Realidade Aumentada (AR).
            </p>
          </div>

          {/* Interactive 3D Canvas */}
          <IPhone18Pro3DViewer />
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          5. Câmera Pro: Abertura Variável
      ──────────────────────────────────────────────────────────────────────── */}
      <section id="camera" className="w-full py-16 sm:py-24 bg-[#0A0A0A] border-t border-white/10">
        <div className="max-w-[1220px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12 sm:mb-16">
            <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
              Sistema de Câmera Pro
            </p>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] font-display text-white">
              Abertura variável. Pros entenderão.
            </h2>
            <p className="text-base text-zinc-400 mt-3 leading-relaxed">
              O controle óptico de diafragma mecânico traz a profundidade real de lentes cinematográficas diretamente para a ponta dos seus dedos.
            </p>
          </div>

          {/* 4 Apertures Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 rounded-2xl bg-[#161617] border border-white/10 text-center space-y-2">
              <span className="text-3xl sm:text-4xl font-bold font-display text-[#2997FF]">ƒ/1.48</span>
              <p className="text-xs sm:text-sm font-semibold text-white">Exposição máxima</p>
              <p className="text-xs text-zinc-400">Captura extrema de luz para fotos noturnas impecáveis sem ruído.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#161617] border border-white/10 text-center space-y-2">
              <span className="text-3xl sm:text-4xl font-bold font-display text-white">ƒ/1.8</span>
              <p className="text-xs sm:text-sm font-semibold text-white">Padrão Pro</p>
              <p className="text-xs text-zinc-400">Equilíbrio perfeito de nitidez e faixa dinâmica para o dia a dia.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#161617] border border-white/10 text-center space-y-2">
              <span className="text-3xl sm:text-4xl font-bold font-display text-white">ƒ/2.8</span>
              <p className="text-xs sm:text-sm font-semibold text-white">Mais profundidade</p>
              <p className="text-xs text-zinc-400">Retratos elegantes com desfoque de fundo óptico natural (bokeh).</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#161617] border border-white/10 text-center space-y-2">
              <span className="text-3xl sm:text-4xl font-bold font-display text-amber-400">ƒ/4.0</span>
              <p className="text-xs sm:text-sm font-semibold text-white">Profundidade máxima</p>
              <p className="text-xs text-zinc-400">Todo o cenário nítido do primeiro plano ao horizonte mais distante.</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl overflow-hidden border border-white/10 relative h-[300px] sm:h-[450px]">
            <img
              src="/apple-official/iphone-18-pro/max_depth.jpg"
              alt="Abertura variável iPhone 18 Pro"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          6. Box de Compra & Trade-In Mundo Apple Delivery
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="w-full py-16 sm:py-24 bg-gradient-to-b from-[#0A0A0A] to-black border-t border-white/10">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-[#161617] border border-[#0071E3]/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#0071E3]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0071E3]/20 border border-[#0071E3]/40 text-xs font-semibold text-[#2997FF]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Garantia Oficial Apple de 1 Ano
                </span>
                <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight font-display text-white">
                  Garanta seu iPhone 18 Pro na Mundo Apple Delivery
                </h3>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  Entrega expressa no mesmo dia via motoboy em São Paulo ou retire em nossa loja física na Santa Ifigênia. Pagamento à vista via PIX ou em até 18x no cartão.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span>Entrega Expressa SP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Novo & Lacrado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>PIX com Desconto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-emerald-400" />
                    <span>Aceitamos seu Usado</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
                <a
                  href={buyWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-base rounded-full transition-all shadow-lg shadow-[#0071E3]/30 text-center"
                >
                  <span>Comprar pelo WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/troca"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-full border border-white/15 transition-all text-center"
                >
                  <RefreshCw className="w-4 h-4 text-[#2997FF]" />
                  <span>Simular Troca (Trade-In)</span>
                </Link>
                <p className="text-center text-[11px] text-zinc-400 pt-1">
                  Atendimento direto: {storeConfig.contact.whatsappFormatted}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
