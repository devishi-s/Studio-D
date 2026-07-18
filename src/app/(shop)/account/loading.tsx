import { Container } from "@/components/layout/container";

export default function AccountLoading() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="h-8 w-48 animate-pulse rounded bg-brand-blush" />
          <div className="h-40 animate-pulse rounded-2xl bg-brand-blush/70" />
          <div className="h-20 animate-pulse rounded-2xl bg-brand-blush/50" />
        </div>
      </Container>
    </section>
  );
}
