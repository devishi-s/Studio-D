import type { Metadata } from "next";
import Link from "next/link";

import {
  ERROR_PRIMARY_ACTION_CLASS,
  ERROR_SECONDARY_ACTION_CLASS,
  ErrorState,
} from "@/components/common/error-state";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Page not found",
  description:
    "This Studio D page could not be found. Browse handmade crochet, paintings, and gifts instead.",
  path: "/",
  noIndex: true,
});

export default function NotFound() {
  return (
    <ErrorState
      kicker="404"
      title="This page isn't here"
      description="The piece you're looking for may have been moved, or the link is a little off. The shop is still open."
      actions={
        <>
          <Link href="/products" className={ERROR_PRIMARY_ACTION_CLASS}>
            Browse the shop
          </Link>
          <Link href="/" className={ERROR_SECONDARY_ACTION_CLASS}>
            Back to home
          </Link>
        </>
      }
    />
  );
}
