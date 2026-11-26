import React from "react";
import { getProducts } from "@/lib/data";
import { AppleOfficialHeroSection } from "@/components/home/AppleOfficialHeroSection";
import { AppleOfficialPromoGrid } from "@/components/home/AppleOfficialPromoGrid";
import { BrandIntroSplash } from "@/components/home/BrandIntroSplash";
import { IPhonePuzzleShowcase } from "@/components/home/IPhonePuzzleShowcase";
import { TalesProductCatalog } from "@/components/products/TalesProductCatalog";
import { FAQSection } from "@/components/home/FAQSection";
import { StoreLocationSection } from "@/components/home/StoreLocationSection";

export default async function HomePage() {
  const activeProducts = await getProducts({ condition: "new" });

  return (
    <>
      {/* 0. Vinheta Curta de Marca (1x por sessão, GPU-only, interruptível) */}
      <BrandIntroSplash />

      {/* 0.5. Destaque Interativo iPhone 18 Pro — Quebra-Cabeça 3D guiado pela rolagem */}
      <IPhonePuzzleShowcase />

      {/* 1. Grandes Heroes Oficiais Apple */}
      <AppleOfficialHeroSection />

      {/* 2. Destaques em Duas Colunas */}
      <AppleOfficialPromoGrid />

      {/* 3. Vitrine Oficial de Produtos Novos (Estilo PJT Tales - Abas, Filtros e Cards Interativos) */}
      <TalesProductCatalog products={activeProducts} />

      {/* 4. Sobre a Loja Física Santa Ifigênia */}
      <StoreLocationSection />
      <div id="faq" className="scroll-mt-16"><FAQSection /></div>
    </>
  );
}
