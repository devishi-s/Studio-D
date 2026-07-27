import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { categories } from "@/data/products";
import { cachedQuery, PRODUCT_REVALIDATE_SECONDS } from "@/lib/cache";
import {
  escapeIlikePattern,
  type ProductQueryFilters,
} from "@/lib/products";
import { resolveProductImagePath } from "@/lib/supabase/storage";
import type { Database } from "@/types/database";
import type { Category, Product, SortOption } from "@/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. See docs/SUPABASE.md."
    );
  }

  // Public catalog reads do not need auth cookies. Avoiding `cookies()` keeps
  // product routes eligible for static generation / revalidation.
  return createSupabaseClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function resolveCategory(slug: string): Category {
  const match = categories.find((category) => category.slug === slug);
  if (match) return match;

  return {
    id: slug,
    name: slug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
    slug,
    description: "",
    image: "",
    displayOrder: 0,
  };
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    compareAtPrice:
      row.compare_at_price == null ? undefined : Number(row.compare_at_price),
    images: (row.images ?? []).map(resolveProductImagePath),
    category: resolveCategory(row.category),
    tags: row.tags ?? [],
    materials: row.materials ?? [],
    dimensions: row.dimensions ?? "",
    stockCount: row.stock_count,
    isFeatured: row.featured,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

/** Maps a products table row to the storefront `Product` shape. */
export function mapProductRow(row: ProductRow): Product {
  return mapProduct(row);
}

function assertNoError(error: { message: string } | null, context: string) {
  if (error) {
    throw new Error(`Supabase ${context}: ${error.message}`);
  }
}

function applySort<
  T extends { order: (column: string, options?: { ascending?: boolean }) => T },
>(query: T, sort: SortOption = "newest"): T {
  switch (sort) {
    case "price-asc":
      return query.order("price", { ascending: true });
    case "price-desc":
      return query.order("price", { ascending: false });
    case "name-asc":
      return query.order("name", { ascending: true });
    case "newest":
    default:
      return query.order("created_at", { ascending: false });
  }
}

function filtersCacheKey(filters: ProductQueryFilters): string {
  return JSON.stringify({
    search: filters.search ?? "",
    category: filters.category ?? "all",
    minPrice: filters.minPrice ?? null,
    maxPrice: filters.maxPrice ?? null,
    sort: filters.sort ?? "newest",
  });
}

/**
 * Active products for the storefront.
 * Pass filters to apply name search, category, price range, and sort in Supabase.
 * Results are cached for {@link PRODUCT_REVALIDATE_SECONDS}.
 */
export async function getAllProducts(
  filters: ProductQueryFilters = {}
): Promise<Product[]> {
  const key = filtersCacheKey(filters);

  return cachedQuery(
    async () => {
      const supabase = createPublicClient();
      const { search, category, minPrice, maxPrice, sort = "newest" } = filters;

      let query = supabase.from("products").select("*").eq("is_active", true);

      if (search) {
        query = query.ilike("name", `%${escapeIlikePattern(search)}%`);
      }
      if (category && category !== "all") {
        query = query.eq("category", category);
      }
      if (minPrice != null) {
        query = query.gte("price", minPrice);
      }
      if (maxPrice != null) {
        query = query.lte("price", maxPrice);
      }

      query = applySort(query, sort);

      const { data, error } = await query;
      assertNoError(error, "getAllProducts");
      return (data ?? []).map(mapProduct);
    },
    {
      keyParts: ["products", "all", key],
      tags: ["products"],
      revalidate: PRODUCT_REVALIDATE_SECONDS,
    }
  );
}

/** Count of all active catalog products (unfiltered). */
export async function getActiveProductCount(): Promise<number> {
  return cachedQuery(
    async () => {
      const supabase = createPublicClient();
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      assertNoError(error, "getActiveProductCount");
      return count ?? 0;
    },
    {
      keyParts: ["products", "active-count"],
      tags: ["products"],
      revalidate: PRODUCT_REVALIDATE_SECONDS,
    }
  );
}

/** Single active product by slug, or `null` when missing. */
export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  return cachedQuery(
    async () => {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      assertNoError(error, "getProductBySlug");
      return data ? mapProduct(data) : null;
    },
    {
      keyParts: ["products", "slug", slug],
      tags: ["products", `product:${slug}`],
      revalidate: PRODUCT_REVALIDATE_SECONDS,
    }
  );
}

/** Active products in a category (category slug), newest first. */
export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  return cachedQuery(
    async () => {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      assertNoError(error, "getProductsByCategory");
      return (data ?? []).map(mapProduct);
    },
    {
      keyParts: ["products", "category", category],
      tags: ["products", `category:${category}`],
      revalidate: PRODUCT_REVALIDATE_SECONDS,
    }
  );
}

/** Active featured products, newest first. */
export async function getFeaturedProducts(): Promise<Product[]> {
  return cachedQuery(
    async () => {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("featured", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      assertNoError(error, "getFeaturedProducts");
      return (data ?? []).map(mapProduct);
    },
    {
      keyParts: ["products", "featured"],
      tags: ["products"],
      revalidate: PRODUCT_REVALIDATE_SECONDS,
    }
  );
}
