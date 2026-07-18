import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { requireUser } from "@/lib/supabase/require-user";
import { getOrderById } from "@/lib/supabase/orders";
import { formatDate, formatPrice } from "@/lib/format";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/components/product/product-image";
import { OrderStatusBadge } from "@/components/account/order-status-badge";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order ${id.slice(0, 8).toUpperCase()}`,
    description: "Studio D order details.",
  };
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const user = await requireUser(`/account/orders/${id}`);
  const order = await getOrderById(id, user.id);

  if (!order) notFound();

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <nav className="mb-6">
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand-brown"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All orders
            </Link>
          </nav>

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="mb-4 h-px w-10 bg-brand-coral" />
              <h1 className="font-heading text-3xl font-semibold text-brand-brown">
                Order {order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-white p-5 sm:p-6">
            <h2 className="font-heading text-lg font-semibold text-brand-brown">
              Items
            </h2>

            {order.items.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No line items were found for this order.
              </p>
            ) : (
              <ul className="mt-5 space-y-4">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 border-b border-border/60 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <ProductImage
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        placeholderVariant={
                          item.productImage ? "blush" : "cream"
                        }
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      {item.productSlug ? (
                        <Link
                          href={`/products/${item.productSlug}`}
                          className="font-medium text-brand-brown transition-colors hover:text-brand-coral"
                        >
                          {item.productName}
                        </Link>
                      ) : (
                        <p className="font-medium text-brand-brown">
                          {item.productName}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-muted-foreground">
                        Qty {item.quantity} · {formatPrice(item.priceAtPurchase)}{" "}
                        each
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-brand-brown">
                      {formatPrice(item.lineTotal)}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <Separator className="my-5" />

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-brand-brown">Order total</p>
              <p className="text-lg font-semibold text-brand-brown">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
