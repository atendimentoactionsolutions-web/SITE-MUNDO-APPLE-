"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { ProductGallery } from "./ProductGallery";
import { ProductDetailOptions } from "./ProductDetailOptions";

export function ProductDetailPresentation({ product }: { product: Product }) {
  const [image, setImage] = useState(product.image);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 bg-white rounded-3xl p-4 sm:p-10 border border-apple-border shadow-apple-card mb-16">
      <div className="min-w-0 lg:col-span-7">
        <ProductGallery key={image} mainImage={image} gallery={[image, ...(product.gallery || []).filter(src => src !== image)]} name={product.name} />
      </div>
      <div className="min-w-0 lg:col-span-5">
        <ProductDetailOptions product={product} onImageChange={setImage} />
      </div>
    </div>
  );
}
