"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw, Zap, ShieldCheck, Play, Pause } from "lucide-react";
import { Container } from "@/components/ui/Container";

export const AppleHero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may require user interaction in some browsers
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className="relative w-full bg-black text-white overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-24">
      {/* Background Video / Atmosphere with Fallback Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            videoLoaded ? "opacity-70" : "opacity-0"
          }`}
        >
          <source src="/videos/hero-iphone18pro.mp4" type="video/mp4" />
        </video>

        {/* Fallback image if video is loading or unsupported */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            videoLoaded ? "opacity-0" : "opacity-60"
          }`}
          style={{ backgroundImage: "url('/images/apple-showcase/hero-main.jpg')" }}
        />

        {/* Cinematic Vignette & Gradient Overlays for Perfect Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/80" />
      </div>

      <Container size="large" className="relative z-10 w-full flex flex-col items-center text-center px-4 sm:px-6">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-white/90 mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <ShieldCheck className="w-4 h-4 text-apple-blue" />
          <span>Linha 2026/2027 · Novos, Lacrados com 1 Ano de Garantia Apple</span>
        </div>

        {/* Main Headline (Apple Style) */}
        <div className="max-w-4xl space-y-4 sm:space-y-6">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] text-white font-display leading-[1.05]">
            iPhone 18 Pro
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl text-zinc-300 font-normal tracking-[-0.02em] max-w-2xl mx-auto leading-snug">
            Titânio forjado. Câmeras sem precedentes. Desempenho que redefine tudo.
          </p>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed pt-1">
            Compre lacrado com nota e procedência ou faça upgrade do seu iPhone usado com a melhor avaliação de São Paulo.
          </p>
        </div>

        {/* Action Buttons (Apple Pill Design) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 w-full max-w-2xl">
          {/* Comprar / Catálogo */}
          <a
            href="#categoria-iphone"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-base sm:text-lg rounded-full shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-200 tracking-tight"
          >
            <span>Ver Modelos & Preços</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Simular Troca (Trade-In) */}
          <Link
            href="/troca"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/15 backdrop-blur-md text-white font-semibold text-base sm:text-lg rounded-full border border-white/20 active:scale-95 transition-all duration-200 tracking-tight"
          >
            <RefreshCw className="w-4 h-4 text-[#2997FF]" />
            <span>Simular Troca (Trade-In)</span>
          </Link>

          {/* Vender Aparelho (PIX) */}
          <Link
            href="/vender"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/15 backdrop-blur-md text-white font-semibold text-base sm:text-lg rounded-full border border-white/20 active:scale-95 transition-all duration-200 tracking-tight"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Vender Usado (PIX na Hora)</span>
          </Link>
        </div>

        {/* Video Control Play/Pause (Discreet) */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/70 hover:text-white border border-white/10 transition-all text-xs flex items-center gap-2 px-3"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[11px] font-medium">{isPlaying ? "Pausar" : "Reproduzir"}</span>
          </button>
        </div>

        {/* Pillars / Key Benefits */}
        <div className="w-full max-w-4xl mt-12 sm:mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold block">Original</span>
            <strong className="text-sm text-white font-semibold block">100% Lacrado</strong>
            <p className="text-xs text-zinc-400">1 ano garantia mundial</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold block">Trade-In</span>
            <strong className="text-sm text-white font-semibold block">Entrada no Usado</strong>
            <p className="text-xs text-zinc-400">Abatimento imediato</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[11px] uppercase tracking-wider text-blue-400 font-bold block">Pagamento</span>
            <strong className="text-sm text-white font-semibold block">Até 18x no Cartão</strong>
            <p className="text-xs text-zinc-400">Ou super desconto PIX</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold block">Delivery</span>
            <strong className="text-sm text-white font-semibold block">Express São Paulo</strong>
            <p className="text-xs text-zinc-400">Entrega ou retirada loja</p>
          </div>
        </div>
      </Container>
    </section>
  );
};
