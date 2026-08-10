import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import BlogTable from "@/components/admin/blog-table";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, slug: true, published: true, publishedAt: true, updatedAt: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Blog</h1>
          <p className="mt-1 text-[13px] text-stone">
            {posts.length} post{posts.length === 1 ? "" : "s"}.
          </p>
        </div>
        <Link href="/admin/blog/new" className="btn-gold">
          <Plus className="h-4 w-4" />
          Write Post
        </Link>
      </div>
      <BlogTable posts={posts} />
    </div>
  );
}