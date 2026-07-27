import { cn } from "@/lib/utils";
import { ProductCardSkeleton } from "@/components/product/product-card-skeleton";

type ProductGridSkeletonProps = {
  count?: number;
  columns?: 2 | 3 | 4;
  className?: string;
};

const colClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function ProductGridSkeleton({
  count = 8,
  columns = 4,
  className,
}: ProductGridSkeletonProps) {
  return (
    <div className={cn("grid gap-5", colClasses[columns], className)}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
