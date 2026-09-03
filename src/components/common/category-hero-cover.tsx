import { cn } from "@/lib/utils";
import { TEMPORARY_CATEGORY_COVER } from "@/data/categories";
import type { CategoryCover } from "@/lib/supabase/products";
import { ProductImage } from "@/components/product/product-image";

type CategoryHeroCoverProps = {
  label: string;
  variant: "cream" | "sage" | "coral" | "blush";
  cover?: CategoryCover | null;
  className?: string;
};

/** Full-width category banner: newest product photo, or temporary shared cover. */
export function CategoryHeroCover({
  label,
  variant,
  cover,
  className,
}: CategoryHeroCoverProps) {
  const displayCover = cover ?? {
    src: TEMPORARY_CATEGORY_COVER.src,
    alt: `${label} — ${TEMPORARY_CATEGORY_COVER.alt}`,
  };

  return (
    <div className={cn("relative h-44 w-full sm:h-56", className)}>
      <ProductImage
        src={displayCover.src}
        alt={displayCover.alt}
        fill
        sizes="100vw"
        placeholderVariant={variant}
      />
    </div>
  );
}
