import Link from "next/link";

import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "@/components/product/product-image";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { WishlistButton } from "@/components/product/wishlist-button";

type ProductCardProps = {
  product: Product;
  className?: string;
  /** Eager-load LCP-critical card images (hero row / first grid cells). */
  priority?: boolean;
};

export function ProductCard({
  product,
  className,
  priority = false,
}: ProductCardProps) {
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const primaryImage = product.images[0];
  const redirectPath = `/products/${product.slug}`;

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-brown/5",
        className
      )}
    >
      <div className="relative">
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-square overflow-hidden"
        >
          <ProductImage
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute left-2 top-2 flex flex-col gap-1 sm:left-3 sm:top-3 sm:gap-1.5">
            {hasDiscount && (
              <span className="rounded-full bg-brand-coral px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white sm:px-2.5 sm:text-[10px]">
                Sale
              </span>
            )}
            {product.tags.includes("bestseller") && (
              <span className="rounded-full bg-brand-sage px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white sm:px-2.5 sm:text-[10px]">
                Bestseller
              </span>
            )}
            {product.tags.includes("new") && (
              <span className="rounded-full bg-brand-gold px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white sm:px-2.5 sm:text-[10px]">
                New
              </span>
            )}
          </div>
        </Link>

        <WishlistButton
          productId={product.id}
          redirectPath={redirectPath}
          size="sm"
          className="absolute right-2 top-2 z-10 sm:right-3 sm:top-3"
        />
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        <span className="text-[10px] font-medium uppercase tracking-wider text-brand-coral sm:text-[11px]">
          {product.category.name}
        </span>

        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-0.5 font-heading text-sm font-semibold leading-snug text-brand-brown transition-colors group-hover:text-brand-coral sm:mt-1 sm:text-base">
            {product.name}
          </h3>
        </Link>

        {product.materials.length > 0 && (
          <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground sm:mt-1 sm:text-xs">
            {product.materials[0]}
          </p>
        )}

        <div className="mt-auto flex items-center gap-1.5 pt-1.5 sm:gap-2 sm:pt-2">
          <span className="text-xs font-semibold text-brand-brown sm:text-sm">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-[10px] text-muted-foreground line-through sm:text-xs">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>

        <div className="mt-2 border-t border-border/40 pt-2 sm:mt-3 sm:pt-3">
          <AddToCartButton
            productId={product.id}
            productName={product.name}
            price={product.price}
            inStock={product.stockCount > 0}
            maxQuantity={product.stockCount}
            compact
          />
        </div>
      </div>
    </div>
  );
}
