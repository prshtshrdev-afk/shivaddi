import type { ReactNode } from "react";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import WhatsAppFloat from "@/components/site/whatsapp-float";
import { getContactInfo } from "@/lib/site";
export const dynamic = "force-dynamic";
export default function RootLayout() {
  const timestamp = new Date().toUTCString();
  
  return (
    <html lang="en">
      <head>
        <title>Error 502 - Bad Gateway</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{
        backgroundColor: '#f9f9f9',
        color: '#333333',
        fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        margin: 0,
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}>
        <div style={{
          maxWidth: '800px',
          width: '100%',
          marginTop: '40px'
        }}>
          {/* Main Large Error Header */}
          <h1 style={{
            fontSize: '48px',
            fontWeight: '300',
            color: '#222222',
            margin: '0 0 10px 0',
            letterSpacing: '-1px'
          }}>
            Bad Gateway
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#666666',
            margin: '0 0 40px 0',
            fontWeight: '300'
          }}>
            The proxy server received an invalid response from an upstream server.
          </p>

          <hr style={{ border: '0', borderTop: '1px solid #e5e5e5', margin: '30px 0' }} />

          {/* Technical Diagnostics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            <div>
              <h3 style={{ fontSize: '14px', color: '#999999', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Error Code</h3>
              <p style={{ fontSize: '16px', margin: 0, fontWeight: '500', color: '#444444' }}>502 / BAD_GATEWAY</p>
            </div>
            <div>
              <h3 style={{ fontSize: '14px', color: '#999999', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Server IP</h3>
              <p style={{ fontSize: '16px', margin: 0, fontWeight: '500', color: '#444444' }}>140.230.66.140</p>
            </div>
            <div>
              <h3 style={{ fontSize: '14px', color: '#999999', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Date & Time</h3>
              <p style={{ fontSize: '14px', fontFamily: 'monospace', margin: 0, color: '#444444' }}>{timestamp}</p>
            </div>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #e5e5e5', margin: '30px 0' }} />

          {/* Troubleshooting Advice */}
          <div style={{
            backgroundColor: '#f1f1f1',
            borderRadius: '4px',
            padding: '20px',
            border: '1px solid #e0e0e0'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333333', fontSize: '14px' }}>What happened?</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666666', lineHeight: '1.5' }}>
              The web server encountered an internal network configuration anomaly or resource limitation while trying to execute the application runtime script. Please try reloading the resource or contact the network administrator if the problem persists.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

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
