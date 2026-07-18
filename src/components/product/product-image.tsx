"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { canOptimizeProductImage } from "@/lib/supabase/storage";
import { ImagePlaceholder } from "@/components/common/image-placeholder";

type ProductImageProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  /**
   * When true, fills the relatively positioned parent.
   * Parent must set an aspect ratio or height.
   */
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  placeholderVariant?: "cream" | "blush" | "sage" | "coral";
};

/**
 * Renders a product photo with `next/image` when a real remote URL is available.
 * Falls back to the branded placeholder for missing or mock `/images/...` paths.
 */
export function ProductImage({
  src,
  alt,
  className,
  fill = false,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  placeholderVariant = "blush",
}: ProductImageProps) {
  if (!canOptimizeProductImage(src)) {
    return (
      <ImagePlaceholder
        label={alt}
        variant={placeholderVariant}
        className={cn(fill && "h-full w-full", className)}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src!}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={src!}
      alt={alt}
      width={width ?? 400}
      height={height ?? 400}
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
