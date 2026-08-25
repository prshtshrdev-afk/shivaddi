import type { Metadata } from "next";
import Image from "next/image";
import {
  Check,
  Gem,
  Users,
  Building2,
  Truck,
  Headphones,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import Reveal from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story of Shiv Aadi – Mithila Tiles & Marbles House. A decade of premium tiles, marble, granite and sanitaryware supply across Bihar & Jharkhand.",
};

const PILLARS = [
  {
    icon: Gem,
    title: "Premium Quality",
    text: "Every slab, tile and fitting is hand-inspected at our yard before it reaches your site.",
  },
  {
    icon: Users,
    title: "Trusted Since 2010",
    text: "Over 5,000 happy clients — builders, architects, dealers and homeowners.",
  },
  {
    icon: Building2,
    title: "Project Expertise",
    text: "200+ delivered projects from residential bungalows to commercial towers and hotels.",
  },
  {
    icon: Truck,
    title: "Reliable Supply",
    text: "Truckload dispatch on schedule, with full batch matching for bulk orders.",
  },
  {
    icon: Headphones,
    title: "Expert Guidance",
    text: "Material selection, quantity estimation and installation advice — always free.",
  },
];

export default async function AboutPage() {
  const [stats, aboutImages] = await Promise.all([
    prisma.pageContent.findMany({
      where: { page: "home", section: "stats" },
      select: { content: true },
      orderBy: { key: "asc" },
    }),
    prisma.product.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 2,
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    }),
  ]);
  const getImg = (idx: number) => aboutImages[idx]?.images[0]?.url ?? "";

  return (
    <div>
      {/* Hero */}
      <section className="section-dark relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0">
            <Image
              src={getImg(0) || "/shivadii-logo.jpg"}
              alt="Shiv Aadi showroom"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-charcoal/60" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="section-kicker mb-4">Our Story</p>
          <h1 className="display font-bold text-white">
            Rooted in Mithila, <span className="text-gold">Built on Stone</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70">
            Shiv Aadi began as a single marble yard in the heart of Mithila and
            grew into one of the region&apos;s most trusted tile, marble, granite
            and sanitaryware houses. Every slab is hand-inspected. Every batch
            is priced with builders in mind.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden border border-charcoal/10">
              <Image
                src={getImg(1) || "/shivadii-logo.jpg"}
                alt="Premium interior finished with Shiv Aadi surfaces"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden border border-gold/40 bg-charcoal px-8 py-6 shadow-2xl sm:block">
              <p className="font-serif text-3xl font-bold text-gold">2010</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/60">
                Year Founded
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="order-1 lg:order-2">
            <p className="section-kicker mb-3">The Shiv Aadi Way</p>
            <h2 className="display font-bold text-charcoal">
              A Showroom Designed Like a Finished Home
            </h2>
            <p className="mt-6 leading-relaxed text-stone">
              Walk into our showroom and you&apos;ll understand the difference.
              We designed it like a luxury interior — full-scale bathrooms,
              living rooms and lobbies — so you experience materials the way
              they will live in your spaces. Light, texture and scale are not
              brochures here; they are rooms you can touch.
            </p>
            <p className="mt-4 leading-relaxed text-stone">
              For builders and architects, we operate like a supply partner:
              transparent B2B pricing, batch-matched deliveries, dedicated
              project rates and material guidance from selection to
              installation.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Hand-inspected quality at every stage",
                "Direct distributor pricing for professionals",
                "Truckload dispatch on schedule",
                "Free estimation and specification support",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-charcoal/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-gold/50 bg-gold/10">
                    <Check className="h-3 w-3 text-gold-dark" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <section className="section-beige py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="section-kicker mb-3">What We Stand For</p>
            <h2 className="display font-bold text-charcoal">The Pillars of Shiv Aadi</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 60}>
                <div className="group h-full border border-charcoal/10 bg-white p-6 text-center transition-all duration-500 hover:border-gold/50 hover:shadow-card">
                  <span className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center border border-gold/40 bg-beige text-gold-dark transition-colors duration-500 group-hover:bg-gold group-hover:text-charcoal">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-serif text-[15px] font-semibold text-charcoal">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-stone">
                    {p.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-charcoal/10 bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-charcoal/10 px-4 sm:px-6 lg:grid-cols-4">
          {(stats.length
            ? stats.map((s) => {
                try {
                  return JSON.parse(s.content) as { value: string; label: string };
                } catch {
                  return null;
                }
              }).filter((x): x is { value: string; label: string } => x !== null)
            : [
                { value: "15+", label: "Years of Excellence" },
                { value: "5000+", label: "Happy Clients" },
                { value: "200+", label: "Projects Delivered" },
                { value: "40+", label: "Premium Brands" },
              ]
          ).map((stat) => (
            <div key={stat.label} className="flex flex-col items-center bg-white px-4 py-10 text-center">
              <span className="font-serif text-4xl font-bold text-gold-dark">{stat.value}</span>
              <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}