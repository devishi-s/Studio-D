import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Package } from "lucide-react";

import { requireUser } from "@/lib/supabase/require-user";
import { getOrdersByUser } from "@/lib/supabase/orders";
import { formatDate, formatPrice } from "@/lib/format";
import { Container } from "@/components/layout/container";
import { OrderStatusBadge } from "@/components/account/order-status-badge";

export const metadata: Metadata = {
  title: "Orders",
  description: "Your Studio D order history.",
};

export default async function AccountOrdersPage() {
  const user = await requireUser("/account/orders");
  const orders = await getOrdersByUser(user.id);

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <nav className="mb-6">
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand-brown"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Account
            </Link>
          </nav>

          <div className="mb-4 h-px w-10 bg-brand-coral" />
          <h1 className="font-heading text-3xl font-semibold text-brand-brown">
            Order history
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {orders.length > 0
              ? `${orders.length} ${orders.length === 1 ? "order" : "orders"}`
              : "Orders will appear here after checkout is available."}
          </p>

          {orders.length === 0 ? (
            <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-blush">
                <Package className="h-6 w-6 text-brand-coral" />
              </span>
              <h2 className="mt-4 font-heading text-xl font-semibold text-brand-brown">
                No orders yet
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                When you place an order, you&apos;ll find the details and status
                updates here.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Browse the collection
              </Link>
            </div>
          ) : (
            <ul className="mt-8 space-y-3">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white px-4 py-4 transition-colors hover:border-brand-coral/40 hover:bg-brand-blush/20 sm:px-5"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-brand-brown">
                          Order {order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                      <p className="text-sm font-semibold text-brand-brown">
                        {formatPrice(order.total)}
                      </p>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
