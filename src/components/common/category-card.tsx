import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Category } from "@/types";
import { cn } from "@/lib/utils";
import { ImagePlaceholder } from "@/components/common/image-placeholder";

type CategoryCardProps = {
  category: Category;
  className?: string;
};

const variantByIndex = ["cream", "sage", "coral", "blush"] as const;

export function CategoryCard({ category, className }: CategoryCardProps) {
  const variant = variantByIndex[category.displayOrder - 1] ?? "blush";

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-brown/5",
        className
      )}
    >
      {/* Image area */}
      <ImagePlaceholder
        label={category.name}
        variant={variant}
        className="aspect-[4/3] rounded-none border-0"
      />

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="font-heading text-lg font-semibold text-brand-brown">
            {category.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {category.description}
          </p>
        </div>

        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-coral transition-colors group-hover:text-brand-brown">
          Browse collection
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
