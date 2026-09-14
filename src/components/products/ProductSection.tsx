import React from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "lucide-react";

interface ProductSectionProps {
  id?: string;
  title: string;
  description: string;
  products: Product[];
  buttonText?: string;
  categoryLink?: string;
  limit?: number;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  id,
  title,
  description,
  products,
  buttonText,
  categoryLink,
  limit = 4,
}) => {
  const displayedProducts = limit ? products.slice(0, limit) : products;

  if (displayedProducts.length === 0) return null;

  return (
    <section id={id} className="py-16 sm:py-24 bg-[#F5F5F7] scroll-mt-24 border-t border-[#D2D2D7]">
      <Container size="large">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1D1D1F] font-display tracking-[-0.028em] leading-tight">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-[#6E6E73] font-normal leading-relaxed tracking-[-0.011em]">
              {description}
            </p>
          </div>

          {categoryLink && buttonText && (
            <Link
              href={categoryLink}
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#F5F5F7] border border-[#D2D2D7]/80 text-[#1D1D1F] font-semibold text-xs sm:text-sm rounded-full shadow-2xs hover:shadow-xs transition-all active:scale-95 shrink-0 group tracking-[-0.011em]"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4 text-[#0071E3] group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View More Button */}
        {categoryLink && buttonText && (
          <div className="mt-8 text-center md:hidden">
            <Link
              href={categoryLink}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[#D2D2D7]/80 text-[#1D1D1F] font-semibold text-sm rounded-full shadow-2xs tracking-[-0.011em]"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4 text-[#0071E3]" />
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
};
