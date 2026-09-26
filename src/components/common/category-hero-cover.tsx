import { cn } from "@/lib/utils";
import { TEMPORARY_CATEGORY_COVER } from "@/data/categories";
import { ProductImage } from "@/components/product/product-image";

type CategoryHeroCoverProps = {
  label: string;
  variant: "cream" | "sage" | "coral" | "blush";
  className?: string;
};

/** Full-width category banner using the shared temporary cover. */
export function CategoryHeroCover({
  label,
  variant,
  className,
}: CategoryHeroCoverProps) {
  return (
    <div className={cn("relative h-44 w-full sm:h-56", className)}>
      <ProductImage
        src={TEMPORARY_CATEGORY_COVER.src}
        alt={`${label}, ${TEMPORARY_CATEGORY_COVER.alt}`}
        fill
        sizes="100vw"
        placeholderVariant={variant}
      />
    </div>
  );
}
