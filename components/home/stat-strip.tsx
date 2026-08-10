"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import SectionHeading from "./section-heading";

export type BrandStat = {
  value: string;
  label: string;
};

function parseValue(raw: string): { prefix: string; num: number; suffix: string } {
  const match = raw.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { prefix: "", num: 0, suffix: raw };
  return { prefix: match[1], num: Number(match[2]), suffix: match[3] };
}

function CountUp({
  value,
  start,
}: {
  value: string;
  start: boolean;
}) {
  const { prefix, num, suffix } = parseValue(value);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;
    const duration = 1600;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(num * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, num]);

  return (
    <span className="font-bold tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default function StatStrip({
  stats,
  heading,
  description,
}: {
  stats: BrandStat[];
  heading: string;
  description: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStart(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!stats.length) return null;

  return (
    <section className="bg-charcoal py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
          <SectionHeading
            kicker="A Name You Can Trust"
            title={heading}
            description={description}
            dark
            className="mb-10 lg:mb-0"
          />
          <div ref={ref} className="mb-10 flex flex-wrap items-center gap-x-10 gap-y-8 lg:mb-0">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  "min-w-32",
                  i > 0 && "border-l border-white/15 pl-10",
                )}
              >
                <p className="text-3xl text-gold sm:text-4xl">
                  <CountUp value={stat.value} start={start} />
                </p>
                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}