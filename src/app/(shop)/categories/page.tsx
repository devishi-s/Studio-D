import type { Metadata } from "next";

import { mainCategories } from "@/data/categories";
import {
  getLatestCategoryCover,
  getProductsByCategory,
} from "@/lib/supabase/products";
import { buildPageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/common/section-header";
import { CategoryCard } from "@/components/common/category-card";

export const metadata: Metadata = buildPageMetadata({
  title: "Shop by Category",
  description:
    "Explore Studio D collections — wearables, keychains & charms, crochet creations, and art & decor.",
  path: "/categories",
});

/** Keep in sync with PRODUCT_REVALIDATE_SECONDS in src/lib/cache.ts */
export const revalidate = 3600;

export default async function CategoriesPage() {
  const categoriesWithCount = await Promise.all(
    mainCategories.map(async (cat) => {
      const [products, cover] = await Promise.all([
        getProductsByCategory(cat.slug),
        getLatestCategoryCover(cat.slug),
      ]);
      return {
        ...cat,
        productCount: products.length,
        cover,
      };
    })
  );

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          title="Our Collections"
          subtitle="Each collection is a labour of love. Explore what speaks to you."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {categoriesWithCount.map((cat, i) => (
            <div
              key={cat.id}
              className={`animate-fade-in-up animation-delay-${(i + 1) * 100}`}
            >
              <CategoryCard
                category={cat}
                cover={cat.cover}
                className="h-full"
              />
              <p className="mt-1.5 text-center text-xs text-muted-foreground">
                {cat.productCount}{" "}
                {cat.productCount === 1 ? "product" : "products"}
                {" · "}
                {cat.children.map((c) => c.name).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
