import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SITE_TAGLINE } from "@/lib/constants";
import { Container } from "@/components/layout/container";
import { ChromaKeyLogo } from "@/components/layout/chroma-key-logo";

export function HeroBanner() {
  return (
    <section
      className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-x-clip bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/images/home-hero.jpg)" }}
    >
      {/*
        Notepad graphic — upper-right of the hero (layout reference),
        slight clockwise tilt. Black bg dropped via lighten blend.
      */}
      <div className="pointer-events-none absolute top-[4%] right-[3%] z-20 hidden w-[38vw] max-w-[260px] min-w-[140px] sm:block sm:right-[5%] sm:w-[32vw] md:top-[6%] md:right-[6%] md:max-w-[290px] lg:right-[8%] lg:max-w-[320px]">
        <Image
          src="/images/Art_that_feels_like_home-removebg-preview.png"
          alt=""
          width={760}
          height={900}
          priority
          unoptimized
          aria-hidden
          className="h-auto w-full rotate-[8deg] object-contain mix-blend-lighten drop-shadow-md"
        />
      </div>

      <Container className="relative z-10 py-20 sm:py-28">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          {/* Logo: below tagline on mobile, above on md+ */}
          <div className="order-2 w-full max-w-[640px] origin-center scale-[1.35] translate-y-4 animate-fade-in-up leading-none sm:max-w-[720px] md:order-1 md:scale-105 md:translate-y-14 lg:max-w-[820px] lg:scale-100 lg:translate-y-16">
            <h1 className="sr-only">Studio D</h1>
            <div className="overflow-hidden">
              <ChromaKeyLogo
                src="/animations/studio-d-logo-cream.webm"
                className="-mt-[8%] -mb-[12%] sm:-mt-[10%] sm:-mb-[14%]"
              />
            </div>
          </div>

          {/* Tagline: above logo on mobile, below on md+ */}
          <p className="order-1 mb-2 animate-fade-in-up font-ui text-base font-medium tracking-[0.2em] uppercase text-brand-coral md:order-2 md:mb-0 md:mt-3 sm:text-lg">
            {SITE_TAGLINE}
          </p>

          <p className="order-3 animate-fade-in-up animation-delay-300 mt-5 max-w-lg text-lg leading-relaxed text-brand-brown/75 sm:text-xl">
            Little handmade things, thoughtful details, and art made to make
            everyday moments feel special.
          </p>

          <div className="order-4 animate-fade-in-up animation-delay-400 mt-9">
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
