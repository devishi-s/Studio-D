import { categories } from "@/data/products";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/common/section-header";
import { CategoryCard } from "@/components/common/category-card";

export function CategoryShowcase() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeader
          title="Explore by Category"
          subtitle="From delicate crochet flowers to original paintings — find something that speaks to you."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <CategoryCard
              key={category.id}
              category={category}
              className={`animate-fade-in-up animation-delay-${(i + 1) * 100}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
