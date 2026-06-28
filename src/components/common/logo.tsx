import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={className}>
      <span className="font-heading text-2xl font-semibold text-brand-brown">
        {SITE_NAME}
      </span>
    </Link>
  );
}
