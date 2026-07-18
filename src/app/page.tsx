import { Suspense } from "react";

import { getFeaturedProducts } from "@/lib/supabase/products";
import { HeroBanner } from "@/components/layout/hero-banner";
import { CategoryShowcase } from "@/components/layout/category-showcase";
import { FeaturedProducts } from "@/components/layout/featured-products";
import { BrandStory } from "@/components/layout/brand-story";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/common/section-header";

export const revalidate = 60;

async function FeaturedProductsSection() {
  const featured = await getFeaturedProducts();
  return <FeaturedProducts products={featured} />;
}

function FeaturedProductsFallback() {
  return (
    <section className="bg-brand-cream/50 py-16 sm:py-20">
      <Container>
        <SectionHeader
          title="Handpicked for You"
          subtitle="Our most loved pieces — each one crafted with patience, precision, and a whole lot of heart."
        />
        <div className="mt-10">
          <ProductGridSkeleton count={4} columns={4} />
        </div>
      </Container>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryShowcase />
      <Suspense fallback={<FeaturedProductsFallback />}>
        <FeaturedProductsSection />
      </Suspense>
      <BrandStory />
    </>
  );
}
