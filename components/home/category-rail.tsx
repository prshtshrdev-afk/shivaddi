"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SectionHeading from "./section-heading";

export type CategoryTile = {
  name: string;
  slug: string;
  image: string | null;
};

const FALLBACK_IMAGES: [string, string][] = [
  ["marble", "photo-1618221195710-dd6b41faaea6"],
  ["granite", "photo-1600607687939-ce8a6c25118c"],
  ["tile", "photo-1600585154340-be6161a56a0c"],
  ["sanitary", "photo-1584622650111-993a426fbf0a"],
  ["bathroom", "photo-1552321554-5fefe8c9ef14"],
  ["kitchen", "photo-1556909114-f6e7ad7d3136"],
  ["floor", "photo-1600210492486-724fe5c67fb0"],
  ["wall", "photo-1615874959474-d609969a20ed"],
  ["outdoor", "photo-1558618666-fcd25c85cd64"],
  ["wooden", "photo-1541123437800-1bb1317badc2"],
  ["room", "photo-1600585153490-76fb20a32601"],
];

export function categoryImage(category: { name: string; image: string | null }): string {
  if (category.image) return category.image;
  const lower = category.name.toLowerCase();
  const match = FALLBACK_IMAGES.find(([key]) => lower.includes(key));
  const id = match?.[1] ?? "photo-1600585154340-be6161a56a0c";
  return `https://images.unsplash.com/${id}?q=80&w=600&auto=format&fit=crop`;
}

export default function CategoryRail({
  tiles,
}: {
  tiles: CategoryTile[];
}) {
  return (
    <section className="border-b border-charcoal/10 bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            kicker="Shop by Category"
            title="Browse Our Collections"
            description="Floor tiles, walls, marble, sanitaryware — find the right range for every room and project."
            className="mb-0"
          />
          <Link
            href="/products"
            className="btn-outline-dark mb-1 hidden shrink-0 sm:inline-flex"
          >
            View More
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {tiles.map((tile) => (
            <Link
              key={tile.slug}
              href={`/categories/${tile.slug}`}
              className="group text-center"
            >
              <span className="relative block aspect-square overflow-hidden rounded-xl border border-charcoal/10 bg-beige">
                <Image
                  src={categoryImage(tile)}
                  alt={tile.name}
                  fill
                  sizes="(max-width:640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-charcoal/0 transition-colors duration-500 group-hover:bg-charcoal/15" />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-gradient-to-t from-charcoal/60 to-transparent pb-2.5 pt-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                    View Collection
                  </span>
                </span>
              </span>
              <span className="mt-3 block text-[13px] font-medium text-charcoal transition-colors group-hover:text-gold-dark">
                {tile.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="btn-outline-dark">
            View More
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}