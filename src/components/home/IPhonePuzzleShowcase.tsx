"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, MessageCircle, Zap } from "lucide-react";
import { createWhatsAppLink } from "@/utils/whatsapp";

interface DeviceConfig {
  id: string;
  name: string;
  image: string;
  aspect: number; // natural width / height
  cols: number;
  rows: number;
  // Percentual position inside stage container (3:2 studio composition)
  leftPct: number;
  topPct: number;
  widthPct: number;
  // Phase 1 (0 -> 25% scroll): fast 3D parallax separation
  sepX: number; // fraction of stage width
  sepY: number; // fraction of stage height
  sepScale: number;
  // Center bias when pieces fly across the whole viewport
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
    leftPct: 12,
    topPct: 4,
    widthPct: 76,
    sepX: 0,
    sepY: -0.07,
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
    leftPct: 1,
    topPct: 45.5,
    widthPct: 48,
    sepX: -0.08,
    sepY: 0.05,
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
    leftPct: 64.5,
    topPct: 40,
    widthPct: 21.5,
    sepX: 0.075,
    sepY: -0.04,
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
    leftPct: 83.5,
    topPct: 64.5,
    widthPct: 15.5,
    sepX: 0.1,
    sepY: 0.07,
    sepScale: 1.1,
    launchBiasX: 0.24,
    launchBiasY: 0.18,
  },
];

interface BakedPiece {
  id: string;
  deviceIdx: number;
  bitmap: HTMLCanvasElement;
  // Origin center relative to device box (0..1)
  cx: number;
  cy: number;
  // Padded source crop bounds (0..1) inside device rect
  bx0: number;
  by0: number;
  bw: number;
  bh: number;
  // Flight vector
  dirX: number;
  dirY: number;
  depth: number;
  rotZ: number;
  startDelay: number;
}

function traceJigsawEdge(
  ctx: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  sign: number
) {
  if (sign === 0) {
    ctx.lineTo(bx, by);
    return;
  }

  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  // Unit perpendicular vector scaled by edge length so jigsaw tabs are always perfectly round
  const nx = (-dy / len) * sign * len;
  const ny = (dx / len) * sign * len;

  const px = (u: number, v: number) => ax + dx * u + nx * v;
  const py = (u: number, v: number) => ay + dy * u + ny * v;

  ctx.bezierCurveTo(px(0.2, 0), py(0.2, 0), px(0.32, -0.05), py(0.32, -0.05), px(0.38, 0.02), py(0.38, 0.02));
  ctx.bezierCurveTo(px(0.42, 0.08), py(0.42, 0.08), px(0.32, 0.22), py(0.32, 0.22), px(0.5, 0.22), py(0.5, 0.22));
  ctx.bezierCurveTo(px(0.68, 0.22), py(0.68, 0.22), px(0.58, 0.08), py(0.58, 0.08), px(0.62, 0.02), py(0.62, 0.02));
  ctx.bezierCurveTo(px(0.68, -0.05), py(0.68, -0.05), px(0.8, 0), py(0.8, 0), px(1, 0), py(1, 0));
}

function bakeDevicePieces(img: HTMLImageElement, device: DeviceConfig, deviceIdx: number): BakedPiece[] {
  const { cols, rows, id, launchBiasX, launchBiasY } = device;

  // Bake onto a crisp capped working resolution (~560px max side) so 26 bitmaps stay feather-light in GPU RAM
  const maxBakeDim = 560;
  const scaleDown = Math.min(1, maxBakeDim / Math.max(img.naturalWidth, img.naturalHeight));
  const fullW = Math.max(64, Math.round(img.naturalWidth * scaleDown));
  const fullH = Math.max(64, Math.round(img.naturalHeight * scaleDown));

  const hEdges: number[][] = Array.from({ length: rows - 1 }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ((r * 3 + c * 5 + deviceIdx) % 2 === 0 ? 1 : -1))
  );
  const vEdges: number[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols - 1 }, (_, c) => ((r * 5 + c * 3 + deviceIdx + 1) % 2 === 0 ? 1 : -1))
  );

  const pieces: BakedPiece[] = [];
  const cw = fullW / cols;
  const ch = fullH / rows;
  const margin = Math.ceil(Math.max(cw, ch) * 0.26);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = c * cw;
      const x1 = (c + 1) * cw;
      const y0 = r * ch;
      const y1 = (r + 1) * ch;

      const bx0 = Math.max(0, Math.floor(x0 - margin));
      const by0 = Math.max(0, Math.floor(y0 - margin));
      const bx1 = Math.min(fullW, Math.ceil(x1 + margin));
      const by1 = Math.min(fullH, Math.ceil(y1 + margin));
      const bw = Math.max(2, bx1 - bx0);
      const bh = Math.max(2, by1 - by0);

      const tileCanvas = document.createElement("canvas");
      tileCanvas.width = bw;
      tileCanvas.height = bh;
      const tctx = tileCanvas.getContext("2d");

      if (tctx) {
        tctx.save();
        tctx.beginPath();
        const lx0 = x0 - bx0;
        const lx1 = x1 - bx0;
        const ly0 = y0 - by0;
        const ly1 = y1 - by0;

        tctx.moveTo(lx0, ly0);
        traceJigsawEdge(tctx, lx0, ly0, lx1, ly0, r === 0 ? 0 : hEdges[r - 1][c]);
        traceJigsawEdge(tctx, lx1, ly0, lx1, ly1, c === cols - 1 ? 0 : vEdges[r][c]);
        traceJigsawEdge(tctx, lx1, ly1, lx0, ly1, r === rows - 1 ? 0 : -hEdges[r][c]);
        traceJigsawEdge(tctx, lx0, ly1, lx0, ly0, c === 0 ? 0 : -vEdges[r][c - 1]);
        tctx.closePath();
        tctx.clip();

        // Draw ONLY the slice of the source image into this compact pre-clipped canvas!
        tctx.drawImage(img, -bx0, -by0, fullW, fullH);
        tctx.restore();
      }

      const cx = (c + 0.5) / cols;
      const cy = (r + 0.5) / rows;
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

      const baseDepthSign = deviceIdx >= 2 ? 1 : (r + c) % 2 === 0 ? 1 : -0.45;
      const depth = baseDepthSign * (0.45 + frac * 0.55);

      const deviceLead = (3 - deviceIdx) * 0.025;
      const startDelay = clamp01(deviceLead + (1 - normDist) * 0.14);

      pieces.push({
        id: `eco-${id}-${r}-${c}`,
        deviceIdx,
        bitmap: tileCanvas,
        cx,
        cy,
        bx0: bx0 / fullW,
        by0: by0 / fullH,
        bw: bw / fullW,
        bh: bh / fullH,
        dirX,
        dirY,
        depth,
        rotZ: ((signed * 42 + vx * 28) * Math.PI) / 180,
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const act1CopyRef = useRef<HTMLDivElement>(null);
  const act2CopyRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLSpanElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const floorShadowRef = useRef<HTMLDivElement>(null);

  const bakedPiecesRef = useRef<BakedPiece[][]>([]);
  const assetsReadyRef = useRef(false);

  const stageMetrics = useMemo(() => ECOSYSTEM_DEVICES, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Slice all 4 official transparent PNGs ONCE offscreen on mount -> 0 runtime SVG clipPath cost!
  useEffect(() => {
    if (typeof window === "undefined" || reducedMotion) return;
    let cancelled = false;

    Promise.all(
      stageMetrics.map(
        (dev, idx) =>
          new Promise<BakedPiece[]>((resolve) => {
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.onload = async () => {
              try {
                if (typeof img.decode === "function") await img.decode();
              } catch {
                // Ignore decode timing error
              }
              if (cancelled) return resolve([]);
              resolve(bakeDevicePieces(img, dev, idx));
            };
            img.onerror = () => resolve([]);
            img.src = dev.image;
          })
      )
    ).then((all) => {
      if (cancelled) return;
      bakedPiecesRef.current = all;
      assetsReadyRef.current = true;
      window.dispatchEvent(new Event("mundoapple-puzzle-baked"));
    });

    return () => {
      cancelled = true;
    };
  }, [stageMetrics, reducedMotion]);

  useEffect(() => {
    if (typeof window === "undefined" || reducedMotion) return;

    let rafId = 0;
    let canvasW = 0;
    let canvasH = 0;
    let canvasDpr = 1;
    let lastScrollY = -1;
    let lastStageOffsetTop = 0;
    let lastStageOffsetLeft = 0;
    let lastStageW = 560;
    let lastStageH = 370;

    const syncCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (vw !== canvasW || vh !== canvasH || dpr !== canvasDpr) {
        canvasW = vw;
        canvasH = vh;
        canvasDpr = dpr;
        canvas.width = Math.round(vw * dpr);
        canvas.height = Math.round(vh * dpr);
      }

      if (stageBoxRef.current) {
        const sRect = stageBoxRef.current.getBoundingClientRect();
        lastStageW = sRect.width || 560;
        lastStageH = sRect.height || 370;
        lastStageOffsetLeft = sRect.left;
        lastStageOffsetTop = sRect.top;
      }
    };

    const renderFrame = (force = false) => {
      rafId = 0;
      const track = trackRef.current;
      const canvas = canvasRef.current;
      if (!track) return;

      const sy = window.scrollY;
      if (!force && sy === lastScrollY) return;
      lastScrollY = sy;

      const rect = track.getBoundingClientRect();
      const vw = canvasW || window.innerWidth;
      const vh = canvasH || window.innerHeight;
      const scrollable = Math.max(1, track.offsetHeight - vh);
      const progress = clamp01(-rect.top / scrollable);

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${Math.max(0.04, progress).toFixed(4)})`;
      }

      if (scrollHintRef.current) {
        const hintOpacity = clamp01(1 - progress / 0.08);
        scrollHintRef.current.style.opacity = hintOpacity.toFixed(3);
      }

      if (floorShadowRef.current) {
        const shadowOpacity = clamp01(1 - progress * 4.5);
        const shadowScale = 1 + progress * 0.45;
        floorShadowRef.current.style.opacity = (shadowOpacity * 0.55).toFixed(3);
        floorShadowRef.current.style.transform = `scaleX(${shadowScale.toFixed(3)})`;
      }

      // Smooth editorial handoff (Act 1 -> Act 2)
      if (act1CopyRef.current) {
        const outT = clamp01((progress - 0.14) / 0.18);
        act1CopyRef.current.style.opacity = (1 - outT).toFixed(3);
        act1CopyRef.current.style.transform = `translate3d(0, ${(-outT * 20).toFixed(1)}px, 0)`;
        act1CopyRef.current.style.pointerEvents = outT > 0.55 ? "none" : "auto";
      }

      if (act2CopyRef.current) {
        const inT = clamp01((progress - 0.36) / 0.2);
        const exitT = clamp01((progress - 0.86) / 0.14);
        const opacity = inT * (1 - exitT);
        const yOffset = (1 - inT) * 20 - exitT * 16;
        act2CopyRef.current.style.opacity = opacity.toFixed(3);
        act2CopyRef.current.style.transform = `translate3d(0, ${yOffset.toFixed(1)}px, 0)`;
        act2CopyRef.current.style.pointerEvents = opacity > 0.4 ? "auto" : "none";
      }

      // Phase 1 (0 -> 0.24): 4 lightweight DOM PNG layers separate in fast parallax
      const SPLIT_AT = 0.24;
      const sepT = easeOutCubic(clamp01(progress / SPLIT_AT));
      const inCanvasPhase = progress > SPLIT_AT && assetsReadyRef.current && rect.bottom > 0 && rect.top < vh;

      for (let d = 0; d < stageMetrics.length; d++) {
        const dev = stageMetrics[d];
        const devEl = deviceRefs.current[d];
        if (!devEl) continue;

        if (inCanvasPhase) {
          devEl.style.opacity = "0";
        } else {
          devEl.style.opacity = "1";
          const sx = dev.sepX * lastStageW * sepT;
          const syOffset = dev.sepY * lastStageH * sepT;
          const sscale = 1 + (dev.sepScale - 1) * sepT;
          devEl.style.transform = `translate3d(${sx.toFixed(1)}px, ${syOffset.toFixed(
            1
          )}px, 0) scale(${sscale.toFixed(3)})`;
        }
      }

      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (!inCanvasPhase) {
        canvas.style.opacity = "0";
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      // Refresh live stage box coordinates only while sticky canvas is active (1 read total!)
      if (stageBoxRef.current) {
        const sRect = stageBoxRef.current.getBoundingClientRect();
        lastStageW = sRect.width || 560;
        lastStageH = sRect.height || 370;
        lastStageOffsetLeft = sRect.left;
        lastStageOffsetTop = sRect.top;
      }

      canvas.style.opacity = "1";
      ctx.setTransform(canvasDpr, 0, 0, canvasDpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);

      const explodeT = clamp01((progress - SPLIT_AT) / (1 - SPLIT_AT));
      const isDesktop = vw >= 1024;
      const reachX = isDesktop ? vw * 0.6 : vw * 0.68;
      const reachY = isDesktop ? vh * 0.56 : vh * 0.54;
      const desktopLeftSweepBias = isDesktop ? -vw * 0.2 : 0;

      const bakedGroups = bakedPiecesRef.current;

      for (let d = 0; d < stageMetrics.length; d++) {
        const dev = stageMetrics[d];
        const pieces = bakedGroups[d];
        if (!pieces || pieces.length === 0) continue;

        // Compute exact base device rectangle on screen at end of Phase 1 separation
        const devW = (dev.widthPct / 100) * lastStageW * dev.sepScale;
        const devH = devW / dev.aspect;
        const unscaledW = (dev.widthPct / 100) * lastStageW;
        const unscaledH = unscaledW / dev.aspect;
        const devCenterX =
          lastStageOffsetLeft + (dev.leftPct / 100) * lastStageW + unscaledW * 0.5 + dev.sepX * lastStageW;
        const devCenterY =
          lastStageOffsetTop + (dev.topPct / 100) * lastStageH + unscaledH * 0.5 + dev.sepY * lastStageH;
        const devLeft = devCenterX - devW * 0.5;
        const devTop = devCenterY - devH * 0.5;

        for (let i = 0; i < pieces.length; i++) {
          const p = pieces[i];
          const localT = clamp01((explodeT - p.startDelay) / (1 - p.startDelay));
          const eased = easeOutCubic(localT);
          const dissolveT = clamp01((localT - 0.58) / 0.42);
          const dissolveEase = dissolveT * dissolveT;

          const alpha = clamp01(1 - dissolveEase * 0.96);
          if (alpha <= 0.01) continue;

          const flight = eased * 0.9 + dissolveEase * 0.72;
          const tx = p.dirX * reachX * flight + desktopLeftSweepBias * eased;
          const ty = p.dirY * reachY * flight - dissolveEase * (vh * 0.12);
          const rot = p.rotZ * (eased + dissolveEase * 0.35);

          const depthScale =
            p.depth > 0 ? 1 + eased * 0.28 * p.depth : 1 - eased * 0.18 * Math.abs(p.depth);
          const scale = Math.max(0.35, depthScale - dissolveEase * 0.42);

          const pivotX = devLeft + p.cx * devW + tx;
          const pivotY = devTop + p.cy * devH + ty;
          const drawOffsetX = (p.bx0 - p.cx) * devW;
          const drawOffsetY = (p.by0 - p.cy) * devH;
          const drawW = p.bw * devW;
          const drawH = p.bh * devH;

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(pivotX, pivotY);
          ctx.rotate(rot);
          ctx.scale(scale, scale);
          ctx.drawImage(p.bitmap, drawOffsetX, drawOffsetY, drawW, drawH);
          ctx.restore();
        }
      }
    };

    const scheduleRender = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(() => renderFrame(false));
      }
    };

    const handleResize = () => {
      syncCanvasSize();
      renderFrame(true);
    };

    const handleBaked = () => {
      syncCanvasSize();
      renderFrame(true);
    };

    syncCanvasSize();
    renderFrame(true);
    window.addEventListener("scroll", scheduleRender, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mundoapple-puzzle-baked", handleBaked);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleRender);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mundoapple-puzzle-baked", handleBaked);
    };
  }, [stageMetrics, reducedMotion]);

  const whatsappHref = createWhatsAppLink(
    "Olá! Vim pelo site da Mundo Apple Delivery e quero consultar valores e disponibilidade dos novos lançamentos Apple (iPhone Duo, MacBook Pro M6, Apple Watch Ultra 4 e AirPods 5)."
  );

  return (
    <section
      ref={trackRef}
      data-no-reveal
      aria-label="Lançamentos Apple — iPhone Duo, MacBook Pro M6, Apple Watch Ultra 4 e AirPods 5"
      className={`relative w-full bg-white text-[#1D1D1F] overflow-x-clip border-b border-[#EFEFF4] ${
        reducedMotion ? "py-24" : "h-[225vh] sm:h-[250vh]"
      }`}
    >
      {/* Sticky Pure-White Apple Studio Stage */}
      <div
        className={`${
          reducedMotion ? "relative" : "sticky top-0 h-[100dvh]"
        } w-full flex flex-col justify-between overflow-hidden pt-20 sm:pt-24 pb-6 sm:pb-8 bg-white`}
      >
        {/* Single High-FPS Viewport Canvas — draws all 26 pre-baked puzzle shards over EVERYTHING on screen */}
        {!reducedMotion && (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{ opacity: 0 }}
            className="fixed inset-0 z-[60] w-full h-[100dvh] pointer-events-none"
          />
        )}

        {/* Main Editorial Grid */}
        <div className="relative z-10 w-full max-w-[1180px] mx-auto px-5 sm:px-8 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-10">
          {/* Left Editorial Column */}
          <div className="lg:col-span-5 relative order-2 lg:order-1 min-h-[210px] sm:min-h-[255px] flex items-center">
            {/* ACT 1: Clean Apple Typography + Buy & Sell CTAs */}
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
                Aparelhos 100% novos lacrados com 1 ano de garantia Apple. Também compramos seu Apple usado no PIX na hora.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
                <Link
                  href="#catalogo"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-200"
                >
                  <span>Ver catálogo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/vender"
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 sm:py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-200"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Vender meu Apple</span>
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#D2D2D7] text-[#1D1D1F] hover:border-[#1D1D1F] hover:bg-[#F5F5F7] px-4 py-2.5 sm:py-3 text-sm font-semibold transition-[background-color,border-color,transform] duration-200"
                >
                  <MessageCircle className="w-4 h-4 text-[#16A34A]" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* ACT 2: Revealed Mid-Scroll Behind the Soaring Canvas Shards */}
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
                  Compre novos lacrados ou venda seu iPhone, MacBook, iPad e Watch usados com pagamento via PIX na hora.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
                  <Link
                    href="/vender"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 sm:py-3 text-sm font-semibold transition-[background-color,transform] duration-200"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Vender produto Apple</span>
                  </Link>
                  <Link
                    href="#catalogo"
                    className="inline-flex items-center gap-2 rounded-full bg-[#1D1D1F] text-white hover:bg-black px-6 py-2.5 sm:py-3 text-sm font-semibold transition-[background-color,transform] duration-200"
                  >
                    <span>Ver modelos novos</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Stage: 4 Lightweight Native IMG Layers (Zero DOM SVG clipPath / Zero Lag!) */}
          <div className="lg:col-span-7 relative order-1 lg:order-2 flex flex-col items-center justify-center">
            <div
              ref={stageBoxRef}
              className="relative w-[340px] h-[230px] sm:w-[540px] sm:h-[360px] lg:w-[660px] lg:h-[440px] select-none pointer-events-none"
            >
              {stageMetrics.map((device, dIdx) => (
                <div
                  key={device.id}
                  ref={(el) => {
                    deviceRefs.current[dIdx] = el;
                  }}
                  className={`absolute will-change-transform ${
                    dIdx === 0 ? "z-10" : dIdx === 1 ? "z-20" : dIdx === 2 ? "z-30" : "z-40"
                  }`}
                  style={{
                    left: `${device.leftPct}%`,
                    top: `${device.topPct}%`,
                    width: `${device.widthPct}%`,
                    aspectRatio: `${device.aspect}`,
                  }}
                >
                  <img
                    src={device.image}
                    alt={device.name}
                    fetchPriority="high"
                    className="w-full h-full object-contain pointer-events-none"
                  />
                </div>
              ))}
            </div>

            {/* Soft Studio Ground Shadow beneath the 4-device family */}
            {!reducedMotion && (
              <div
                ref={floorShadowRef}
                aria-hidden="true"
                className="w-[260px] sm:w-[420px] lg:w-[520px] h-4 rounded-full bg-black/[0.12] blur-xl -mt-1 pointer-events-none"
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
