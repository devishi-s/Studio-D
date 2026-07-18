"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import type { SortOption } from "@/types";

type ProductFiltersProps = {
  /** Kept for call-site compatibility; category pills live on `/products`. */
  categories?: unknown[];
  activeCategory?: string;
  activeSort: SortOption;
  productCount?: number;
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

/**
 * Lightweight sort control for category listing pages.
 * Full search / category / price filters live in `ProductCatalogFilters`.
 */
export function ProductFilters({ activeSort }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "newest") {
        params.delete("sort");
      } else {
        params.set("sort", value);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return (
    <select
      value={activeSort}
      onChange={(e) => updateSort(e.target.value)}
      className="h-8 rounded-lg border border-border bg-card px-3 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring/50"
      aria-label="Sort products"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
