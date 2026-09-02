"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { categoryHref, mainCategories } from "@/data/categories";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MobileAuthLinks,
  type AuthUserSummary,
} from "@/components/auth/auth-nav";

type MobileNavProps = {
  user: AuthUserSummary | null;
};

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-brand-brown"
            aria-label="Open menu"
          />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>

      <SheetContent side="left" className="w-72 bg-brand-cream">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="font-heading text-xl text-brand-brown">
            {SITE_NAME}
          </SheetTitle>
          <p className="text-xs text-brand-brown-light">{SITE_TAGLINE}</p>
        </SheetHeader>

        <nav className="flex flex-col gap-1 overflow-y-auto px-4 pt-2 pb-4">
          {NAV_LINKS.map((link) => {
            if (link.href === "/categories") {
              const isActive = pathname.startsWith("/categories");
              return (
                <div key={link.href} className="space-y-1">
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand-blush text-brand-brown"
                        : "text-brand-brown-light hover:bg-brand-blush/60 hover:text-brand-brown"
                    )}
                  >
                    {link.label}
                  </Link>
                  <div className="ml-2 space-y-3 border-l border-border/60 pl-3">
                    {mainCategories.map((main) => (
                      <div key={main.slug}>
                        <Link
                          href={`/categories/${main.slug}`}
                          onClick={() => setOpen(false)}
                          className="block py-1 text-xs font-semibold text-brand-brown"
                        >
                          {main.name}
                        </Link>
                        <ul className="space-y-0.5">
                          {main.children.map((sub) => (
                            <li key={sub.slug}>
                              <Link
                                href={categoryHref(sub)}
                                onClick={() => setOpen(false)}
                                className="block py-1 text-xs text-muted-foreground hover:text-brand-brown"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-blush text-brand-brown"
                    : "text-brand-brown-light hover:bg-brand-blush/60 hover:text-brand-brown"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <MobileAuthLinks user={user} onNavigate={() => setOpen(false)} />

        <div className="mt-auto border-t border-border px-4 py-4">
          <p className="text-xs text-muted-foreground">
            Handcrafted with care in India
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
