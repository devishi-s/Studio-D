import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";

import { requireUser } from "@/lib/supabase/require-user";
import { getOrderById } from "@/lib/supabase/orders";
import { formatDate, formatPrice } from "@/lib/format";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/components/product/product-image";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OrderConfirmationPageProps = {
  params: Promise<{ orderId: string }>;
};

export async function generateMetadata({
  params,
}: OrderConfirmationPageProps): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Order confirmed · ${orderId.slice(0, 8).toUpperCase()}`,
    description: "Thank you for your Studio D order.",
  };
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { orderId } = await params;
  const user = await requireUser(`/order-confirmation/${orderId}`);
  const order = await getOrderById(orderId, user.id);

  if (!order) notFound();

  const address = order.shippingAddress;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-sage/15 text-brand-sage">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="mb-3 h-px w-10 bg-brand-coral" />
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-brand-brown sm:text-4xl">
            Thank you for your order
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your handmade pieces are reserved and we&apos;ll begin preparing them
            with care. A confirmation sits in your account whenever you need it.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <OrderStatusBadge status={order.status} />
            <p className="text-sm text-muted-foreground">
              Order{" "}
              <span className="font-medium text-brand-brown">
                {order.id.slice(0, 8).toUpperCase()}
              </span>
              <span className="mx-1.5 text-border">·</span>
              {formatDate(order.createdAt)}
            </p>
          </div>

          {order.needsManualReview ? (
            <p className="mt-4 rounded-xl border border-brand-gold/40 bg-brand-blush/40 px-4 py-3 text-sm text-brand-brown">
              One or more items need a quick stock check on our side. We&apos;ll
              reach out if anything changes — your payment is safe.
            </p>
          ) : null}

          <div className="mt-8 rounded-2xl border border-border/60 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-brand-sage" />
              <h2 className="font-heading text-lg font-semibold text-brand-brown">
                Order summary
              </h2>
            </div>

            <ul className="mt-5 space-y-4">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 border-b border-border/50 pb-4 last:border-0 last:pb-0"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                    <ProductImage
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-brand-brown">
                      {item.productName}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Qty {item.quantity} · {formatPrice(item.priceAtPurchase)}{" "}
                      each
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums text-brand-brown">
                    {formatPrice(item.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>

            <Separator className="my-5" />

            <div className="flex items-center justify-between">
              <p className="font-heading text-base font-semibold text-brand-brown">
                Total paid
              </p>
              <p className="font-heading text-xl font-bold tabular-nums text-brand-brown">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>

          {address ? (
            <div className="mt-6 rounded-2xl border border-border/60 bg-white p-5 sm:p-6">
              <h2 className="font-heading text-lg font-semibold text-brand-brown">
                Shipping to
              </h2>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-brand-brown">{address.fullName}</p>
                <p>{address.email}</p>
                <p>{address.phone}</p>
                <p className="pt-2">
                  {address.addressLine1}
                  {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                </p>
                <p>
                  {address.city}, {address.state} {address.pincode}
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/account/orders"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full rounded-full sm:flex-1"
              )}
            >
              View all orders
            </Link>
            <Link
              href="/products"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full rounded-full border-border/70 text-brand-brown sm:flex-1"
              )}
            >
              <ShoppingBag className="h-4 w-4" />
              Continue shopping
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
