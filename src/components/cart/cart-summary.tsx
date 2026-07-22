"use client";

import Link from "next/link";
import { Truck, Shield, Undo2 } from "lucide-react";

import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { getDeliveryFee } from "@/lib/checkout";
import {
  useCartStore,
  getCartItemCount,
  getCartSubtotal,
} from "@/store/cart.store";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const PERKS = [
  { icon: Truck, text: "Free shipping over ₹999" },
  { icon: Shield, text: "Quality guaranteed" },
  { icon: Undo2, text: "Easy 7-day returns" },
] as const;

export function CartSummary() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const itemCount = getCartItemCount(items);
  const subtotal = getCartSubtotal(items);
  const deliveryFee = getDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  return (
    <div className="rounded-xl border border-border/40 bg-card p-6">
      <h2 className="font-heading text-lg font-semibold text-brand-brown">
        Order Summary
      </h2>

      <Separator className="my-4" />

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items ({itemCount})</span>
          <span className="font-medium text-brand-brown">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-xs font-medium text-brand-sage">
            {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
          </span>
        </div>
        {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? (
          <p className="text-xs text-muted-foreground">
            Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free
            delivery.
          </p>
        ) : null}
      </div>

      <Separator className="my-4" />

      <div className="flex items-center justify-between">
        <span className="font-heading text-base font-semibold text-brand-brown">
          Total
        </span>
        <span className="font-heading text-xl font-bold text-brand-brown">
          {formatPrice(total)}
        </span>
      </div>

      <Link
        href="/checkout"
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-4 w-full rounded-full"
        )}
      >
        Proceed to Checkout
      </Link>

      <p className="mt-2 text-center text-xs text-muted-foreground">
        Sign in required. Delivery calculated at checkout.
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {PERKS.map((perk) => (
          <div
            key={perk.text}
            className="flex flex-col items-center gap-1.5 rounded-lg bg-brand-blush/50 px-2 py-3 text-center"
          >
            <perk.icon className="h-4 w-4 text-brand-sage" />
            <span className="text-[10px] leading-tight text-muted-foreground">
              {perk.text}
            </span>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <button
        className="w-full text-center text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-brand-coral hover:underline"
        onClick={clearCart}
      >
        Clear entire cart
      </button>
    </div>
  );
}
