import { Container } from "@/components/layout/container";
import { SiteLogo } from "@/components/layout/site-logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="relative overflow-hidden bg-brand-cream py-14 sm:py-20">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-blush/60" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-brand-sage/10" />

      <Container>
        <div className="relative mx-auto max-w-md">
          <div className="mb-8 flex justify-center">
            <SiteLogo className="h-12" />
          </div>
          <div className="rounded-2xl border border-border bg-white p-5 sm:p-8">
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}
