import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/common/image-placeholder";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-brown/5",
        className
      )}
    >
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden"
      >
        <ImagePlaceholder
          label={product.name}
          variant="blush"
          className="aspect-square rounded-none transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="rounded-full bg-brand-coral px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              Sale
            </span>
          )}
          {product.tags.includes("bestseller") && (
            <span className="rounded-full bg-brand-sage px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              Bestseller
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category label */}
        <span className="text-[11px] font-medium uppercase tracking-wider text-brand-coral">
          {product.category.name}
        </span>

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 font-heading text-base font-semibold leading-snug text-brand-brown transition-colors group-hover:text-brand-coral">
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-semibold text-brand-brown">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>

        {/* Add to cart (placeholder — Phase 2) */}
        <div className="mt-3 pt-3 border-t border-border/40">
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-full text-xs"
            disabled
          >
            <ShoppingBag className="mr-1.5 h-3.5 w-3.5" data-icon="inline-start" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
