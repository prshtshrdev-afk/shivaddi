import type { Metadata } from "next";
import Link from "next/link";
import { getContactInfo } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using the Shiv Aadi – Mithila Tiles & Marbles House website and requesting B2B quotations.",
};

export default async function TermsPage() {
  const c = await getContactInfo();

  return (
    <div>
      {/* Hero */}
      <section className="section-dark py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="section-kicker mb-2">Legal</p>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">Terms &amp; Conditions</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
            Last updated: August 2026 · {c.companyLegalName}
          </p>
        </div>
      </section>

      <section className="bg-[#f4f1ec] py-16 sm:py-20">
        <div className="mx-auto max-w-4xl space-y-10 px-4 sm:px-6">
          <div className="border border-charcoal/10 bg-white p-6 text-sm leading-relaxed text-charcoal/85 sm:p-8">
            These Terms &amp; Conditions govern your use of the website of{" "}
            {c.companyLegalName} (&ldquo;Shiv Aadi&rdquo;, &ldquo;we&rdquo;,
            &ldquo;us&rdquo;), including requesting quotations through our B2B
            enquiry form. By accessing this website or submitting an enquiry,
            you agree to these terms.
          </div>

          {[
            {
              title: "1. About Us",
              body: (
                <>
                  <p>{c.companyLegalName}</p>
                  <p className="mt-2">{c.address}</p>
                  {c.gstin ? <p className="mt-2">GSTIN: {c.gstin}</p> : null}
                  <p className="mt-2">
                    Established in 2010 — suppliers of tiles, marble, granite
                    and sanitaryware to builders, architects, dealers and
                    homeowners across Bihar &amp; Jharkhand.
                  </p>
                </>
              ),
            },
            {
              title: "2. Use of This Website",
              body: (
                <>
                  <ul className="list-disc space-y-1.5 pl-5">
                    <li>You agree to provide accurate, current information in all enquiry forms.</li>
                    <li>You must not submit spam, automated or abusive requests through our forms.</li>
                    <li>You must not attempt to breach, scrape at scale, or disrupt the website.</li>
                  </ul>
                  <p className="mt-3">
                    We may rate-limit or block submissions that violate these rules.
                  </p>
                </>
              ),
            },
            {
              title: "3. Quotations & Pricing",
              body: (
                <>
                  <ul className="list-disc space-y-1.5 pl-5">
                    <li>Prices shown on this website are indicative and subject to change without notice.</li>
                    <li>All quotations are valid for 7 days unless stated otherwise in writing.</li>
                    <li>Quoted prices are exclusive of GST and any applicable statutory levies.</li>
                    <li>An order is confirmed only after written acceptance of our quotation and receipt of the agreed advance payment.</li>
                  </ul>
                </>
              ),
            },
            {
              title: "4. Orders & Payment",
              body: (
                <>
                  <ul className="list-disc space-y-1.5 pl-5">
                    <li>Payment terms are as per the confirmed proforma invoice.</li>
                    <li>Goods remain the property of Shiv Aadi until full payment is received.</li>
                    <li>We reserve the right to decline or cancel any order where stock is unavailable, with a full refund of any advance.</li>
                  </ul>
                </>
              ),
            },
            {
              title: "5. Delivery & Risk",
              body: (
                <>
                  <ul className="list-disc space-y-1.5 pl-5">
                    <li>Delivery timelines are estimates and may vary due to stock, transport or weather conditions.</li>
                    <li>Risk passes to you upon dispatch from our premises (ex-showroom terms) or upon delivery, as agreed in writing.</li>
                    <li>Please inspect goods at delivery and report damage or shortage within 48 hours with photographs.</li>
                  </ul>
                </>
              ),
            },
            {
              title: "6. Product Representation",
              body: (
                <p>
                  Product images are indicative. Natural stones, marble and
                  ceramic/vitrified tiles may show batch-to-batch variation in
                  shade, veining and texture, which is a natural
                  characteristic and not a defect. We recommend inspecting
                  physical samples before large orders.
                </p>
              ),
            },
            {
              title: "7. Returns & Replacement",
              body: (
                <>
                  <ul className="list-disc space-y-1.5 pl-5">
                    <li>Unopened, undamaged stock in original packaging may be returned within 7 days of purchase, subject to a restocking charge.</li>
                    <li>Manufacturing-defect claims are handled as per the respective brand&rsquo;s warranty policy.</li>
                    <li>No returns on cut, used or specially ordered material.</li>
                  </ul>
                </>
              ),
            },
            {
              title: "8. Intellectual Property",
              body: (
                <p>
                  All content on this website — including text, images, logos
                  and design — is the property of Shiv Aadi or its licensors
                  and may not be copied, reproduced or used commercially without
                  prior written permission.
                </p>
              ),
            },
            {
              title: "9. Limitation of Liability",
              body: (
                <p>
                  To the maximum extent permitted by law, Shiv Aadi shall not
                  be liable for any indirect, incidental or consequential
                  losses arising from use of this website or reliance on its
                  content. Our total liability for any claim shall not exceed
                  the value of the relevant invoice.
                </p>
              ),
            },
            {
              title: "10. Governing Law & Jurisdiction",
              body: (
                <p>
                  These terms are governed by the laws of India. Any dispute
                  shall be subject to the exclusive jurisdiction of the courts
                  at Madhubani, Bihar.
                </p>
              ),
            },
            {
              title: "11. Contact",
              body: (
                <>
                  <p>
                    Questions about these terms may be sent to{" "}
                    <a href={`mailto:${c.email}`} className="font-semibold text-gold-dark hover:underline">
                      {c.email}
                    </a>{" "}
                    or call {c.phoneDisplay || c.phone}.
                  </p>
                  <p className="mt-2">{c.address}</p>
                </>
              ),
            },
          ].map((s) => (
            <div key={s.title} className="border border-charcoal/10 bg-white p-6 sm:p-8">
              <h2 className="font-serif text-xl font-bold text-charcoal">{s.title}</h2>
              <div className="mt-4 text-sm leading-relaxed text-charcoal/80">{s.body}</div>
            </div>
          ))}

          <p className="text-center text-xs uppercase tracking-[0.16em] text-stone">
            Related:{" "}
            <Link href="/privacy" className="text-gold-dark hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
