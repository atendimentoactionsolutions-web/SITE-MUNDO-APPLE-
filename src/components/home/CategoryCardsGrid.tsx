import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ArrowUpRight } from "lucide-react";

export const CategoryCardsGrid: React.FC = () => {
  const categoriesData = [
    {
      id: "iphone",
      name: "iPhone",
      image: "/images/products/iphone/iphone-17-pro-max.png",
      href: "/iphone",
    },
    {
      id: "macbook",
      name: "MacBook",
      image: "/images/products/mac/macbook-pro-space-black.png",
      href: "/mac",
    },
    {
      id: "ipad",
      name: "iPad",
      image: "/images/products/ipad/ipad-pro-spaceblack.png",
      href: "/ipad",
    },
    {
      id: "watch",
      name: "Apple Watch",
      image: "/images/products/watch/apple-watch-ultra-natural.png",
      href: "/apple-watch",
    },
    {
      id: "airpods",
      name: "AirPods",
      image: "/images/products/airpods/airpods-max-midnight.png",
      href: "/airpods",
    },
    {
      id: "mac",
      name: "Mac & iMac",
      image: "/images/products/mac/mac-mini-m4-clean.png",
      href: "/mac",
    },
    {
      id: "accessories",
      name: "Acessórios",
      image: "/images/products/accessories/apple-pencil-pro.png",
      href: "/produtos?categoria=accessories",
    },
  ];

  return (
    <section id="catalogo" className="py-16 sm:py-24 bg-[#F5F5F7] scroll-mt-24">
      <Container size="large">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D2D2D7]/60 text-xs font-semibold uppercase tracking-wider text-[#0071E3] shadow-2xs">
            <span>CATÁLOGO</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1D1D1F] font-display tracking-[-0.028em] leading-tight">
            Qual produto Apple você procura?
          </h2>

          <p className="text-sm sm:text-base text-[#6E6E73] font-normal leading-relaxed tracking-[-0.011em]">
            Escolha abaixo e confira nossas opções com garantia, procedência e atendimento especializado.
          </p>
        </div>

        {/* 7 Vertical Clean Minimalist Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5 sm:gap-4">
          {categoriesData.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative h-[280px] sm:h-[310px] rounded-[22px] overflow-hidden bg-white p-3.5 sm:p-4 flex flex-col justify-between border border-[#E5E5E7] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#D2D2D7] transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Product Image Area with Light #F5F5F7 Background */}
              <div className="relative w-full h-[190px] sm:h-[215px] rounded-2xl bg-[#F5F5F7] group-hover:bg-[#EFEFF2] transition-colors flex items-center justify-center p-3">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                  className="object-contain p-2 group-hover:scale-106 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Card Bottom Content (Only Title + Clean Arrow) */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[#1D1D1F]">
                  <h3 className="text-sm sm:text-base font-semibold font-display tracking-[-0.018em] group-hover:text-[#0071E3] transition-colors">
                    {cat.name}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-[#86868B] group-hover:text-[#0071E3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};
