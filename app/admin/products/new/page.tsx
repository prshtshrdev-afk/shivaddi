import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { displayOrder: "asc" } });
  const flat = categories.map((c) => ({ id: c.id, name: c.name, depth: c.parentId ? 1 : 0 }));
  return <ProductForm categories={flat} />;
}