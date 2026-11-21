import { AppleHomeBanner } from "./AppleHomeBanner";

export function AppleOfficialPromoGrid() {
  return (
    <section aria-label="Conheça os produtos Apple" className="grid grid-cols-1 gap-3 bg-white py-3 md:grid-cols-2 md:px-3">
      <AppleHomeBanner image="iphone-pro" title="iPhone 18 Pro" subtitle="Muito mais Pro." href="/iphone-18-pro" dark />
      <AppleHomeBanner image="watch" title="Apple Watch Series 12" subtitle="Saúde e conexão no seu pulso." href="/apple-watch" logo="watch-logo" dark bottomCopy />
      <AppleHomeBanner image="macbook" title="MacBook Pro" subtitle="Modelo de 14 polegadas agora com M6." href="/mac" dark availability />
      <AppleHomeBanner image="imac" title="iMac" subtitle={"Complllllletão.\nE de chip novo."} href="/mac" availability purchaseLabel="Ver preços" />
      <AppleHomeBanner image="ipad" title="iPad mini" subtitle="O mini que é o máximo." href="/ipad" logo="ipad-logo" availability purchaseLabel="Ver preços" />
      <AppleHomeBanner image="airpods" title="AirPods Pro 3" subtitle="Seu som. Uma nova experiência." href="/airpods" />
    </section>
  );
}
