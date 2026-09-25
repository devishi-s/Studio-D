"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { trackAddToCart } from "@/lib/analytics";
import { cartQuantityCap } from "@/lib/cart/quantity-cap";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";

type AddToCartButtonProps = {
  productId: string;
  productName: string;
  price: number;
  inStock: boolean;
  quantity?: number;
  /** Live stock count. Cart lines cannot exceed this. */
  maxQuantity?: number;
  compact?: boolean;
  className?: string;
};

export function AddToCartButton({
  productId,
  productName,
  price,
  inStock,
  quantity = 1,
  maxQuantity,
  compact = false,
  className,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore(
    (s) => s.items.find((item) => item.productId === productId)?.quantity ?? 0
  );
  const [added, setAdded] = useState(false);
  const cap = maxQuantity == null ? undefined : cartQuantityCap(maxQuantity);
  const atCap = cap != null && inCart >= cap;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const result = addItem(productId, quantity, cap);
    if (result.added === 0) {
      toast.error(
        result.cap <= 0
          ? "This piece is out of stock."
          : `Only ${result.cap} in stock.`
      );
      return;
    }

    trackAddToCart({ productId, productName, price });
    setAdded(true);
    if (result.quantity >= result.cap) {
      toast.success("Added to cart", {
        description: `${productName}. That's all we have in stock.`,
      });
    } else {
      toast.success("Added to cart", { description: productName });
    }
    setTimeout(() => setAdded(false), 1500);
  }

  if (!inStock) {
    return (
      <Button
        size={compact ? "sm" : "lg"}
        variant={compact ? "outline" : "default"}
        className={cn(
          "rounded-full",
          compact ? "w-full text-xs" : "w-full",
          className
        )}
        disabled
      >
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      size={compact ? "sm" : "lg"}
      variant={compact ? "outline" : "default"}
      className={cn(
        "rounded-full transition-all",
        compact ? "w-full text-xs" : "w-full",
        className
      )}
      onClick={handleClick}
      disabled={atCap}
    >
      {added ? (
        <>
          <Check className={cn("mr-1.5", compact ? "h-3.5 w-3.5" : "h-4 w-4")} data-icon="inline-start" />
          Added!
        </>
      ) : atCap ? (
        "Max in cart"
      ) : (
        <>
          <ShoppingBag className={cn("mr-1.5", compact ? "h-3.5 w-3.5" : "h-4 w-4")} data-icon="inline-start" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
