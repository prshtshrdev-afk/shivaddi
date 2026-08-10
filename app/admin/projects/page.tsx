import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProjectsTable from "@/components/admin/projects-table";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, slug: true, type: true, published: true, images: true, updatedAt: true },
  });

  const rows = projects.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    type: p.type,
    published: p.published,
    thumbnail: p.images[0] ?? null,
    updatedAt: p.updatedAt,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Projects</h1>
          <p className="mt-1 text-[13px] text-stone">
            {projects.length} project{projects.length === 1 ? "" : "s"} in the portfolio.
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn-gold">
          <Plus className="h-4 w-4" />
          Add Project
        </Link>
      </div>
      <ProjectsTable projects={rows} />
    </div>
  );
}