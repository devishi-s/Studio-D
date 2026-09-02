import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { getAllProducts } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";
import {
  categoryDisplayName,
  getCategoryBySlug,
  getMainCategoryBySlug,
} from "@/data/categories";
import { buttonVariants } from "@/components/ui/button";
import {
  AdminFeaturedToggle,
  AdminStockEditor,
} from "@/components/admin/admin-product-row-controls";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin products",
  robots: { index: false, follow: false },
};

function categoryColumns(slug: string): { main: string; sub: string } {
  const node = getCategoryBySlug(slug);
  if (!node) return { main: slug, sub: "—" };

  if (node.parentSlug) {
    return {
      main: node.parentName ?? node.parentSlug,
      sub: node.name,
    };
  }

  const main = getMainCategoryBySlug(slug);
  if (main) {
    return { main: main.name, sub: "—" };
  }

  return { main: categoryDisplayName(node), sub: "—" };
}

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getAllProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-brand-brown">
            Products
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} catalog {products.length === 1 ? "item" : "items"}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className={cn(
            buttonVariants({ size: "lg" }),
            "rounded-full bg-brand-brown text-white hover:bg-brand-brown/85"
          )}
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-white">
        <table className="w-full min-w-[840px] text-left text-sm">
          <thead className="border-b border-border/60 bg-brand-blush/30 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Main category</th>
              <th className="px-4 py-3 font-medium">Subcategory</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {products.map((product) => {
              const { main, sub } = categoryColumns(product.category);
              return (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-brand-brown">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.slug}</p>
                </td>
                <td className="px-4 py-3 tabular-nums text-brand-brown">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{main}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {sub === "—" ? (
                    <span className="text-brand-coral/80">Not set</span>
                  ) : (
                    sub
                  )}
                </td>
                <td className="px-4 py-3">
                  <AdminStockEditor
                    productId={product.id}
                    stockCount={product.stockCount}
                  />
                </td>
                <td className="px-4 py-3">
                  <AdminFeaturedToggle
                    productId={product.id}
                    featured={product.featured}
                  />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {product.isActive ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-sm font-medium text-brand-coral hover:text-brand-brown"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            No products yet. Add your first handmade piece.
          </p>
        ) : null}
      </div>
    </div>
  );
}
