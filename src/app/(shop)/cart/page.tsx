import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { CartPageContent } from "@/components/cart/cart-page-content";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review and manage the items in your shopping cart.",
};

export default function CartPage() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <h1 className="mb-8 font-heading text-2xl font-semibold text-brand-brown sm:text-3xl">
          Shopping Cart
        </h1>
        <CartPageContent />
      </Container>
    </section>
  );
}
