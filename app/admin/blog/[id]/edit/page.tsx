import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/admin/blog-form";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: PageProps<"/admin/blog/[id]/edit">) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      featuredImage: true,
      published: true,
      seoTitle: true,
      seoDescription: true,
    },
  });
  if (!post) notFound();

  return <BlogForm post={post} />;
}