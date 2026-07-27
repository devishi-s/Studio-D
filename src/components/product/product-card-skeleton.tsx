import { cn } from "@/lib/utils";

type ProductCardSkeletonProps = {
  className?: string;
};

/** Matches `ProductCard` layout: square media + category/title/price/CTA blocks. */
export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/40 bg-card",
        className
      )}
      aria-hidden
    >
      <div className="aspect-square animate-pulse bg-brand-blush" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-brand-blush" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-brand-blush" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-brand-blush" />
        <div className="h-4 w-1/4 animate-pulse rounded bg-brand-blush" />
        <div className="mt-3 h-9 w-full animate-pulse rounded-full bg-brand-blush" />
      </div>
    </div>
  );
}
