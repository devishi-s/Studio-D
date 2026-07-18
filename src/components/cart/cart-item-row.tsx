"use client";

import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart.store";
import { ProductImage } from "@/components/product/product-image";
import type { CartItemWithProduct } from "@/types";

type CartItemRowProps = {
  item: CartItemWithProduct;
};

export function CartItemRow({ item }: CartItemRowProps) {
  const { product, quantity } = item;
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const lineTotal = product.price * quantity;

  return (
    <div className="flex gap-4 rounded-xl border border-border/40 bg-card p-4 transition-shadow hover:shadow-sm sm:gap-6">
      {/* Product image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-28"
      >
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="112px"
        />
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col">
        {/* Top row: name + remove */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/products/${product.slug}`}
              className="font-heading text-sm font-semibold text-brand-brown transition-colors hover:text-brand-coral sm:text-base"
            >
              {product.name}
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {product.category.name}
            </p>
          </div>
          <button
            className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            onClick={() => removeItem(product.id)}
            aria-label={`Remove ${product.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Unit price */}
        <p className="mt-1 text-xs text-muted-foreground">
          {formatPrice(product.price)} each
        </p>

        {/* Bottom row: quantity controls + line total */}
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="inline-flex items-center rounded-full border border-border">
            <button
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-brown-light transition-colors hover:bg-brand-blush hover:text-brand-brown",
                quantity <= 1 && "opacity-40"
              )}
              onClick={() => updateQuantity(product.id, quantity - 1)}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[2rem] text-center text-sm font-medium tabular-nums text-brand-brown">
              {quantity}
            </span>
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-brown-light transition-colors hover:bg-brand-blush hover:text-brand-brown"
              onClick={() => updateQuantity(product.id, quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <span className="font-heading text-base font-semibold text-brand-brown">
            {formatPrice(lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
