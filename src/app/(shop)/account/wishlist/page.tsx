import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";

import { requireUser } from "@/lib/supabase/require-user";
import { getWishlist } from "@/lib/supabase/wishlist";
import { buildPageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/container";
import { ProductGrid } from "@/components/product/product-grid";

export const metadata: Metadata = buildPageMetadata({
  title: "Wishlist",
  description: "Your saved Studio D pieces.",
  path: "/account/wishlist",
  noIndex: true,
});

export default async function AccountWishlistPage() {
  const user = await requireUser("/account/wishlist");
  const products = await getWishlist(user.id);

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <nav className="mb-6">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand-brown"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Account
          </Link>
        </nav>

        <div className="mb-8 max-w-xl">
          <div className="mb-3 h-px w-10 bg-brand-coral" />
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-brand-brown sm:text-4xl">
            Wishlist
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Pieces you&apos;ve saved for later — tap the heart again to remove.
          </p>
        </div>

        {products.length > 0 ? (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {products.length}{" "}
              {products.length === 1 ? "saved piece" : "saved pieces"}
            </p>
            <ProductGrid products={products} columns={3} priorityCount={3} />
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-white px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-blush">
              <Heart className="h-6 w-6 text-brand-coral" />
            </span>
            <p className="font-heading text-xl font-semibold text-brand-brown">
              Your wishlist is empty
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Save handmade pieces you love while you browse — they&apos;ll wait
              here until you&apos;re ready.
            </p>
            <Link
              href="/products"
              className="mt-2 inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              <ShoppingBag className="h-4 w-4" />
              Browse products
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
