import type { Product, ProductImage, Category } from "@/app/generated/prisma/client";
import type { ProductCardData } from "./product-card";

export function toProductCardData(
  p: Product & {
    category: Pick<Category, "name" | "slug"> | null;
    images: Pick<ProductImage, "url" | "alt" | "isThumbnail">[];
  },
): ProductCardData {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price?.toString() ?? null,
    priceType: p.priceType,
    size: p.size,
    finish: p.finish,
    isNew: p.isNew,
    featured: p.featured,
    category: p.category ? { name: p.category.name, slug: p.category.slug } : null,
    images: p.images.map((img) => ({ url: img.url, alt: img.alt, isThumbnail: img.isThumbnail })),
  };
}