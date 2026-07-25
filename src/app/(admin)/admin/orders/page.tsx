import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { getAllOrders } from "@/lib/supabase/admin";
import { formatDate, formatPrice } from "@/lib/format";
import { AdminOrderStatusSelect } from "@/components/admin/admin-order-status-select";

export const metadata: Metadata = {
  title: "Admin orders",
  robots: { index: false, follow: false },
};

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await getAllOrders();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-brand-brown">
          Orders
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border/60 bg-brand-blush/30 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3">
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
                <td className="px-4 py-3">
                  <p className="text-brand-brown">{order.customerName}</p>
                  {order.customerEmail ? (
                    <p className="text-xs text-muted-foreground">
                      {order.customerEmail}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3 tabular-nums text-brand-brown">
                  {formatPrice(order.total)}
                </td>
                <td className="px-4 py-3">
                  <AdminOrderStatusSelect
                    orderId={order.id}
                    status={order.status}
                  />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No orders yet.</p>
        ) : null}
      </div>
    </div>
  );
}
