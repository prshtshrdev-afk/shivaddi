import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import GalleryGrid from "@/components/gallery/gallery-grid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A curated look at tiles, marble, granite and sanitaryware — from our showroom displays to finished installations.",
};

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const categories = [
    "All",
    ...Array.from(new Set(images.map((i) => i.category).filter(Boolean))),
  ] as string[];

  const hero = images.find((i) => i.category === "Showroom");

  return (
    <div>
      <section
        className={`relative flex items-center justify-center py-20 sm:py-24 ${
          hero ? "" : "section-dark"
        }`}
      >
        {hero && (
          <Image
            src={hero.url}
            alt={hero.title ?? "Shiv Aadi gallery"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="section-kicker mb-4">Gallery</p>
          <h1 className="display font-bold text-white">
            A Feast for the <span className="text-gold">Eye</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">
            Samples, displays and finished spaces — click any image to view it
            larger.
          </p>
        </div>
      </section>

      <section className="section-beige py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <GalleryGrid images={images} categories={categories} />
        </div>
      </section>
    </div>
  );
}