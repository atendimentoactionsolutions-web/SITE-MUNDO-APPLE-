import React from "react";
import { products } from "@/data/products";
import { Hero } from "@/components/home/Hero";
import { MarqueeTicker } from "@/components/home/MarqueeTicker";
import { CategoryCardsGrid } from "@/components/home/CategoryCardsGrid";
import { AppleLaunchesSection } from "@/components/home/AppleLaunchesSection";
import { TradeInBanner } from "@/components/home/TradeInBanner";
import { ProductSection } from "@/components/products/ProductSection";
import { FAQSection } from "@/components/home/FAQSection";
import { TrustSection } from "@/components/home/TrustSection";
import { StoreLocationSection } from "@/components/home/StoreLocationSection";

export const revalidate = 60; // ISR 60s

export default function HomePage() {
  const activeProducts = products.filter((p) => p.active && p.condition === "new");

  // Order for iPhones
  const iphoneOrder = [
    "iphone-duo",
    "iphone-18-pro-max",
    "iphone-18-pro",
    "iphone-17-pro-max",
    "iphone-17-pro",
    "iphone-17-air",
    "iphone-17e",
    "iphone-17",
    "iphone-16",
    "iphone-15",
  ];

  // Filter products by category directly from database (Only new lacrados)
  const iphoneProducts = activeProducts
    .filter((p) => p.category === "iphone")
    .sort((a, b) => {
      const idxA = iphoneOrder.indexOf(a.slug);
      const idxB = iphoneOrder.indexOf(b.slug);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

  const macbookProducts = activeProducts.filter(
    (p) => p.category === "mac" && p.name.toLowerCase().includes("macbook")
  );
  const ipadProducts = activeProducts.filter((p) => p.category === "ipad");

  const watchOrder = [
    "apple-watch-ultra-4",
    "apple-watch-s12",
    "apple-watch-ultra-3",
    "apple-watch-s11",
    "apple-watch-se-3",
  ];
  const watchProducts = activeProducts
    .filter((p) => p.category === "watch")
    .sort((a, b) => {
      const idxA = watchOrder.indexOf(a.slug);
      const idxB = watchOrder.indexOf(b.slug);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

  const airpodsOrder = [
    "airpods-5",
    "airpods-pro-3",
    "airpods-4-anc",
    "airpods-4",
    "airpods-max-2",
  ];
  const airpodsProducts = activeProducts
    .filter((p) => p.category === "airpods")
    .sort((a, b) => {
      const idxA = airpodsOrder.indexOf(a.slug);
      const idxB = airpodsOrder.indexOf(b.slug);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

  const macProducts = activeProducts.filter(
    (p) => p.category === "mac" && !p.name.toLowerCase().includes("macbook")
  );
  const accessoriesProducts = activeProducts.filter(
    (p) => p.category === "accessories" || p.category === "acessorios"
  );

  return (
    <>
      {/* 1. Hero Apple Store Clean Editorial */}
      <Hero />

      {/* 2. Faixa Marquee Animada Infinita */}
      <MarqueeTicker />

      {/* 3. Destaques de Lançamentos Apple 2026 (Material do Drive) */}
      <AppleLaunchesSection />

      {/* 4. Seção Categorias Rápidas */}
      <CategoryCardsGrid />

      {/* 5. Banner de Troca / Trade-In */}
      <TradeInBanner />

      {/* 6. Catálogo: iPhone (Novos Lacrados) */}
      <div id="catalogo" className="scroll-mt-20" />
      <ProductSection
        id="categoria-iphone"
        title="iPhone"
        description="Produtos novos, lacrados na caixa com 1 ano de garantia oficial Apple."
        products={iphoneProducts}
        buttonText="Ver Mais iPhones →"
        categoryLink="/iphone"
        limit={8}
      />

      {/* 6. Catálogo: MacBook */}
      <ProductSection
        id="categoria-macbook"
        title="MacBook"
        description="Air e Pro com diferentes configurações para estudo, trabalho e criação."
        products={macbookProducts}
        buttonText="Ver Mais MacBooks →"
        categoryLink="/mac"
        limit={4}
      />

      {/* 7. Catálogo: iPad */}
      <ProductSection
        id="categoria-ipad"
        title="iPad"
        description="De iPad a iPad Pro, encontre o tablet ideal para suas tarefas."
        products={ipadProducts}
        buttonText="Ver Mais iPads →"
        categoryLink="/ipad"
        limit={4}
      />

      {/* 8. Catálogo: Apple Watch */}
      <ProductSection
        id="categoria-watch"
        title="Apple Watch"
        description="Series, Ultra e SE com diversas opções de acabamento e tamanho."
        products={watchProducts}
        buttonText="Ver Mais Apple Watches →"
        categoryLink="/apple-watch"
        limit={4}
      />

      {/* 9. Catálogo: AirPods */}
      <ProductSection
        id="categoria-airpods"
        title="AirPods"
        description="Áudio Apple original com garantia e procedência verificada."
        products={airpodsProducts}
        buttonText="Ver Mais AirPods →"
        categoryLink="/airpods"
        limit={4}
      />

      {/* 10. Catálogo: Mac (iMac e Mac mini) */}
      {macProducts.length > 0 && (
        <ProductSection
          id="categoria-mac"
          title="Mac"
          description="iMac e Mac mini | potência máxima para profissionais."
          products={macProducts}
          buttonText="Ver Mais Macs →"
          categoryLink="/mac"
          limit={4}
        />
      )}

      {/* 11. Catálogo: Acessórios */}
      {accessoriesProducts.length > 0 && (
        <ProductSection
          id="categoria-acessorios"
          title="Acessórios"
          description="Apple Pencil, Magic Keyboard, Magic Mouse e Magic Trackpad | acessórios originais com garantia."
          products={accessoriesProducts}
          buttonText="Ver Mais Acessórios →"
          categoryLink="/produtos?categoria=accessories"
          limit={4}
        />
      )}

      {/* 12. Garantia & Diferenciais */}
      <TrustSection />

      {/* 13. Perguntas Frequentes (FAQ Accordion) */}
      <div id="faq">
        <FAQSection />
      </div>

      {/* 14. Localização Loja Física Santa Ifigênia */}
      <StoreLocationSection />
    </>
  );
}
