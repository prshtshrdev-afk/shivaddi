import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/app/generated/prisma/client";
import Reveal from "@/components/site/reveal";
import SectionHeading from "./section-heading";

export default function CategoryGrid({
  categories,
}: {
  categories: (Category & { children?: Category[] })[];
}) {
  return (
    <section className="section-beige py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Our Range"
          title="Explore Our Collections"
          description="Tiles, marble, granite and sanitaryware — every surface your project needs, under one roof."
        />

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {categories.slice(0, 8).map((cat, i) => (
            <Reveal key={cat.id} delay={i * 60}>
              <Link
                href={`/categories/${cat.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden border border-charcoal/10 bg-charcoal"
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width:640px) 50vw, 25vw"
                    className="object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-60"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-serif text-lg font-bold text-white">
                    {cat.name}
                  </p>
                  {cat.children?.length ? (
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/55">
                      {cat.children.length} sub-collections
                    </p>
                  ) : null}
                  <span className="mt-3 inline-flex h-8 w-8 items-center justify-center border border-gold/60 text-gold opacity-0 transition-all duration-500 group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}