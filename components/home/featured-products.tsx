"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard, { type ProductCardData } from "@/components/products/product-card";
import SectionHeading from "./section-heading";

export default function FeaturedProducts({
  products,
}: {
  products: ProductCardData[];
}) {
  const [activeTab, setActiveTab] = useState("All");
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    const raf = requestAnimationFrame(() => onSelect(emblaApi));
    return () => {
      cancelAnimationFrame(raf);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const tabs = useMemo(() => {
    const names = new Set(
      products.map((p) => p.category?.name).filter((x): x is string => Boolean(x)),
    );
    return ["All", ...names].slice(0, 7);
  }, [products]);

  const visible = useMemo(
    () =>
      activeTab === "All"
        ? products
        : products.filter((p) => p.category?.name === activeTab),
    [products, activeTab],
  );

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(0, false);
  }, [activeTab, emblaApi]);

  if (!products.length) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            kicker="Handpicked"
            title="Featured Products"
            description="Our most-specified surfaces for homes, hotels and commercial projects."
            className="mb-0"
          />
          <div className="mb-1 flex items-center gap-2">
            <Link
              href="/products"
              className="mr-2 hidden items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-dark transition-colors hover:text-gold lg:inline-flex"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
              aria-label="Previous products"
              className="flex h-11 w-11 items-center justify-center border border-charcoal/20 text-charcoal transition-all duration-300 hover:border-gold hover:text-gold-dark disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
              aria-label="Next products"
              className="flex h-11 w-11 items-center justify-center border border-charcoal/20 text-charcoal transition-all duration-300 hover:border-gold hover:text-gold-dark disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Category tabs */}
        {tabs.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-300",
                  activeTab === tab
                    ? "border-charcoal bg-charcoal text-gold"
                    : "border-charcoal/15 bg-white text-stone hover:border-gold/60 hover:text-gold-dark",
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6">
        <div ref={emblaRef} className="-mx-2 overflow-hidden pt-10">
          <div className="flex touch-pan-y">
            {visible.map((product) => (
              <div
                key={product.id}
                className="min-w-0 flex-[0_0_100%] px-2 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}