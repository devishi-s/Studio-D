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
import { buildPageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/common/section-header";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductCatalogFilters } from "@/components/product/product-catalog-filters";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";

/** Keep in sync with PRODUCT_REVALIDATE_SECONDS in src/lib/cache.ts */
export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Shop Handmade Gifts & Decor",
  description:
    "Browse Studio D’s handmade crochet flowers, paintings, gifts, and decorative pieces — crafted with care in India.",
  path: "/products",
});

type ProductsSearchParams = {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
};

type ProductsPageProps = {
  searchParams: Promise<ProductsSearchParams>;
};

function ProductsCatalogSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <div className="hidden h-80 animate-pulse rounded-xl bg-brand-blush/50 lg:block" />
      <div className="space-y-6">
        <div className="h-10 animate-pulse rounded-lg bg-brand-blush/50" />
        <ProductGridSkeleton count={8} columns={3} />
      </div>
    </div>
  );
}

async function ProductsCatalog({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  const filters = parseProductSearchParams(searchParams);
  const activeCategory = filters.category ?? "all";
  const activeSort = filters.sort ?? "newest";
  const activeFilterCount = countActiveProductFilters(filters);

  const [products, totalCount] = await Promise.all([
    getAllProducts(filters),
    getActiveProductCount(),
  ]);

  return (
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
        <ProductGrid products={products} columns={3} priorityCount={3} />
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="font-heading text-lg text-brand-brown">
            No products found
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Try a different name, category, or price range — or clear your
            filters and browse the full collection.
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
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          title="Shop"
          subtitle="Every piece is handmade with care. Browse our full collection."
        />

        <div className="mt-10">
          <Suspense fallback={<ProductsCatalogSkeleton />}>
            <ProductsCatalog searchParams={params} />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
