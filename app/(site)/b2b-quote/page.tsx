import type { Metadata } from "next";
import Image from "next/image";
import { Phone, MessagesSquare, Clock, ShieldCheck, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getContactInfo } from "@/lib/site";
import LeadForm from "@/components/forms/lead-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get B2B Quote",
  description:
    "Request wholesale pricing for tiles, marble, granite and sanitaryware. Competitive B2B rates for builders, architects, contractors and dealers.",
};

export default async function B2BQuotePage() {
  const s = await getContactInfo();
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return (
    <div>
      {/* Header */}
      <section className="section-dark relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop"
            alt="Premium marble surfaces"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/85 to-charcoal/70" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="section-kicker mb-4">B2B &amp; Project Sales</p>
          <h1 className="display font-bold text-white">
            Get a Wholesale Quote in <span className="text-gold">24 Hours</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70">
            Fill in your requirement and our sales team will get back to you
            with competitive project pricing, availability and dispatch
            timelines.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold" /> Transparent Pricing
            </span>
            <span className="inline-flex items-center gap-2">
              <Truck className="h-4 w-4 text-gold" /> Truckload Dispatch
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" /> Response in 24h
            </span>
          </div>
        </div>
      </section>

      {/* Form + info */}
      <section className="section-beige py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_360px]">
          <LeadForm products={products} />

          {/* Side info */}
          <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            <div className="border border-charcoal/10 bg-white p-6">
              <h2 className="font-serif text-lg font-semibold text-charcoal">
                Prefer to Talk?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-stone">
                Call us directly or message on WhatsApp — our team is quick to
                respond during showroom hours.
              </p>
              <div className="mt-5 space-y-4">
                <a
                  href={`tel:${s.phone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-3 text-sm text-charcoal/85 transition-colors hover:text-gold-dark"
                >
                  <span className="flex h-10 w-10 items-center justify-center border border-gold/40 bg-beige text-gold-dark">
                    <Phone className="h-4 w-4" />
                  </span>
                  {s.phoneDisplay || s.phone}
                </a>
                <a
                  href={`mailto:${s.b2bEmail || s.email}`}
                  className="flex items-center gap-3 text-sm text-charcoal/85 transition-colors hover:text-gold-dark"
                >
                  <span className="flex h-10 w-10 items-center justify-center border border-gold/40 bg-beige text-gold-dark">
                    <MessagesSquare className="h-4 w-4" />
                  </span>
                  {s.b2bEmail || s.email}
                </a>
              </div>
            </div>

            <div className="border border-charcoal/10 bg-white p-6">
              <h2 className="font-serif text-lg font-semibold text-charcoal">
                What Happens Next?
              </h2>
              <ol className="mt-5 space-y-4">
                {[
                  "We review your requirement and confirm availability",
                  "You receive a written quote with project pricing",
                  "Samples and batch matching arranged on request.",
                  "Truckload dispatch scheduled to your site.",
                ].map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-gold/50 bg-gold/10 font-serif text-[12px] font-bold text-gold-dark">
                      {i + 1}
                    </span>
                    <span className="text-[13px] leading-relaxed text-charcoal/80">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}