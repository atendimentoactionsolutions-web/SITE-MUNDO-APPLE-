"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { createWhatsAppLink } from "@/utils/whatsapp";
import { View, Box, RefreshCw, Smartphone, Rotate3d, Check } from "lucide-react";

interface ColorOption {
  id: "bordo" | "glacier" | "silver" | "black";
  name: "Bordô" | "Glacial" | "Prateado" | "Preto";
  swatchHex: string;
  threeColor: number;
  glassColor: number;
  metalness: number;
  roughness: number;
  image: string;
}

const colors: ColorOption[] = [
  {
    id: "bordo",
    name: "Bordô",
    swatchHex: "#5B242A",
    threeColor: 0x4e1a22,
    glassColor: 0x5a1e28,
    metalness: 0.85,
    roughness: 0.28,
    image: "/apple-official/iphone-18-pro/color_burgundy.jpg",
  },
  {
    id: "glacier",
    name: "Glacial",
    swatchHex: "#8B95A0",
    threeColor: 0x76808c,
    glassColor: 0x88929e,
    metalness: 0.88,
    roughness: 0.24,
    image: "/apple-official/iphone-18-pro/color_glacier.jpg",
  },
  {
    id: "silver",
    name: "Prateado",
    swatchHex: "#E2E4E8",
    threeColor: 0xd6d8dc,
    glassColor: 0xe8eaed,
    metalness: 0.92,
    roughness: 0.2,
    image: "/apple-official/iphone-18-pro/color_silver.jpg",
  },
  {
    id: "black",
    name: "Preto",
    swatchHex: "#27282A",
    threeColor: 0x1f2022,
    glassColor: 0x2b2c2e,
    metalness: 0.86,
    roughness: 0.3,
    image: "/apple-official/iphone-18-pro/color_black.jpg",
  },
];

export const IPhone18Pro3DViewer: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(colors[0]);
  const [selectedSize, setSelectedSize] = useState<"6.3" | "6.9">("6.3");
  const [viewMode, setViewMode] = useState<"3d" | "photo">("3d");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<{
    titanium?: THREE.MeshStandardMaterial;
    backGlass?: THREE.MeshPhysicalMaterial;
  }>({});

  // WhatsApp Link personalized with selection
  const modelFullName = selectedSize === "6.9" ? "iPhone 18 Pro Max (6,9\")" : "iPhone 18 Pro (6,3\")";
  const whatsAppUrl = createWhatsAppLink(
    `Olá! Vim pela página oficial do iPhone 18 Pro no site da Mundo Apple Delivery. Gostaria de adquirir o *${modelFullName}* na cor *${selectedColor.name}*. Como funciona o pagamento e a entrega expressa em SP?`
  );

  // Initialize Three.js 3D Scene
  useEffect(() => {
    if (viewMode !== "3d" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 520;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const rimLightLeft = new THREE.DirectionalLight(0x70a5ff, 1.8);
    rimLightLeft.position.set(-4, 2, -2);
    scene.add(rimLightLeft);

    const rimLightRight = new THREE.DirectionalLight(0xffd4b8, 1.4);
    rimLightRight.position.set(4, -2, -2);
    scene.add(rimLightRight);

    // Model Group
    const group = new THREE.Group();
    scene.add(group);
    modelGroupRef.current = group;

    // Scale according to size
    const scaleFactor = selectedSize === "6.9" ? 1.08 : 1.0;
    group.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Dimensions for unibody phone
    const w = 1.8;
    const h = 3.7;
    const d = 0.22;
    const r = 0.32; // Corner radius

    // 1. Titanium Frame (Chassis)
    const frameGeo = new THREE.BoxGeometry(w, h, d, 8, 8, 8);
    const frameMat = new THREE.MeshStandardMaterial({
      color: selectedColor.threeColor,
      metalness: selectedColor.metalness,
      roughness: selectedColor.roughness,
    });
    materialsRef.current.titanium = frameMat;
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    group.add(frameMesh);

    // 2. Back Glass Panel
    const backGeo = new THREE.PlaneGeometry(w * 0.95, h * 0.95);
    const backMat = new THREE.MeshPhysicalMaterial({
      color: selectedColor.glassColor,
      metalness: 0.1,
      roughness: 0.35,
      transmission: 0.2,
      thickness: 0.5,
      reflectivity: 0.5,
    });
    materialsRef.current.backGlass = backMat;
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.z = -d / 2 - 0.005;
    backMesh.rotation.y = Math.PI;
    group.add(backMesh);

    // 3. Apple Logo on Back
    const logoGeo = new THREE.CircleGeometry(0.16, 32);
    const logoMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.1,
    });
    const logoMesh = new THREE.Mesh(logoGeo, logoMat);
    logoMesh.position.z = -d / 2 - 0.01;
    logoMesh.rotation.y = Math.PI;
    group.add(logoMesh);

    // 4. Front OLED Display
    const frontGeo = new THREE.PlaneGeometry(w * 0.94, h * 0.96);
    const frontMat = new THREE.MeshBasicMaterial({
      color: 0x050505,
    });
    const frontMesh = new THREE.Mesh(frontGeo, frontMat);
    frontMesh.position.z = d / 2 + 0.005;
    group.add(frontMesh);

    // 5. Dynamic Island on Display
    const islandGeo = new THREE.BoxGeometry(0.42, 0.12, 0.01);
    const islandMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const islandMesh = new THREE.Mesh(islandGeo, islandMat);
    islandMesh.position.set(0, h * 0.42, d / 2 + 0.008);
    group.add(islandMesh);

    // 6. Camera Bump Plateau
    const bumpW = 0.85;
    const bumpH = 0.92;
    const bumpD = 0.1;
    const bumpGeo = new THREE.BoxGeometry(bumpW, bumpH, bumpD);
    const bumpMat = new THREE.MeshStandardMaterial({
      color: selectedColor.threeColor,
      metalness: selectedColor.metalness,
      roughness: selectedColor.roughness * 1.2,
    });
    const bumpMesh = new THREE.Mesh(bumpGeo, bumpMat);
    bumpMesh.position.set(-w * 0.22, h * 0.3, -d / 2 - bumpD / 2);
    group.add(bumpMesh);

    // 7. Triple Pro Camera Lenses
    const lensRingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.15,
    });
    const lensGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a101d,
      metalness: 0.2,
      roughness: 0.05,
      transmission: 0.7,
      reflectivity: 0.9,
    });

    const lensPositions = [
      [-w * 0.32, h * 0.4, -d / 2 - bumpD - 0.04],
      [-w * 0.32, h * 0.2, -d / 2 - bumpD - 0.04],
      [-w * 0.12, h * 0.3, -d / 2 - bumpD - 0.04],
    ];

    lensPositions.forEach(([lx, ly, lz]) => {
      const ringGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.06, 32);
      const ringMesh = new THREE.Mesh(ringGeo, lensRingMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.set(lx, ly, lz);
      group.add(ringMesh);

      const lensGeo = new THREE.CircleGeometry(0.15, 32);
      const lensMesh = new THREE.Mesh(lensGeo, lensGlassMat);
      lensMesh.position.set(lx, ly, lz - 0.035);
      lensMesh.rotation.y = Math.PI;
      group.add(lensMesh);
    });

    // Initial slight angle
    group.rotation.y = -0.35;
    group.rotation.x = 0.15;

    // Interactive Drag / Touch Orbit Controls
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let targetRotY = -0.35;
    let targetRotX = 0.15;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevX = clientX;
      prevY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevX;
      const deltaY = clientY - prevY;

      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.008;

      // Clamp vertical tilt
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));

      prevX = clientX;
      prevY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    canvas.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto rotation when idle
      if (!isDragging) {
        targetRotY += 0.003;
      }

      // Smooth damping interpolation
      group.rotation.y += (targetRotY - group.rotation.y) * 0.08;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      const newW = canvas.clientWidth;
      const newH = canvas.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH, false);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      canvas.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      renderer.dispose();
    };
  }, [viewMode, selectedSize]);

  // Update materials when color changes
  useEffect(() => {
    if (materialsRef.current.titanium) {
      materialsRef.current.titanium.color.setHex(selectedColor.threeColor);
      materialsRef.current.titanium.metalness = selectedColor.metalness;
      materialsRef.current.titanium.roughness = selectedColor.roughness;
    }
    if (materialsRef.current.backGlass) {
      materialsRef.current.backGlass.color.setHex(selectedColor.glassColor);
    }
  }, [selectedColor]);

  return (
    <div className="w-full bg-[#161617] text-white rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl overflow-hidden">
      {/* Top Controls: Mode & Size */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-xs uppercase tracking-widest text-[#86868B] font-semibold">
            Visualizador 3D Interativo
          </p>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight font-display text-white">
            {modelFullName} em {selectedColor.name}
          </h3>
        </div>

        {/* Size Pills */}
        <div className="flex items-center gap-2 bg-black/60 p-1 rounded-full border border-white/10">
          <button
            type="button"
            onClick={() => setSelectedSize("6.3")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedSize === "6.3"
                ? "bg-[#0071E3] text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            6,3" Pro
          </button>
          <button
            type="button"
            onClick={() => setSelectedSize("6.9")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedSize === "6.9"
                ? "bg-[#0071E3] text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            6,9" Pro Max
          </button>
        </div>
      </div>

      {/* Main Canvas / Image Area */}
      <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[520px] flex items-center justify-center my-4 select-none">
        {viewMode === "3d" ? (
          <>
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
            />
            {/* Drag hint badge */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-zinc-300 flex items-center gap-2 pointer-events-none">
              <Rotate3d className="w-3.5 h-3.5 text-[#2997FF] animate-spin-slow" />
              <span>Arraste para girar em 360°</span>
            </div>
          </>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center animate-in fade-in duration-300">
            <Image
              src={selectedColor.image}
              alt={`iPhone 18 Pro ${selectedColor.name}`}
              fill
              className="object-contain"
              priority
            />
          </div>
        )}

        {/* View Switcher (3D vs Studio Photo) */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-full border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={`px-3 py-1 rounded-full font-medium transition-colors flex items-center gap-1 ${
              viewMode === "3d" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("photo")}
            className={`px-3 py-1 rounded-full font-medium transition-colors flex items-center gap-1 ${
              viewMode === "photo" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            <View className="w-3.5 h-3.5" />
            <span>Foto</span>
          </button>
        </div>
      </div>

      {/* Bottom Dock: Color Swatches & CTAs */}
      <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Colors */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="text-xs text-zinc-400 font-medium">Acabamento em Titânio:</span>
          <div className="flex items-center gap-3">
            {colors.map((c) => {
              const isSelected = selectedColor.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`group relative flex items-center justify-center w-9 h-9 rounded-full transition-transform ${
                    isSelected ? "scale-110 ring-2 ring-[#0071E3] ring-offset-2 ring-offset-[#161617]" : "hover:scale-105"
                  }`}
                  aria-label={`Cor ${c.name}`}
                  title={c.name}
                >
                  <span
                    className="w-7 h-7 rounded-full shadow-inner border border-white/20 flex items-center justify-center"
                    style={{ backgroundColor: c.swatchHex }}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white/90" />}
                  </span>
                </button>
              );
            })}
          </div>
          <span className="text-xs font-semibold text-white tracking-wide">
            {selectedColor.name}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
          {/* Apple AR Quick Look USDZ Link */}
          <a
            rel="ar"
            href="/apple-official/iphone-18-pro/iphone_18_pro_ar.usdz"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors"
            title="Ver em Realidade Aumentada no seu ambiente"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#2997FF]" />
            <span>Ver em AR</span>
          </a>

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-lg shadow-[#0071E3]/25"
          >
            Comprar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
