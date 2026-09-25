import { writeFileSync } from "node:fs";
import catalogSeed from "../src/data/catalog-seed.json" with { type: "json" };

function esc(s) {
  return String(s).replace(/'/g, "''");
}

function arr(a) {
  return `ARRAY[${a.map((x) => `'${esc(x)}'`).join(", ")}]::text[]`;
}

function insertValues(p) {
  const compare = p.compareAtPrice == null ? "NULL" : p.compareAtPrice;
  return `insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  '${esc(p.id)}',
  '${esc(p.slug)}',
  '${esc(p.name)}',
  '${esc(p.description)}',
  ${p.price},
  ${compare},
  '${esc(p.category)}',
  ${arr(p.images)},
  ${arr(p.tags)},
  ${p.isFeatured},
  ${p.isActive},
  ${arr(p.materials)},
  '${esc(p.dimensions)}',
  ${p.stockCount},
  '${p.createdAt}'::timestamptz
)`;
}

const conflict = `
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = case
    when exists (
      select 1
      from unnest(public.products.images) as img
      where img is not null
        and img not like '/%'
        and img not like 'http://%'
        and img not like 'https://%'
    )
    then public.products.images
    else excluded.images
  end,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;
`;

const seedLines = [
  "-- Studio D product seed data",
  "-- Generated from src/data/catalog-seed.json",
  "-- Run after supabase/schema.sql",
  "-- WARNING: truncates products (cascades to order_items, reviews, wishlist).",
  "",
  "truncate table public.products cascade;",
  "",
];

for (const p of catalogSeed) {
  seedLines.push(`${insertValues(p)};`, "");
}

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), seedLines.join("\n"));

const polishLines = [
  "-- Studio D catalog polish (idempotent)",
  "-- Generated from src/data/catalog-seed.json",
  "-- Safe for existing projects: upserts products, does not truncate.",
  "-- Preserves reviews, wishlist, and orders that reference product ids.",
  "-- On conflict, keeps products.images when any path is a Storage object",
  "-- (not /images/... and not http(s)), so re-running after admin uploads",
  "-- does not hide those photos.",
  "",
  "begin;",
  "",
];

for (const p of catalogSeed) {
  polishLines.push(`${insertValues(p)}${conflict}`, "");
}

polishLines.push("commit;", "");
polishLines.push("-- Verify");
polishLines.push("select category, count(*) as product_count");
polishLines.push("from public.products");
polishLines.push("group by category");
polishLines.push("order by category;");
polishLines.push("");

writeFileSync(
  new URL("../supabase/catalog-polish.sql", import.meta.url),
  polishLines.join("\n")
);

console.log(
  `Wrote ${catalogSeed.length} products to supabase/seed.sql and supabase/catalog-polish.sql`
);
