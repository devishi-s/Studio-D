import type { Product } from "@/types";

import { FeaturedSpill } from "@/components/layout/featured-spill";

type FeaturedProductsProps = {
  products: Product[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="bg-brand-cream">
      <FeaturedSpill products={products} />
    </section>
  );
}
