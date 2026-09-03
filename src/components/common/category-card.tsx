import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Category } from "@/types";
import { cn } from "@/lib/utils";
import { categoryHref, TEMPORARY_CATEGORY_COVER } from "@/data/categories";
import type { CategoryCover } from "@/lib/supabase/products";
import { ProductImage } from "@/components/product/product-image";

type CategoryCardProps = {
  category: Category;
  className?: string;
  /** Newest product photo in this collection; temporary cover until one exists. */
  cover?: CategoryCover | null;
};

const variantByIndex = ["cream", "sage", "coral", "blush"] as const;

export function CategoryCard({
  category,
  className,
  cover,
}: CategoryCardProps) {
  const variant = variantByIndex[category.displayOrder - 1] ?? "blush";
  const displayCover = cover ?? {
    src: TEMPORARY_CATEGORY_COVER.src,
    alt: `${category.name} — ${TEMPORARY_CATEGORY_COVER.alt}`,
  };

  return (
    <Link
      href={categoryHref(category)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-brown/5",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ProductImage
          src={displayCover.src}
          alt={displayCover.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          placeholderVariant={variant}
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </div>

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
