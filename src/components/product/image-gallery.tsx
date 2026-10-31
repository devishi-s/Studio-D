"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/product/product-image";

type ImageGalleryProps = {
  images: string[];
  productName: string;
};

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const displayImages = images.length > 0 ? images : [""];
  const activeSrc = displayImages[activeIndex] ?? "";
  const hasMultiple = displayImages.length > 1;

  const goTo = useCallback(
    (index: number) => {
      const total = displayImages.length;
      setActiveIndex(((index % total) + total) % total);
    },
    [displayImages.length]
  );

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current == null || !hasMultiple) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    goTo(activeIndex + (delta < 0 ? 1 : -1));
  }

  return (
    <div className="space-y-3">
      <div
        className="relative aspect-square overflow-hidden rounded-xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <ProductImage
          src={activeSrc}
          alt={
            activeIndex === 0
              ? productName
              : `${productName}, view ${activeIndex + 1}`
          }
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className="transition-all duration-300"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label={`Previous ${productName} photo`}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-blush/80 bg-brand-cream/90 text-brand-brown shadow-sm backdrop-blur-sm transition-colors hover:border-brand-coral hover:bg-brand-coral hover:text-brand-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label={`Next ${productName} photo`}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-blush/80 bg-brand-cream/90 text-brand-brown shadow-sm backdrop-blur-sm transition-colors hover:border-brand-coral hover:bg-brand-coral hover:text-brand-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

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
                  onClick={() => goTo(i)}
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
              onClick={() => goTo(i)}
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
