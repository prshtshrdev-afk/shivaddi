import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import GalleryTable from "@/components/admin/gallery-table";
import GalleryAddForm from "@/components/admin/gallery-add-form";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const rows = images.map((i) => ({
    id: i.id,
    title: i.title,
    url: i.url,
    category: i.category,
    published: i.published,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-charcoal">Gallery</h1>
        <p className="mt-1 text-[13px] text-stone">
          {images.length} image{images.length === 1 ? "" : "s"} on display.
        </p>
      </div>
      <GalleryTable images={rows} />
      <div className="border border-stone-200 bg-white p-6">
        <h2 className="font-serif text-base font-bold text-charcoal">Add a new image</h2>
        <Suspense fallback={null}>
          <GalleryAddForm />
        </Suspense>
      </div>
    </div>
  );
}