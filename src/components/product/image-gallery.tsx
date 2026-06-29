"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ImagePlaceholder } from "@/components/common/image-placeholder";

type ImageGalleryProps = {
  images: string[];
  productName: string;
};

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages = images.length > 0 ? images : ["placeholder"];

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="overflow-hidden rounded-xl">
        <ImagePlaceholder
          label={activeIndex === 0 ? productName : `${productName} — View ${activeIndex + 1}`}
          variant="blush"
          className="aspect-square w-full transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {displayImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "overflow-hidden rounded-lg transition-all duration-200",
                i === activeIndex
                  ? "ring-2 ring-brand-coral ring-offset-2 ring-offset-background"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <ImagePlaceholder
                label={`View ${i + 1}`}
                variant={i === activeIndex ? "coral" : "cream"}
                className="aspect-square"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
