import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import { categories } from "@/data/products";
import {
  countActiveProductFilters,
  parseProductSearchParams,
} from "@/lib/products";
import {
  getActiveProductCount,
  getAllProducts,
} from "@/lib/supabase/products";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/common/section-header";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductCatalogFilters } from "@/components/product/product-catalog-filters";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse our collection of handmade crochet flowers, paintings, gifts, and decorative items.",
};

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const filters = parseProductSearchParams(params);
  const activeCategory = filters.category ?? "all";
  const activeSort = filters.sort ?? "newest";
  const activeFilterCount = countActiveProductFilters(filters);

  const [products, totalCount] = await Promise.all([
    getAllProducts(filters),
    getActiveProductCount(),
  ]);

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          title="Shop"
          subtitle="Every piece is handmade with care. Browse our full collection."
        />

        <div className="mt-10">
          <Suspense
            fallback={
              <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
                <div className="h-80 animate-pulse rounded-xl bg-brand-blush/50" />
                <div className="space-y-6">
                  <div className="h-10 animate-pulse rounded-lg bg-brand-blush/50" />
                  <ProductGridSkeleton count={8} columns={3} />
                </div>
              </div>
            }
          >
            <ProductCatalogFilters
              categories={categories}
              activeSearch={filters.search ?? ""}
              activeCategory={activeCategory}
              activeMinPrice={filters.minPrice}
              activeMaxPrice={filters.maxPrice}
              activeSort={activeSort}
              resultCount={products.length}
              totalCount={totalCount}
              activeFilterCount={activeFilterCount}
            >
              {products.length > 0 ? (
                <ProductGrid products={products} columns={3} />
              ) : (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <p className="font-heading text-lg text-brand-brown">
                    No products found
                  </p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Try a different name, category, or price range — or clear
                    your filters and browse the full collection.
                  </p>
                  {activeFilterCount > 0 ? (
                    <Link
                      href="/products"
                      className="mt-2 text-sm font-medium text-brand-coral transition-colors hover:text-brand-brown"
                    >
                      Clear all filters
                    </Link>
                  ) : null}
                </div>
              )}
            </ProductCatalogFilters>
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
