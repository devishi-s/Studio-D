import { Container } from "@/components/layout/container";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";

export default function CategoryLoading() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="mb-6 h-4 w-40 animate-pulse rounded bg-brand-blush" />
        <div className="h-44 w-full animate-pulse rounded-xl bg-brand-blush sm:h-56" />
        <div className="mt-8 mb-6 flex items-center justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-brand-blush" />
          <div className="h-9 w-36 animate-pulse rounded-full bg-brand-blush" />
        </div>
        <ProductGridSkeleton count={6} columns={3} />
      </Container>
    </section>
  );
}
