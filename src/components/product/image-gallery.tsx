"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/product/product-image";

type ImageGalleryProps = {
  images: string[];
  productName: string;
};

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const displayImages = images.length > 0 ? images : [""];
  const activeSrc = displayImages[activeIndex] ?? "";

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <ProductImage
          src={activeSrc}
          alt={
            activeIndex === 0
              ? productName
              : `${productName} — view ${activeIndex + 1}`
          }
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className="transition-all duration-300"
        />
      </div>

      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {displayImages.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg transition-all duration-200",
                i === activeIndex
                  ? "ring-2 ring-brand-coral ring-offset-2 ring-offset-background"
                  : "opacity-60 hover:opacity-100"
              )}
              aria-label={`Show ${productName} view ${i + 1}`}
            >
              <ProductImage
                src={src}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                sizes="120px"
                placeholderVariant={i === activeIndex ? "coral" : "cream"}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
