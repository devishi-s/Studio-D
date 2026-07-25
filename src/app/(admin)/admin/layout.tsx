import { requireAdmin } from "@/lib/supabase/require-admin";
import { Container } from "@/components/layout/container";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-[70vh] bg-brand-cream/40 py-8 sm:py-10">
      <Container>
        <div className="mb-6 flex flex-col gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-brand-coral">
              Studio D
            </p>
            <h1 className="mt-1 font-heading text-2xl font-semibold text-brand-brown sm:text-3xl">
              Admin
            </h1>
          </div>
          <AdminNav />
        </div>
        {children}
      </Container>
    </div>
  );
}
