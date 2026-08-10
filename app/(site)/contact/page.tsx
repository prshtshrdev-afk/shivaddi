import type { Metadata } from "next";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
} from "lucide-react";
import { getContactInfo } from "@/lib/site";
import ContactForm from "@/components/forms/contact-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Visit the Shiv Aadi showroom in Darbhanga, call us, or send a message. Premium tiles, marble, granite and sanitaryware for homes and businesses.",
};

export default async function ContactPage() {
  const s = await getContactInfo();
  const cleanPhone = s.phone.replace(/[^0-9+]/g, "");
  const cleanWa = s.whatsapp.replace(/[^0-9]/g, "");
  const waLink = cleanWa
    ? `https://wa.me/${cleanWa}?text=${encodeURIComponent(
        "Hello Shiv Aadi! I'd like to enquire about tiles & marble.",
      )}`
    : "";

  return (
    <div>
      {/* Header */}
      <section className="section-dark py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="section-kicker mb-4">Contact</p>
          <h1 className="display font-bold text-white">
            Visit, Call or <span className="text-gold">Message Us</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/65">
            Our showroom is designed like a finished home — come experience the
            materials in real light. For bulk and project enquiries, the team is
            one call away.
          </p>
        </div>
      </section>

      <section className="section-beige py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[360px_1fr]">
          {/* Info cards */}
          <div className="space-y-5">
            {[
              {
                icon: MapPin,
                title: "Showroom",
                lines: [s.address],
              },
              {
                icon: Phone,
                title: "Phone",
                lines: [s.phoneDisplay || s.phone],
                href: `tel:${cleanPhone}`,
              },
              {
                icon: Mail,
                title: "Email",
                lines: [s.email, s.b2bEmail].filter(Boolean) as string[],
                href: `mailto:${s.email}`,
              },
              {
                icon: Clock,
                title: "Hours",
                lines: [s.hours],
              },
            ].map(({ icon: Icon, title, lines, href }) => (
              <div
                key={title}
                className="flex gap-4 border border-charcoal/10 bg-white p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold/40 bg-beige text-gold-dark">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-serif text-sm font-semibold uppercase tracking-[0.14em] text-charcoal">
                    {title}
                  </h2>
                  {lines.map((line) =>
                    href ? (
                      <a
                        key={line}
                        href={href}
                        className="mt-1 block text-sm text-charcoal/75 transition-colors hover:text-gold-dark"
                      >
                        {line}
                      </a>
                    ) : (
                      <p key={line} className="mt-1 text-sm text-charcoal/75">
                        {line}
                      </p>
                    ),
                  )}
                </div>
              </div>
            ))}

            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-[2px] bg-[#25D366] px-5 py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:brightness-110"
              >
                <MessageCircle className="h-5 w-5" />
                Chat on WhatsApp
              </a>
            )}

            {s.mapsUrl && (
              <a
                href={s.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-dark w-full"
              >
                Get Directions
              </a>
            )}
          </div>

          {/* Form */}
          <div>
            <p className="section-kicker mb-3">Send a Message</p>
            <h2 className="display mb-8 font-bold text-charcoal">
              We&apos;ll Get Back Within 24 Hours
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}