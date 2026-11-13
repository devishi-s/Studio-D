import type { Metadata } from "next";

import {
  TEMPORARY_CATEGORY_COVER,
  categoryHref,
  mainCategories,
} from "@/data/categories";
import {
  getLatestCategoryCover,
  getProductsByCategory,
} from "@/lib/supabase/products";
import { buildPageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/common/section-header";
import { CategoriesYarnLineLazy } from "@/components/common/categories-yarn-line-lazy";

export const metadata: Metadata = buildPageMetadata({
  title: "Shop by Category",
  description:
    "Explore Studio D collections: wearables, keychains & charms, crochet creations, and art & decor.",
  path: "/categories",
});

/** Keep in sync with PRODUCT_REVALIDATE_SECONDS in src/lib/cache.ts */
export const revalidate = 3600;

export default async function CategoriesPage() {
  const categoriesWithCount = await Promise.all(
    mainCategories.map(async (cat) => {
      const [products, cover] = await Promise.all([
        getProductsByCategory(cat.slug),
        getLatestCategoryCover(cat.slug),
      ]);
      return {
        ...cat,
        productCount: products.length,
        cover,
      };
    })
  );

  const yarnItems = categoriesWithCount.map((cat) => ({
    id: cat.id,
    name: cat.name,
    href: categoryHref(cat),
    coverSrc: cat.cover?.src ?? TEMPORARY_CATEGORY_COVER.src,
    coverAlt:
      cat.cover?.alt ?? `${cat.name}, ${TEMPORARY_CATEGORY_COVER.alt}`,
    productCount: cat.productCount,
    childNames: cat.children.map((c) => c.name).join(", "),
    displayOrder: cat.displayOrder,
  }));

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          title="Our Collections"
          subtitle={
            <>
              Each collection is a labour of love.
              <br />
              Explore what speaks to you.
            </>
          }
        />
      </Container>

      {/* Full-bleed yarn scene — no framed card around it */}
      <CategoriesYarnLineLazy items={yarnItems} />
    </section>
  );
}
