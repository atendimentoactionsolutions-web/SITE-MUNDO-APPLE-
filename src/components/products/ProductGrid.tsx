import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  emptyMessage = "Nenhum produto encontrado nesta categoria no momento.",
}) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-[#F4F7FB] rounded-3xl border border-dashed border-slate-200">
        <p className="text-gray-500 text-base font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {products.map((product, idx) => (
        <ProductCard key={product.id} product={product} priority={idx < 4} />
      ))}
    </div>
  );
};
