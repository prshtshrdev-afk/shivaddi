"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionHeading from "./section-heading";

export type DesignIdeaImage = {
  id: string;
  url: string;
  title: string | null;
  category: string | null;
};

const ROOMS = [
  "Kitchen",
  "Bathroom",
  "Bedroom",
  "Living Room",
  "Pooja Room",
] as const;

const AREAS = [
  "Outdoor",
  "Counter",
  "Wash Basin",
  "Front Elevation",
] as const;

const PRESETS: Record<(typeof ROOMS)[number], string[]> = {
  Kitchen: [
    "photo-1556909114-f6e7ad7d3136",
    "photo-1556911220-bff31c812dba",
    "photo-1600489000022-c2086d79f9d4",
  ],
  Bathroom: [
    "photo-1620626011761-996317b8d101",
    "photo-1552321554-5fefe8c9ef14",
    "photo-1584622650111-993a426fbf0a",
  ],
  Bedroom: [
    "photo-1616594039964-ae9021a400a0",
    "photo-1615874959474-d969609a20ed",
    "photo-1560448204-e02f11c3d0e2",
  ],
  "Living Room": [
    "photo-1600585154340-be6161a56a0c",
    "photo-1600607687939-ce8a6c25118c",
    "photo-1586023492125-27b2c045efd7",
  ],
  "Pooja Room": [
    "photo-1600585154526-990dced4db0d",
    "photo-1600607687920-4e2a09cf159d",
    "photo-1513694203232-719a280e022f",
  ],
};

const AREA_PRESETS: Record<(typeof AREAS)[number], string[]> = {
  Outdoor: ["photo-1600210492486-724fe5c67fb0", "photo-1580587771525-78b9dba3b914"],
  Counter: ["photo-1600573472592-401b489a3cdc", "photo-1556912173-3bb406ef7e77"],
  "Wash Basin": ["photo-1507652313519-d4e9174996dd", "photo-1584622781564-1d987f7333c1"],
  "Front Elevation": ["photo-1600585154526-990dced4db0d", "photo-1600607687920-4e2a09cf159d"],
};

function imageUrl(id: string) {
  return `https://images.unsplash.com/${id}?q=80&w=800&auto=format&fit=crop`;
}

function matchesTag(category: string | null, tag: string) {
  return category?.toLowerCase().includes(tag.toLowerCase()) ?? false;
}

export default function DesignIdeasTabs({ images }: { images: DesignIdeaImage[] }) {
  const [room, setRoom] = useState<(typeof ROOMS)[number]>("Kitchen");
  const [area, setArea] = useState<(typeof AREAS)[number] | null>(null);

  const current = useMemo(() => {
    const roomHits = images.filter((img) => matchesTag(img.category, room));
    const areaHits = area ? roomHits.filter((img) => matchesTag(img.category, area)) : roomHits;

    if (areaHits.length) return areaHits.slice(0, 6);
    if (area) {
      const areaOnly = images.filter((img) => matchesTag(img.category, area));
      if (areaOnly.length) return areaOnly.slice(0, 6);
    }

    const presetIds = [...(PRESETS[room] ?? []), ...(area ? AREA_PRESETS[area] : [])];
    const fallback = presetIds.map((id) => ({
      id: `preset-${id}`,
      url: imageUrl(id),
      title: `${room}${area ? ` · ${area}` : ""}`,
      category: room,
    }));
    return fallback.slice(0, 6);
  }, [images, room, area]);

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Inspiring Spaces Await"
          title="Home Design Ideas"
          description="Discover design ideas for every room and surface — kitchen, bathroom, pooja room and beyond."
          align="center"
        />

        {/* Room tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {ROOMS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoom(r)}
              className={cn(
                "rounded-full border px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-all duration-300",
                room === r
                  ? "border-gold bg-gold text-charcoal"
                  : "border-charcoal/15 bg-white text-stone hover:border-gold/60 hover:text-gold-dark",
              )}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Area tabs */}
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {AREAS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setArea(area === a ? null : a)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-all duration-300",
                area === a
                  ? "border-charcoal bg-charcoal font-semibold text-gold"
                  : "border-charcoal/10 bg-beige text-charcoal/60 hover:border-gold/60 hover:text-gold-dark",
              )}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {current.map((img, i) => (
            <Link
              key={img.id + img.url}
              href="/gallery"
              className={cn(
                "group relative block overflow-hidden border border-charcoal/10 bg-beige",
                i === 0 &&
                  "col-span-2 row-span-2 lg:col-span-1 lg:row-span-2",
              )}
            >
              <Image
                src={img.url}
                alt={img.title ?? `${room} ideas`}
                fill
                sizes="(max-width:640px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                <span className="font-serif text-sm font-semibold text-white sm:text-base">
                  {img.title ?? img.category ?? room}
                </span>
                <span className="rounded-full border border-gold/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  View
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/gallery" className="btn-outline-dark">
            View All Designs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}