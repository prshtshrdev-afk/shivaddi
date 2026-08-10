import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: PageProps<"/admin/projects/[id]/edit">) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <ProjectForm
      project={{
        id: project.id,
        name: project.name,
        slug: project.slug,
        location: project.location,
        type: project.type,
        description: project.description,
        images: project.images,
        productsUsed: project.productsUsed,
        published: project.published,
      }}
    />
  );
}