import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireUser } from "@/lib/supabase/require-user";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/layout/container";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter your delivery details to complete your Studio D order.",
};

export default async function CheckoutPage() {
  const user = await requireUser("/checkout");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const fullName =
    profile?.full_name ??
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "") ??
    "";
  const email = profile?.email ?? user.email ?? "";

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <nav className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand-brown"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to cart
          </Link>
        </nav>

        <div className="mb-8 max-w-xl">
          <div className="mb-3 h-px w-10 bg-brand-coral" />
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-brand-brown sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Confirm your details and review your handmade pieces. Payment with
            Razorpay is next — nothing is charged on this step.
          </p>
        </div>

        <CheckoutForm
          defaultValues={{
            fullName,
            email,
          }}
        />
      </Container>
    </section>
  );
}
