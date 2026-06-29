"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import type { Category, SortOption } from "@/types";
import { cn } from "@/lib/utils";

type ProductFiltersProps = {
  categories: Category[];
  activeCategory: string;
  activeSort: SortOption;
  productCount: number;
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

export function ProductFilters({
  categories,
  activeCategory,
  activeSort,
  productCount,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || value === "newest") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const showCategoryPills = categories.length > 0;

  return (
    <div
      className={cn(
        "flex gap-4",
        showCategoryPills
          ? "flex-col sm:flex-row sm:items-center sm:justify-between"
          : "justify-end"
      )}
    >
      {showCategoryPills && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParams("category", "all")}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              activeCategory === "all"
                ? "bg-brand-brown text-primary-foreground"
                : "bg-brand-blush text-brand-brown-light hover:bg-brand-blush/80 hover:text-brand-brown"
            )}
          >
            All ({productCount})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => updateParams("category", cat.slug)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                activeCategory === cat.slug
                  ? "bg-brand-brown text-primary-foreground"
                  : "bg-brand-blush text-brand-brown-light hover:bg-brand-blush/80 hover:text-brand-brown"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <select
        value={activeSort}
        onChange={(e) => updateParams("sort", e.target.value)}
        className="h-8 rounded-lg border border-border bg-card px-3 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring/50"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
