import type { Product, SortOption } from "@/types";

/** Filters applied to the storefront catalog query (URL ↔ Supabase). */
export type ProductQueryFilters = {
  search?: string;
  /** Category slug; omit or `"all"` means no category filter. */
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
};

const SORT_VALUES: SortOption[] = [
  "newest",
  "price-asc",
  "price-desc",
  "name-asc",
];

function parseNonNegativeNumber(raw: string | undefined): number | undefined {
  if (raw == null || raw.trim() === "") return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return n;
}

/**
 * Parses `/products` search params into a typed filter object.
 * Invalid values are dropped so the query stays safe.
 */
export function parseProductSearchParams(params: {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}): ProductQueryFilters {
  const search = params.search?.trim() || undefined;
  const category =
    params.category && params.category !== "all"
      ? params.category
      : undefined;

  let minPrice = parseNonNegativeNumber(params.minPrice);
  let maxPrice = parseNonNegativeNumber(params.maxPrice);

  if (
    minPrice != null &&
    maxPrice != null &&
    minPrice > maxPrice
  ) {
    // Swap so a reversed range still returns sensible results.
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  const sort = SORT_VALUES.includes(params.sort as SortOption)
    ? (params.sort as SortOption)
    : "newest";

  return { search, category, minPrice, maxPrice, sort };
}

/** Counts user-facing filters (excludes default sort). */
export function countActiveProductFilters(
  filters: ProductQueryFilters
): number {
  let count = 0;
  if (filters.search) count += 1;
  if (filters.category) count += 1;
  if (filters.minPrice != null) count += 1;
  if (filters.maxPrice != null) count += 1;
  return count;
}

/** Escapes `%` / `_` / `\` for safe PostgREST `ilike` patterns. */
export function escapeIlikePattern(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
}

/** Pure in-memory sort for already-fetched product lists (category pages). */
export function sortProducts(items: Product[], sort: SortOption): Product[] {
  const sorted = [...items];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

/** Pure in-memory category filter for already-fetched product lists. */
export function filterProducts(
  items: Product[],
  categorySlug?: string
): Product[] {
  if (!categorySlug || categorySlug === "all") return items;
  return items.filter((p) => p.category.slug === categorySlug);
}
