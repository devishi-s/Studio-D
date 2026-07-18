import { writeFileSync } from "node:fs";
import { products } from "../src/data/products.ts";

function esc(s) {
  return String(s).replace(/'/g, "''");
}

function arr(a) {
  return `ARRAY[${a.map((x) => `'${esc(x)}'`).join(", ")}]::text[]`;
}

const lines = [
  "-- Studio D product seed data",
  "-- Generated from src/data/products.ts",
  "-- Run after supabase/schema.sql",
  "",
  "truncate table public.products cascade;",
  "",
];

for (const p of products) {
  const compare = p.compareAtPrice == null ? "NULL" : p.compareAtPrice;
  lines.push(`insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  '${esc(p.id)}',
  '${esc(p.slug)}',
  '${esc(p.name)}',
  '${esc(p.description)}',
  ${p.price},
  ${compare},
  '${esc(p.category.slug)}',
  ${arr(p.images)},
  ${arr(p.tags)},
  ${p.isFeatured},
  ${p.isActive},
  ${arr(p.materials)},
  '${esc(p.dimensions)}',
  ${p.stockCount},
  '${p.createdAt}'::timestamptz
);
`);
}

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), lines.join("\n"));
console.log(`Wrote ${products.length} products to supabase/seed.sql`);
