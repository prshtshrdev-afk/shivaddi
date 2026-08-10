import Image from "next/image";
import { Check } from "lucide-react";
import Reveal from "@/components/site/reveal";

const CREDENTIALS = [
  "Hand-inspected every slab, every batch",
  "Direct distributor B2B pricing",
  "Truckload dispatch on schedule",
  "Free material selection & estimation support",
];

export default function AboutPreview({
  image,
  heading,
  description,
  badge,
}: {
  image: string;
  heading: string;
  description: string;
  badge: string;
}) {
  return (
    <section className="section-beige overflow-hidden py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden border border-charcoal/10">
            <Image
              src={image}
              alt={heading}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden border border-gold/40 bg-charcoal px-8 py-6 shadow-2xl sm:block">
            <p className="font-serif text-3xl font-bold text-gold">Since 2010</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/60">
              Mithila&apos;s Trusted Tile House
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="section-kicker mb-3">{badge}</p>
          <h2 className="display font-bold text-charcoal">{heading}</h2>
          <p className="mt-6 leading-relaxed text-stone">{description}</p>
          <ul className="mt-8 space-y-3.5">
            {CREDENTIALS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-charcoal/85">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-gold/50 bg-gold/10">
                  <Check className="h-3 w-3 text-gold-dark" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="/about" className="btn-gold">
              Our Story
            </a>
            <a href="/b2b-quote" className="btn-outline-dark">
              Get B2B Quote
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}