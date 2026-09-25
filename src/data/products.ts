/**
 * Seed catalog for `scripts/generate-seed.mjs` and local SQL regeneration.
 * Live storefront categories: `src/data/categories.ts`.
 * Cart resolution uses live Supabase via `useResolvedCart`.
 */

import type { Product } from "@/types";
import {
  categories,
  getCategoryBySlug,
  resolveCategory,
} from "@/data/categories";
import catalogSeed from "./catalog-seed.json";

export {
  categories,
  getCategoryBySlug,
  resolveCategory,
} from "@/data/categories";

function cat(slug: string) {
  return getCategoryBySlug(slug) ?? resolveCategory(slug);
}

type CatalogSeedRow = (typeof catalogSeed)[number];

function mapSeedRow(row: CatalogSeedRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    compareAtPrice: row.compareAtPrice,
    images: row.images,
    category: cat(row.category),
    tags: row.tags,
    materials: row.materials,
    dimensions: row.dimensions,
    stockCount: row.stockCount,
    isFeatured: row.isFeatured,
    isActive: row.isActive,
    createdAt: row.createdAt,
  };
}

export const products: Product[] = catalogSeed.map(mapSeedRow);
