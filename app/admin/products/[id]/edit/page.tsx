import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: PageProps<"/admin/products/[id]/edit">) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { displayOrder: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <ProductForm
      product={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        categoryId: product.categoryId,
        subcategory: product.subcategory,
        shortDescription: product.shortDescription,
        description: product.description,
        material: product.material,
        size: product.size,
        thickness: product.thickness,
        finish: product.finish,
        colour: product.colour,
        application: product.application,
        stockStatus: product.stockStatus,
        price: product.price ? product.price.toString() : null,
        priceType: product.priceType,
        moq: product.moq,
        featured: product.featured,
        isNew: product.isNew,
        tags: product.tags,
        published: product.published,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        images: product.images.map((i) => ({ url: i.url, alt: i.alt })),
      }}
      categories={categories.map((c) => ({ id: c.id, name: c.name, depth: c.parentId ? 1 : 0 }))}
    />
  );
}