import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { CartPageContent } from "@/components/cart/cart-page-content";
import { createClient } from "@/lib/supabase/server";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Your Cart",
  description: "Review and manage the items in your Studio D shopping cart.",
  path: "/cart",
  noIndex: true,
});

export default async function CartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <h1 className="mb-8 font-heading text-2xl font-semibold text-brand-brown sm:text-3xl">
          Shopping Cart
        </h1>
        <CartPageContent isSignedIn={Boolean(user)} />
      </Container>
    </section>
  );
}
