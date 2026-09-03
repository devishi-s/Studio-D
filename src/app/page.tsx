import type { Metadata } from "next";
import { Suspense } from "react";

import { getFeaturedProducts } from "@/lib/supabase/products";
import { buildPageMetadata, organizationJsonLd } from "@/lib/seo";
import { HeroBanner } from "@/components/layout/hero-banner";
import { CategoryShowcase } from "@/components/layout/category-showcase";
import { FeaturedProducts } from "@/components/layout/featured-products";
import { BrandStory } from "@/components/layout/brand-story";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/common/section-header";
import { JsonLd } from "@/components/seo/json-ld";

/** Keep in sync with PRODUCT_REVALIDATE_SECONDS in src/lib/cache.ts */
export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Studio D | Handmade Crochet, Paintings & Thoughtful Gifts",
  description:
    "Studio D crafts handmade crochet flowers, original paintings, and warm home decor — made slowly, meant to last.",
  path: "/",
  absoluteTitle: true,
});

type HomePageProps = {
  searchParams: Promise<{ error?: string }>;
};

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

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const showUnauthorized = params.error === "unauthorized";

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      {showUnauthorized ? (
        <div className="border-b border-destructive/20 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
          You don&apos;t have access to the admin area. If you believe this is a
          mistake, ask an existing admin to enable your account.
        </div>
      ) : null}
      <HeroBanner />
      <Suspense
        fallback={
          <section className="py-16 sm:py-20">
            <Container>
              <SectionHeader
                title="Explore by Category"
                subtitle="Wearables, charms, crochet creations, and art — find something that speaks to you."
              />
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] animate-pulse rounded-xl bg-brand-blush/50"
                  />
                ))}
              </div>
            </Container>
          </section>
        }
      >
        <CategoryShowcase />
      </Suspense>
      <Suspense fallback={<FeaturedProductsFallback />}>
        <FeaturedProductsSection />
      </Suspense>
      <BrandStory />
    </>
  );
}
