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
  const hasMultiple = displayImages.length > 1;

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

        {hasMultiple && (
          <>
            <div
              className="pointer-events-none absolute right-3 top-3 rounded-md bg-brand-brown/70 px-2 py-1 text-[11px] font-medium tabular-nums tracking-wide text-brand-cream backdrop-blur-sm"
              aria-live="polite"
            >
              {activeIndex + 1} / {displayImages.length}
            </div>

            <div
              className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5"
              role="tablist"
              aria-label={`${productName} image slides`}
            >
              {displayImages.map((_, i) => (
                <button
                  key={`dot-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`Show image ${i + 1} of ${displayImages.length}`}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200",
                    i === activeIndex
                      ? "w-5 bg-brand-coral"
                      : "w-1.5 bg-brand-cream/80 hover:bg-brand-cream"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
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
