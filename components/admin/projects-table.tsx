"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toggleProjectPublished, deleteProject } from "@/lib/actions/admin";
import { prismaProjectTypeToLabel } from "@/lib/types";

export default function ProjectsTable({
  projects,
}: {
  projects: {
    id: string;
    name: string;
    slug: string;
    type: string;
    published: boolean;
    thumbnail: string | null;
    updatedAt: Date;
  }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onToggle(id: string) {
    startTransition(async () => {
      await toggleProjectPublished(id);
      router.refresh();
    });
  }

  function onDelete(id: string, name: string) {
    if (!confirm(`Delete project "${name}"?`)) return;
    startTransition(async () => {
      await deleteProject(id);
      router.refresh();
    });
  }

  return (
    <div className="overflow-x-auto border border-stone-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-[13px]">
        <thead>
          <tr className="border-b border-stone-100 bg-stone-50 text-[11px] uppercase tracking-[0.14em] text-stone">
            <th className="px-5 py-3.5 font-semibold">Project</th>
            <th className="px-5 py-3.5 font-semibold">Type</th>
            <th className="px-5 py-3.5 font-semibold">Status</th>
            <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {projects.map((p) => (
            <tr key={p.id} className="transition-colors hover:bg-stone-50/60">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden bg-stone-100">
                    {p.thumbnail && (
                      <Image src={p.thumbnail} alt="" fill sizes="44px" className="object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal">{p.name}</p>
                    <p className="text-[11px] text-stone">/{p.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3.5 text-stone">{prismaProjectTypeToLabel(p.type)}</td>
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
                    href={`/admin/projects/${p.id}/edit`}
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
          {projects.length === 0 && (
            <tr>
              <td colSpan={4} className="px-5 py-16 text-center text-sm text-stone">
                No projects yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {pending && <p className="border-t border-stone-100 px-5 py-2 text-[11px] text-stone">Updating…</p>}
    </div>
  );
}