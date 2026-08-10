"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type ProductDetailImage = {
  url: string;
  alt: string | null;
  isThumbnail: boolean;
};

export default function ProductGallery({ images, name }: {
  images: ProductDetailImage[];
  name: string;
}) {
  const nonThumb = images.filter((i) => !i.isThumbnail);
  const ordered = images.length
    ? [...images.filter((i) => i.isThumbnail), ...nonThumb]
    : [{ url: "/file.svg", alt: name, isThumbnail: true }];
  const [active, setActive] = useState(0);
  const current = ordered[active];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[88px_1fr]">
      {/* Thumbnails */}
      {ordered.length > 1 && (
        <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
          {ordered.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-20 shrink-0 border transition-all duration-300 lg:h-22 lg:w-22",
                i === active
                  ? "border-gold"
                  : "border-charcoal/15 opacity-70 hover:opacity-100",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `${name} – view ${i + 1}`}
                fill
                sizes="88px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Active image */}
      <div className="order-1 lg:order-2">
        <div className="relative aspect-[4/5] w-full overflow-hidden border border-charcoal/10 bg-beige">
          <Image
            key={current.url + active}
            src={current.url}
            alt={current.alt ?? name}
            fill
            priority
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}