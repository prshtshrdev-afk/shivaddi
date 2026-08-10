import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import type { BlogPost } from "@/app/generated/prisma/client";
import { formatDate } from "@/lib/utils";
import Reveal from "@/components/site/reveal";
import SectionHeading from "./section-heading";

export default function BlogStrip({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;

  return (
    <section className="section-beige py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            kicker="From the Desk"
            title="Guides & Insights"
            description="Material selection guides and design knowledge from our team."
            className="mb-0"
          />
          <Link href="/blog" className="btn-outline-dark mb-1 shrink-0">
            All Articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.id} delay={i * 80}>
              <article className="group flex h-full flex-col border border-charcoal/10 bg-white transition-all duration-500 hover:border-gold/50 hover:shadow-card">
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative block aspect-[16/9] overflow-hidden bg-beige"
                >
                  {post.featuredImage && (
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 bg-charcoal/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-gold">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.publishedAt ?? post.createdAt)}
                  </span>
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-serif text-lg font-semibold leading-snug text-charcoal transition-colors hover:text-gold-dark"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-stone">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-dark transition-colors hover:text-gold"
                  >
                    Read More
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}