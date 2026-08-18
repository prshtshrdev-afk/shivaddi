import { prisma } from "@/lib/prisma";
import Reveal from "@/components/site/reveal";
import SectionHeading from "./section-heading";
import CollectionProductCard from "./collection-product-card";

function getCategoryImage(category: { name: string; image: string | null }): string {
  if (category.image) return category.image;
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
  ];
  const lower = category.name.toLowerCase();
  const match = FALLBACK_IMAGES.find(([key]) => lower.includes(key));
  const id = match?.[1] ?? "photo-1600585154340-be6161a56a0c";
  return `https://images.unsplash.com/${id}?q=80&w=600&auto=format&fit=crop`;
}

export default async function CollectionProductGrid() {
  const categories = await prisma.category.findMany({
    where: { published: true, parentId: null },
    orderBy: { displayOrder: "asc" },
    take: 8,
    include: {
      _count: { select: { products: true } },
      products: {
        where: { published: true },
        take: 1,
        orderBy: { featured: "desc" },
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      },
    },
  });

  return (
    <section className="section-beige py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Our Collections"
          title="Featured Collections"
          description="Hand-picked ranges with our best-selling products — explore tiles, marble, and more."
        />

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {categories.map((cat, i) => {
            const featuredProduct = cat.products[0];
            const featuredImage = featuredProduct?.images[0]?.url 
              ?? getCategoryImage(cat);

            return (
              <Reveal key={cat.id} delay={i * 60}>
                <CollectionProductCard
                  name={cat.name}
                  slug={cat.slug}
                  image={getCategoryImage(cat)}
                  productCount={cat._count.products}
                  featuredProduct={featuredProduct ? {
                    name: featuredProduct.name,
                    price: featuredProduct.price?.toString() ?? null,
                    priceType: featuredProduct.priceType,
                    image: featuredImage,
                  } : null}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}