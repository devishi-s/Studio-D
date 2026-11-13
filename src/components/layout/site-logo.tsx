import Image from "next/image";
import Link from "next/link";

import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Transparent Studio D wordmark (cream keyed out from og-image). */
export const SITE_LOGO_PATH = "/images/studio-d-logo.png";

type SiteLogoProps = {
  className?: string;
  /** Wrap in a home link. Pass `false` when the parent is already a link. */
  href?: string | false;
  priority?: boolean;
  onClick?: () => void;
};

export function SiteLogo({
  className,
  href = "/",
  priority = false,
  onClick,
}: SiteLogoProps) {
  const image = (
    <Image
      src={SITE_LOGO_PATH}
      alt={SITE_NAME}
      width={1145}
      height={245}
      priority={priority}
      className={cn(
        "h-9 w-auto border-0 bg-transparent object-contain object-left outline-none",
        className
      )}
    />
  );

  if (href === false) {
    return image;
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-flex items-center"
      aria-label={SITE_NAME}
    >
      {image}
    </Link>
  );
}
