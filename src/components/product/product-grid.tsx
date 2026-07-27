import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product/product-card";

type ProductGridProps = {
  products: Product[];
  columns?: 2 | 3 | 4;
  className?: string;
  /** First N cards get `priority` on their primary image (above-the-fold). */
  priorityCount?: number;
};

const colClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function ProductGrid({
  products,
  columns = 4,
  className,
  priorityCount = 0,
}: ProductGridProps) {
  return (
    <div className={cn("grid gap-5", colClasses[columns], className)}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={i < priorityCount}
          className={`animate-fade-in-up animation-delay-${(i + 1) * 100}`}
        />
      ))}
    </div>
  );
}
