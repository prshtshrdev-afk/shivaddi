"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { createProduct, updateProduct } from "@/lib/actions/admin";
import { formatSlug } from "@/lib/utils";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full border border-stone-300 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-stone/60 focus:border-gold focus:outline-none transition-colors";
const labelCls =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/75";
const sectionCls = "border border-stone-200 bg-white p-6";

type ImageRow = { url: string; alt: string };

export default function ProductForm({
  categories,
  product,
}: {
  categories: { id: string; name: string; depth: number }[];
  product?: {
    id: string;
    name: string;
    slug: string;
    sku: string | null;
    categoryId: string | null;
    subcategory: string | null;
    shortDescription: string | null;
    description: string | null;
    material: string | null;
    size: string | null;
    thickness: string | null;
    finish: string | null;
    colour: string | null;
    application: string | null;
    stockStatus: string;
    price: string | null;
    priceType: "EXACT" | "FROM" | "ON_REQUEST";
    moq: string | null;
    featured: boolean;
    isNew: boolean;
    tags: string[];
    published: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
    images: { url: string; alt: string | null }[];
  };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [images, setImages] = useState<ImageRow[]>(
    product?.images.map((i) => ({ url: i.url, alt: i.alt ?? "" })) ?? [{ url: "", alt: "" }],
  );
  const [imageFieldErrors, setImageFieldErrors] = useState<Record<number, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);

    const cleanImages = images
      .map((i) => ({ url: i.url.trim(), alt: i.alt.trim() }))
      .filter((i) => i.url.length > 0);

    const errs: Record<number, string> = {};
    images.forEach((img, i) => {
      if (!img.url.trim() && img.alt.trim()) {
        errs[i] = "Please add an image URL or remove this row.";
      }
    });
    setImageFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      name: String(fd.get("name") ?? ""),
      slug: String(fd.get("slug") ?? ""),
      sku: String(fd.get("sku") ?? ""),
      categoryId: String(fd.get("categoryId") ?? ""),
      subcategory: String(fd.get("subcategory") ?? ""),
      shortDescription: String(fd.get("shortDescription") ?? ""),
      description: String(fd.get("description") ?? ""),
      material: String(fd.get("material") ?? ""),
      size: String(fd.get("size") ?? ""),
      thickness: String(fd.get("thickness") ?? ""),
      finish: String(fd.get("finish") ?? ""),
      colour: String(fd.get("colour") ?? ""),
      application: String(fd.get("application") ?? ""),
      stockStatus: String(fd.get("stockStatus") ?? "In Stock"),
      priceType: String(fd.get("priceType") ?? "ON_REQUEST") as "EXACT" | "FROM" | "ON_REQUEST",
      price: fd.get("price") ? Number(fd.get("price")) : null,
      moq: String(fd.get("moq") ?? ""),
      featured: fd.get("featured") === "on",
      isNew: fd.get("isNew") === "on",
      tags: String(fd.get("tags") ?? ""),
      published: fd.get("published") === "on",
      seoTitle: String(fd.get("seoTitle") ?? ""),
      seoDescription: String(fd.get("seoDescription") ?? ""),
      images: cleanImages,
    };

    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, payload)
        : await createProduct(payload);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    });
  }

  const input = (name: string, value?: string | null, extra?: string) => (
    <input
      name={name}
      defaultValue={value ?? ""}
      className={cn(inputCls, extra)}
    />
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="space-y-6">
          <section className={sectionCls}>
            <h2 className="font-serif text-base font-bold text-charcoal">Basic info</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls}>Product name *</label>
                {input("name")}
              </div>
              <div>
                <label className={labelCls}>Slug</label>
                <input
                  name="slug"
                  defaultValue={product?.slug ?? ""}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.value = formatSlug((e.currentTarget.form?.elements.namedItem("name") as HTMLInputElement)?.value ?? "");
                  }}
                  className={inputCls}
                  placeholder="auto-generated from name"
                />
              </div>
              <div>
                <label className={labelCls}>SKU</label>
                {input("sku", product?.sku, "")}
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select
                  name="categoryId"
                  defaultValue={product?.categoryId ?? ""}
                  className={inputCls}
                >
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {"\u00A0".repeat(c.depth * 2)}{c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Subcategory</label>
                {input("subcategory", product?.subcategory, "")}
              </div>
            </div>
          </section>

          <section className={sectionCls}>
            <h2 className="font-serif text-base font-bold text-charcoal">Images</h2>
            <p className="mt-1 text-[12px] text-stone">
              Paste image URLs (Unsplash links work well). The first row is the
              thumbnail.
            </p>
            <div className="mt-4 space-y-3">
              {images.map((img, i) => (
                <div key={i} className="grid gap-3 sm:grid-cols-[1fr_200px_40px]">
                  <div>
                    <input
                      value={img.url}
                      onChange={(e) =>
                        setImages(images.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))
                      }
                      placeholder={`Image URL ${i + 1}`}
                      className={cn(inputCls, imageFieldErrors[i] && "border-red-400")}
                    />
                    {imageFieldErrors[i] && (
                      <p className="mt-1 text-[11px] text-red-600">{imageFieldErrors[i]}</p>
                    )}
                  </div>
                  <input
                    value={img.alt}
                    onChange={(e) =>
                      setImages(images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))
                    }
                    placeholder="Alt text"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, j) => j !== i))}
                    disabled={images.length === 1}
                    className="flex h-full min-h-[46px] items-center justify-center text-stone transition-colors hover:text-red-600 disabled:opacity-30"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setImages([...images, { url: "", alt: "" }])}
              className="btn-outline-dark mt-4"
            >
              <Plus className="h-4 w-4" />
              Add Image
            </button>
          </section>

          <section className={sectionCls}>
            <h2 className="font-serif text-base font-bold text-charcoal">Pricing &amp; stock</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Price type</label>
                <select name="priceType" defaultValue={product?.priceType ?? "ON_REQUEST"} className={inputCls}>
                  <option value="EXACT">Exact price</option>
                  <option value="FROM">Starting from</option>
                  <option value="ON_REQUEST">Price on request</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Price (₹)</label>
                <input name="price" type="number" min="0" step="0.01" defaultValue={product?.price ?? ""} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>MOQ</label>
                {input("moq", product?.moq, "")}
              </div>
              <div>
                <label className={labelCls}>Stock status</label>
                {input("stockStatus", product?.stockStatus ?? "In Stock", "")}
              </div>
            </div>
          </section>

          <section className={sectionCls}>
            <h2 className="font-serif text-base font-bold text-charcoal">Specifications</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {[
                ["material", "Material"],
                ["size", "Size"],
                ["thickness", "Thickness"],
                ["finish", "Finish"],
                ["colour", "Colour"],
                ["application", "Application"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className={labelCls}>{label}</label>
                  {input(name, product?.[name as keyof typeof product] as string | null, "")}
                </div>
              ))}
            </div>
            <div className="mt-5">
              <label className={labelCls}>Short description</label>
              <textarea name="shortDescription" rows={3} defaultValue={product?.shortDescription ?? ""} className={inputCls} />
            </div>
            <div className="mt-5">
              <label className={labelCls}>Full description</label>
              <textarea name="description" rows={8} defaultValue={product?.description ?? ""} className={inputCls} />
            </div>
            <div className="mt-5">
              <label className={labelCls}>Tags (comma separated)</label>
              {input("tags", product?.tags.join(", "), "")}
            </div>
          </section>

          <section className={sectionCls}>
            <h2 className="font-serif text-base font-bold text-charcoal">SEO</h2>
            <div className="mt-5 grid gap-5">
              <div>
                <label className={labelCls}>SEO title</label>
                {input("seoTitle", product?.seoTitle, "")}
              </div>
              <div>
                <label className={labelCls}>SEO description</label>
                <textarea name="seoDescription" rows={3} defaultValue={product?.seoDescription ?? ""} className={inputCls} />
              </div>
            </div>
          </section>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <section className={sectionCls}>
            <h2 className="font-serif text-base font-bold text-charcoal">Visibility</h2>
            <div className="mt-4 space-y-4">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-charcoal">
                <input type="checkbox" name="published" defaultChecked={product?.published ?? false} className="h-4 w-4 accent-gold-dark" />
                Published (visible on site)
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-charcoal">
                <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="h-4 w-4 accent-gold-dark" />
                Featured on home page
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-charcoal">
                <input type="checkbox" name="isNew" defaultChecked={product?.isNew ?? false} className="h-4 w-4 accent-gold-dark" />
                Mark as new
              </label>
            </div>
          </section>

          {error && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </div>
          )}

          <button type="submit" disabled={pending} className="btn-gold w-full">
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {product ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  );
}