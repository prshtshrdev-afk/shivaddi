"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createGalleryImage } from "@/lib/actions/admin";

const inputCls =
  "w-full border border-stone-300 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-stone/60 focus:border-gold focus:outline-none transition-colors";
const labelCls =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/75";

export default function GalleryAddForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get("title") ?? ""),
      url: String(fd.get("url") ?? ""),
      category: String(fd.get("category") ?? ""),
      published: fd.get("published") === "on",
    };

    startTransition(async () => {
      const result = await createGalleryImage(payload);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      e.currentTarget.reset();
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_220px_180px_auto]">
      <div>
        <label className={labelCls}>Title</label>
        <input name="title" className={inputCls} placeholder="e.g. Italian Marble Display" />
      </div>
      <div>
        <label className={labelCls}>Image URL *</label>
        <input name="url" required className={inputCls} placeholder="https://images.unsplash.com/…" />
      </div>
      <div>
        <label className={labelCls}>Category</label>
        <input name="category" className={inputCls} placeholder="Showroom / Projects" />
      </div>
      <label className="flex cursor-pointer items-end gap-2 pb-3 text-sm text-charcoal">
        <input
          type="checkbox"
          name="published"
          defaultChecked
          className="h-4 w-4 accent-gold-dark"
        />
        Visible
      </label>
      <button type="submit" disabled={pending} className="btn-gold self-end">
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Add Image
      </button>
      {error && <p className="col-span-full text-[13px] text-red-600">{error}</p>}
    </form>
  );
}