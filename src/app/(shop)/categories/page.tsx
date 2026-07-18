import type { Metadata } from "next";

import { categories } from "@/data/products";
import { getProductsByCategory } from "@/lib/supabase/products";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/common/section-header";
import { CategoryCard } from "@/components/common/category-card";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse Studio D collections — crochet flowers, paintings, handmade gifts, and decorative items.",
};

export const revalidate = 60;

export default async function CategoriesPage() {
  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const products = await getProductsByCategory(cat.slug);
      return {
        ...cat,
        productCount: products.length,
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
              <CategoryCard category={cat} className="h-full" />
              <p className="mt-1.5 text-center text-xs text-muted-foreground">
                {cat.productCount}{" "}
                {cat.productCount === 1 ? "product" : "products"}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
