"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, Cpu, BatteryCharging, Palette, Sparkles, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";

interface FeatureTab {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  bulletPoints: string[];
  videoSrc: string;
  icon: React.ElementType;
}

const features: FeatureTab[] = [
  {
    id: "camera",
    title: "Câmeras Pro",
    badge: "Fotografia Computacional",
    subtitle: "Zoom de estúdio e sensores de última geração.",
    description:
      "Novo sistema de lentes com revestimento antirreflexo, foco macro ultra-nítido e gravação ProRES em 4K a 120 qps diretamente para SSD externo.",
    bulletPoints: [
      "Sensor principal de 48 MP com pixels quad",
      "Teleobjetiva periscópica com zoom óptico avançado",
      "Estilos fotográficos de nova geração em tempo real",
    ],
    videoSrc: "/videos/highlights-camera.mp4",
    icon: Camera,
  },
  {
    id: "chip",
    title: "Chip A-Series Pro",
    badge: "Poder de Processamento",
    subtitle: "O chip mais avançado já criado para um smartphone.",
    description:
      "Arquitetura de ponta com ray tracing acelerado por hardware para jogos com gráficos de console e inteligência neural no próprio dispositivo.",
    bulletPoints: [
      "GPU com aceleradores dedicados de ray tracing",
      "Neural Engine de 16 núcleos para IA ultraveloz",
      "Maior largura de banda de memória unificada",
    ],
    videoSrc: "/videos/highlights-chip.mp4",
    icon: Cpu,
  },
  {
    id: "battery",
    title: "Bateria Recorde",
    badge: "Eficiência Energética",
    subtitle: "Até 33 horas de reprodução de vídeo contínua.",
    description:
      "Gestão térmica refinada aliada à eficiência do silício Apple para que você trabalhe, crie e jogue o dia inteiro longe da tomada.",
    bulletPoints: [
      "Otimização dinâmica de consumo por software e hardware",
      "Carregamento rápido MagSafe e USB-C de alta velocidade",
      "Modo de preservação inteligente da saúde da bateria",
    ],
    videoSrc: "/videos/highlights-battery.mp4",
    icon: BatteryCharging,
  },
  {
    id: "colors",
    title: "Cores & Titânio",
    badge: "Acabamento Premium",
    subtitle: "Beleza, leveza e durabilidade aeroespacial.",
    description:
      "Estrutura esculpida em liga de titânio grau 5 com bordas arredondadas ergonômicas e vidro traseiro fosco texturizado.",
    bulletPoints: [
      "Material com uma das maiores relações resistência/peso",
      "Bordas ultrafinas ao redor da tela Super Retina XDR",
      "Ceramic Shield de última geração mais resistente que qualquer vidro",
    ],
    videoSrc: "/videos/highlights-colors.mp4",
    icon: Palette,
  },
];

export const AppleTechHighlights: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("camera");
  const currentFeature = features.find((f) => f.id === activeTab) || features[0];
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [activeTab]);

  return (
    <section className="w-full bg-black text-white py-16 sm:py-24 border-t border-white/10">
      <Container size="large" className="space-y-10 sm:space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-zinc-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
            <span>Engenharia & Inovação</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display">
            A tecnologia por trás da perfeição.
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">
            Veja em ação os diferenciais que tornam a experiência Apple incomparável.
          </p>
        </div>

        {/* Tab Buttons Navigation */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {features.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black shadow-lg scale-[1.02]"
                    : "bg-white/10 text-zinc-400 hover:bg-white/15 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-apple-blue" : "text-zinc-400"}`} />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Card with Video and Details */}
        <div className="rounded-[28px] sm:rounded-[36px] overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Video in Loop */}
          <div className="lg:col-span-7 relative min-h-[350px] sm:min-h-[480px] bg-black flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              key={currentFeature.videoSrc}
              className="w-full h-full object-cover object-center"
            >
              <source src={currentFeature.videoSrc} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent lg:hidden pointer-events-none" />
          </div>

          {/* Right Column: Spec Details */}
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-bold text-apple-blue">
                {currentFeature.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
                {currentFeature.subtitle}
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed pt-1">
                {currentFeature.description}
              </p>
            </div>

            {/* Bullet Points */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              {currentFeature.bulletPoints.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <a
                href="#categoria-iphone"
                className="inline-flex items-center gap-2 text-sm font-semibold text-apple-blue hover:text-blue-400 hover:underline transition-colors"
              >
                <span>Ver aparelhos com essa tecnologia</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
