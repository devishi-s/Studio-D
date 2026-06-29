"use client";

import Link from "next/link";
import { ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";

import { useMounted } from "@/hooks/use-mounted";
import { useCartStore, getItemsWithProducts, getCartItemCount } from "@/store/cart.store";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { CartSummary } from "@/components/cart/cart-summary";

export function CartPageContent() {
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const resolved = getItemsWithProducts(items);
  const itemCount = getCartItemCount(items);

  if (!mounted) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-brown border-t-transparent" />
      </div>
    );
  }

  if (resolved.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 text-center">
        <div className="rounded-full bg-brand-blush p-8">
          <ShoppingBag className="h-10 w-10 text-brand-brown-light" />
        </div>
        <h2 className="font-heading text-2xl font-semibold text-brand-brown">
          Your cart is empty
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Looks like you haven&apos;t found your perfect handcrafted piece yet.
          Browse our collection — every item is made with love.
        </p>
        <Link
          href="/products"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-brown px-8 text-sm font-medium text-white transition-colors hover:bg-brand-brown/80"
        >
          Explore Collection
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
      {/* Left: Cart items */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-brand-brown">
            {itemCount} {itemCount === 1 ? "Item" : "Items"} in Your Cart
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-brand-brown"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Continue Shopping
          </Link>
        </div>

        <div className="space-y-4">
          {resolved.map((item) => (
            <CartItemRow key={item.product.id} item={item} />
          ))}
        </div>
      </div>

      {/* Right: Order summary */}
      <div className="lg:sticky lg:top-24">
        <CartSummary />
      </div>
    </div>
  );
}
