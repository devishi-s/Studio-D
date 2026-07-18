import Link from "next/link";

import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "@/components/product/product-image";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const primaryImage = product.images[0];

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-brown/5",
        className
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden"
      >
        <ProductImage
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />

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
          {product.tags.includes("new") && (
            <span className="rounded-full bg-brand-gold px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              New
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-medium uppercase tracking-wider text-brand-coral">
          {product.category.name}
        </span>

        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 font-heading text-base font-semibold leading-snug text-brand-brown transition-colors group-hover:text-brand-coral">
            {product.name}
          </h3>
        </Link>

        {product.materials.length > 0 && (
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {product.materials[0]}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className="text-sm font-semibold text-brand-brown">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>

        <div className="mt-3 border-t border-border/40 pt-3">
          <AddToCartButton
            productId={product.id}
            productName={product.name}
            inStock={product.stockCount > 0}
            compact
          />
        </div>
      </div>
    </div>
  );
}
