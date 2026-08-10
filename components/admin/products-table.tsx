"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toggleProductPublished, deleteProduct } from "@/lib/actions/admin";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsTable({
  products,
}: {
  products: {
    id: string;
    name: string;
    slug: string;
    price: string | null;
    priceType: "EXACT" | "FROM" | "ON_REQUEST";
    published: boolean;
    featured: boolean;
    updatedAt: Date;
    categoryName: string | null;
    thumbnail: string | null;
  }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onToggle(id: string, published: boolean) {
    startTransition(async () => {
      await toggleProductPublished(id, !published);
      router.refresh();
    });
  }

  function onDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteProduct(id);
      router.refresh();
    });
  }

  return (
    <div className="overflow-x-auto border border-stone-200 bg-white">
      <table className="w-full min-w-[720px] text-left text-[13px]">
        <thead>
          <tr className="border-b border-stone-100 bg-stone-50 text-[11px] uppercase tracking-[0.14em] text-stone">
            <th className="px-5 py-3.5 font-semibold">Product</th>
            <th className="px-5 py-3.5 font-semibold">Category</th>
            <th className="px-5 py-3.5 font-semibold">Price</th>
            <th className="px-5 py-3.5 font-semibold">Status</th>
            <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {products.map((p) => (
            <tr key={p.id} className="transition-colors hover:bg-stone-50/60">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden bg-stone-100">
                    {p.thumbnail && (
                      <Image
                        src={p.thumbnail}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal">{p.name}</p>
                    <p className="text-[11px] text-stone">
                      /{p.slug}
                      {p.featured && (
                        <span className="ml-1.5 rounded-[2px] bg-gold/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-dark">
                          Featured
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3.5 text-stone">
                {p.categoryName ?? "—"}
              </td>
              <td className="px-5 py-3.5 text-stone">
                {p.price ? formatPrice(p.price) : p.priceType === "ON_REQUEST" ? "On request" : "—"}
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={`rounded-[2px] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                    p.published ? "bg-green-100 text-green-800" : "bg-stone-100 text-stone"
                  }`}
                >
                  {p.published ? "Live" : "Draft"}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onToggle(p.id, p.published)}
                    title={p.published ? "Unpublish" : "Publish"}
                    className="flex h-8 w-8 items-center justify-center rounded-[2px] text-stone transition-colors hover:bg-gold/15 hover:text-gold-dark"
                  >
                    {p.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    title="Edit"
                    className="flex h-8 w-8 items-center justify-center rounded-[2px] text-stone transition-colors hover:bg-gold/15 hover:text-gold-dark"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => onDelete(p.id, p.name)}
                    title="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-[2px] text-stone transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={5} className="px-5 py-16 text-center text-sm text-stone">
                No products yet.{" "}
                <Link href="/admin/products/new" className="text-gold-dark underline">
                  Create your first product
                </Link>
                .
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {pending && (
        <div className="flex items-center gap-2 border-t border-stone-100 px-5 py-2.5 text-[11px] text-stone">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Updating…
        </div>
      )}
    </div>
  );
}