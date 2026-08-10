import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Reveal from "@/components/site/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides and inspiration on choosing tiles, marble, granite and sanitaryware — from the team at Shiv Aadi, Darbhanga.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true, publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      publishedAt: true,
    },
  });

  const [latest, ...rest] = posts;

  return (
    <div>
      <section className="section-dark py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="section-kicker mb-4">The Journal</p>
          <h1 className="display font-bold text-white">
            Ideas, Guides &amp; <span className="text-gold">Inspiration</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/65">
            Practical advice on choosing surfaces that last a lifetime — sized,
            finished and priced for homes across Bihar.
          </p>
        </div>
      </section>

      <section className="section-beige py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {posts.length === 0 ? (
            <div className="border border-charcoal/10 bg-white px-8 py-20 text-center">
              <h2 className="font-serif text-2xl font-bold text-charcoal">
                Articles coming soon
              </h2>
              <p className="mt-3 text-sm text-stone">
                We&apos;re writing our first guides on choosing tiles and care
                of marble.
              </p>
            </div>
          ) : (
            <>
              {latest && (
                <Reveal>
                  <Link
                    href={`/blog/${latest.slug}`}
                    className="group grid overflow-hidden border border-charcoal/10 bg-white transition-all duration-500 hover:border-gold/50 hover:shadow-card lg:grid-cols-2"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-charcoal">
                      {latest.featuredImage && (
                        <Image
                          src={latest.featuredImage}
                          alt={latest.title}
                          fill
                          sizes="(max-width:1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="flex flex-col justify-center p-8 sm:p-12">
                      <p className="section-kicker mb-3">Latest Article</p>
                      <h2 className="font-serif text-2xl font-bold leading-snug text-charcoal transition-colors group-hover:text-gold-dark sm:text-3xl">
                        {latest.title}
                      </h2>
                      {latest.excerpt && (
                        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-stone">
                          {latest.excerpt}
                        </p>
                      )}
                      <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-dark">
                        Read Article
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              )}

              {rest.length > 0 && (
                <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <Reveal key={post.id} delay={i * 70}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex h-full flex-col overflow-hidden border border-charcoal/10 bg-white transition-all duration-500 hover:border-gold/50 hover:shadow-card"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-charcoal">
                          {post.featuredImage && (
                            <Image
                              src={post.featuredImage}
                              alt={post.title}
                              fill
                              sizes="(max-width:768px) 100vw, 33vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-stone">
                            <CalendarDays className="h-3.5 w-3.5 text-gold-dark" />
                            {formatDate(post.publishedAt!)}
                          </p>
                          <h2 className="mt-3 font-serif text-lg font-semibold leading-snug text-charcoal transition-colors group-hover:text-gold-dark">
                            {post.title}
                          </h2>
                          {post.excerpt && (
                            <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-stone">
                              {post.excerpt}
                            </p>
                          )}
                          <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-dark">
                            Read Article
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}