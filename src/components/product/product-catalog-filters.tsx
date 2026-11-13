"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

import type { SortOption } from "@/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  getCategoryBySlug,
  mainCategories,
} from "@/data/categories";
import {
  trackCategoryFiltered,
  trackSearchPerformed,
} from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type ProductCatalogFiltersProps = {
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

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState(activeSearch);
  const [minDraft, setMinDraft] = useState(
    activeMinPrice != null ? String(activeMinPrice) : ""
  );
  const [maxDraft, setMaxDraft] = useState(
    activeMaxPrice != null ? String(activeMaxPrice) : ""
  );

  const lastTrackedSearch = useRef<string | null>(null);

  useEffect(() => {
    setSearchDraft(activeSearch);
  }, [activeSearch]);

  useEffect(() => {
    setMinDraft(activeMinPrice != null ? String(activeMinPrice) : "");
  }, [activeMinPrice]);

  useEffect(() => {
    setMaxDraft(activeMaxPrice != null ? String(activeMaxPrice) : "");
  }, [activeMaxPrice]);

  useEffect(() => {
    const term = activeSearch.trim();
    if (!term) {
      lastTrackedSearch.current = "";
      return;
    }
    if (lastTrackedSearch.current === term) return;
    lastTrackedSearch.current = term;
    trackSearchPerformed({ searchTerm: term, resultCount });
  }, [activeSearch, resultCount]);

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

  const selectCategory = useCallback(
    (category: string) => {
      trackCategoryFiltered({ category });
      setParam("category", category, "all");
    },
    [setParam]
  );

  const categoryLabel =
    getCategoryBySlug(activeCategory)?.name ?? null;

  /** Filters that live in the mobile panel (excludes search). */
  const panelFilterCount =
    (activeCategory !== "all" ? 1 : 0) +
    (activeMinPrice != null ? 1 : 0) +
    (activeMaxPrice != null ? 1 : 0) +
    (activeSort !== "newest" ? 1 : 0);

  const searchField = (inputId: string) => (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand-brown-light"
      >
        Search
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          id={inputId}
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
  );

  const categorySection = (
    <div className="space-y-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand-brown-light">
        Category
      </p>
      <ul className="space-y-1">
        <li>
          <button
            type="button"
            onClick={() => selectCategory("all")}
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
        {mainCategories.map((main) => (
          <li key={main.slug} className="space-y-0.5">
            <button
              type="button"
              onClick={() => selectCategory(main.slug)}
              className={cn(
                "w-full border-l-2 py-1.5 pl-3 text-left text-sm transition-colors",
                activeCategory === main.slug
                  ? "border-brand-coral font-medium text-brand-brown"
                  : "border-transparent text-muted-foreground hover:text-brand-brown"
              )}
            >
              {main.name}
            </button>
            <ul className="ml-3 space-y-0.5 border-l border-border/50 pl-2">
              {main.children.map((sub) => (
                <li key={sub.slug}>
                  <button
                    type="button"
                    onClick={() => selectCategory(sub.slug)}
                    className={cn(
                      "w-full py-1 pl-2 text-left text-xs transition-colors",
                      activeCategory === sub.slug
                        ? "font-medium text-brand-coral"
                        : "text-muted-foreground hover:text-brand-brown"
                    )}
                  >
                    {sub.name}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );

  const priceSection = (
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
  );

  const sortControl = (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="shrink-0 uppercase tracking-[0.12em]">Sort</span>
      <select
        value={activeSort}
        onChange={(e) => setParam("sort", e.target.value, "newest")}
        className="h-9 min-w-[10.5rem] flex-1 rounded-lg border border-border/70 bg-card px-3 text-sm text-brand-brown outline-none focus:border-brand-coral/40 focus:ring-2 focus:ring-brand-coral/15"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );

  const clearButton =
    activeFilterCount > 0 ? (
      <Button
        type="button"
        variant="outline"
        onClick={clearAll}
        className="w-full border-border/70 text-brand-brown hover:bg-brand-blush/40"
      >
        Clear all filters
      </Button>
    ) : null;

  const resultSummary = (
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
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-10">
      {/* Desktop sidebar — search + category + price */}
      <aside className="hidden space-y-8 lg:sticky lg:top-24 lg:block lg:self-start">
        {searchField("product-search")}
        {categorySection}
        {priceSection}
        {clearButton}
      </aside>

      <div className="min-w-0 space-y-5">
        {/* Mobile: search always visible */}
        <div className="lg:hidden">{searchField("product-search-mobile")}</div>

        <div className="flex flex-col gap-3 border-b border-border/50 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap items-start gap-3">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="relative shrink-0 gap-2 border-border/70 text-brand-brown hover:bg-brand-blush/40 lg:hidden"
                  />
                }
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {panelFilterCount > 0 ? (
                  <span className="rounded-full bg-brand-coral px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                    {panelFilterCount}
                  </span>
                ) : null}
              </SheetTrigger>

              <SheetContent
                side="left"
                className="flex w-[min(100%,20rem)] flex-col gap-0 bg-brand-cream p-0 font-ui"
              >
                <SheetHeader className="border-b border-border/60 pb-3 pr-12">
                  <SheetTitle className="font-heading text-lg text-brand-brown">
                    Filters
                  </SheetTitle>
                  {panelFilterCount > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      {panelFilterCount} active
                    </p>
                  ) : null}
                </SheetHeader>

                <div className="flex-1 space-y-8 overflow-y-auto px-4 py-5">
                  {categorySection}
                  {priceSection}
                  <div className="space-y-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand-brown-light">
                      Sort
                    </p>
                    {sortControl}
                  </div>
                  {clearButton}
                </div>
              </SheetContent>
            </Sheet>

            {resultSummary}
          </div>

          {/* Desktop sort stays in the toolbar */}
          <div className="hidden lg:block">{sortControl}</div>
        </div>

        {children}
      </div>
    </div>
  );
}
