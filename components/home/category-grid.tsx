import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import Reveal from "@/components/site/reveal";
import SectionHeading from "./section-heading";

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
  ["large", "photo-1600585154340-be6161a56a0c"],
  ["vitrified", "photo-1600607687939-ce8a6c25118c"],
  ["ceramic", "photo-1600585154340-be6161a56a0c"],
  ["flexi", "photo-1615874959474-d609969a20ed"],
  ["subway", "photo-1615874959474-d609969a20ed"],
  ["elevation", "photo-1615874959474-d609969a20ed"],
  ["texture", "photo-1615874959474-d609969a20ed"],
  ["3d", "photo-1615874959474-d609969a20ed"],
  ["accent", "photo-1615874959474-d609969a20ed"],
  ["anti-skid", "photo-1600210492486-724fe5c67fb0"],
  ["bedroom", "photo-1600585153490-76fb20a32601"],
  ["living", "photo-1600585153490-76fb20a32601"],
];

function categoryImage(category: { name: string; image: string | null }, productFallbacks: string[]): string {
  if (category.image) return category.image;
  const lower = category.name.toLowerCase();
  const match = FALLBACK_IMAGES.find(([key]) => lower.includes(key));
  if (match) return `https://images.unsplash.com/${match[1]}?q=80&w=600&auto=format&fit=crop`;
  if (productFallbacks.length) return productFallbacks[0];
  return "";
}

export default async function CategoryGrid({
  categories,
}: {
  categories: (Category & { children?: Category[] })[];
}) {
  const fallbackProducts = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });
  const productFallbacks = fallbackProducts.flatMap((p) => p.images[0]?.url ? [p.images[0].url] : []);

  return (
    <section className="section-beige py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Our Range"
          title="Explore Our Collections"
          description="Tiles, marble, granite and sanitaryware — every surface your project needs, under one roof."
        />

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 xl:grid-cols-4">
          {categories.slice(0, 8).map((cat, i) => (
            <Reveal key={cat.id} delay={i * 60}>
              <Link
                href={`/categories/${cat.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden border border-charcoal/10 bg-charcoal"
              >
                <Image
                  src={categoryImage(cat, productFallbacks)}
                  alt={cat.name}
                  fill
                  sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                  className="object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-60"
                />
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