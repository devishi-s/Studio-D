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
          <p className="animate-fade-in-up font-brand text-7xl font-normal leading-none text-brand-brown sm:text-8xl lg:text-9xl">
            {SITE_NAME}
          </p>

          <p className="animate-fade-in-up animation-delay-100 mt-4 font-ui text-base font-medium tracking-[0.2em] uppercase text-brand-coral sm:text-lg">
            {SITE_TAGLINE}
          </p>

          <h1 className="animate-fade-in-up animation-delay-200 mt-7 font-heading text-3xl font-semibold leading-snug tracking-tight text-[#FAA0A0] sm:text-4xl lg:text-[2.75rem]">
            Art that feels like home.
          </h1>

          <p className="animate-fade-in-up animation-delay-300 mt-5 max-w-lg text-lg leading-relaxed text-brand-brown/75 sm:text-xl">
            Little handmade things, thoughtful details, and art made to make
            everyday moments feel special.
          </p>

          <div className="animate-fade-in-up animation-delay-400 mt-9">
            <Link
              href="/products"
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-7 font-ui text-base font-medium text-primary-foreground transition-colors hover:bg-primary/80"
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
