import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/category-form";

export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
  const parents = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true },
  });
  return <CategoryForm parents={parents} />;
}