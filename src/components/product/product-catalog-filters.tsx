"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import type { Category, SortOption } from "@/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ProductCatalogFiltersProps = {
  categories: Category[];
  activeSearch: string;
  activeCategory: string;
  activeMinPrice?: number;
  activeMaxPrice?: number;
  activeSort: SortOption;
  resultCount: number;
  totalCount: number;
  activeFilterCount: number;
  children: ReactNode;
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

export function ProductCatalogFilters({
  categories,
  activeSearch,
  activeCategory,
  activeMinPrice,
  activeMaxPrice,
  activeSort,
  resultCount,
  totalCount,
  activeFilterCount,
  children,
}: ProductCatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchDraft, setSearchDraft] = useState(activeSearch);
  const [minDraft, setMinDraft] = useState(
    activeMinPrice != null ? String(activeMinPrice) : ""
  );
  const [maxDraft, setMaxDraft] = useState(
    activeMaxPrice != null ? String(activeMaxPrice) : ""
  );

  useEffect(() => {
    setSearchDraft(activeSearch);
  }, [activeSearch]);

  useEffect(() => {
    setMinDraft(activeMinPrice != null ? String(activeMinPrice) : "");
  }, [activeMinPrice]);

  useEffect(() => {
    setMaxDraft(activeMaxPrice != null ? String(activeMaxPrice) : "");
  }, [activeMaxPrice]);

  const pushParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const setParam = useCallback(
    (key: string, value: string, clearWhen?: string) => {
      pushParams((params) => {
        if (!value || value === clearWhen) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
    },
    [pushParams]
  );

  useEffect(() => {
    const trimmed = searchDraft.trim();
    if (trimmed === activeSearch) return;

    const timer = window.setTimeout(() => {
      setParam("search", trimmed);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchDraft, activeSearch, setParam]);

  const commitPriceRange = useCallback(() => {
    pushParams((params) => {
      const minRaw = minDraft.trim();
      const maxRaw = maxDraft.trim();
      const min = minRaw === "" ? undefined : Number(minRaw);
      const max = maxRaw === "" ? undefined : Number(maxRaw);

      if (min == null || !Number.isFinite(min) || min < 0) {
        params.delete("minPrice");
      } else {
        params.set("minPrice", String(Math.floor(min)));
      }

      if (max == null || !Number.isFinite(max) || max < 0) {
        params.delete("maxPrice");
      } else {
        params.set("maxPrice", String(Math.floor(max)));
      }
    });
  }, [pushParams, minDraft, maxDraft]);

  const clearAll = useCallback(() => {
    setSearchDraft("");
    setMinDraft("");
    setMaxDraft("");
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const categoryLabel =
    categories.find((c) => c.slug === activeCategory)?.name ?? null;

  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-heading text-lg text-brand-brown">Refine</h2>
            {activeFilterCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {activeFilterCount} active
              </span>
            )}
          </div>
          <div className="mt-2 h-px w-8 bg-brand-coral/50" />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="product-search"
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand-brown-light"
          >
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              id="product-search"
              type="search"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Search by name…"
              className="h-10 w-full rounded-lg border border-border/70 bg-card pl-9 pr-9 text-sm text-brand-brown outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-brand-coral/40 focus:ring-2 focus:ring-brand-coral/15"
            />
            {searchDraft ? (
              <button
                type="button"
                onClick={() => {
                  setSearchDraft("");
                  setParam("search", "");
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-brand-brown"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand-brown-light">
            Category
          </p>
          <ul className="space-y-1">
            <li>
              <button
                type="button"
                onClick={() => setParam("category", "all", "all")}
                className={cn(
                  "w-full border-l-2 py-1.5 pl-3 text-left text-sm transition-colors",
                  activeCategory === "all"
                    ? "border-brand-coral font-medium text-brand-brown"
                    : "border-transparent text-muted-foreground hover:text-brand-brown"
                )}
              >
                All pieces
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <button
                  type="button"
                  onClick={() => setParam("category", cat.slug)}
                  className={cn(
                    "w-full border-l-2 py-1.5 pl-3 text-left text-sm transition-colors",
                    activeCategory === cat.slug
                      ? "border-brand-coral font-medium text-brand-brown"
                      : "border-transparent text-muted-foreground hover:text-brand-brown"
                  )}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand-brown-light">
            Price (₹)
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={minDraft}
              onChange={(e) => setMinDraft(e.target.value)}
              onBlur={commitPriceRange}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              placeholder="Min"
              aria-label="Minimum price"
              className="h-10 w-full rounded-lg border border-border/70 bg-card px-3 text-sm text-brand-brown outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-brand-coral/40 focus:ring-2 focus:ring-brand-coral/15"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={maxDraft}
              onChange={(e) => setMaxDraft(e.target.value)}
              onBlur={commitPriceRange}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              placeholder="Max"
              aria-label="Maximum price"
              className="h-10 w-full rounded-lg border border-border/70 bg-card px-3 text-sm text-brand-brown outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-brand-coral/40 focus:ring-2 focus:ring-brand-coral/15"
            />
          </div>
        </div>

        {activeFilterCount > 0 ? (
          <Button
            type="button"
            variant="outline"
            onClick={clearAll}
            className="w-full border-border/70 text-brand-brown hover:bg-brand-blush/40"
          >
            Clear all filters
          </Button>
        ) : null}
      </aside>

      <div className="min-w-0 space-y-6">
        <div className="flex flex-col gap-4 border-b border-border/50 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <p className="text-sm text-brand-brown">
              Showing{" "}
              <span className="font-medium tabular-nums">{resultCount}</span> of{" "}
              <span className="font-medium tabular-nums">{totalCount}</span>{" "}
              {totalCount === 1 ? "product" : "products"}
            </p>
            {activeFilterCount > 0 ? (
              <p className="text-xs text-muted-foreground">
                {[
                  activeSearch ? `“${activeSearch}”` : null,
                  categoryLabel,
                  activeMinPrice != null
                    ? `from ${formatPrice(activeMinPrice)}`
                    : null,
                  activeMaxPrice != null
                    ? `up to ${formatPrice(activeMaxPrice)}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            ) : null}
          </div>

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="shrink-0 uppercase tracking-[0.12em]">Sort</span>
            <select
              value={activeSort}
              onChange={(e) => setParam("sort", e.target.value, "newest")}
              className="h-9 min-w-[10.5rem] rounded-lg border border-border/70 bg-card px-3 text-sm text-brand-brown outline-none focus:border-brand-coral/40 focus:ring-2 focus:ring-brand-coral/15"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {children}
      </div>
    </div>
  );
}
