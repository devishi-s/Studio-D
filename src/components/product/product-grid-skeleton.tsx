import { cn } from "@/lib/utils";

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
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-border/40 bg-card"
        >
          <div className="aspect-square animate-pulse bg-brand-blush" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-brand-blush" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-brand-blush" />
            <div className="h-4 w-1/4 animate-pulse rounded bg-brand-blush" />
          </div>
        </div>
      ))}
    </div>
  );
}
