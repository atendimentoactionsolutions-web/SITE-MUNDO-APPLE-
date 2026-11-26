import Link from "next/link";
import { createWhatsAppLink } from "@/utils/whatsapp";

interface AppleHomeBannerProps {
  image: string;
  title: string;
  subtitle: string;
  href: string;
  dark?: boolean;
  hero?: boolean;
  logo?: string;
  bottomCopy?: boolean;
  availability?: boolean;
  price?: React.ReactNode;
  purchaseHref?: string;
  purchaseLabel?: string;
}

export function AppleHomeBanner({ image, title, subtitle, href, dark = false,
  hero = false, logo, bottomCopy = false, availability, price, purchaseHref,
  purchaseLabel = "Comprar" }: AppleHomeBannerProps) {
  const whatsapp = createWhatsAppLink(`Olá! Vim pelo site da Mundo Apple Delivery e quero consultar valores e disponibilidade do ${title}. Pode me atender?`);
  return (
    <article
      data-reveal="banner"
      className={`apple-banner relative isolate overflow-hidden text-center ${hero ? "h-[540px] sm:h-[650px] lg:h-[692px]" : "h-[500px] sm:h-[580px]"} ${dark ? "bg-black text-white" : "bg-[#f5f5f7] text-[#1d1d1f]"}`}
    >
      <picture className="absolute inset-0 -z-10 block">
        <source media="(max-width: 734px)" srcSet={`/apple-official/home/${image}-small.jpg`} />
        <img src={`/apple-official/home/${image}-large.jpg`} alt={title}
          loading="lazy"
          className="apple-banner-img h-full w-full object-cover object-center" />
      </picture>
      <div className={`relative mx-auto flex max-w-2xl flex-col items-center px-5 ${bottomCopy ? "h-full pb-8 sm:pb-10" : ""} ${hero ? "pt-9 sm:pt-12" : "pt-9 sm:pt-11"}`}>
        {logo ? (
          <h2 className="apple-banner-title"><img src={`/apple-official/home/${logo}-large.png`} alt={title} className="mb-2 h-10 w-auto sm:h-12" /></h2>
        ) : (
          <h2 className={`apple-banner-title font-display font-semibold leading-[1.08] tracking-tight ${hero ? "text-[36px] sm:text-[56px]" : "text-[30px] sm:text-[40px]"}`}>{title}</h2>
        )}
        <p className={`apple-banner-subtitle ${bottomCopy ? "mt-auto" : "mt-2"} max-w-md whitespace-pre-line leading-snug ${hero ? "text-xl sm:text-[28px]" : "text-lg sm:text-[21px]"}`}>{subtitle}</p>
        {availability && <p className={`apple-banner-meta mt-2 text-sm ${dark ? "text-[#a1a1a6]" : "text-[#6e6e73]"}`}>Consulte a disponibilidade</p>}
        {price && <div className="apple-banner-meta">{price}</div>}
        <div className="apple-banner-ctas mt-4 flex flex-wrap justify-center gap-3">
          <Link href={href} className="rounded-full bg-[#0071e3] px-5 py-2.5 text-sm text-white transition-colors hover:bg-[#0077ed] sm:text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]">Saiba mais</Link>
          <a href={purchaseHref ?? whatsapp} target="_blank" rel="noopener noreferrer"
            className={`rounded-full border px-5 py-2.5 text-sm transition-colors hover:bg-[#0071e3] hover:text-white sm:text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3] ${dark ? "border-[#2997ff] text-[#2997ff]" : "border-[#0071e3] text-[#0066cc]"}`}>
            {purchaseLabel}
          </a>
        </div>
      </div>
    </article>
  );
}
