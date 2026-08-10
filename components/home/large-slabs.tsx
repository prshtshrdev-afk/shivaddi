"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionHeading from "./section-heading";

export type SlabProduct = {
  id: string;
  name: string;
  slug: string;
  size: string | null;
  finish: string | null;
  image: string | null;
  categoryName: string | null;
  categorySlug: string | null;
};

export default function LargeSlabs({
  products,
}: {
  products: SlabProduct[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * (track.clientWidth * 0.75), behavior: "smooth" });
  };

  return (
    <section className="border-b border-charcoal/10 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Large Format Slabs"
          title="The Largest Collection, Ready In Stock"
          description="Fewer joints, grander rooms — explore our large format slabs and XL vitrified ranges that read as a single, continuous surface."
        />

        {products.length ? (
          <div className="relative">
            <div
              ref={trackRef}
              className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
            >
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group w-60 shrink-0 snap-start sm:w-72"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-charcoal/10 bg-beige">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width:640px) 240px, 288px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-beige" />
                    )}
                    {p.size && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 border border-gold bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal shadow-sm">
                        <Ruler className="h-3 w-3 text-gold-dark" />
                        {p.size}
                      </span>
                    )}
                    {p.categoryName && (
                      <span className="absolute bottom-3 left-3 rounded-full bg-charcoal/70 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                        {p.categoryName}
                      </span>
                    )}
                    <span className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-charcoal/45 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-charcoal">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </span>
                  </div>
                  <div className="mt-3.5 flex items-start justify-between gap-3">
                    <div>
                      <p className="line-clamp-1 text-[14px] font-medium text-charcoal transition-colors group-hover:text-gold-dark">
                        {p.name}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-stone">
                        {p.finish || p.size || "Premium finish"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <button
              type="button"
              aria-label="Scroll slabs left"
              onClick={() => scroll(-1)}
              className="absolute -left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-charcoal/15 bg-white text-charcoal shadow-lg transition-all duration-300 hover:border-gold hover:text-gold-dark lg:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Scroll slabs right"
              onClick={() => scroll(1)}
              className="absolute -right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-charcoal/15 bg-white text-charcoal shadow-lg transition-all duration-300 hover:border-gold hover:text-gold-dark lg:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div
            className={cn(
              "mt-4 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-charcoal/20 py-16 text-center",
            )}
          >
            <Ruler className="h-6 w-6 text-stone" />
            <p className="text-sm text-stone">
              New large-format slabs are landing at the showroom — check back soon.
            </p>
            <Link href="/products" className="btn-outline-dark mt-2">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}