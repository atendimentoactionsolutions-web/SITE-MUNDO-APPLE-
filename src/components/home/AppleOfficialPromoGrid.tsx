import { AppleHomeBanner } from "./AppleHomeBanner";
import { storeConfig } from "@/data/storeConfig";

export function AppleOfficialPromoGrid() {
  const ctaLabel = storeConfig.showPrices ? "Comprar" : "Consultar valor";
  return (
    <section aria-label="Conheça os produtos Apple" className="grid grid-cols-1 gap-3 bg-white py-3 md:grid-cols-2 md:px-3">
      <AppleHomeBanner image="iphone-pro" title="iPhone 18 Pro" subtitle="Muito mais Pro." href="/iphone-18-pro" dark purchaseLabel={ctaLabel} />
      <AppleHomeBanner image="watch" title="Apple Watch Series 12" subtitle="Saúde e conexão no seu pulso." href="/apple-watch" logo="watch-logo" dark bottomCopy purchaseLabel={ctaLabel} />
      <AppleHomeBanner image="macbook" title="MacBook Pro" subtitle="Modelo de 14 polegadas agora com M6." href="/mac" dark availability purchaseLabel={ctaLabel} />
      <AppleHomeBanner image="imac" title="iMac" subtitle={"Complllllletão.\nE de chip novo."} href="/mac" availability purchaseLabel={ctaLabel} />
      <AppleHomeBanner image="ipad" title="iPad mini" subtitle="O mini que é o máximo." href="/ipad" logo="ipad-logo" availability purchaseLabel={ctaLabel} />
      <AppleHomeBanner image="airpods" title="AirPods Pro 3" subtitle="Seu som. Uma nova experiência." href="/airpods" purchaseLabel={ctaLabel} />
    </section>
  );
}
