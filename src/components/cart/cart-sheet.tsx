"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Trash2, Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { useMounted } from "@/hooks/use-mounted";
import { useCartStore, getItemsWithProducts, getCartItemCount, getCartSubtotal } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ImagePlaceholder } from "@/components/common/image-placeholder";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";

export function CartSheet() {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();

  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const resolved = getItemsWithProducts(items);
  const itemCount = getCartItemCount(items);
  const subtotal = getCartSubtotal(items);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-brand-brown-light transition-colors hover:bg-brand-blush hover:text-brand-brown"
            aria-label="Shopping cart"
          />
        }
      >
        <ShoppingBag className="h-5 w-5" />
        {mounted && itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-coral text-[10px] font-bold text-white">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col bg-brand-cream sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2 font-heading text-lg text-brand-brown">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
            {itemCount > 0 && (
              <span className="rounded-full bg-brand-blush px-2 py-0.5 text-xs font-medium text-brand-brown-light">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {resolved.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
            <div className="rounded-full bg-brand-blush p-6">
              <ShoppingBag className="h-8 w-8 text-brand-brown-light" />
            </div>
            <p className="font-heading text-lg text-brand-brown">
              Your cart is empty
            </p>
            <p className="text-sm text-muted-foreground">
              Discover our handcrafted collection and find something you love.
            </p>
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 items-center justify-center rounded-full bg-brand-brown px-6 text-sm font-medium text-white transition-colors hover:bg-brand-brown/80"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <ul className="space-y-4">
                {resolved.map(({ product, quantity }) => (
                  <li key={product.id} className="flex gap-3">
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex-shrink-0"
                    >
                      <ImagePlaceholder
                        label={product.name}
                        variant="blush"
                        className="h-20 w-20 rounded-lg"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={() => setOpen(false)}
                        className="font-heading text-sm font-medium text-brand-brown transition-colors hover:text-brand-coral"
                      >
                        {product.name}
                      </Link>
                      <span className="mt-0.5 text-xs text-muted-foreground">
                        {product.category.name}
                      </span>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button
                            className={cn(
                              "inline-flex h-6 w-6 items-center justify-center rounded-full text-brand-brown-light transition-colors hover:bg-brand-blush hover:text-brand-brown",
                              quantity <= 1 && "opacity-40"
                            )}
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[1.5rem] text-center text-xs font-medium tabular-nums text-brand-brown">
                            {quantity}
                          </span>
                          <button
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-brand-brown-light transition-colors hover:bg-brand-blush hover:text-brand-brown"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-brand-brown">
                            {formatPrice(product.price * quantity)}
                          </span>
                          <button
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => removeItem(product.id)}
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-heading text-lg font-semibold text-brand-brown">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>

              <Separator />

              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-full items-center justify-center rounded-full border border-border text-sm font-medium text-brand-brown transition-colors hover:bg-brand-blush"
              >
                View Full Cart
              </Link>

              <Button
                size="lg"
                className="w-full rounded-full"
                disabled
              >
                Checkout — Coming Soon
              </Button>

              <button
                className="text-xs text-muted-foreground underline-offset-2 hover:text-brand-coral hover:underline"
                onClick={clearCart}
              >
                Clear cart
              </button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
