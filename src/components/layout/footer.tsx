import Link from "next/link";
import { AtSign, Mail, MapPin } from "lucide-react";

import {
  SITE_NAME,
  SITE_TAGLINE,
  FOOTER_LINKS,
} from "@/lib/constants";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";

const CATEGORY_LINKS = [
  { label: "Crochet Flowers", href: "/categories/crochet-flowers" },
  { label: "Paintings", href: "/categories/paintings" },
  { label: "Handmade Gifts", href: "/categories/handmade-gifts" },
  { label: "Decorative Items", href: "/categories/decorative-items" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: AtSign },
  { label: "Email", href: "mailto:hello@studiod.in", icon: Mail },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-brand-blush/40">
      <Container>
        {/* Main footer grid */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-heading text-xl font-semibold text-brand-brown">
                {SITE_NAME}
              </span>
            </Link>
            <p className="mt-1 text-xs tracking-wide text-brand-coral">
              {SITE_TAGLINE}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Handcrafted crochet flowers, paintings, and decorative pieces —
              each made with love and attention to detail.
            </p>

            <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Made with love in India</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-brown">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand-brown"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-brown">
              Categories
            </h3>
            <ul className="mt-3 space-y-2">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand-brown"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-brown">
              Connect
            </h3>
            <ul className="mt-3 space-y-2">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand-brown"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Copyright bar */}
        <div className="flex flex-col items-center justify-between gap-2 py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Handmade with care, delivered with love.
          </p>
        </div>
      </Container>
    </footer>
  );
}
