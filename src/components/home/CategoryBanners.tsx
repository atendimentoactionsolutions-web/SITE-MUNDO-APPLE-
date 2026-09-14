import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChevronRight } from "lucide-react";

const categoryCards = [
  {
    title: "iPhone",
    subtitle: "Do iPhone 15 ao revolucionário iPhone 17 Pro Max.",
    href: "/iphone",
    image: "/images/products/iphone/iphone-17-pro-max.png",
  },
  {
    title: "AirPods",
    subtitle: "AirPods 4, AirPods Pro 3 e AirPods Max 2 com áudio espacial.",
    href: "/airpods",
    image: "/images/products/airpods/airpods-category.png",
  },
  {
    title: "Mac & MacBook",
    subtitle: "MacBook Pro, MacBook Air e Mac mini com chips M5 e M4.",
    href: "/mac",
    image: "/images/products/mac/macbook-pro-m5-category.png",
  },
  {
    title: "iPad",
    subtitle: "iPad Pro M5 e iPad 11ª geração para criação e trabalho.",
    href: "/ipad",
    image: "/images/products/ipad/ipad-pro-m5-category.png",
  },
  {
    title: "Apple Watch",
    subtitle: "Series 11, Ultra 3 e SE 3 para conectividade e saúde.",
    href: "/apple-watch",
    image: "/images/products/watch/apple-watch-category.jpg",
  },
];

export const CategoryBanners: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-apple-gray/40 border-t border-apple-border/40">
      <Container>
        <SectionHeading
          eyebrow="Ecossistema Apple"
          title="Explore por Categoria"
          subtitle="Encontre o dispositivo ideal para suas necessidades diárias."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {categoryCards.map((card, index) => {
            return (
              <Link
                key={card.title}
                href={card.href}
                className={`group relative rounded-3xl p-6 sm:p-9 bg-white border border-apple-border/60 hover:border-apple-border shadow-apple-card hover:shadow-apple-card-hover transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[300px] sm:min-h-[360px] lg:h-[390px] ${
                  index === 0 ? "lg:col-span-2" : ""
                }`}
              >
                {/* Text Content */}
                <div className="relative z-10 max-w-[65%] sm:max-w-[70%] lg:max-w-xs space-y-1.5 sm:space-y-2">
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-apple-blue block">
                    Linha Apple
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-apple-dark">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-apple-muted font-normal leading-relaxed">
                    {card.subtitle}
                  </p>
                  <div className="pt-2 inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-apple-blue group-hover:underline">
                    <span>Conhecer modelos</span>
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>

                {/* Card Image — Perfectly framed and responsive */}
                <div className="absolute right-0 bottom-0 w-[170px] h-[170px] sm:w-3/5 sm:h-3/4 opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 170px, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain object-right-bottom p-3 sm:p-4"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
