"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryImageData = {
  id: string;
  title: string | null;
  url: string;
  category: string | null;
};

export default function GalleryGrid({
  images,
  categories,
}: {
  images: GalleryImageData[];
  categories: string[];
}) {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<GalleryImageData | null>(null);

  const filtered = useMemo(
    () => (filter === "All" ? images : images.filter((i) => i.category === filter)),
    [images, filter],
  );

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "border px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-300",
              filter === cat
                ? "border-gold bg-gold text-charcoal"
                : "border-charcoal/20 bg-white text-charcoal/70 hover:border-gold/60 hover:text-gold-dark",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-charcoal/10 bg-white px-8 py-20 text-center text-sm text-stone">
          No images in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((img) => (
            <button
              key={img.id}
              onClick={() => setActive(img)}
              className="group relative aspect-square overflow-hidden bg-charcoal"
            >
              <Image
                src={img.url}
                alt={img.title ?? "Shiv Aadi gallery image"}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {img.title && (
                <span className="absolute inset-x-0 bottom-0 translate-y-full bg-charcoal/70 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
                  {img.title}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {active && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-charcoal/90 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <figure
            className="relative max-h-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full max-w-3xl overflow-hidden">
              <Image
                src={active.url}
                alt={active.title ?? "Shiv Aadi gallery image"}
                fill
                sizes="(max-width:768px) 90vw, 60vw"
                className="object-contain"
              />
            </div>
            {active.title && (
              <figcaption className="mt-3 text-center text-sm tracking-wide text-white/80">
                {active.title}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}