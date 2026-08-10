"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCategory } from "@/lib/actions/admin";

export default function CategoriesTable({
  categories,
}: {
  categories: {
    id: string;
    name: string;
    slug: string;
    parentName: string | null;
    productCount: number;
  }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? Products will be unlinked.`)) return;
    startTransition(async () => {
      await deleteCategory(id);
      router.refresh();
    });
  }

  return (
    <div className="overflow-x-auto border border-stone-200 bg-white">
      <table className="w-full min-w-[560px] text-left text-[13px]">
        <thead>
          <tr className="border-b border-stone-100 bg-stone-50 text-[11px] uppercase tracking-[0.14em] text-stone">
            <th className="px-5 py-3.5 font-semibold">Category</th>
            <th className="px-5 py-3.5 font-semibold">Parent</th>
            <th className="px-5 py-3.5 font-semibold">Products</th>
            <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {categories.map((c) => (
            <tr key={c.id} className="transition-colors hover:bg-stone-50/60">
              <td className="px-5 py-3.5">
                <p className="font-semibold text-charcoal">{c.name}</p>
                <p className="text-[11px] text-stone">/{c.slug}</p>
              </td>
              <td className="px-5 py-3.5 text-stone">{c.parentName ?? "—"}</td>
              <td className="px-5 py-3.5 text-stone">{c.productCount}</td>
              <td className="px-5 py-3.5">
                <div className="flex items-center justify-end gap-1.5">
                  <Link
                    href={`/admin/categories/${c.id}/edit`}
                    title="Edit"
                    className="flex h-8 w-8 items-center justify-center rounded-[2px] text-stone transition-colors hover:bg-gold/15 hover:text-gold-dark"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => onDelete(c.id, c.name)}
                    title="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-[2px] text-stone transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan={4} className="px-5 py-16 text-center text-sm text-stone">
                No categories yet. Create one to start organising the catalog.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {pending && <p className="border-t border-stone-100 px-5 py-2 text-[11px] text-stone">Updating…</p>}
    </div>
  );
}