"use client";

import { useEffect } from "react";
import Link from "next/link";

import {
  ERROR_PRIMARY_ACTION_CLASS,
  ERROR_SECONDARY_ACTION_CLASS,
  ErrorState,
} from "@/components/common/error-state";

type AppErrorProps = {
  error: Error & { digest?: string };
  /** Next.js 16.2 stable recovery. */
  reset?: () => void;
  /** Next.js 16.2+ recovery that also re-fetches the segment. */
  retry?: () => void;
};

export default function AppError({ error, reset, retry }: AppErrorProps) {
  useEffect(() => {
    console.error("[app-error]", error.digest ?? error.message);
  }, [error]);

  function recover() {
    (retry ?? reset)?.();
  }

  return (
    <ErrorState
      kicker="Studio D"
      title="Something went wrong"
      description="We could not load this page. Try again in a moment, or head back to the shop."
      actions={
        <>
          <button
            type="button"
            onClick={recover}
            className={ERROR_PRIMARY_ACTION_CLASS}
          >
            Try again
          </button>
          <Link href="/products" className={ERROR_SECONDARY_ACTION_CLASS}>
            Browse the shop
          </Link>
        </>
      }
      footnote={error.digest ? `Reference ${error.digest}` : undefined}
    />
  );
}
