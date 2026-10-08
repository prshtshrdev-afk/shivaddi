import type { ReactNode } from "react";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import WhatsAppFloat from "@/components/site/whatsapp-float";
import { getContactInfo } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const s = await getContactInfo();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: `${s.companyName} – ${s.tagline}`,
    description:
      "Premium tiles, marble, granite and sanitaryware showroom serving Madhubani, Bihar and nearby districts.",
    ...(s.phone && { telephone: s.phone }),
    ...(s.email && { email: s.email }),

    ...(s.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: s.address.split(",").slice(0, -1).join(",").trim(),
        addressLocality:
          s.address.split(",").at(-2)?.trim() || undefined,
        addressRegion: "Bihar",
        addressCountry: "IN",
      },
    }),

    ...(s.hours && { openingHours: s.hours }),

    sameAs: [s.instagram, s.facebook, s.youtube].filter(Boolean),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      <WhatsAppFloat />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
    </div>
  );
}
