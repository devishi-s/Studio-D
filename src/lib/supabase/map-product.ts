import { resolveProductImagePath } from "@/lib/supabase/storage";
import { resolveCategory } from "@/data/categories";
import type { Database } from "@/types/database";
import type { Product } from "@/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

/** Maps a products table row to the storefront `Product` shape. */
export function mapProductRow(row: ProductRow): Product {
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
