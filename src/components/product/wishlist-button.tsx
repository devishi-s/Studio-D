"use client";

import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/hooks/use-wishlist";

type WishlistButtonProps = {
  productId: string;
  /** Path to return to after login. */
  redirectPath: string;
  initialWishlisted?: boolean;
  isAuthenticated?: boolean;
  className?: string;
  size?: "sm" | "md";
};

export function WishlistButton({
  productId,
  redirectPath,
  initialWishlisted = false,
  isAuthenticated = false,
  className,
  size = "md",
}: WishlistButtonProps) {
  const { isWishlisted, isPending, toggle } = useWishlist({
    productId,
    initialWishlisted,
    isAuthenticated,
    redirectPath,
  });

  const iconClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      disabled={isPending}
      aria-pressed={isWishlisted}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-border/70 bg-white/90 text-brand-brown shadow-sm backdrop-blur-sm transition-colors hover:border-brand-coral/40 hover:bg-white hover:text-brand-coral disabled:opacity-60",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        className
      )}
    >
      <Heart
        className={cn(
          iconClass,
          isWishlisted ? "fill-brand-coral text-brand-coral" : "fill-none"
        )}
        strokeWidth={1.75}
      />
    </button>
  );
}
