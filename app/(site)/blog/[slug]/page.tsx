import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
  };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const readMinutes = Math.max(2, Math.round(post.content.split(/\s+/).length / 200));

  const related = await prisma.blogPost.findMany({
    where: { published: true, id: { not: post.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: { id: true, title: true, slug: true, featuredImage: true },
  });

  return (
    <div>
      <article>
        <header className="section-dark py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Articles
            </Link>
            <h1 className="display mt-6 font-bold leading-tight text-white">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-[0.16em] text-white/60">
              {post.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-gold" />
                  {formatDate(post.publishedAt)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gold" />
                {readMinutes} min read
              </span>
            </div>
          </div>
        </header>

        {post.featuredImage && (
          <div className="relative aspect-[21/9] bg-charcoal">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="section-beige py-14 sm:py-20">
          <div className="prose prose-stone mx-auto max-w-3xl px-4 sm:px-6">
            {post.content.split(/\n{2,}/).map((paragraph) => {
              // Heading paragraphs (single line starting with ##)
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={paragraph} className="font-serif text-2xl font-bold text-charcoal">
                    {paragraph.slice(3)}
                  </h2>
                );
              }
              return (
                <p key={paragraph.slice(0, 40)} className="text-[15px] leading-[1.9] text-charcoal/75">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section-white py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="font-serif text-2xl font-bold text-charcoal">
              Keep Reading
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group overflow-hidden border border-charcoal/10 bg-white transition-all duration-500 hover:border-gold/50 hover:shadow-card"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-charcoal">
                    {p.featuredImage && (
                      <Image
                        src={p.featuredImage}
                        alt={p.title}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-semibold leading-snug text-charcoal transition-colors group-hover:text-gold-dark">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}