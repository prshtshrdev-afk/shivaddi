"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { toggleGalleryImagePublished, deleteGalleryImage } from "@/lib/actions/admin";

export default function GalleryTable({
  images,
}: {
  images: { id: string; title: string | null; url: string; category: string | null; published: boolean }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onToggle(id: string) {
    startTransition(async () => {
      await toggleGalleryImagePublished(id);
      router.refresh();
    });
  }

  function onDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    startTransition(async () => {
      await deleteGalleryImage(id);
      router.refresh();
    });
  }

  return (
    <div className="border border-stone-200 bg-white p-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => (
          <div
            key={img.id}
            className={`group relative aspect-square overflow-hidden bg-stone-100 ${
              img.published ? "" : "opacity-50"
            }`}
          >
            <Image src={img.url} alt={img.title ?? "Gallery image"} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover" />
            <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-charcoal/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="pr-2">
                <p className="line-clamp-2 text-[11px] font-semibold text-white">
                  {img.title ?? "Untitled"}
                </p>
                {img.category && (
                  <p className="text-[10px] uppercase tracking-[0.12em] text-gold">{img.category}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => onToggle(img.id)}
                  title={img.published ? "Hide" : "Show"}
                  className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-white/15 text-white hover:bg-gold hover:text-charcoal"
                >
                  {img.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => onDelete(img.id)}
                  title="Delete"
                  className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-white/15 text-white hover:bg-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full px-8 py-16 text-center text-sm text-stone">
            No images yet — add one below.
          </div>
        )}
      </div>
      {pending && <p className="mt-4 text-[11px] text-stone">Updating…</p>}
    </div>
  );
}