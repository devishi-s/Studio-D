import type { Metadata } from "next";

import type { SortOption } from "@/types";
import {
  categories,
  getAllActiveProducts,
  filterProducts,
  sortProducts,
} from "@/data/products";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/common/section-header";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse our collection of handmade crochet flowers, paintings, gifts, and decorative items.",
};

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const activeCategory = params.category ?? "all";
  const activeSort = (params.sort as SortOption) ?? "newest";

  const allProducts = getAllActiveProducts();
  const filtered = filterProducts(allProducts, activeCategory);
  const sorted = sortProducts(filtered, activeSort);

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          title="Shop"
          subtitle="Every piece is handmade with care. Browse our full collection."
        />

        <div className="mt-8">
          <ProductFilters
            categories={categories}
            activeCategory={activeCategory}
            activeSort={activeSort}
            productCount={allProducts.length}
          />
        </div>

        <div className="mt-8">
          {sorted.length > 0 ? (
            <ProductGrid products={sorted} columns={4} />
          ) : (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <p className="text-lg font-heading text-brand-brown">
                No products found
              </p>
              <p className="text-sm text-muted-foreground">
                Try selecting a different category.
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
