import Link from "next/link";
import { ArrowRight, Heart, Flower2, Paintbrush } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ImagePlaceholder } from "@/components/common/image-placeholder";

const values = [
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Every stitch, every brushstroke is made by hand — no mass production, no shortcuts.",
  },
  {
    icon: Flower2,
    title: "Timeless Design",
    description:
      "Our pieces are designed to be treasured, not discarded. Beauty that lasts.",
  },
  {
    icon: Paintbrush,
    title: "Thoughtfully Crafted",
    description:
      "From material selection to final packaging, we care about every detail.",
  },
] as const;

export function BrandStory() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image side */}
          <div className="relative order-2 lg:order-1">
            <ImagePlaceholder
              label="Behind the scenes"
              variant="sage"
              className="aspect-[3/4] w-full max-w-md mx-auto rounded-xl"
            />
            <div className="absolute -bottom-3 -left-3 -z-10 aspect-[3/4] w-full max-w-md mx-auto rounded-xl border-2 border-brand-sage/20" />
          </div>

          {/* Text content */}
          <div className="order-1 lg:order-2">
            <div className="mb-4 h-px w-10 bg-brand-coral mx-auto lg:mx-0" />
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-brand-brown sm:text-3xl text-center lg:text-left">
              The story behind
              <br />
              every piece.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground text-center lg:text-left">
              Studio D was born from a simple belief — that handmade things
              carry a warmth that factory-made items never can. What started
              as a small passion project has grown into a collection of
              art and craft that brings joy to homes across India.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground text-center lg:text-left">
              Each product you see here was made by hand, with patience and
              purpose. We don&apos;t rush. We don&apos;t mass-produce. We
              create things worth keeping.
            </p>

            {/* Values */}
            <div className="mt-8 space-y-5">
              {values.map((value) => (
                <div key={value.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blush">
                    <value.icon className="h-5 w-5 text-brand-coral" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-brand-brown">
                      {value.title}
                    </h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center lg:text-left">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-coral transition-colors hover:text-brand-brown"
              >
                Read our full story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
