import { ShoppingBag } from "lucide-react";

import { Container } from "@/components/layout/container";

export const ERROR_PRIMARY_ACTION_CLASS =
  "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-brown px-8 text-sm font-medium text-white transition-colors hover:bg-brand-brown/80";

export const ERROR_SECONDARY_ACTION_CLASS =
  "inline-flex h-10 items-center justify-center rounded-full border border-border bg-white px-6 text-sm font-medium text-brand-brown transition-colors hover:bg-brand-blush/50";

type ErrorStateProps = {
  kicker?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  footnote?: React.ReactNode;
};

export function ErrorState({
  kicker,
  title,
  description,
  actions,
  footnote,
}: ErrorStateProps) {
  return (
    <section className="relative overflow-hidden bg-brand-cream py-16 sm:py-24">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-brand-blush/50" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-brand-coral/5" />

      <Container>
        <div className="relative mx-auto flex max-w-lg flex-col items-center text-center">
          {kicker ? (
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-brand-coral">
              {kicker}
            </p>
          ) : null}
          <div className="mt-4 rounded-full bg-brand-blush p-8">
            <ShoppingBag className="h-10 w-10 text-brand-brown-light" />
          </div>
          <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-brand-brown sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
          {actions ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {actions}
            </div>
          ) : null}
          {footnote ? (
            <p className="mt-6 text-xs text-muted-foreground/80">{footnote}</p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
