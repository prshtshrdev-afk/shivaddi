import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/category-form";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: PageProps<"/admin/categories/[id]/edit">) {
  const { id } = await params;
  const [category, parents] = await Promise.all([
    prisma.category.findUnique({ where: { id } }),
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!category) notFound();

  return (
    <CategoryForm
      category={{
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        parentId: category.parentId,
        displayOrder: category.displayOrder,
        published: category.published,
      }}
      parents={parents}
    />
  );
}