"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";

type AddToCartButtonProps = {
  productId: string;
  productName: string;
  inStock: boolean;
  quantity?: number;
  compact?: boolean;
  className?: string;
};

export function AddToCartButton({
  productId,
  productName,
  inStock,
  quantity = 1,
  compact = false,
  className,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    addItem(productId, quantity);
    setAdded(true);
    toast.success("Added to cart", { description: productName });
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
    >
      {added ? (
        <>
          <Check className={cn("mr-1.5", compact ? "h-3.5 w-3.5" : "h-4 w-4")} data-icon="inline-start" />
          Added!
        </>
      ) : (
        <>
          <ShoppingBag className={cn("mr-1.5", compact ? "h-3.5 w-3.5" : "h-4 w-4")} data-icon="inline-start" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
