import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SITE_TAGLINE } from "@/lib/constants";
import { Container } from "@/components/layout/container";
import { ImagePlaceholder } from "@/components/common/image-placeholder";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-brand-cream py-16 sm:py-24 lg:py-28">
      {/* Decorative background circles */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-blush/50" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-coral/5" />

      <Container>
        <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <p className="animate-fade-in-up text-sm font-medium tracking-[0.2em] uppercase text-brand-coral">
              {SITE_TAGLINE}
            </p>

            <h1 className="animate-fade-in-up animation-delay-100 mt-4 font-heading text-4xl font-semibold leading-tight tracking-tight text-brand-brown sm:text-5xl lg:text-6xl">
              Art that feels
              <br />
              <span className="text-brand-coral">like home.</span>
            </h1>

            <p className="animate-fade-in-up animation-delay-200 mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Every piece in our collection is handcrafted with care — crochet
              flowers that never wilt, paintings that tell stories, and gifts
              that carry meaning.
            </p>

            <div className="animate-fade-in-up animation-delay-300 mt-8">
              <Link
                href="/products"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="animate-fade-in-up animation-delay-400 mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-sage" />
                100% Handmade
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-coral" />
                Made in India
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                Eco-Friendly
              </span>
            </div>
          </div>

          {/* Hero image placeholder */}
          <div className="animate-fade-in-up animation-delay-300 flex justify-center lg:justify-end">
            <div className="relative">
              <ImagePlaceholder
                label="Hero image"
                variant="blush"
                className="aspect-[4/5] w-72 sm:w-80 lg:w-96"
              />
              {/* Decorative frame */}
              <div className="absolute -bottom-3 -right-3 -z-10 aspect-[4/5] w-72 rounded-lg border-2 border-brand-coral/20 sm:w-80 lg:w-96" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
