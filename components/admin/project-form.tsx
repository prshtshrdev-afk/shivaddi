"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createProject, updateProject } from "@/lib/actions/admin";
import { formatSlug } from "@/lib/utils";

const inputCls =
  "w-full border border-stone-300 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-stone/60 focus:border-gold focus:outline-none transition-colors";
const labelCls =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/75";

export default function ProjectForm({
  project,
}: {
  project?: {
    id: string;
    name: string;
    slug: string;
    location: string | null;
    type: "RESIDENTIAL" | "COMMERCIAL" | "HOTEL" | "OFFICE" | "RETAIL" | "OTHER";
    description: string | null;
    images: string[];
    productsUsed: string[];
    published: boolean;
  };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>(project?.images ?? [""]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      slug: String(fd.get("slug") ?? ""),
      location: String(fd.get("location") ?? ""),
      type: String(fd.get("type") ?? "RESIDENTIAL") as "RESIDENTIAL" | "COMMERCIAL" | "HOTEL" | "OFFICE" | "RETAIL" | "OTHER",
      description: String(fd.get("description") ?? ""),
      images: images.map((s) => s.trim()).filter(Boolean),
      productsUsed: String(fd.get("productsUsed") ?? ""),
      published: fd.get("published") === "on",
    };

    startTransition(async () => {
      const result = project
        ? await updateProject(project.id, payload)
        : await createProject(payload);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.push("/admin/projects");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <div className="border border-stone-200 bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Project name *</label>
            <input name="name" defaultValue={project?.name ?? ""} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Slug</label>
            <input
              name="slug"
              defaultValue={project?.slug ?? ""}
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
            <label className={labelCls}>Location</label>
            <input name="location" defaultValue={project?.location ?? ""} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Type</label>
            <select name="type" defaultValue={project?.type ?? "RESIDENTIAL"} className={inputCls}>
              <option value="RESIDENTIAL">Residential</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="HOTEL">Hotel</option>
              <option value="OFFICE">Office</option>
              <option value="RETAIL">Retail</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Products used (comma separated)</label>
            <input
              name="productsUsed"
              defaultValue={project?.productsUsed.join(", ") ?? ""}
              className={inputCls}
              placeholder="Carrara Marble, Wooden Finish Vitrified Tiles"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Description</label>
            <textarea
              name="description"
              rows={6}
              defaultValue={project?.description ?? ""}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      <div className="border border-stone-200 bg-white p-6">
        <h2 className="font-serif text-base font-bold text-charcoal">Gallery</h2>
        <div className="mt-4 space-y-3">
          {images.map((img, i) => (
            <input
              key={i}
              value={img}
              onChange={(e) =>
                setImages(images.map((x, j) => (j === i ? e.target.value : x)))
              }
              placeholder={`Image URL ${i + 1} (first is the main photo)`}
              className={inputCls}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            const last = images[images.length - 1];
            if (last?.trim()) setImages([...images, ""]);
          }}
          className="btn-outline-dark mt-4"
        >
          Add Image
        </button>
      </div>

      <div className="flex items-start justify-between gap-6">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-charcoal">
          <input
            type="checkbox"
            name="published"
            defaultChecked={project?.published ?? false}
            className="h-4 w-4 accent-gold-dark"
          />
          Published (visible on site)
        </label>
        <div className="flex items-center gap-4">
          {error && <p className="text-[13px] text-red-600">{error}</p>}
          <button type="submit" disabled={pending} className="btn-gold">
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {project ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </div>
    </form>
  );
}