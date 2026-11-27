import React from "react";
import { getProducts } from "@/lib/data";
import { AppleOfficialHeroSection } from "@/components/home/AppleOfficialHeroSection";
import { AppleOfficialPromoGrid } from "@/components/home/AppleOfficialPromoGrid";
import { TalesProductCatalog } from "@/components/products/TalesProductCatalog";
import { FAQSection } from "@/components/home/FAQSection";
import { StoreLocationSection } from "@/components/home/StoreLocationSection";

export default async function HomePage() {
  const activeProducts = await getProducts({ condition: "new" });

  return (
    <>
      {/* 1. Grandes Heroes Oficiais Apple */}
      <AppleOfficialHeroSection />

      {/* 2. Destaques em Duas Colunas */}
      <AppleOfficialPromoGrid />

      {/* 3. Vitrine Oficial de Produtos Novos (Abas, Filtros e Cards Interativos) */}
      <TalesProductCatalog products={activeProducts} />

      {/* 4. Sobre a Loja Física Santa Ifigênia */}
      <StoreLocationSection />
      <div id="faq" className="scroll-mt-16"><FAQSection /></div>
    </>
  );
}
