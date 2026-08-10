import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Reveal from "@/components/site/reveal";

export default function PromoBand({
  image,
  kicker = "Something Just Surfaced",
  title,
  description,
  href,
  ctaLabel = "Explore Range",
}: {
  image: string;
  kicker?: string;
  title: string;
  description: string;
  href: string;
  ctaLabel?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-charcoal">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/40" />
      </div>

      <Reveal className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-20 sm:px-6 sm:py-24">
        <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
          <Sparkles className="h-3.5 w-3.5" />
          {kicker}
        </p>
        <h2 className="max-w-3xl font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="max-w-2xl text-[15px] leading-relaxed text-white/70">
          {description}
        </p>
        <Link href={href} className="btn-gold mt-2">
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>
    </section>
  );
}