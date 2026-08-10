"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { GalleryImage } from "@/app/generated/prisma/client";
import useEmblaCarousel from "embla-carousel-react";
import SectionHeading from "./section-heading";

export default function GalleryStrip({ images }: { images: GalleryImage[] }) {
  const [emblaRef] = useEmblaCarousel({ align: "start", loop: true, dragFree: true });

  if (!images.length) return null;

  return (
    <section className="section-dark py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            dark
            kicker="Our Work"
            title="From the Showroom & Sites"
            className="mb-0"
          />
          <Link
            href="/gallery"
            className="btn-outline-light mb-1 shrink-0"
          >
            View Gallery
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl overflow-hidden px-4 pt-10 sm:px-6">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-4">
            {images.map((img) => (
              <Link
                key={img.id}
                href="/gallery"
                className="group relative aspect-[4/5] w-64 shrink-0 overflow-hidden border border-white/10 sm:w-72"
              >
                <Image
                  src={img.url}
                  alt={img.title ?? "Shiv Aadi gallery"}
                  fill
                  sizes="300px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-charcoal/85 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="font-serif text-sm font-semibold text-white">
                    {img.category ?? img.title}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-gold" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}