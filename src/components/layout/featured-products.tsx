import type { Product } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/common/section-header";
import { ProductGrid } from "@/components/product/product-grid";

type FeaturedProductsProps = {
  products: Product[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="bg-brand-cream/50 py-16 sm:py-20">
      <Container>
        <SectionHeader
          title="Handpicked for You"
          subtitle="Our most loved pieces — each one crafted with patience, precision, and a whole lot of heart."
        />

        <div className="mt-10">
          {products.length > 0 ? (
            <ProductGrid products={products} columns={4} />
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Featured pieces will appear here soon.
            </p>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-coral transition-colors hover:text-brand-brown"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
