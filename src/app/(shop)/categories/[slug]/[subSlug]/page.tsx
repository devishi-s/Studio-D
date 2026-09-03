import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  categoryHref,
  getMainCategoryBySlug,
  getSubcategory,
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

type SubcategoryPageProps = {
  params: Promise<{ slug: string; subSlug: string }>;
  searchParams: Promise<{ sort?: string }>;
};

/** Keep in sync with PRODUCT_REVALIDATE_SECONDS in src/lib/cache.ts */
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: SubcategoryPageProps): Promise<Metadata> {
  const { slug, subSlug } = await params;
  const main = getMainCategoryBySlug(slug);
  const sub = getSubcategory(slug, subSlug);
  if (!main || !sub) {
    return buildPageMetadata({
      title: "Category Not Found",
      description: "This Studio D collection could not be found.",
      path: `/categories/${slug}/${subSlug}`,
      noIndex: true,
    });
  }
  return buildPageMetadata({
    title: `${sub.name} | ${main.name}`,
    description: sub.description,
    path: categoryHref(sub),
  });
}

export function generateStaticParams() {
  return mainCategories.flatMap((main) =>
    main.children.map((sub) => ({
      slug: main.slug,
      subSlug: sub.slug,
    }))
  );
}

const variantByIndex = ["cream", "sage", "coral", "blush"] as const;

async function SubcategoryProductList({
  subSlug,
  activeSort,
}: {
  subSlug: string;
  activeSort: SortOption;
}) {
  const categoryProducts = await getProductsByCategory(subSlug);
  const sorted = sortProducts(categoryProducts, activeSort);

  return (
    <>
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sorted.length} {sorted.length === 1 ? "product" : "products"}
        </p>
        <ProductFilters
          categories={[]}
          activeCategory={subSlug}
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

function ProductListSkeleton() {
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

export default async function SubcategoryPage({
  params,
  searchParams,
}: SubcategoryPageProps) {
  const { slug, subSlug } = await params;
  const { sort } = await searchParams;

  const main = getMainCategoryBySlug(slug);
  const sub = getSubcategory(slug, subSlug);
  if (!main || !sub) notFound();

  const activeSort = (sort as SortOption) ?? "newest";
  const variant =
    variantByIndex[(main.displayOrder - 1) % 4] ?? "blush";
  const cover = await getLatestCategoryCover(subSlug);

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-brown"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Categories
          </Link>
          <span>/</span>
          <Link
            href={`/categories/${main.slug}`}
            className="transition-colors hover:text-brand-brown"
          >
            {main.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{sub.name}</span>
        </nav>

        <div className="relative overflow-hidden rounded-xl">
          <CategoryHeroCover
            label={sub.name}
            variant={variant}
            cover={cover}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-brown/30 px-4 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/70">
              {main.name}
            </p>
            <div className="mb-3 h-px w-10 bg-white/60" />
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {sub.name}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
              {sub.description}
            </p>
          </div>
        </div>

        <Suspense fallback={<ProductListSkeleton />}>
          <SubcategoryProductList subSlug={subSlug} activeSort={activeSort} />
        </Suspense>
      </Container>
    </section>
  );
}
