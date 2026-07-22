"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Package } from "lucide-react";
import { toast } from "sonner";

import { AUTH_FIELD_CLASS } from "@/lib/auth";
import {
  checkoutFormSchema,
  getCheckoutTotal,
  toCheckoutAddress,
  type CheckoutFormValues,
} from "@/lib/checkout";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { validateCheckoutCart } from "@/lib/actions/checkout";
import { useMounted } from "@/hooks/use-mounted";
import {
  getCartItemCount,
  getCartSubtotal,
  getItemsWithProducts,
  useCartStore,
} from "@/store/cart.store";
import type { CheckoutDraft } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/components/product/product-image";
import { cn } from "@/lib/utils";

type CheckoutFormProps = {
  defaultValues: Partial<CheckoutFormValues>;
};

export function CheckoutForm({ defaultValues }: CheckoutFormProps) {
  const router = useRouter();
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolved = getItemsWithProducts(items);
  const itemCount = getCartItemCount(items);
  const clientSubtotal = getCartSubtotal(items);
  const { deliveryFee: clientDeliveryFee, total: clientTotal } =
    getCheckoutTotal(clientSubtotal);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0 && !draft) {
      router.replace("/cart");
    }
  }, [mounted, items.length, draft, router]);

  async function onSubmit(values: CheckoutFormValues) {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      router.replace("/cart");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await validateCheckoutCart(items);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      const address = toCheckoutAddress(values);
      setDraft({
        address,
        lines: result.lines,
        subtotal: result.subtotal,
        deliveryFee: result.deliveryFee,
        total: result.total,
      });

      toast.success("Details saved — payment comes next.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!mounted) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="h-96 animate-pulse rounded-2xl bg-brand-blush/40" />
        <div className="h-72 animate-pulse rounded-2xl bg-brand-blush/40" />
      </div>
    );
  }

  if (items.length === 0 && !draft) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Redirecting to your cart…
      </div>
    );
  }

  if (draft) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <div className="rounded-2xl border border-border/60 bg-white p-6 sm:p-8">
          <div className="mb-3 h-px w-10 bg-brand-coral" />
          <h2 className="font-heading text-2xl font-semibold text-brand-brown">
            Ready for payment
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your delivery details and cart totals are held for the next step.
            Razorpay checkout arrives in Phase 4.2 — nothing has been charged.
          </p>

          <Separator className="my-6" />

          <div className="space-y-1 text-sm text-brand-brown">
            <p className="font-medium">{draft.address.fullName}</p>
            <p className="text-muted-foreground">{draft.address.email}</p>
            <p className="text-muted-foreground">{draft.address.phone}</p>
            <p className="mt-3 text-muted-foreground">
              {draft.address.addressLine1}
              {draft.address.addressLine2
                ? `, ${draft.address.addressLine2}`
                : ""}
            </p>
            <p className="text-muted-foreground">
              {draft.address.city}, {draft.address.state}{" "}
              {draft.address.pincode}
            </p>
          </div>

          <Separator className="my-6" />

          <ul className="space-y-3 text-sm">
            {draft.lines.map((line) => (
              <li key={line.productId} className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  {line.name} × {line.quantity}
                </span>
                <span className="font-medium text-brand-brown tabular-nums">
                  {formatPrice(line.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums text-brand-brown">
                {formatPrice(draft.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span className="tabular-nums text-brand-brown">
                {draft.deliveryFee === 0
                  ? "Free"
                  : formatPrice(draft.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between font-heading text-lg font-semibold text-brand-brown">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(draft.total)}</span>
            </div>
          </div>

          <Button
            type="button"
            size="lg"
            className="mt-6 w-full rounded-full"
            disabled
          >
            Pay with Razorpay — Coming Soon
          </Button>

          <button
            type="button"
            onClick={() => setDraft(null)}
            className="mt-4 w-full text-center text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-brand-coral hover:underline"
          >
            Edit delivery details
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          <Link
            href="/cart"
            className="font-medium text-brand-coral transition-colors hover:text-brand-brown"
          >
            Back to cart
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]"
      noValidate
    >
      <div className="space-y-8">
        <section className="rounded-2xl border border-border/60 bg-white p-5 sm:p-6">
          <h2 className="font-heading text-lg font-semibold text-brand-brown">
            Contact
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            We&apos;ll use this for order updates.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              error={errors.fullName?.message}
              className="sm:col-span-2"
            >
              <input
                {...register("fullName")}
                autoComplete="name"
                aria-invalid={!!errors.fullName}
                className={AUTH_FIELD_CLASS}
              />
            </Field>

            <Field label="Email" error={errors.email?.message}>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className={AUTH_FIELD_CLASS}
              />
            </Field>

            <Field label="Phone" error={errors.phone?.message}>
              <input
                {...register("phone")}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="10-digit mobile"
                aria-invalid={!!errors.phone}
                className={AUTH_FIELD_CLASS}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-border/60 bg-white p-5 sm:p-6">
          <h2 className="font-heading text-lg font-semibold text-brand-brown">
            Delivery address
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Where should we send your handmade pieces?
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              label="Address line 1"
              error={errors.addressLine1?.message}
              className="sm:col-span-2"
            >
              <input
                {...register("addressLine1")}
                autoComplete="address-line1"
                aria-invalid={!!errors.addressLine1}
                className={AUTH_FIELD_CLASS}
              />
            </Field>

            <Field
              label="Address line 2 (optional)"
              error={errors.addressLine2?.message}
              className="sm:col-span-2"
            >
              <input
                {...register("addressLine2")}
                autoComplete="address-line2"
                aria-invalid={!!errors.addressLine2}
                className={AUTH_FIELD_CLASS}
              />
            </Field>

            <Field label="City" error={errors.city?.message}>
              <input
                {...register("city")}
                autoComplete="address-level2"
                aria-invalid={!!errors.city}
                className={AUTH_FIELD_CLASS}
              />
            </Field>

            <Field label="State" error={errors.state?.message}>
              <input
                {...register("state")}
                autoComplete="address-level1"
                aria-invalid={!!errors.state}
                className={AUTH_FIELD_CLASS}
              />
            </Field>

            <Field label="Pincode" error={errors.pincode?.message}>
              <input
                {...register("pincode")}
                inputMode="numeric"
                autoComplete="postal-code"
                aria-invalid={!!errors.pincode}
                className={AUTH_FIELD_CLASS}
              />
            </Field>
          </div>
        </section>

        <div className="lg:hidden">
          <CheckoutSummaryCard
            resolved={resolved}
            itemCount={itemCount}
            subtotal={clientSubtotal}
            deliveryFee={clientDeliveryFee}
            total={clientTotal}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <CheckoutSummaryCard
            resolved={resolved}
            itemCount={itemCount}
            subtotal={clientSubtotal}
            deliveryFee={clientDeliveryFee}
            total={clientTotal}
            isSubmitting={isSubmitting}
          />
        </div>
      </aside>
    </form>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block text-sm font-medium text-brand-brown", className)}>
      {label}
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs font-normal text-destructive">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function CheckoutSummaryCard({
  resolved,
  itemCount,
  subtotal,
  deliveryFee,
  total,
  isSubmitting,
}: {
  resolved: ReturnType<typeof getItemsWithProducts>;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isSubmitting: boolean;
}) {
  const remainingForFree =
    subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD
      ? FREE_SHIPPING_THRESHOLD - subtotal
      : 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-brand-sage" />
        <h2 className="font-heading text-lg font-semibold text-brand-brown">
          Order summary
        </h2>
      </div>

      <Separator className="my-4" />

      <ul className="max-h-64 space-y-3 overflow-y-auto pr-1">
        {resolved.map(({ product, quantity }) => (
          <li key={product.id} className="flex gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
              <ProductImage
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="56px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-brand-brown">
                {product.name}
              </p>
              <p className="text-xs text-muted-foreground">Qty {quantity}</p>
            </div>
            <p className="shrink-0 text-sm font-medium tabular-nums text-brand-brown">
              {formatPrice(product.price * quantity)}
            </p>
          </li>
        ))}
      </ul>

      <Separator className="my-4" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items ({itemCount})</span>
          <span className="tabular-nums text-brand-brown">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery</span>
          <span
            className={cn(
              "tabular-nums",
              deliveryFee === 0 ? "text-brand-sage" : "text-brand-brown"
            )}
          >
            {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
          </span>
        </div>
        {remainingForFree > 0 ? (
          <p className="text-xs text-muted-foreground">
            Add {formatPrice(remainingForFree)} more for free delivery.
          </p>
        ) : null}
      </div>

      <Separator className="my-4" />

      <div className="flex items-center justify-between">
        <span className="font-heading text-base font-semibold text-brand-brown">
          Total
        </span>
        <span className="font-heading text-xl font-bold tabular-nums text-brand-brown">
          {formatPrice(total)}
        </span>
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-5 w-full rounded-full bg-brand-brown text-white hover:bg-brand-brown/85"
        disabled={isSubmitting || resolved.length === 0}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving details…
          </>
        ) : (
          "Continue to payment"
        )}
      </Button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
        <Lock className="h-3 w-3" />
        Payment is not charged yet — Razorpay comes next.
      </p>

      <p className="mt-2 text-center text-xs">
        <Link
          href="/cart"
          className="text-muted-foreground underline-offset-2 transition-colors hover:text-brand-coral hover:underline"
        >
          Edit cart
        </Link>
      </p>
    </div>
  );
}
