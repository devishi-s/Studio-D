import type { Metadata } from "next";
import {
  Heart,
  Leaf,
  Sparkles,
  HandHeart,
} from "lucide-react";

import { SITE_NAME } from "@/lib/constants";
import { buildPageMetadata, localBusinessJsonLd } from "@/lib/seo";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/common/section-header";
import { ImagePlaceholder } from "@/components/common/image-placeholder";
import { Separator } from "@/components/ui/separator";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = buildPageMetadata({
  title: "Our Story",
  description:
    "Meet the makers behind Studio D — handmade crochet, original paintings, and thoughtful gifts crafted with love in India.",
  path: "/about",
});

// ─── Data ────────────────────────────────────────────────────

const VALUES = [
  {
    icon: Heart,
    title: "Handmade Quality",
    description:
      "Every piece passes through human hands, never a machine. We believe that imperfection is what gives handmade work its soul. A slight variation in a petal, a unique brushstroke, these are marks of authenticity, not flaws.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "We use natural, eco-friendly materials wherever possible like organic cotton yarn, soy-based candles, recycled paper packaging. Our products are made to last, not to be thrown away. Slow craft over fast fashion.",
  },
  {
    icon: Sparkles,
    title: "Artistry",
    description:
      "Each product is designed with intention. We draw inspiration from nature, Indian textiles, and everyday beauty. Our pieces aren't just objects, they're small works of art meant to bring warmth to your space.",
  },
  {
    icon: HandHeart,
    title: "Care in Every Detail",
    description:
      "From the yarn we choose to the way we wrap your order, every detail matters. We write handwritten notes, use paper instead of plastic, and treat each package like a gift, because it is.",
  },
] as const;

const TEAM = [
  {
    name: "Devishi",
    role: "Founder & Creative Director",
    bio: "The brain behind Studio D. Devishi handles the designs, the details, and everything in between. From dreaming up new products to making sure every order feels special. She built this little corner of the internet from scratch.",
    variant: "coral" as const,
  },
  {
    name: "Dishita",
    role: "Lead Crafter & Crochet Artist",
    bio: "The hands behind every stitch. Dishita brings each design to life with her crochet work. From delicate plushies to intricate bracelets, her craft and patience are woven into every single piece Studio D creates.",
    variant: "sage" as const,
  },
];

// ─── Page ────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-brand-cream py-16 sm:py-24">
        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-brand-blush/50" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-brand-coral/5" />

        <Container>
          <div className="relative mx-auto max-w-2xl text-center">
            <p className="animate-fade-in-up text-sm font-medium uppercase tracking-[0.2em] text-brand-coral">
              Our Story
            </p>
            <h1 className="animate-fade-in-up animation-delay-100 mt-4 font-heading text-3xl font-semibold leading-tight tracking-tight text-brand-brown sm:text-4xl lg:text-5xl">
              Made by hand.
              <br />
              Made with meaning.
            </h1>
            <p className="animate-fade-in-up animation-delay-200 mt-6 leading-relaxed text-muted-foreground">
              {SITE_NAME} is a small, independent studio creating handmade
              crochet wearables, plushies, original paintings, and thoughtful gifts.
              We believe the world has enough mass-produced things; what it needs
              is more things made with care.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Origin story ── */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative">
              <ImagePlaceholder
                label="The Studio D workspace"
                variant="sage"
                className="aspect-[4/5] w-full rounded-xl"
              />
              <div className="absolute -bottom-3 -right-3 -z-10 aspect-[4/5] w-full rounded-xl border-2 border-brand-sage/20" />
            </div>

            <div>
              <div className="mb-4 h-px w-10 bg-brand-coral" />
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-brand-brown sm:text-3xl">
                How it all began
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                It started with a single crochet rose, made late at night in a
                small room, following a YouTube tutorial. That first flower was
                imperfect, a little lopsided, but it had something that
                store-bought flowers didn&apos;t: it was made with intention.
              </p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Friends asked for one. Then friends of friends. What started as
                a hobby became a quiet passion, and that passion became
                {" "}{SITE_NAME}. Today, we create everything from crochet bouquets
                to plushies to wearables, each piece carrying
                the same care as that very first rose.
              </p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                We&apos;re not a factory. We&apos;re not trying to scale to a
                million orders. We&apos;re a small team of makers who believe
                that handmade things carry warmth that nothing else can. When
                you hold a Studio D product, you&apos;re holding hours of
                someone&apos;s focused attention and genuine care.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* ── Values ── */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            title="What We Stand For"
          />

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {VALUES.map((value, i) => (
              <div
                key={value.title}
                className={`animate-fade-in-up animation-delay-${(i + 1) * 100} flex gap-4`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-blush">
                  <value.icon className="h-5 w-5 text-brand-coral" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-brand-brown">
                    {value.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* ── Team ── */}
      <section className="bg-brand-cream/50 py-16 sm:py-20">
        <Container>
          <SectionHeader
            title="The People Behind the Craft"
            subtitle="A small team, a big heart, and a whole lot of yarn."
          />

          <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:max-w-2xl sm:mx-auto">
            {TEAM.map((person, i) => (
              <div
                key={person.name}
                className={`animate-fade-in-up animation-delay-${(i + 1) * 100} flex flex-col items-center text-center`}
              >
                <ImagePlaceholder
                  label={person.name}
                  variant={person.variant}
                  className="h-36 w-36 rounded-full"
                />
                <h3 className="mt-4 font-heading text-lg font-semibold text-brand-brown">
                  {person.name}
                </h3>
                <p className="text-xs font-medium uppercase tracking-wider text-brand-coral">
                  {person.role}
                </p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {person.bio}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
