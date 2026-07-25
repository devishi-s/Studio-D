import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { AdminProductCreateForm } from "@/components/admin/admin-product-create-form";

export const metadata: Metadata = {
  title: "Add product",
  robots: { index: false, follow: false },
};

export default async function AdminNewProductPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand-brown"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to products
        </Link>
        <h2 className="mt-3 font-heading text-xl font-semibold text-brand-brown">
          Add New Product
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a catalog item from scratch. It will appear in the shop when
          active.
        </p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-white p-5 sm:p-6">
        <AdminProductCreateForm />
      </div>
    </div>
  );
}
