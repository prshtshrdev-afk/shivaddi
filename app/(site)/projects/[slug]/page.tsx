import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { prismaProjectTypeToLabel } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!project) return {};
  return {
    title: project.name,
    description: project.description?.slice(0, 160) ?? undefined,
  };
}

export default async function ProjectDetailPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
  });
  if (!project || !project.published) notFound();

  const more = await prisma.project.findMany({
    where: { published: true, id: { not: project.id } },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, name: true, slug: true, location: true, images: true, type: true },
  });

  return (
    <div>
      <section className="section-dark py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Projects
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal">
              {prismaProjectTypeToLabel(project.type)}
            </span>
            {project.location && (
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-white/60">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                {project.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-white/60">
              <CalendarDays className="h-3.5 w-3.5 text-gold" />
              {project.createdAt.toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
              })}
            </span>
          </div>
          <h1 className="display mt-4 font-bold text-white">{project.name}</h1>
        </div>
      </section>

      <section className="section-beige py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {project.images.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {project.images.map((src, i) => (
                <div
                  key={src}
                  className={`relative aspect-[4/3] overflow-hidden bg-charcoal ${
                    i === 0 && project.images.length > 1
                      ? "md:row-span-2 md:aspect-auto md:min-h-[560px]"
                      : ""
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${project.name} – ${i + 1}`}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex aspect-[21/9] items-center justify-center bg-white text-sm text-stone">
              Images coming soon
            </div>
          )}

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <h2 className="font-serif text-2xl font-bold text-charcoal">
                About this project
              </h2>
              {project.description ? (
                <div className="mt-5 space-y-4 text-[15px] leading-[1.9] text-charcoal/75">
                  {project.description.split(/\n{2,}/).map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-stone">
                  More details about this project coming soon.
                </p>
              )}
            </div>

            {project.productsUsed.length > 0 && (
              <aside className="h-fit border border-charcoal/10 bg-white p-6">
                <h3 className="font-serif text-base font-semibold text-charcoal">
                  Materials Used
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {project.productsUsed.map((name) => (
                    <li
                      key={name}
                      className="flex items-center gap-2 text-sm text-charcoal/70"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-dark" />
                      {name}
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </div>

          <div className="mt-16 border-t border-charcoal/10 pt-12 text-center">
            <h2 className="font-serif text-2xl font-bold text-charcoal">
              Looking for similar materials?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone">
              Our team can help source, match and schedule delivery for your
              project — from a single bathroom to a full complex.
            </p>
            <Link
              href="/b2b-quote"
              className="btn-gold mt-6 inline-flex"
            >
              Request a Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="section-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="font-serif text-2xl font-bold text-charcoal">
              More Projects
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="group overflow-hidden border border-charcoal/10 bg-white transition-all duration-500 hover:border-gold/50 hover:shadow-card"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-charcoal">
                    {p.images[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-semibold text-charcoal transition-colors group-hover:text-gold-dark">
                      {p.name}
                    </h3>
                    {p.location && (
                      <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-stone">
                        <MapPin className="h-3.5 w-3.5 text-gold-dark" />
                        {p.location}
                      </p>
                    )}
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