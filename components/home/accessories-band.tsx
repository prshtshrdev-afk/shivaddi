"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import Reveal from "@/components/site/reveal";
import { cn } from "@/lib/utils";

export type AccessoryChip = {
  label: string;
  sub?: string | null;
};

export default function AccessoriesBand({
  title,
  description,
  chips,
  ctaLabel = "Explore Range",
  ctaHref,
  image,
}: {
  title: string;
  description: string;
  chips: AccessoryChip[];
  ctaLabel?: string;
  ctaHref: string;
  image?: string | null;
}) {
  return (
    <section className="section-beige py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="section-kicker mb-3">Complete The Installation</p>
            <h2 className="display font-bold text-charcoal">{title}</h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-stone">
              {description}
            </p>

            {chips.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {chips.map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-2 rounded-md border border-charcoal/15 bg-white px-3.5 py-2"
                  >
                    <BadgeCheck className="h-3.5 w-3.5 text-brand-green" />
                    <span className="text-[12px] font-semibold text-charcoal">
                      {chip.label}
                    </span>
                    {chip.sub && (
                      <span className="text-[10px] uppercase tracking-[0.14em] text-stone">
                        {chip.sub}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href={ctaHref} className="btn-gold">
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/b2b-quote"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-green transition-colors hover:text-brand-green-bright"
              >
                Talk to an Expert
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <Reveal className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-xl border-2 border-gold" aria-hidden />
            <div
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-xl bg-white shadow-card",
                !image && "flex items-center justify-center",
              )}
            >
              {image ? (
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <p className="px-8 text-center text-sm text-stone">
                  Add product images to unlock this band.
                </p>
              )}
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-md bg-charcoal/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold backdrop-blur">
                <BadgeCheck className="h-3.5 w-3.5" />
                Trusted by Builders &amp; Architects
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}