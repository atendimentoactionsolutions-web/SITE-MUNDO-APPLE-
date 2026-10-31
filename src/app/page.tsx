import React from "react";
import { getProducts } from "@/lib/data";
import { AppleOfficialHeroSection } from "@/components/home/AppleOfficialHeroSection";
import { AppleOfficialPromoGrid } from "@/components/home/AppleOfficialPromoGrid";
import { ProductSection } from "@/components/products/ProductSection";
import { FAQSection } from "@/components/home/FAQSection";
import { StoreLocationSection } from "@/components/home/StoreLocationSection";

export default async function HomePage() {
  const activeProducts = await getProducts({ condition: "new" });

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

  // Filter products by category (Only new lacrados with live pricing)
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
      {/* 1. Grandes Heroes Oficiais Apple (iPhone Duo e iPhone 18 Pro) */}
      <AppleOfficialHeroSection />

      {/* 2. Promo Grid Oficial Apple 2-Colunas (Watch S12, Watch Ultra 4, iPad Air M4, Trade-In, MacBook Pro M5, AirPods 5) */}
      <AppleOfficialPromoGrid duoPrice={activeProducts.find((product) => product.id === "iphone-duo")?.priceFrom ?? 0} />

      {/* 3. Catálogo Oficial Mundo Apple (Novos Lacrados com Preços do Banco de Dados) */}
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

      {/* Catálogo: MacBook */}
      <ProductSection
        id="categoria-macbook"
        title="MacBook"
        description="Air e Pro com diferentes configurações para estudo, trabalho e criação."
        products={macbookProducts}
        buttonText="Ver Mais MacBooks →"
        categoryLink="/mac"
        limit={4}
      />

      {/* Catálogo: iPad */}
      <ProductSection
        id="categoria-ipad"
        title="iPad"
        description="De iPad a iPad Pro, encontre o tablet ideal para suas tarefas."
        products={ipadProducts}
        buttonText="Ver Mais iPads →"
        categoryLink="/ipad"
        limit={4}
      />

      {/* Catálogo: Apple Watch */}
      <ProductSection
        id="categoria-watch"
        title="Apple Watch"
        description="Series, Ultra e SE com diversas opções de acabamento e tamanho."
        products={watchProducts}
        buttonText="Ver Mais Apple Watches →"
        categoryLink="/apple-watch"
        limit={4}
      />

      {/* Catálogo: AirPods */}
      <ProductSection
        id="categoria-airpods"
        title="AirPods"
        description="Áudio Apple original com garantia e procedência verificada."
        products={airpodsProducts}
        buttonText="Ver Mais AirPods →"
        categoryLink="/airpods"
        limit={4}
      />

      {/* Catálogo: Mac (iMac e Mac mini) */}
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

      {/* Catálogo: Acessórios */}
      {accessoriesProducts.length > 0 && (
        <ProductSection
          id="categoria-acessorios"
          title="Acessórios"
          description="Apple Pencil, Magic Keyboard, Magic Mouse e Magic Trackpad originais com garantia."
          products={accessoriesProducts}
          buttonText="Ver Mais Acessórios →"
          categoryLink="/produtos?categoria=accessories"
          limit={4}
        />
      )}

      {/* 4. Localização Loja Física Santa Ifigênia */}
      <div id="localizacao" className="scroll-mt-20" />
      <StoreLocationSection />
      <div id="faq" className="scroll-mt-20"><FAQSection /></div>
    </>
  );
}
