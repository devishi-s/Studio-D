"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", match: (path: string) => path === "/admin" },
  {
    href: "/admin/products",
    label: "Products",
    match: (path: string) => path.startsWith("/admin/products"),
  },
  {
    href: "/admin/orders",
    label: "Orders",
    match: (path: string) => path.startsWith("/admin/orders"),
  },
  {
    href: "/admin/reviews",
    label: "Reviews",
    match: (path: string) => path.startsWith("/admin/reviews"),
  },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 font-ui">
      {ADMIN_NAV.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-white text-brand-brown shadow-sm"
                : "text-brand-brown-light hover:bg-white/70 hover:text-brand-brown"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
