import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/site/reveal";
import SectionHeading from "./section-heading";

const COLUMN_A = [
  { image: "photo-1615874959474-d609969a20ed", label: "Kitchen" },
  { image: "photo-1552321554-5fefe8c9ef14", label: "Bathroom" },
  { image: "photo-1616594039964-ae9021a400a0", label: "Bedroom" },
  { image: "photo-1600585154340-be6161a56a0c", label: "Living Room" },
];

const COLUMN_B = [
  { image: "photo-1600210492486-724fe5c67fb0", label: "Hotel" },
  { image: "photo-1600566753086-00f18fb6b3ea", label: "Flooring" },
  { image: "photo-1584622650111-993a426fbf0a", label: "Spa" },
  { image: "photo-1600607687939-ce8a6c25118c", label: "Lobby" },
];

function MarbleColumn({
  items,
  direction,
}: {
  items: { image: string; label: string }[];
  direction: "up" | "down";
}) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-col h-[560px] flex-1">
      <div
        className={`flex flex-col gap-5 ${
          direction === "up" ? "marquee-track-up" : "marquee-track-down"
        }`}
      >
        {doubled.map((item, i) => (
          <figure
            key={`${item.label}-${i}`}
            className="group relative aspect-[3/4] w-full shrink-0 overflow-hidden"
          >
            <Image
              src={`https://images.unsplash.com/${item.image}?q=80&w=600&auto=format&fit=crop`}
              alt={item.label}
              fill
              sizes="(max-width:1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 to-transparent p-4 font-serif text-sm font-semibold uppercase tracking-[0.2em] text-white">
              {item.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function DesignIdeas() {
  return (
    <section className="section-dark overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          dark
          kicker="Design Ideas"
          title="Spaces That Inspire"
          description="Real installations from our projects — see how tile, marble and stone transform rooms."
          align="center"
        />
      </div>

      <Reveal className="mt-4 flex gap-5 px-4 sm:px-6">
        <MarbleColumn items={COLUMN_A} direction="up" />
        <MarbleColumn items={COLUMN_B} direction="down" />
      </Reveal>

      <div className="mt-14 text-center">
        <Link href="/projects" className="btn-outline-light">
          View Our Projects
        </Link>
      </div>
    </section>
  );
}