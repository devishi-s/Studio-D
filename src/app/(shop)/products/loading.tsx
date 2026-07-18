import { Container } from "@/components/layout/container";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";

export default function ProductsLoading() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto mb-8 max-w-md space-y-3 text-center">
          <div className="mx-auto h-px w-10 bg-brand-coral/40" />
          <div className="mx-auto h-8 w-32 animate-pulse rounded bg-brand-blush" />
          <div className="mx-auto h-4 w-64 animate-pulse rounded bg-brand-blush" />
        </div>
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <div className="hidden space-y-6 lg:block">
            <div className="h-6 w-20 animate-pulse rounded bg-brand-blush/70" />
            <div className="h-10 animate-pulse rounded-lg bg-brand-blush/50" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 animate-pulse rounded bg-brand-blush/40"
                />
              ))}
            </div>
            <div className="h-10 animate-pulse rounded-lg bg-brand-blush/50" />
          </div>
          <div className="space-y-6">
            <div className="h-10 animate-pulse rounded-lg bg-brand-blush/50" />
            <ProductGridSkeleton count={8} columns={3} />
          </div>
        </div>
      </Container>
    </section>
  );
}
