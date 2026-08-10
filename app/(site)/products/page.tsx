import type { Metadata } from "next";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/products/product-grid";
import { toProductCardData } from "@/components/products/serialize";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our full range of premium tiles, marble, granite and sanitaryware. B2B wholesale pricing for builders, architects and dealers.",
};

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const q = await searchParams;
  const category = typeof q.category === "string" ? q.category : undefined;
  const search = typeof q.q === "string" ? q.q.trim() : undefined;
  const priceType =
    typeof q.priceType === "string" ? q.priceType : undefined;
  const sort =
    typeof q.sort === "string" ? q.sort : undefined;

  const where: Prisma.ProductWhereInput = {
    published: true,
    ...(category
      ? {
          OR: [
            { category: { slug: category } },
            { category: { parent: { slug: category } } },
          ],
        }
      : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { tags: { has: search } },
          ],
        }
      : {}),
    ...(priceType ? { priceType: priceType as "EXACT" | "FROM" | "ON_REQUEST" } : {}),
  };

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: { select: { name: true, slug: true } },
    },
  });

  const categories = await prisma.category.findMany({
    where: { published: true, parentId: null },
    orderBy: { displayOrder: "asc" },
    include: {
      children: { where: { published: true }, orderBy: { displayOrder: "asc" } },
    },
  });

  return (
    <ProductGrid
      products={products.map(toProductCardData)}
      categories={categories}
      activeCategory={category}
      search={search}
      priceType={priceType}
      sort={sort}
    />
  );
}