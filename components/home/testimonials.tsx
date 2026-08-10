import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@/app/generated/prisma/client";
import Reveal from "@/components/site/reveal";
import SectionHeading from "./section-heading";

export default function Testimonials({
  items,
}: {
  items: Testimonial[];
}) {
  if (!items.length) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Client Stories"
          title="What Our Clients Say"
          description="Builders, architects and homeowners who trust Shiv Aadi with their most important surfaces."
          align="center"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={i * 80}>
              <figure className="relative flex h-full flex-col border border-charcoal/10 bg-beige p-8 transition-all duration-500 hover:border-gold/50 hover:shadow-card">
                <Quote className="absolute right-6 top-6 h-8 w-8 rotate-180 text-gold/25" />
                <div className="flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-charcoal/80">
                  “{t.content}”
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-4 border-t border-charcoal/10 pt-5">
                  <span className="flex h-11 w-11 items-center justify-center border border-gold/50 bg-charcoal font-serif text-sm font-bold text-gold">
                    {t.clientName
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div>
                    <p className="font-serif text-sm font-semibold text-charcoal">
                      {t.clientName}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-stone">
                      {t.company}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}