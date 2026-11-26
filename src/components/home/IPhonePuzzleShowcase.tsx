"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, MessageCircle } from "lucide-react";
import { createWhatsAppLink } from "@/utils/whatsapp";

interface DeviceConfig {
  id: string;
  name: string;
  image: string;
  aspect: number; // natural width / height
  cols: number;
  rows: number;
  // Layout inside the 3:2 family studio stage
  className: string;
  zClass: string;
  // Act 1 (0 -> 26% scroll): 3D parallax separation before shattering
  sepX: number; // fraction of stage width
  sepY: number; // fraction of stage height
  sepZ: number; // px
  sepRotX: number;
  sepRotY: number;
  sepRotZ: number;
  sepScale: number;
  // Center bias when pieces launch across the entire screen
  launchBiasX: number;
  launchBiasY: number;
}

const ECOSYSTEM_DEVICES: DeviceConfig[] = [
  {
    id: "macbook",
    name: "MacBook Pro M6",
    image: "/images/hero-ecosystem/macbook-pro-m6.png",
    aspect: 822 / 501,
    cols: 4,
    rows: 3,
    className: "left-[12%] top-[4%] w-[76%]",
    zClass: "z-10",
    sepX: 0,
    sepY: -0.08,
    sepZ: -35,
    sepRotX: 6,
    sepRotY: 0,
    sepRotZ: 0,
    sepScale: 0.96,
    launchBiasX: 0,
    launchBiasY: -0.18,
  },
  {
    id: "duo",
    name: "iPhone Duo",
    image: "/images/hero-ecosystem/iphone-duo.png",
    aspect: 842 / 551,
    cols: 3,
    rows: 2,
    className: "left-[1%] bottom-[5%] w-[48%]",
    zClass: "z-20",
    sepX: -0.09,
    sepY: 0.06,
    sepZ: 60,
    sepRotX: -4,
    sepRotY: 10,
    sepRotZ: -2,
    sepScale: 1.05,
    launchBiasX: -0.22,
    launchBiasY: 0.08,
  },
  {
    id: "watch",
    name: "Apple Watch Ultra 4",
    image: "/images/hero-ecosystem/watch-ultra-4.png",
    aspect: 501 / 814,
    cols: 2,
    rows: 2,
    className: "right-[14%] bottom-[7%] w-[21.5%]",
    zClass: "z-30",
    sepX: 0.08,
    sepY: -0.05,
    sepZ: 88,
    sepRotX: 4,
    sepRotY: -12,
    sepRotZ: 6,
    sepScale: 1.07,
    launchBiasX: 0.16,
    launchBiasY: -0.1,
  },
  {
    id: "airpods",
    name: "AirPods 5",
    image: "/images/hero-ecosystem/airpods-5.png",
    aspect: 388 / 559,
    cols: 2,
    rows: 2,
    className: "right-[1%] bottom-[2%] w-[15.5%]",
    zClass: "z-40",
    sepX: 0.11,
    sepY: 0.08,
    sepZ: 120,
    sepRotX: -6,
    sepRotY: -8,
    sepRotZ: -9,
    sepScale: 1.1,
    launchBiasX: 0.24,
    launchBiasY: 0.18,
  },
];

interface PuzzlePiece {
  id: string;
  deviceIdx: number;
  path: string;
  cx: number;
  cy: number;
  dirX: number;
  dirY: number;
  depth: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  startDelay: number;
}

function appendJigsawEdge(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  sign: number,
  aspect: number
): string {
  if (sign === 0) {
    return `L ${bx.toFixed(5)} ${by.toFixed(5)} `;
  }

  const dx = bx - ax;
  const dy = by - ay;
  // Aspect-compensated perpendicular normal so every jigsaw knob stays round on any product ratio
  const nx = (-dy / aspect) * sign;
  const ny = dx * aspect * sign;

  const pt = (u: number, v: number) =>
    `${(ax + dx * u + nx * v).toFixed(5)} ${(ay + dy * u + ny * v).toFixed(5)}`;

  return (
    `C ${pt(0.2, 0)} ${pt(0.32, -0.05)} ${pt(0.38, 0.02)} ` +
    `C ${pt(0.42, 0.08)} ${pt(0.32, 0.22)} ${pt(0.5, 0.22)} ` +
    `C ${pt(0.68, 0.22)} ${pt(0.58, 0.08)} ${pt(0.62, 0.02)} ` +
    `C ${pt(0.68, -0.05)} ${pt(0.8, 0)} ${pt(1, 0)} `
  );
}

function buildDevicePieces(device: DeviceConfig, deviceIdx: number): PuzzlePiece[] {
  const { cols, rows, aspect, id, launchBiasX, launchBiasY } = device;

  const hEdges: number[][] = Array.from({ length: rows - 1 }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ((r * 3 + c * 5 + deviceIdx) % 2 === 0 ? 1 : -1))
  );
  const vEdges: number[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols - 1 }, (_, c) => ((r * 5 + c * 3 + deviceIdx + 1) % 2 === 0 ? 1 : -1))
  );

  const pieces: PuzzlePiece[] = [];
  const cw = 1 / cols;
  const ch = 1 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = c * cw;
      const x1 = (c + 1) * cw;
      const y0 = r * ch;
      const y1 = (r + 1) * ch;

      const topSign = r === 0 ? 0 : hEdges[r - 1][c];
      const rightSign = c === cols - 1 ? 0 : vEdges[r][c];
      const bottomSign = r === rows - 1 ? 0 : -hEdges[r][c];
      const leftSign = c === 0 ? 0 : -vEdges[r][c - 1];

      const path =
        `M ${x0.toFixed(5)} ${y0.toFixed(5)} ` +
        appendJigsawEdge(x0, y0, x1, y0, topSign, aspect) +
        appendJigsawEdge(x1, y0, x1, y1, rightSign, aspect) +
        appendJigsawEdge(x1, y1, x0, y1, bottomSign, aspect) +
        appendJigsawEdge(x0, y1, x0, y0, leftSign, aspect) +
        "Z";

      const cx = (c + 0.5) * cw;
      const cy = (r + 0.5) * ch;

      const vx = cx - 0.5;
      const vy = cy - 0.5;
      const dist = Math.hypot(vx, vy);
      const normDist = Math.min(1, dist / 0.72);
      const angle = Math.atan2(vy, vx);

      const seed =
        Math.sin((deviceIdx + 1) * 31.7 + (r + 1) * 14.9898 + (c + 1) * 78.233) * 43758.5453;
      const frac = seed - Math.floor(seed);
      const signed = (frac - 0.5) * 2;

      const mag = 0.52 + normDist * 0.65 + frac * 0.25;
      const dirX = Math.cos(angle) * mag + launchBiasX + signed * 0.14;
      const dirY = Math.sin(angle) * mag + launchBiasY + signed * 0.14;

      // Foreground devices (AirPods/Watch/Duo) soar closer toward viewer while MacBook sweeps wide
      const baseDepthSign = deviceIdx >= 2 ? 1 : (r + c) % 2 === 0 ? 1 : -0.5;
      const depth = baseDepthSign * (0.45 + frac * 0.55);

      // Foreground devices break slightly earlier, outer shards before inner shards
      const deviceLead = (3 - deviceIdx) * 0.025;
      const startDelay = clamp01(deviceLead + (1 - normDist) * 0.14);

      pieces.push({
        id: `eco-${id}-${r}-${c}`,
        deviceIdx,
        path,
        cx,
        cy,
        dirX,
        dirY,
        depth,
        rotX: vy * -64 + signed * 22,
        rotY: vx * 78 + signed * 24,
        rotZ: signed * 44 + vx * 28,
        startDelay,
      });
    }
  }

  return pieces;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function IPhonePuzzleShowcase() {
  const [reducedMotion, setReducedMotion] = useState(false);

  const trackRef = useRef<HTMLElement>(null);
  const stageBoxRef = useRef<HTMLDivElement>(null);
  const deviceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const baseImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const puzzleLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pieceRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const act1CopyRef = useRef<HTMLDivElement>(null);
  const act2CopyRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLSpanElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const floorShadowRef = useRef<HTMLDivElement>(null);

  const devicePieces = useMemo(
    () => ECOSYSTEM_DEVICES.map((device, idx) => buildDevicePieces(device, idx)),
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || reducedMotion) return;

    let rafId = 0;

    const renderFrame = () => {
      rafId = 0;
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scrollable = Math.max(1, track.offsetHeight - vh);
      const progress = clamp01(-rect.top / scrollable);

      const stageW = stageBoxRef.current?.offsetWidth || 560;
      const stageH = stageBoxRef.current?.offsetHeight || 370;

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${Math.max(0.04, progress).toFixed(4)})`;
      }

      if (scrollHintRef.current) {
        const hintOpacity = clamp01(1 - progress / 0.09);
        scrollHintRef.current.style.opacity = hintOpacity.toFixed(3);
      }

      if (floorShadowRef.current) {
        const shadowOpacity = clamp01(1 - progress * 4.5);
        const shadowScale = 1 + progress * 0.45;
        floorShadowRef.current.style.opacity = (shadowOpacity * 0.55).toFixed(3);
        floorShadowRef.current.style.transform = `scaleX(${shadowScale.toFixed(3)})`;
      }

      // Act 1 editorial fades out cleanly as devices finish separating and begin exploding
      if (act1CopyRef.current) {
        const outT = clamp01((progress - 0.16) / 0.2);
        act1CopyRef.current.style.opacity = (1 - outT).toFixed(3);
        act1CopyRef.current.style.transform = `translate3d(0, ${(-outT * 24).toFixed(1)}px, 0)`;
        act1CopyRef.current.style.pointerEvents = outT > 0.55 ? "none" : "auto";
      }

      // Act 2 editorial emerges behind the soaring 26 full-screen puzzle pieces
      if (act2CopyRef.current) {
        const inT = clamp01((progress - 0.42) / 0.2);
        const exitT = clamp01((progress - 0.86) / 0.14);
        const opacity = inT * (1 - exitT);
        const yOffset = (1 - inT) * 24 - exitT * 18;
        act2CopyRef.current.style.opacity = opacity.toFixed(3);
        act2CopyRef.current.style.transform = `translate3d(0, ${yOffset.toFixed(1)}px, 0)`;
        act2CopyRef.current.style.pointerEvents = opacity > 0.4 ? "auto" : "none";
      }

      // Phase 1 (0 -> 0.26): 4 products separate cleanly in 3D parallax
      const SPLIT_AT = 0.26;
      const sepT = easeOutCubic(clamp01(progress / SPLIT_AT));
      // Phase 2 (0.26 -> 1.0): Each product shatters from its live 3D pose across the whole screen
      const isShattered = progress > SPLIT_AT;
      const explodeT = clamp01((progress - SPLIT_AT) / (1 - SPLIT_AT));

      const isDesktop = vw >= 1024;
      const reachX = isDesktop ? vw * 0.62 : vw * 0.7;
      const reachY = isDesktop ? vh * 0.58 : vh * 0.55;
      const desktopLeftSweepBias = isDesktop ? -vw * 0.2 : 0;

      for (let d = 0; d < ECOSYSTEM_DEVICES.length; d++) {
        const dev = ECOSYSTEM_DEVICES[d];
        const devEl = deviceRefs.current[d];

        if (devEl) {
          const sx = dev.sepX * stageW * sepT;
          const sy = dev.sepY * stageH * sepT;
          const sz = dev.sepZ * sepT;
          const srx = dev.sepRotX * sepT;
          const sry = dev.sepRotY * sepT;
          const srz = dev.sepRotZ * sepT;
          const sscale = 1 + (dev.sepScale - 1) * sepT;

          devEl.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, ${sz.toFixed(
            1
          )}px) rotateX(${srx.toFixed(1)}deg) rotateY(${sry.toFixed(1)}deg) rotateZ(${srz.toFixed(
            1
          )}deg) scale(${sscale.toFixed(3)})`;
        }

        const baseImg = baseImgRefs.current[d];
        const puzzleLayer = puzzleLayerRefs.current[d];
        if (baseImg) baseImg.style.opacity = isShattered ? "0" : "1";
        if (puzzleLayer) puzzleLayer.style.opacity = isShattered ? "1" : "0";

        const pieces = devicePieces[d];
        for (let i = 0; i < pieces.length; i++) {
          const p = pieces[i];
          const el = pieceRefs.current[p.id];
          if (!el) continue;

          if (!isShattered) {
            el.style.transform = "translate3d(0px, 0px, 0px) scale(1)";
            el.style.opacity = "1";
            continue;
          }

          const localT = clamp01((explodeT - p.startDelay) / (1 - p.startDelay));
          const eased = easeOutCubic(localT);
          const dissolveT = clamp01((localT - 0.56) / 0.44);
          const dissolveEase = dissolveT * dissolveT;

          const flight = eased * 0.9 + dissolveEase * 0.72;
          const tx = p.dirX * reachX * flight + desktopLeftSweepBias * eased;
          const ty = p.dirY * reachY * flight - dissolveEase * (vh * 0.12);
          const tz = p.depth * 260 * eased;
          const rx = p.rotX * eased;
          const ry = p.rotY * eased;
          const rz = p.rotZ * (eased + dissolveEase * 0.35);

          const depthScale =
            p.depth > 0 ? 1 + eased * 0.22 * p.depth : 1 - eased * 0.15 * Math.abs(p.depth);
          const scale = Math.max(0.35, depthScale - dissolveEase * 0.44);
          const opacity = clamp01(1 - dissolveEase * 0.96);

          el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(
            1
          )}px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) rotateZ(${rz.toFixed(
            1
          )}deg) scale(${scale.toFixed(3)})`;
          el.style.opacity = opacity.toFixed(3);
        }
      }
    };

    const scheduleRender = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();
    window.addEventListener("scroll", scheduleRender, { passive: true });
    window.addEventListener("resize", scheduleRender, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleRender);
      window.removeEventListener("resize", scheduleRender);
    };
  }, [devicePieces, reducedMotion]);

  const whatsappHref = createWhatsAppLink(
    "Olá! Vim pelo site da Mundo Apple Delivery e quero consultar valores e disponibilidade dos novos lançamentos Apple (iPhone Duo, MacBook Pro M6, Apple Watch Ultra 4 e AirPods 5)."
  );

  return (
    <section
      ref={trackRef}
      data-no-reveal
      aria-label="Lançamentos Apple — iPhone Duo, MacBook Pro M6, Apple Watch Ultra 4 e AirPods 5"
      className={`relative w-full bg-white text-[#1D1D1F] overflow-x-clip border-b border-[#EFEFF4] ${
        reducedMotion ? "py-24" : "h-[265vh] sm:h-[290vh]"
      }`}
    >
      {/* Hidden SVG clipPath definitions for all 26 interlocking jigsaw pieces across the 4 devices */}
      <svg
        className="absolute w-0 h-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {devicePieces.flat().map((piece) => (
            <clipPath
              key={piece.id}
              id={piece.id}
              clipPathUnits="objectBoundingBox"
            >
              <path d={piece.path} />
            </clipPath>
          ))}
        </defs>
      </svg>

      {/* Sticky Pure-White Apple Studio Stage */}
      <div
        className={`${
          reducedMotion ? "relative" : "sticky top-0 h-[100dvh]"
        } w-full flex flex-col justify-between overflow-x-clip overflow-y-visible pt-20 sm:pt-24 pb-6 sm:pb-8 bg-white`}
      >
        {/* Main Editorial Grid */}
        <div className="relative w-full max-w-[1180px] mx-auto px-5 sm:px-8 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-10 overflow-visible">
          {/* Left Editorial Column (z-10 so exploding transparent shards soar right OVER it!) */}
          <div className="lg:col-span-5 relative z-10 order-2 lg:order-1 min-h-[200px] sm:min-h-[245px] flex items-center">
            {/* ACT 1: Clean Apple Typography */}
            <div
              ref={act1CopyRef}
              className="w-full text-center lg:text-left space-y-3 sm:space-y-4 will-change-transform"
            >
              <div className="space-y-2">
                <h1 className="font-display text-[36px] sm:text-[50px] lg:text-[58px] font-semibold tracking-[-0.04em] leading-[1.03] text-[#1D1D1F]">
                  A nova geração Apple.
                </h1>
                <p className="font-display text-[17px] sm:text-[21px] font-medium tracking-[-0.02em] leading-[1.3] text-[#6E6E73]">
                  iPhone Duo, MacBook Pro M6, Apple Watch Ultra 4 e AirPods 5.
                </p>
              </div>

              <p className="text-sm sm:text-[15px] text-[#86868B] max-w-sm mx-auto lg:mx-0 leading-relaxed">
                100% novos lacrados com 1 ano de garantia oficial Apple e entrega expressa em São Paulo.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
                <Link
                  href="#catalogo"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] px-6 py-2.5 sm:py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-200"
                >
                  <span>Ver catálogo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#0071E3] text-[#0066CC] hover:bg-[#0071E3] hover:text-white px-5 py-2.5 sm:py-3 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar no WhatsApp</span>
                </a>
              </div>
            </div>

            {/* ACT 2: Revealed Mid-Scroll Behind the Soaring Full-Screen Puzzle Shards */}
            {!reducedMotion && (
              <div
                ref={act2CopyRef}
                style={{ opacity: 0, pointerEvents: "none" }}
                className="absolute inset-0 flex flex-col justify-center text-center lg:text-left space-y-3 sm:space-y-4 will-change-transform"
              >
                <h2 className="font-display text-[32px] sm:text-[44px] lg:text-[50px] font-semibold tracking-[-0.035em] leading-[1.06] text-[#1D1D1F]">
                  O ecossistema completo, peça por peça.
                </h2>

                <p className="text-sm sm:text-[15px] text-[#6E6E73] max-w-md mx-auto lg:mx-0 leading-relaxed">
                  Retirada presencial na Rua Santa Ifigênia ou entrega via motoboy com pagamento no ato.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
                  <Link
                    href="#catalogo"
                    className="inline-flex items-center gap-2 rounded-full bg-[#1D1D1F] text-white hover:bg-black px-6 py-2.5 sm:py-3 text-sm font-semibold transition-[background-color,transform] duration-200"
                  >
                    <span>Explorar todos os modelos</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Stage: 4 Authentic Unmodified Apple Launches — Hybrid 3D Parallax -> Full-Screen 26-Piece Explosion */}
          <div className="lg:col-span-7 relative order-1 lg:order-2 flex flex-col items-center justify-center overflow-visible">
            <div
              ref={stageBoxRef}
              className="relative z-[60] w-[340px] h-[230px] sm:w-[540px] sm:h-[360px] lg:w-[660px] lg:h-[440px] select-none pointer-events-none overflow-visible"
              style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
            >
              {ECOSYSTEM_DEVICES.map((device, dIdx) => (
                <div
                  key={device.id}
                  ref={(el) => {
                    deviceRefs.current[dIdx] = el;
                  }}
                  className={`absolute ${device.className} ${device.zClass} will-change-transform overflow-visible`}
                  style={{
                    aspectRatio: `${device.aspect}`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Pristine Unmodified Official Product Cutout (visible during rest + Phase 1 3D Separation) */}
                  <img
                    ref={(el) => {
                      baseImgRefs.current[dIdx] = el;
                    }}
                    src={device.image}
                    alt={device.name}
                    fetchPriority="high"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    style={{
                      filter:
                        dIdx === 0
                          ? "drop-shadow(0 16px 26px rgba(0,0,0,0.12))"
                          : "drop-shadow(0 14px 22px rgba(0,0,0,0.18))",
                    }}
                  />

                  {/* Interlocking Jigsaw Pieces Layer (takes over seamlessly at 26% scroll -> full-screen explosion!) */}
                  {!reducedMotion && (
                    <div
                      ref={(el) => {
                        puzzleLayerRefs.current[dIdx] = el;
                      }}
                      style={{ opacity: 0, transformStyle: "preserve-3d" }}
                      className="absolute inset-0 pointer-events-none overflow-visible"
                    >
                      {devicePieces[dIdx].map((piece) => (
                        <div
                          key={piece.id}
                          ref={(el) => {
                            pieceRefs.current[piece.id] = el;
                          }}
                          className="absolute inset-0 will-change-transform"
                          style={{
                            transformOrigin: `${(piece.cx * 100).toFixed(2)}% ${(piece.cy * 100).toFixed(2)}%`,
                          }}
                        >
                          <div
                            className="absolute inset-0"
                            style={{
                              clipPath: `url(#${piece.id})`,
                              WebkitClipPath: `url(#${piece.id})`,
                            }}
                          >
                            <img
                              src={device.image}
                              alt=""
                              aria-hidden="true"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Soft Studio Ground Shadow beneath the 4-device family (disappears cleanly on lift-off) */}
            {!reducedMotion && (
              <div
                ref={floorShadowRef}
                aria-hidden="true"
                className="relative z-10 w-[260px] sm:w-[420px] lg:w-[520px] h-4 rounded-full bg-black/[0.12] blur-xl -mt-1 pointer-events-none"
              />
            )}
          </div>
        </div>

        {/* Calm Apple Bottom Scrub Indicator */}
        {!reducedMotion && (
          <div className="relative z-10 w-full max-w-[1180px] mx-auto px-5 sm:px-8 flex flex-col items-center gap-2">
            <div
              ref={scrollHintRef}
              className="flex items-center gap-1.5 text-[11px] font-medium text-[#86868B] tracking-[0.02em]"
            >
              <span>Role para explorar</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#86868B]" />
            </div>

            <div className="w-32 sm:w-40 h-[2px] rounded-full bg-[#E5E5EA] overflow-hidden">
              <span
                ref={progressBarRef}
                className="block h-full w-full bg-[#1D1D1F] origin-left"
                style={{ transform: "scaleX(0.04)" }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
