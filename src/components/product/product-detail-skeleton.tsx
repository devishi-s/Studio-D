import { Container } from "@/components/layout/container";

/** Matches product detail layout: gallery + info column + related grid strip. */
export function ProductDetailSkeleton() {
  return (
    <section className="py-10 sm:py-14" aria-busy="true" aria-label="Loading product">
      <Container>
        <div className="mb-6 h-4 w-48 animate-pulse rounded bg-brand-blush" />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-3">
            <div className="aspect-square animate-pulse rounded-xl bg-brand-blush" />
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-lg bg-brand-blush"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="h-3 w-24 animate-pulse rounded bg-brand-blush" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-brand-blush" />
            <div className="h-7 w-28 animate-pulse rounded bg-brand-blush" />
            <div className="my-2 h-px w-full bg-border/60" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-brand-blush" />
              <div className="h-4 w-full animate-pulse rounded bg-brand-blush" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-brand-blush" />
            </div>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div className="h-24 animate-pulse rounded-lg bg-brand-blush" />
              <div className="h-24 animate-pulse rounded-lg bg-brand-blush" />
            </div>
            <div className="mt-4 h-11 w-full animate-pulse rounded-full bg-brand-blush" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg bg-brand-blush"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-6 sm:mt-20">
          <div className="mx-auto h-7 w-48 animate-pulse rounded bg-brand-blush" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-xl bg-brand-blush"
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
