"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  mainImage: string;
  gallery?: string[];
  name: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  mainImage,
  gallery = [],
  name,
}) => {
  const images = gallery.length > 0 ? gallery : [mainImage];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Featured Big Image */}
      <div className="relative w-full aspect-square bg-white rounded-3xl p-6 border border-apple-border/60 shadow-apple-card overflow-hidden flex items-center justify-center">
        <Image
          src={images[selectedImageIndex] || mainImage}
          alt={name}
          fill
          priority
          className="object-contain p-8 transition-all duration-300"
        />
      </div>

      {/* Gallery Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`relative w-20 h-20 rounded-2xl bg-white border p-2 overflow-hidden shrink-0 transition-all ${
                selectedImageIndex === idx
                  ? "border-apple-blue ring-2 ring-apple-blue/20"
                  : "border-apple-border hover:border-gray-400"
              }`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
