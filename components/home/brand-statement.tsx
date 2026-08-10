"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type BrandStat = { value: string; label: string };

const CREDENTIALS = [
  "Hand-inspected every slab, every batch",
  "Direct distributor B2B pricing",
  "Truckload dispatch on schedule",
  "Free material selection & estimation support",
];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function animateValue(target: number, suffix: string, onUpdate: (v: string) => void) {
  const duration = 1400;
  const start = performance.now();
  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    onUpdate(`${current.toLocaleString("en-IN")}${suffix}`);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function StatCell({ stat }: { stat: BrandStat }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [display, setDisplay] = useState(stat.value);

  useEffect(() => {
    if (!inView) return;
    const match = stat.value.match(/^([0-9,.]+)(.*)$/);
    if (!match) return;
    const target = Number(match[1].replace(/,/g, ""));
    if (Number.isNaN(target)) return;
    animateValue(target, match[2], setDisplay);
  }, [inView, stat.value]);

  return (
    <div ref={ref} className="flex flex-col items-center bg-charcoal px-6 py-8 text-center">
      <span className="font-serif text-4xl font-bold text-gold sm:text-5xl">
        {display}
      </span>
      <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
        {stat.label}
      </span>
    </div>
  );
}

export default function BrandStatement({
  image,
  heading,
  badge,
  description,
  stats,
}: {
  image: string;
  heading: string;
  badge: string;
  description: string;
  stats: BrandStat[];
}) {
  const [expanded, setExpanded] = useState(false);
  const needsClamp = description.length > 380;

  return (
    <section className="section-beige overflow-hidden py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
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
        </div>

        <div>
          <p className="section-kicker mb-3">{badge}</p>
          <h2 className="display font-bold text-charcoal">{heading}</h2>
          <p
            className={cn(
              "mt-6 leading-relaxed text-stone",
              !expanded && needsClamp && "line-clamp-4",
            )}
          >
            {description}
          </p>
          {needsClamp && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-dark transition-colors hover:text-gold"
            >
              {expanded ? "Read Less" : "Read More"}
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform duration-300", expanded && "rotate-180")}
              />
            </button>
          )}
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
            <Link href="/about" className="btn-gold">
              Our Story
            </Link>
            <Link href="/b2b-quote" className="btn-outline-dark">
              Get B2B Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Stats band */}
      {stats.length > 0 && (
        <div className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCell key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}