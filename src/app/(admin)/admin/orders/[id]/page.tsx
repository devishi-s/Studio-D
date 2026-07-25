import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { getAdminOrderById } from "@/lib/supabase/admin";
import { formatDate, formatPrice } from "@/lib/format";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { AdminOrderStatusSelect } from "@/components/admin/admin-order-status-select";

type AdminOrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AdminOrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Admin order · ${id.slice(0, 8).toUpperCase()}`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  await requireAdmin();
  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand-brown"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All orders
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-semibold text-brand-brown">
              Order {order.id.slice(0, 8).toUpperCase()}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.customerName}
              {order.customerEmail ? ` · ${order.customerEmail}` : ""}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-heading text-lg font-semibold text-brand-brown">
            Status
          </h3>
          <AdminOrderStatusSelect orderId={order.id} status={order.status} />
        </div>

        {order.needsManualReview ? (
          <p className="mt-4 rounded-xl border border-brand-gold/40 bg-brand-blush/40 px-4 py-3 text-sm text-brand-brown">
            Flagged for manual review
            {order.reviewNotes ? `: ${order.reviewNotes}` : "."}
          </p>
        ) : null}

        <Separator className="my-5" />

        <h3 className="font-heading text-lg font-semibold text-brand-brown">
          Items
        </h3>
        <ul className="mt-4 space-y-3 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                {item.productName} × {item.quantity}
              </span>
              <span className="tabular-nums text-brand-brown">
                {formatPrice(item.lineTotal)}
              </span>
            </li>
          ))}
        </ul>

        <Separator className="my-5" />

        <div className="flex justify-between font-heading text-lg font-semibold text-brand-brown">
          <span>Total</span>
          <span className="tabular-nums">{formatPrice(order.total)}</span>
        </div>

        {order.shippingAddress ? (
          <>
            <Separator className="my-5" />
            <h3 className="font-heading text-lg font-semibold text-brand-brown">
              Shipping
            </h3>
            <div className="mt-2 space-y-0.5 text-sm text-muted-foreground">
              <p>{order.shippingAddress.fullName}</p>
              <p>
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2
                  ? `, ${order.shippingAddress.addressLine2}`
                  : ""}
              </p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.pincode}
              </p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </>
        ) : null}

        {(order.razorpayPaymentId || order.razorpayOrderId) && (
          <>
            <Separator className="my-5" />
            <h3 className="font-heading text-lg font-semibold text-brand-brown">
              Payment
            </h3>
            <dl className="mt-2 space-y-1 text-sm text-muted-foreground">
              {order.razorpayPaymentId ? (
                <div className="flex justify-between gap-4">
                  <dt>Payment ID</dt>
                  <dd className="break-all text-right">{order.razorpayPaymentId}</dd>
                </div>
              ) : null}
              {order.razorpayOrderId ? (
                <div className="flex justify-between gap-4">
                  <dt>Razorpay order</dt>
                  <dd className="break-all text-right">{order.razorpayOrderId}</dd>
                </div>
              ) : null}
            </dl>
          </>
        )}
      </div>
    </div>
  );
}
