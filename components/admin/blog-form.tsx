"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createBlogPost, updateBlogPost } from "@/lib/actions/admin";
import { formatSlug } from "@/lib/utils";

const inputCls =
  "w-full border border-stone-300 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-stone/60 focus:border-gold focus:outline-none transition-colors";
const labelCls =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/75";

export default function BlogForm({
  post,
}: {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featuredImage: string | null;
    published: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
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
      title: String(fd.get("title") ?? ""),
      slug: String(fd.get("slug") ?? ""),
      excerpt: String(fd.get("excerpt") ?? ""),
      content: String(fd.get("content") ?? ""),
      featuredImage: String(fd.get("featuredImage") ?? ""),
      published: fd.get("published") === "on",
      seoTitle: String(fd.get("seoTitle") ?? ""),
      seoDescription: String(fd.get("seoDescription") ?? ""),
    };

    startTransition(async () => {
      const result = post
        ? await updateBlogPost(post.id, payload)
        : await createBlogPost(payload);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
        <div className="space-y-6">
          <div className="border border-stone-200 bg-white p-6">
            <label className={labelCls}>Title *</label>
            <input
              name="title"
              defaultValue={post?.title ?? ""}
              required
              className={inputCls}
              placeholder="e.g. Choosing the Right Vitrified Tile Finish"
            />
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Slug</label>
                <input
                  name="slug"
                  defaultValue={post?.slug ?? ""}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      const title = (e.currentTarget.form?.elements.namedItem("title") as HTMLInputElement)?.value ?? "";
                      e.target.value = formatSlug(title);
                    }
                  }}
                  className={inputCls}
                  placeholder="auto-generated"
                />
              </div>
              <div>
                <label className={labelCls}>Featured image URL</label>
                <input
                  name="featuredImage"
                  defaultValue={post?.featuredImage ?? ""}
                  className={inputCls}
                  placeholder="https://images.unsplash.com/…"
                />
              </div>
            </div>
          </div>

          <div className="border border-stone-200 bg-white p-6">
            <label className={labelCls}>Excerpt (shown on cards)</label>
            <textarea
              name="excerpt"
              rows={3}
              defaultValue={post?.excerpt ?? ""}
              className={inputCls}
            />
            <label className={`${labelCls} mt-5`}>Content *</label>
            <p className="mb-2 text-[12px] text-stone">
              Write paragraphs separated by an empty line. Lines starting with
              &quot;## &quot; render as headings.
            </p>
            <textarea
              name="content"
              rows={16}
              required
              defaultValue={post?.content ?? ""}
              className={inputCls}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-stone-200 bg-white p-6">
            <h2 className="font-serif text-base font-bold text-charcoal">Visibility</h2>
            <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-charcoal">
              <input
                type="checkbox"
                name="published"
                defaultChecked={post?.published ?? false}
                className="h-4 w-4 accent-gold-dark"
              />
              Published
            </label>
            {error && (
              <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                {error}
              </div>
            )}
            <button type="submit" disabled={pending} className="btn-gold mt-5 w-full">
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {post ? "Save Changes" : "Create Post"}
            </button>
          </div>

          <div className="border border-stone-200 bg-white p-6">
            <h2 className="font-serif text-base font-bold text-charcoal">SEO</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className={labelCls}>SEO title</label>
                <input name="seoTitle" defaultValue={post?.seoTitle ?? ""} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>SEO description</label>
                <textarea name="seoDescription" rows={3} defaultValue={post?.seoDescription ?? ""} className={inputCls} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}