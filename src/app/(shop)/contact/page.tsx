import type { Metadata } from "next";
import Link from "next/link";
import { AtSign, Clock3, Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/common/contact-form";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Studio D about handmade products, custom orders, thoughtful gifts, or order support.",
};

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@studiod.in",
    href: "mailto:hello@studiod.in",
  },
  {
    icon: Clock3,
    label: "Response time",
    value: "Usually within 1–2 working days",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "Handmade with care in India",
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-cream py-14 sm:py-20">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-blush/60" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-brand-sage/10" />

        <Container>
          <div className="relative mx-auto max-w-2xl text-center">
            <p className="animate-fade-in-up text-sm font-medium uppercase tracking-[0.2em] text-brand-coral">
              Let&apos;s Talk
            </p>
            <h1 className="animate-fade-in-up animation-delay-100 mt-4 font-heading text-3xl font-semibold tracking-tight text-brand-brown sm:text-4xl lg:text-5xl">
              We&apos;d love to hear from you.
            </h1>
            <p className="animate-fade-in-up animation-delay-200 mx-auto mt-5 max-w-xl leading-relaxed text-muted-foreground">
              Have a question about a piece, a custom idea, or need help choosing
              a gift? Share a little detail and we&apos;ll help however we can.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.55fr)] lg:gap-14">
            <div className="rounded-2xl border border-border bg-white p-5 sm:p-8">
              <div className="mb-7">
                <div className="mb-4 h-px w-10 bg-brand-coral" />
                <h2 className="font-heading text-2xl font-semibold text-brand-brown">
                  Send us a note
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Your message stays on your device until you send the prepared
                  draft from your own email app.
                </p>
              </div>
              <ContactForm />
            </div>

            <aside className="space-y-8 lg:pt-4" aria-label="Contact details">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-coral">
                  Reach the studio
                </p>
                <h2 className="mt-3 font-heading text-2xl font-semibold text-brand-brown">
                  A small studio, a personal reply.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We read every message ourselves. For order help, include your
                  order reference when one is available, but never share card or
                  payment details.
                </p>
              </div>

              <ul className="space-y-5">
                {CONTACT_DETAILS.map((detail) => (
                  <li key={detail.label} className="flex gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blush">
                      <detail.icon className="h-4.5 w-4.5 text-brand-coral" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-brown">
                        {detail.label}
                      </p>
                      {"href" in detail ? (
                        <Link
                          href={detail.href}
                          className="mt-1 inline-block text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-brand-brown hover:underline"
                        >
                          {detail.value}
                        </Link>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {detail.value}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl bg-brand-blush/65 p-5">
                <div className="flex items-center gap-2 text-brand-brown">
                  <AtSign className="h-4 w-4" />
                  <h3 className="text-sm font-semibold">Follow the making</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Our Instagram link is coming soon. Until then, email is the
                  best way to reach Studio D.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
