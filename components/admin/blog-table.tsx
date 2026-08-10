"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { deleteBlogPost, toggleBlogPostPublished } from "@/lib/actions/admin";
import { formatDate } from "@/lib/utils";

export default function BlogTable({
  posts,
}: {
  posts: { id: string; title: string; slug: string; published: boolean; publishedAt: Date | null; updatedAt: Date }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onToggle(id: string) {
    startTransition(async () => {
      await toggleBlogPostPublished(id);
      router.refresh();
    });
  }

  function onDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    startTransition(async () => {
      await deleteBlogPost(id);
      router.refresh();
    });
  }

  return (
    <div className="overflow-x-auto border border-stone-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-[13px]">
        <thead>
          <tr className="border-b border-stone-100 bg-stone-50 text-[11px] uppercase tracking-[0.14em] text-stone">
            <th className="px-5 py-3.5 font-semibold">Post</th>
            <th className="px-5 py-3.5 font-semibold">Date</th>
            <th className="px-5 py-3.5 font-semibold">Status</th>
            <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {posts.map((p) => (
            <tr key={p.id} className="transition-colors hover:bg-stone-50/60">
              <td className="px-5 py-3.5">
                <p className="font-semibold text-charcoal">{p.title}</p>
                <p className="text-[11px] text-stone">/{p.slug}</p>
              </td>
              <td className="px-5 py-3.5 text-stone">
                {p.publishedAt ? formatDate(p.publishedAt) : "Not published"}
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
                    onClick={() => onToggle(p.id)}
                    title={p.published ? "Unpublish" : "Publish"}
                    className="flex h-8 w-8 items-center justify-center rounded-[2px] text-stone transition-colors hover:bg-gold/15 hover:text-gold-dark"
                  >
                    {p.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <Link
                    href={`/admin/blog/${p.id}/edit`}
                    title="Edit"
                    className="flex h-8 w-8 items-center justify-center rounded-[2px] text-stone transition-colors hover:bg-gold/15 hover:text-gold-dark"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => onDelete(p.id, p.title)}
                    title="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-[2px] text-stone transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={4} className="px-5 py-16 text-center text-sm text-stone">
                No blog posts yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {pending && <p className="border-t border-stone-100 px-5 py-2 text-[11px] text-stone">Updating…</p>}
    </div>
  );
}