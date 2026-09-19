import type { ReactNode } from "react";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import WhatsAppFloat from "@/components/site/whatsapp-float";
import { getContactInfo } from "@/lib/site";
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const s = await getContactInfo();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: `${s.companyName} – ${s.tagline}`,
    description:
      "Premium tiles, marble, granite and sanitaryware showroom serving Madhubani, Bihar and nearby districts.",
    telephone: s.phone || undefined,
    email: s.email || undefined,
    address: s.address
      ? {
          "@type": "PostalAddress",
          streetAddress: s.address.split(",").slice(0, -1).join(","),
          addressLocality: s.address.split(",").at(-2)?.trim() ?? undefined,
          addressRegion: "Bihar",
          addressCountry: "IN",
        }
      : undefined,
    openingHours: s.hours || undefined,
    sameAs: [s.instagram, s.facebook, s.youtube].filter(Boolean),
  };

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
