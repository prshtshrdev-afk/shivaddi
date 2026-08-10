"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createCategory, updateCategory } from "@/lib/actions/admin";
import { formatSlug } from "@/lib/utils";

const inputCls =
  "w-full border border-stone-300 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-stone/60 focus:border-gold focus:outline-none transition-colors";
const labelCls =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/75";

export default function CategoryForm({
  parents,
  category,
}: {
  parents: { id: string; name: string }[];
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
    displayOrder: number;
    published: boolean;
  };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      slug: String(fd.get("slug") ?? ""),
      description: String(fd.get("description") ?? ""),
      image: String(fd.get("image") ?? ""),
      parentId: String(fd.get("parentId") ?? ""),
      displayOrder: Number(fd.get("displayOrder") ?? 0),
      published: fd.get("published") === "on",
    };

    startTransition(async () => {
      const result = category
        ? await updateCategory(category.id, payload)
        : await createCategory(payload);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.push("/admin/categories");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      <div className="border border-stone-200 bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Name *</label>
            <input
              name="name"
              defaultValue={category?.name ?? ""}
              required
              className={inputCls}
              placeholder="e.g. Vitrified Tiles"
            />
          </div>
          <div>
            <label className={labelCls}>Slug</label>
            <input
              name="slug"
              defaultValue={category?.slug ?? ""}
              onBlur={(e) => {
                if (!e.target.value) {
                  const name = (e.currentTarget.form?.elements.namedItem("name") as HTMLInputElement)?.value ?? "";
                  e.target.value = formatSlug(name);
                }
              }}
              className={inputCls}
              placeholder="auto-generated"
            />
          </div>
          <div>
            <label className={labelCls}>Parent category</label>
            <select name="parentId" defaultValue={category?.parentId ?? ""} className={inputCls}>
              <option value="">None (top level)</option>
              {parents
                .filter((p) => p.id !== category?.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Display order</label>
            <input
              name="displayOrder"
              type="number"
              min="0"
              defaultValue={category?.displayOrder ?? 0}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Image URL</label>
            <input
              name="image"
              defaultValue={category?.image ?? ""}
              className={inputCls}
              placeholder="https://images.unsplash.com/…"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={category?.description ?? ""}
              className={inputCls}
            />
          </div>
        </div>
        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-charcoal">
          <input
            type="checkbox"
            name="published"
            defaultChecked={category?.published ?? true}
            className="h-4 w-4 accent-gold-dark"
          />
          Published (visible on site)
        </label>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {error}
        </div>
      )}

      <button type="submit" disabled={pending} className="btn-gold">
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {category ? "Save Changes" : "Create Category"}
      </button>
    </form>
  );
}