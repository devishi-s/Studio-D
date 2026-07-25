import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { getAdminProductById } from "@/lib/supabase/admin";
import { AdminProductEditForm } from "@/components/admin/admin-product-edit-form";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit product · ${id}`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminEditProductPage({
  params,
}: EditProductPageProps) {
  await requireAdmin();
  const { id } = await params;
  const product = await getAdminProductById(decodeURIComponent(id));
  if (!product) notFound();

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
          Edit product
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-white p-5 sm:p-6">
        <AdminProductEditForm product={product} />
      </div>
    </div>
  );
}
