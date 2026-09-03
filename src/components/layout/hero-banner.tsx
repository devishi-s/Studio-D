import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { Container } from "@/components/layout/container";

export function HeroBanner() {
  return (
    <section
      className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/images/home-hero.jpg)" }}
    >
      <Container className="relative z-10 py-20 sm:py-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <p className="animate-fade-in-up font-heading text-5xl font-semibold tracking-tight text-brand-brown sm:text-6xl lg:text-7xl">
            {SITE_NAME}
          </p>

          <p className="animate-fade-in-up animation-delay-100 mt-3 text-sm font-medium tracking-[0.2em] uppercase text-brand-coral">
            {SITE_TAGLINE}
          </p>

          <h1 className="animate-fade-in-up animation-delay-200 mt-6 font-heading text-2xl font-semibold leading-snug tracking-tight text-brand-brown sm:text-3xl">
            Art that feels{" "}
            <span className="text-brand-coral">like home.</span>
          </h1>

          <p className="animate-fade-in-up animation-delay-300 mt-4 max-w-md text-base leading-relaxed text-brand-brown/75">
            Every piece in our collection is handcrafted with care — crochet
            flowers that never wilt, paintings that tell stories, and gifts that
            carry meaning.
          </p>

          <div className="animate-fade-in-up animation-delay-400 mt-8">
            <Link
              href="/products"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
