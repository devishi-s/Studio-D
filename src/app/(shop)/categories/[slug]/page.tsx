import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  categories,
  getCategoryBySlug,
  getProductsByCategory,
  sortProducts,
} from "@/data/products";
import type { SortOption } from "@/types";
import { Container } from "@/components/layout/container";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { ImagePlaceholder } from "@/components/common/image-placeholder";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description: category.description,
  };
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

const variantByIndex = ["cream", "sage", "coral", "blush"] as const;

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { sort } = await searchParams;

  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const activeSort = (sort as SortOption) ?? "newest";
  const categoryProducts = getProductsByCategory(slug);
  const sorted = sortProducts(categoryProducts, activeSort);
  const variant = variantByIndex[(category.displayOrder - 1) % 4] ?? "blush";

  return (
    <section className="py-10 sm:py-14">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-brown"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Categories
          </Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Category header with banner */}
        <div className="relative overflow-hidden rounded-xl">
          <ImagePlaceholder
            label={category.name}
            variant={variant}
            className="h-44 w-full rounded-none sm:h-56"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-brown/30 px-4 text-center">
            <div className="mb-3 h-px w-10 bg-white/60" />
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {category.name}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
              {category.description}
            </p>
          </div>
        </div>

        {/* Sort + count */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {sorted.length} {sorted.length === 1 ? "product" : "products"}
          </p>
          <ProductFilters
            categories={[]}
            activeCategory={slug}
            activeSort={activeSort}
            productCount={sorted.length}
          />
        </div>

        {/* Product grid */}
        <div className="mt-6">
          {sorted.length > 0 ? (
            <ProductGrid products={sorted} columns={3} />
          ) : (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <p className="font-heading text-lg text-brand-brown">
                No products yet
              </p>
              <p className="text-sm text-muted-foreground">
                We&apos;re crafting new pieces for this collection. Check back
                soon!
              </p>
              <Link
                href="/products"
                className="mt-2 text-sm font-medium text-brand-coral transition-colors hover:text-brand-brown"
              >
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
