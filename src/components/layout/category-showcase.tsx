import { mainCategories } from "@/data/categories";
import { getLatestCategoryCover } from "@/lib/supabase/products";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/common/section-header";
import { CategoryCard } from "@/components/common/category-card";

export async function CategoryShowcase() {
  const covers = await Promise.all(
    mainCategories.map((category) => getLatestCategoryCover(category.slug))
  );

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeader
          title="Explore by Category"
          subtitle="Wearables, charms, crochet creations, and art — find something that speaks to you."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mainCategories.map((category, i) => (
            <CategoryCard
              key={category.id}
              category={category}
              cover={covers[i]}
              className={`animate-fade-in-up animation-delay-${(i + 1) * 100}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
