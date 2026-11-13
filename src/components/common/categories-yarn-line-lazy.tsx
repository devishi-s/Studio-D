"use client";

import dynamic from "next/dynamic";

import type { YarnCategoryItem } from "@/components/common/categories-yarn-line";

const CategoriesYarnLine = dynamic(
  () =>
    import("@/components/common/categories-yarn-line").then(
      (mod) => mod.CategoriesYarnLine
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="mx-auto mt-6 h-[36rem] w-full max-w-sm animate-pulse rounded-[2rem] bg-brand-blush/40 md:mt-10 md:h-[26rem] md:max-w-7xl lg:h-[27.5rem]"
        aria-hidden
      />
    ),
  }
);

type CategoriesYarnLineLazyProps = {
  items: YarnCategoryItem[];
};

/** Client-only mount so Turbopack/SSR never instantiate the physics module on the server. */
export function CategoriesYarnLineLazy({ items }: CategoriesYarnLineLazyProps) {
  return <CategoriesYarnLine items={items} />;
}
