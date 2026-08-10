import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import CategoriesTable from "@/components/admin/categories-table";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: {
      parent: { select: { name: true } },
      _count: { select: { products: true } },
    },
  });

  const rows = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    parentName: c.parent?.name ?? null,
    productCount: c._count.products,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Categories</h1>
          <p className="mt-1 text-[13px] text-stone">
            {categories.length} categor{categories.length === 1 ? "y" : "ies"} — parent groups and subcategories.
          </p>
        </div>
        <Link href="/admin/categories/new" className="btn-gold">
          <Plus className="h-4 w-4" />
          Add Category
        </Link>
      </div>
      <CategoriesTable categories={rows} />
    </div>
  );
}