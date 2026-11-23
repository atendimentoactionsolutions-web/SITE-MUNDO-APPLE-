"use client";

import React from "react";
import { Product } from "@/types/product";
import { TalesProductCard } from "./TalesProductCard";
import "./tales-catalog.css";

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
    <div className="product-grid">
      {products.map((product, idx) => (
        <TalesProductCard key={product.id} product={product} priority={idx < 4} />
      ))}
    </div>
  );
};
