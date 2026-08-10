import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { prismaProjectTypeToLabel } from "@/lib/types";
import Reveal from "@/components/site/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Completed projects by Shiv Aadi — residential complexes, hotels, offices and commercial spaces finished with our tiles, marble and granite.",
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <section className="section-dark py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="section-kicker mb-4">Our Work</p>
          <h1 className="display font-bold text-white">
            Projects We&apos;ve <span className="text-gold">Helped Build</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/65">
            From residential towers to boutique hotels — the surfaces we supply
            define some of the region&apos;s most ambitious spaces.
          </p>
        </div>
      </section>

      <section className="section-beige py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {projects.length === 0 ? (
            <div className="border border-charcoal/10 bg-white px-8 py-20 text-center">
              <h2 className="font-serif text-2xl font-bold text-charcoal">
                Projects coming soon
              </h2>
              <p className="mt-3 text-sm text-stone">
                We&apos;ll be showcasing our recent work here shortly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <Reveal key={project.id} delay={i * 70}>
                  <article className="group flex h-full flex-col overflow-hidden border border-charcoal/10 bg-white transition-all duration-500 hover:border-gold/50 hover:shadow-card">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="relative block aspect-[16/10] overflow-hidden bg-charcoal"
                    >
                      {project.images[0] ? (
                        <Image
                          src={project.images[0]}
                          alt={project.name}
                          fill
                          sizes="(max-width:768px) 100vw, 33vw"
                          className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : null}
                      <span className="absolute left-4 top-4 bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal">
                        {prismaProjectTypeToLabel(project.type)}
                      </span>
                    </Link>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-stone">
                        <MapPin className="h-3.5 w-3.5 text-gold-dark" />
                        {project.location || "Location on request"}
                      </p>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="mt-3 font-serif text-xl font-semibold leading-snug text-charcoal transition-colors hover:text-gold-dark"
                      >
                        {project.name}
                      </Link>
                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-stone">
                        {project.description}
                      </p>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-dark transition-colors hover:text-gold"
                      >
                        View Project
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}