"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Slide = {
  image: string;
  kicker: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export default function HeroSlider({
  slides,
}: {
  slides: Slide[];
}) {
  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      setCurrent((c) => (c + dir + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    timer.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 6000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [slides.length]);

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden bg-charcoal">
      <div className="relative aspect-[16/10] w-full sm:aspect-[7/2]">
        <div key={current} className="absolute inset-0">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            sizes="100vw"
            className="animate-[heroIn_1.1s_cubic-bezier(0.16,1,0.3,1)_both] object-cover opacity-90"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-charcoal/70 to-transparent" />

        {/* Banner caption – bottom-left card like the reference */}
        <div className="absolute inset-0 z-10 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-12">
            <div className="max-w-2xl rounded-xl border border-white/10 bg-charcoal/45 p-5 backdrop-blur-sm sm:p-7">
              <p
                key={`k-${current}`}
                className="section-kicker animate-[heroFade_1s_0.15s_cubic-bezier(0.16,1,0.3,1)_both]"
              >
                {slide.kicker}
              </p>
              <h1
                key={`t-${current}`}
                className="mt-3 text-2xl font-bold leading-[1.15] text-white sm:text-4xl lg:text-5xl animate-[heroFade_1s_0.3s_cubic-bezier(0.16,1,0.3,1)_both]"
              >
                {slide.title}
              </h1>
              <p
                key={`d-${current}`}
                className="mt-3 hidden max-w-xl text-sm leading-relaxed text-white/75 sm:block animate-[heroFade_1s_0.45s_cubic-bezier(0.16,1,0.3,1)_both]"
              >
                {slide.description}
              </p>
              <div
                key={`c-${current}`}
                className="mt-5 flex flex-wrap items-center gap-3 animate-[heroFade_1s_0.6s_cubic-bezier(0.16,1,0.3,1)_both]"
              >
                <a
                  href={slide.primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-charcoal transition-all duration-300 hover:bg-gold-light hover:shadow-gold"
                >
                  {slide.primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </a>
                {slide.secondaryCta && (
                  <a
                    href={slide.secondaryCta.href}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:border-gold hover:bg-gold hover:text-charcoal"
                  >
                    {slide.secondaryCta.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border border-white/25 bg-charcoal/30 text-white/80 backdrop-blur transition-all duration-300 hover:border-gold hover:bg-gold hover:text-charcoal sm:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border border-white/25 bg-charcoal/30 text-white/80 backdrop-blur transition-all duration-300 hover:border-gold hover:bg-gold hover:text-charcoal sm:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Slide counter */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.title}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-1.5 transition-all duration-500",
              i === current ? "w-10 bg-gold" : "w-4 bg-white/40 hover:bg-white/70",
            )}
          />
        ))}
      </div>
    </section>
  );
}