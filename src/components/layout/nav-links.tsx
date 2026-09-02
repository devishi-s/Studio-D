"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { categoryHref, mainCategories } from "@/data/categories";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {NAV_LINKS.map((link) => {
        if (link.href === "/categories") {
          const isActive = pathname.startsWith("/categories");
          return (
            <div key={link.href} className="group relative">
              <Link
                href={link.href}
                className={cn(
                  "relative inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-brand-brown"
                    : "text-brand-brown-light hover:text-brand-brown"
                )}
              >
                {link.label}
                <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:rotate-180" />
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-[1.05rem] h-0.5 rounded-full bg-brand-coral" />
                )}
              </Link>

              <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="w-[min(100vw-2rem,22rem)] rounded-xl border border-border/60 bg-brand-cream p-3 shadow-lg shadow-brand-brown/10">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {mainCategories.map((main) => (
                      <div key={main.slug} className="space-y-1">
                        <Link
                          href={`/categories/${main.slug}`}
                          className="block rounded-md px-2 py-1 font-heading text-sm font-semibold text-brand-brown transition-colors hover:bg-brand-blush/70"
                        >
                          {main.name}
                        </Link>
                        <ul className="space-y-0.5">
                          {main.children.map((sub) => (
                            <li key={sub.slug}>
                              <Link
                                href={categoryHref(sub)}
                                className="block rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-brand-blush/50 hover:text-brand-brown"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/categories"
                    className="mt-3 block rounded-md border border-border/50 px-2 py-2 text-center text-xs font-medium text-brand-coral transition-colors hover:bg-brand-blush/60"
                  >
                    View all collections
                  </Link>
                </div>
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
            className={cn(
              "relative px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "text-brand-brown"
                : "text-brand-brown-light hover:text-brand-brown"
            )}
          >
            {link.label}
            {isActive && (
              <span className="absolute inset-x-3 -bottom-[1.05rem] h-0.5 rounded-full bg-brand-coral" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
