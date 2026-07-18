import { Container } from "@/components/layout/container";

export default function CategoriesLoading() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto mb-10 max-w-md space-y-3 text-center">
          <div className="mx-auto h-px w-10 bg-brand-coral/40" />
          <div className="mx-auto h-8 w-48 animate-pulse rounded bg-brand-blush" />
          <div className="mx-auto h-4 w-72 animate-pulse rounded bg-brand-blush" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-border/40"
            >
              <div className="aspect-[4/3] animate-pulse bg-brand-blush" />
              <div className="space-y-2 p-4">
                <div className="h-5 w-1/2 animate-pulse rounded bg-brand-blush" />
                <div className="h-4 w-full animate-pulse rounded bg-brand-blush" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
