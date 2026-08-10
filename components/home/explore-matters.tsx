"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { SlidersHorizontal, RotateCcw, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionHeading from "./section-heading";

export type ExploreProduct = {
  id: string;
  name: string;
  slug: string;
  material: string | null;
  finish: string | null;
  colour: string | null;
  size: string | null;
  image: string | null;
  categoryName: string | null;
  categorySlug: string | null;
};

type FilterKey = "material" | "finish" | "colour" | "size";

const GROUPS: { key: FilterKey; label: string }[] = [
  { key: "material", label: "Designs" },
  { key: "finish", label: "Finishes" },
  { key: "colour", label: "Colours" },
  { key: "size", label: "Sizes" },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop";

function valueOptions(products: ExploreProduct[], key: FilterKey) {
  const counts = new Map<string, number>();
  for (const p of products) {
    const v = p[key];
    if (!v) continue;
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 10)
    .map(([value]) => value);
}

export default function ExploreMatters({
  products,
}: {
  products: ExploreProduct[];
}) {
  const [selected, setSelected] = useState<Partial<Record<FilterKey, string>>>({});

  const options = useMemo(
    () =>
      Object.fromEntries(
        GROUPS.map((g) => [g.key, valueOptions(products, g.key)]),
      ) as Record<FilterKey, string[]>,
    [products],
  );

  const filtered = useMemo(() => {
    const active = Object.entries(selected).filter(([, v]) => v) as [
      FilterKey,
      string,
    ][];
    if (!active.length) return products;
    return products.filter((p) =>
      active.every(([key, value]) => p[key] === value),
    );
  }, [products, selected]);

  const toggle = (key: FilterKey, value: string) => {
    setSelected((prev) => ({
      ...prev,
      [key]: prev[key] === value ? undefined : value,
    }));
  };

  const activeCount = Object.values(selected).filter(Boolean).length;

  if (!products.length) return null;

  return (
    <section className="section-beige py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Explore What Matters"
          title="Find Your Perfect Match"
          description="Filter our full catalogue the way you think — by design, finish, colour or size — and discover the tile that fits your space."
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
          {/* Filters */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="border border-charcoal/10 bg-white p-6">
              <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
                <p className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-charcoal">
                  <SlidersHorizontal className="h-4 w-4 text-gold-dark" />
                  Filters
                </p>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelected({})}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-dark transition-colors hover:text-gold"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-7 pt-6">
                {GROUPS.map((group) => {
                  const list = options[group.key];
                  if (!list.length) return null;
                  return (
                    <div key={group.key}>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone">
                        {group.label}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {list.map((value) => {
                          const isActive = selected[group.key] === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => toggle(group.key, value)}
                              className={cn(
                                "rounded-full border px-3.5 py-1.5 text-[12px] transition-all duration-300",
                                isActive
                                  ? "border-gold bg-gold font-semibold text-charcoal"
                                  : "border-charcoal/15 bg-white text-charcoal/75 hover:border-gold/60 hover:text-gold-dark",
                              )}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            <p className="mb-5 flex items-center justify-between text-[12px] uppercase tracking-[0.16em] text-stone">
              <span>
                Showing <span className="font-bold text-charcoal">{filtered.length}</span>{" "}
                {(filtered.length === 1 ? "design" : "designs")}
              </span>
            </p>

            {filtered.length ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
                {filtered.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    className="group relative block overflow-hidden border border-charcoal/10 bg-white transition-all duration-500 hover:border-gold/50 hover:shadow-card"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-beige">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="(max-width:640px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-beige">
                          <Image
                            src={FALLBACK_IMAGE}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-charcoal/70 via-transparent to-transparent p-3.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                          View Design
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-gold" />
                      </span>
                    </div>
                    <div className="p-3.5">
                      <p className="line-clamp-1 text-[13px] font-medium text-charcoal transition-colors group-hover:text-gold-dark">
                        {p.name}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-stone">
                        {[p.size, p.finish].filter(Boolean).join(" · ") || p.categoryName}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center border border-dashed border-charcoal/20 bg-white py-20 text-center">
                <p className="font-serif text-xl font-semibold text-charcoal">
                  No designs match those filters
                </p>
                <p className="mt-2 max-w-sm text-sm text-stone">
                  Try removing a filter or two — or reach out and we&apos;ll
                  source it for you.
                </p>
                <button
                  type="button"
                  onClick={() => setSelected({})}
                  className="btn-outline-dark mt-6"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}