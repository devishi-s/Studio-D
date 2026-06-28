import { HeroBanner } from "@/components/layout/hero-banner";
import { CategoryShowcase } from "@/components/layout/category-showcase";
import { FeaturedProducts } from "@/components/layout/featured-products";
import { BrandStory } from "@/components/layout/brand-story";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryShowcase />
      <FeaturedProducts />
      <BrandStory />
    </>
  );
}
