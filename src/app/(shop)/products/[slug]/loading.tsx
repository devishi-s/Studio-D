import { Container } from "@/components/layout/container";

export default function ProductDetailLoading() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="mb-6 h-4 w-48 animate-pulse rounded bg-brand-blush" />
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="aspect-square animate-pulse rounded-xl bg-brand-blush" />
          <div className="space-y-4">
            <div className="h-3 w-24 animate-pulse rounded bg-brand-blush" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-brand-blush" />
            <div className="h-7 w-28 animate-pulse rounded bg-brand-blush" />
            <div className="h-px w-full bg-border" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-brand-blush" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-brand-blush" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-brand-blush" />
            </div>
            <div className="h-12 w-full animate-pulse rounded-full bg-brand-blush" />
          </div>
        </div>
      </Container>
    </section>
  );
}
