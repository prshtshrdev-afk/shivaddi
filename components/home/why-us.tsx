import { Gem, Layers, BadgeCheck, Heart, Compass, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "@/components/site/reveal";
import SectionHeading from "./section-heading";

const ICONS: Record<string, LucideIcon> = {
  gem: Gem,
  layers: Layers,
  badge: BadgeCheck,
  heart: Heart,
  compass: Compass,
  truck: Truck,
};

export type WhyUsItem = { icon: string; title: string; text: string };

export default function WhyUs({
  items,
}: {
  items: WhyUsItem[];
}) {
  if (!items.length) return null;

  return (
    <section className="section-beige py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="The Shiv Aadi Promise"
          title="Why Choose Shiv Aadi"
          description="A decade of fulfilled promises to builders, architects and homeowners across the region."
          align="center"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Gem;
            return (
              <Reveal key={item.title} delay={i * 60}>
                <div className="group h-full border border-charcoal/10 bg-white p-8 text-center transition-all duration-500 hover:border-gold/50 hover:shadow-card">
                  <span className="gold-rule mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center border border-gold/40 bg-beige text-gold-dark transition-colors duration-500 group-hover:bg-gold group-hover:text-charcoal">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}