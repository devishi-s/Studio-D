import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import {
  categoryHref,
  getMainCategoryBySlug,
  mainCategories,
} from "@/data/categories";
import {
  getLatestCategoryCover,
  getProductsByCategory,
} from "@/lib/supabase/products";
import { sortProducts } from "@/lib/products";
import type { SortOption } from "@/types";
import { buildPageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/container";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { ProductFilters } from "@/components/product/product-filters";
import { CategoryHeroCover } from "@/components/common/category-hero-cover";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
};

/** Keep in sync with PRODUCT_REVALIDATE_SECONDS in src/lib/cache.ts */
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getMainCategoryBySlug(slug);
  if (!category) {
    return buildPageMetadata({
      title: "Category Not Found",
      description: "This Studio D collection could not be found.",
      path: `/categories/${slug}`,
      noIndex: true,
    });
  }
  return buildPageMetadata({
    title: `${category.name} | Handmade Collection`,
    description: category.description,
    path: `/categories/${category.slug}`,
  });
}

export function generateStaticParams() {
  return mainCategories.map((c) => ({ slug: c.slug }));
}

const variantByIndex = ["cream", "sage", "coral", "blush"] as const;

async function CategoryProductList({
  slug,
  activeSort,
}: {
  slug: string;
  activeSort: SortOption;
}) {
  const categoryProducts = await getProductsByCategory(slug);
  const sorted = sortProducts(categoryProducts, activeSort);

  return (
    <>
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

      <div className="mt-6">
        {sorted.length > 0 ? (
          <ProductGrid products={sorted} columns={3} priorityCount={3} />
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
    </>
  );
}

function CategoryProductListSkeleton() {
  return (
    <>
      <div className="mt-8 flex items-center justify-between">
        <div className="h-4 w-24 animate-pulse rounded bg-brand-blush" />
        <div className="h-9 w-36 animate-pulse rounded-lg bg-brand-blush" />
      </div>
      <div className="mt-6">
        <ProductGridSkeleton count={6} columns={3} />
      </div>
    </>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { sort } = await searchParams;

  const category = getMainCategoryBySlug(slug);
  if (!category) notFound();

  const activeSort = (sort as SortOption) ?? "newest";
  const variant = variantByIndex[(category.displayOrder - 1) % 4] ?? "blush";
  const cover = await getLatestCategoryCover(slug);

  return (
    <section className="py-10 sm:py-14">
      <Container>
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

        <div className="relative overflow-hidden rounded-xl">
          <CategoryHeroCover
            label={category.name}
            variant={variant}
            cover={cover}
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

        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-semibold text-brand-brown">
              Shop by type
            </h2>
            <span className="text-xs text-muted-foreground">
              {category.children.length} collections
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {category.children.map((sub) => (
              <Link
                key={sub.slug}
                href={categoryHref(sub)}
                className="group flex items-center justify-between rounded-xl border border-border/50 bg-card px-4 py-3 transition-colors hover:border-brand-coral/40 hover:bg-brand-blush/30"
              >
                <div>
                  <p className="font-heading text-base font-medium text-brand-brown">
                    {sub.name}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {sub.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-brand-coral transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>

        <Suspense fallback={<CategoryProductListSkeleton />}>
          <CategoryProductList slug={slug} activeSort={activeSort} />
        </Suspense>
      </Container>
    </section>
  );
}
