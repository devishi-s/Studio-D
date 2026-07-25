import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, IndianRupee, Package, ShoppingBag } from "lucide-react";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { getAdminStats } from "@/lib/supabase/admin";
import { formatDate, formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/account/order-status-badge";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={ShoppingBag}
          label="Orders"
          value={String(stats.totalOrders)}
        />
        <StatCard
          icon={IndianRupee}
          label="Revenue"
          value={formatPrice(stats.totalRevenue)}
          hint="Excludes cancelled"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low stock"
          value={String(stats.lowStockProducts.length)}
          hint="Fewer than 5 in stock"
        />
      </div>

      <section className="rounded-2xl border border-border/60 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold text-brand-brown">
            Low stock products
          </h2>
          <Link
            href="/admin/products"
            className="text-sm font-medium text-brand-coral hover:text-brand-brown"
          >
            Manage products
          </Link>
        </div>
        {stats.lowStockProducts.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            All products have healthy stock levels.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border/50">
            {stats.lowStockProducts.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="font-medium text-brand-brown hover:text-brand-coral"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {product.category}
                  </p>
                </div>
                <span
                  className={
                    product.stockCount === 0
                      ? "font-semibold text-destructive"
                      : "font-semibold text-brand-coral"
                  }
                >
                  {product.stockCount} left
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-border/60 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold text-brand-brown">
            Recent orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-brand-coral hover:text-brand-brown"
          >
            View all
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No orders yet.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="pb-2 font-medium">Order</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Total</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-brand-brown hover:text-brand-coral"
                      >
                        {order.id.slice(0, 8).toUpperCase()}
                      </Link>
                      {order.needsManualReview ? (
                        <span className="ml-2 text-[10px] font-semibold uppercase text-brand-gold">
                          Review
                        </span>
                      ) : null}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {order.customerName}
                    </td>
                    <td className="py-3 tabular-nums text-brand-brown">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-5">
      <div className="flex items-center gap-2 text-brand-sage">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="mt-3 font-heading text-2xl font-semibold text-brand-brown">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
