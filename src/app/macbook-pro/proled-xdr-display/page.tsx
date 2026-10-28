import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { createWhatsAppLink } from "@/utils/whatsapp";
import {
  Sparkles,
  Touchpad,
  Cpu,
  Layers,
  Battery,
  ShieldCheck,
  Truck,
  ArrowRight,
  Maximize2,
  Tv,
} from "lucide-react";

export const metadata: Metadata = {
  title: "MacBook Pro com Tela PROLED XDR | Mundo Apple Delivery",
  description:
    "Conheça o novo MacBook Pro com Tela PROLED XDR. Revolucionária tecnologia OLED em camada dupla com Touch, Dynamic Island, chips M5 Pro e M5 Max e até 24 horas de bateria. Compre com pronta entrega na Mundo Apple Delivery.",
};

export default function MacBookProProledPage() {
  const buyWhatsAppUrl = createWhatsAppLink(
    "Olá! Vim pela página do MacBook Pro com Tela PROLED XDR no site da Mundo Apple Delivery e quero comprar/encomendar. Podem me passar os detalhes, disponibilidade e formas de pagamento?"
  );

  return (
    <div className="bg-black text-[#F5F5F7] min-h-screen pt-20 sm:pt-24 selection:bg-[#0071E3] selection:text-white">
      {/* ────────────────────────────────────────────────────────────────────────
          1. Apple Sticky LocalNav Bar
      ──────────────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-16 sm:top-20 z-40 bg-[#161617]/85 backdrop-blur-xl border-b border-white/10 text-xs">
        <div className="max-w-[1024px] mx-auto px-4 h-12 flex items-center justify-between">
          <span className="font-semibold text-sm sm:text-base tracking-tight font-display text-white">
            MacBook Pro com Tela PROLED XDR
          </span>
          <div className="flex items-center gap-3 sm:gap-5 text-zinc-300">
            <a href="#destaques" className="hidden sm:inline hover:text-white transition-colors">
              Destaques
            </a>
            <a href="#proled-xdr" className="hidden sm:inline hover:text-white transition-colors">
              Tela PROLED
            </a>
            <a href="#touch" className="hidden sm:inline hover:text-white transition-colors">
              Touch
            </a>
            <a href="#chips" className="hidden sm:inline hover:text-white transition-colors">
              Chips M5 Pro / Max
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
              Ver preços
            </a>
          </div>
        </div>
      </nav>

      {/* ────────────────────────────────────────────────────────────────────────
          2. Hero Section: MacBook Pro Tela PROLED XDR
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-12 text-center flex flex-col items-center">
        <div className="relative z-10 max-w-4xl px-4 space-y-3">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#2997FF]">
            Novo lançamento
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] font-display text-white">
            MacBook Pro
          </h1>
          <p className="text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#86868B]">
            com Tela PROLED XDR
          </p>
          <p className="text-lg sm:text-2xl text-[#F5F5F7] font-normal pt-1">
            A tela dos sonhos.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <a
              href={buyWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[15px] sm:text-[17px] font-normal rounded-full transition-colors"
            >
              Comprar / Ver Preços
            </a>
            <a
              href="#destaques"
              className="px-6 py-2.5 bg-transparent hover:bg-white/10 text-white border border-white/30 text-[15px] sm:text-[17px] font-normal rounded-full transition-colors"
            >
              Ver recursos ↓
            </a>
          </div>
        </div>

        {/* Video / High-Res Visual */}
        <div className="relative w-full max-w-5xl mt-10 px-4 flex justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/apple-official/images/hero_macbook_pro_proled_xdr_animated_preorder__c7dgzbk10sqe_large_2x.jpg"
            className="w-full rounded-2xl shadow-2xl border border-white/10"
          >
            <source src="/apple-official/macbook-pro-proled/anim-welcome.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          3. Highlights Bar
      ──────────────────────────────────────────────────────────────────────── */}
      <section id="destaques" className="max-w-[1024px] mx-auto px-4 py-16 sm:py-24 border-t border-white/10">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-12">
          Comece pelos destaques.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: PROLED XDR */}
          <div className="bg-[#161617] p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <Layers className="w-8 h-8 text-[#2997FF] mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">Tela PROLED XDR</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Revolucionária tecnologia OLED em camada dupla (Tandem OLED). Brilho sustentado de até 1.000 nits e pico de 1.600 nits para HDR.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#2997FF] font-medium">
              Contraste de 2.000.000:1
            </div>
          </div>

          {/* Card 2: Touch Integrado */}
          <div className="bg-[#161617] p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <Touchpad className="w-8 h-8 text-[#2997FF] mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">Touch integrado</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Sensor touch embutido diretamente nas camadas do painel, sem películas extras. Role, dê zoom e manipule timelines com precisão milimétrica.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#2997FF] font-medium">
              Suporte nativo a gestos no macOS
            </div>
          </div>

          {/* Card 3: Dynamic Island */}
          <div className="bg-[#161617] p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <Sparkles className="w-8 h-8 text-[#2997FF] mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">Dynamic Island</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                No alto da tela e da sua produtividade. Acompanhe Atividades ao Vivo, chamadas de vídeo, controles de mídia e Spotlight com total fluidez.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#2997FF] font-medium">
              Integrada ao topo da tela
            </div>
          </div>

          {/* Card 4: Chips M5 Pro e M5 Max */}
          <div className="bg-[#161617] p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <Cpu className="w-8 h-8 text-[#2997FF] mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">M5 Pro & M5 Max</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Desempenho monstruoso de CPU e GPU de última geração com aceleração gráfica para ray tracing avançado e tarefas massivas de IA.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#2997FF] font-medium">
              Arquitetura em 3nm de 3ª geração
            </div>
          </div>

          {/* Card 5: Bateria de 24 Horas */}
          <div className="bg-[#161617] p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <Battery className="w-8 h-8 text-[#2997FF] mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">Até 24h de bateria</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                A maior autonomia de bateria já vista em um MacBook Pro. Mantenha 100% da velocidade, esteja conectado na tomada ou na bateria.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#2997FF] font-medium">
              Do amanhecer ao anoitecer
            </div>
          </div>

          {/* Card 6: Compra Segura Mundo Apple */}
          <div className="bg-[#161617] p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <ShieldCheck className="w-8 h-8 text-[#34C759] mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">Garantia Oficial Apple</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Aparelhos 100% originais e lacrados na caixa. 1 ano de garantia mundial Apple e suporte prioritário Mundo Apple Delivery.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#34C759] font-medium">
              Entrega expressa e segura em SP
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          4. Deep Dive: PROLED XDR Video Section
      ──────────────────────────────────────────────────────────────────────── */}
      <section id="proled-xdr" className="w-full bg-[#0A0A0A] py-20 px-4 border-t border-white/10">
        <div className="max-w-[1024px] mx-auto text-center space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2997FF]">
            Tecnologia de tela de última geração
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight">
            PROLED XDR. A melhor tela de notebook do mundo.
          </h2>
          <p className="max-w-2xl mx-auto text-zinc-400 text-base sm:text-lg leading-relaxed">
            As cores ganham vida com ampla gama de cores P3 e Adobe RGB. Dois painéis OLED empilhados que atingem pretos profundos absolutos e clareza total mesmo em ambientes com muita luz.
          </p>

          <div className="relative w-full max-w-4xl mx-auto mt-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
            >
              <source src="/apple-official/macbook-pro-proled/anim-proled.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          5. Deep Dive: Touch Experience Section
      ──────────────────────────────────────────────────────────────────────── */}
      <section id="touch" className="w-full py-20 px-4 border-t border-white/10">
        <div className="max-w-[1024px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#2997FF]">
              Touch
            </p>
            <h2 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight leading-tight">
              Magia na ponta dos dedos.
            </h2>
            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
              O Touch foi meticulosamente pensado para o Mac e traz um jeito novo de interagir com seu fluxo de trabalho criativo. O sensor não é uma camada sobreposta que gera reflexos — ele é integrado ao painel da tela.
            </p>
            <ul className="space-y-3 text-zinc-400 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0071E3]" />
                Edite áudio, vídeos e fotos diretamente com as mãos
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0071E3]" />
                Rejeição de palma inteligente e latência ultrabaixa
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0071E3]" />
                Acabamento nano-texture disponível para reduzir reflexos
              </li>
            </ul>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
            >
              <source src="/apple-official/macbook-pro-proled/anim-touch.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          6. Deep Dive: Apple Intelligence & Chips M5
      ──────────────────────────────────────────────────────────────────────── */}
      <section id="chips" className="w-full bg-[#0A0A0A] py-20 px-4 border-t border-white/10">
        <div className="max-w-[1024px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl order-2 md:order-1">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
            >
              <source src="/apple-official/macbook-pro-proled/anim-chip.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="space-y-6 order-1 md:order-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#2997FF]">
              Performance Pro
            </p>
            <h2 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight leading-tight">
              M5 Pro & M5 Max. Potência sem limites.
            </h2>
            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
              Desenvolvidos para os fluxos de trabalho mais exigentes de engenharia, animação 3D e edição cinematográfica em 8K. Equipados com Neural Engine de alta velocidade para acelerar modelos de Inteligência Artificial nativos.
            </p>
            <div className="pt-2">
              <a
                href={buyWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[15px] font-medium rounded-full transition-colors"
              >
                Consultar valores com a nossa equipe
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          7. Bottom CTA Bar
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 text-center px-4 border-t border-white/10 bg-gradient-to-b from-black to-[#0E0E10]">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight">
            Garanta seu MacBook Pro na Mundo Apple.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Aparelhos com procedência garantida, 1 ano de garantia Apple, parcelamento em até 18x no cartão e entrega rápida.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href={buyWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[16px] font-medium rounded-full transition-colors shadow-lg shadow-[#0071E3]/25"
            >
              Falar no WhatsApp e Comprar
            </a>
            <Link
              href="/troca"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-[16px] font-medium rounded-full transition-colors"
            >
              Dar meu Mac usado na troca
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
