"use client";

import { Truck, Shield, Undo2 } from "lucide-react";

import { formatPrice } from "@/lib/format";
import { useCartStore, getCartItemCount, getCartSubtotal } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

  return (
    <div className="rounded-xl border border-border/40 bg-card p-6">
      <h2 className="font-heading text-lg font-semibold text-brand-brown">
        Order Summary
      </h2>

      <Separator className="my-4" />

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Items ({itemCount})
          </span>
          <span className="font-medium text-brand-brown">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-xs font-medium text-brand-sage">
            {subtotal >= 999 ? "Free" : "Calculated at checkout"}
          </span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex items-center justify-between">
        <span className="font-heading text-base font-semibold text-brand-brown">
          Subtotal
        </span>
        <span className="font-heading text-xl font-bold text-brand-brown">
          {formatPrice(subtotal)}
        </span>
      </div>

      <Button
        size="lg"
        className="mt-4 w-full rounded-full"
        disabled
      >
        Checkout — Coming Soon
      </Button>

      <p className="mt-2 text-center text-xs text-muted-foreground">
        Shipping and taxes calculated at checkout.
      </p>

      {/* Trust badges */}
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
