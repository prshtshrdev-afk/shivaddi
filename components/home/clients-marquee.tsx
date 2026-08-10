import { Building2 } from "lucide-react";
import SectionHeading from "./section-heading";

const FALLBACK_CLIENTS = [
  "Mithila Builders",
  "Ayodhya Developers",
  "Shree Construction",
  "LNM Hospitality",
  "Ganga Interiors",
  "Saryug Projects",
  "Paras Buildtech",
  "Udyan Developers",
  "Kamal Interiors",
  "Darbhanga Constructions",
  "Rajdhani Builders",
  "Veer Enterprises",
];

export default function ClientsMarquee({ names }: { names: string[] }) {
  const clients = [...new Set([...names, ...FALLBACK_CLIENTS])].slice(0, 16);
  if (!clients.length) return null;

  const row = [...clients, ...clients];

  return (
    <section className="section-dark overflow-hidden py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          dark
          kicker="Prestigious Clients"
          title="Trusted by Builders & Developers"
          description="From housing projects to hotels, the region's finest teams specify Shiv Aadi surfaces."
          align="center"
        />
      </div>

      <div className="relative mt-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-charcoal to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-charcoal to-transparent" />

        <div className="marquee-h flex w-max items-center gap-14 py-6 pl-14">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="inline-flex shrink-0 items-center gap-3 text-white/45 transition-colors duration-300 hover:text-gold"
            >
              <Building2 className="h-5 w-5 text-gold/50" />
              <span className="whitespace-nowrap font-serif text-lg font-semibold tracking-wide">
                {name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}