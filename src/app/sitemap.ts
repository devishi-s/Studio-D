import type { MetadataRoute } from "next";

import { categoryHref, mainCategories } from "@/data/categories";
import { SITE_URL } from "@/lib/constants";
import { getAllProducts } from "@/lib/supabase/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/categories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = mainCategories.flatMap(
    (main) => [
      {
        url: `${base}/categories/${main.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      },
      ...main.children.map((sub) => ({
        url: `${base}${categoryHref(sub)}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ]
  );

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProducts();
    productRoutes = products.map((product) => ({
      url: `${base}/products/${product.slug}`,
      lastModified: product.createdAt
        ? new Date(product.createdAt)
        : now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch (error) {
    console.error("[sitemap] Failed to load products:", error);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
