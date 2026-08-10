import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AdminProductsTable from "@/components/admin/products-table";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      category: { select: { name: true } },
      images: { where: { isThumbnail: true }, select: { url: true }, take: 1 },
    },
  });

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price ? p.price.toString() : null,
    priceType: p.priceType,
    published: p.published,
    featured: p.featured,
    updatedAt: p.updatedAt,
    categoryName: p.category?.name ?? null,
    thumbnail: p.images[0]?.url ?? null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Products</h1>
          <p className="mt-1 text-[13px] text-stone">
            {products.length} product{products.length === 1 ? "" : "s"} in the catalog.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-gold">
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>
      <AdminProductsTable products={rows} />
    </div>
  );
}