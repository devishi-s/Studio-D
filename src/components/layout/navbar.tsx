import Link from "next/link";

import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { Container } from "@/components/layout/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";
import { CartSheet } from "@/components/cart/cart-sheet";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-brand-cream/90 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-semibold text-brand-brown">
              {SITE_NAME}
            </span>
          </Link>

          {/* Desktop navigation */}
          <NavLinks />

          {/* Right side: cart + mobile menu */}
          <div className="flex items-center gap-2">
            <CartSheet />
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}
