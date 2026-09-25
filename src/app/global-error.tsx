"use client";

import { useEffect } from "react";

import {
  ERROR_PRIMARY_ACTION_CLASS,
  ERROR_SECONDARY_ACTION_CLASS,
  ErrorState,
} from "@/components/common/error-state";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset?: () => void;
  retry?: () => void;
};

/**
 * Replaces the root layout. Must render html/body and load global CSS itself.
 * Next.js 16.2: prefer retry when present, fall back to reset.
 */
export default function GlobalError({ error, reset, retry }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[global-error]", error.digest ?? error.message);
  }, [error]);

  function recover() {
    (retry ?? reset)?.();
  }

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-brand-cream font-ui text-foreground">
        <ErrorState
          kicker="Studio D"
          title="Something went wrong"
          description="The shop hit an unexpected error. Try again, or go back to the homepage."
          actions={
            <>
              <button
                type="button"
                onClick={recover}
                className={ERROR_PRIMARY_ACTION_CLASS}
              >
                Try again
              </button>
              <a href="/" className={ERROR_SECONDARY_ACTION_CLASS}>
                Back to home
              </a>
            </>
          }
          footnote={error.digest ? `Reference ${error.digest}` : undefined}
        />
      </body>
    </html>
  );
}
