"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {NAV_LINKS.map((link) => {
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
