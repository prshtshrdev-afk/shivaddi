import type { Metadata } from "next";
import Link from "next/link";
import { getContactInfo } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Shiv Aadi – Mithila Tiles & Marbles House collects, uses and protects your personal information submitted through our enquiry forms.",
};

export default async function PrivacyPolicyPage() {
  const c = await getContactInfo();

  return (
    <div>
      {/* Hero */}
      <section className="section-dark py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="section-kicker mb-2">Legal</p>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
            Last updated: August 2026 · {c.companyLegalName}
          </p>
        </div>
      </section>

      <section className="bg-[#f4f1ec] py-16 sm:py-20">
        <div className="mx-auto max-w-4xl space-y-10 px-4 sm:px-6">
          <div className="border border-charcoal/10 bg-white p-6 text-sm leading-relaxed text-charcoal/85 sm:p-8">
            This Privacy Policy explains how {c.companyLegalName} (&ldquo;Shiv
            Aadi&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses,
            discloses and protects your personal information when you visit our
            website or submit an enquiry through our B2B quotation or contact
            forms.
          </div>

          {[
            {
              title: "1. Information We Collect",
              body: (
                <>
                  <p>
                    We collect information you voluntarily provide when you
                    fill in our forms, including:
                  </p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5">
                    <li>Full name and company / firm name</li>
                    <li>Phone number and WhatsApp number</li>
                    <li>Email address</li>
                    <li>City and business type (builder, contractor, architect, dealer, etc.)</li>
                    <li>Product interest, approximate quantity and project details</li>
                    <li>Any message or requirement you share with us</li>
                  </ul>
                  <p className="mt-3">
                    We also automatically collect your IP address solely for
                    spam and abuse prevention (rate limiting) on our forms.
                  </p>
                </>
              ),
            },
            {
              title: "2. How We Use Your Information",
              body: (
                <>
                  <p>Your information is used only to:</p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5">
                    <li>Respond to your enquiry, normally within 24 hours</li>
                    <li>Prepare and send B2B quotations and pricing</li>
                    <li>Contact you by phone, WhatsApp or email regarding your requirement</li>
                    <li>Maintain internal records of enquiries for sales follow-up</li>
                    <li>Prevent spam and misuse of our forms</li>
                  </ul>
                </>
              ),
            },
            {
              title: "3. Consent",
              body: (
                <p>
                  By ticking the consent box and submitting an enquiry, you
                  expressly agree that Shiv Aadi may contact you using the
                  details you provided. You may withdraw consent at any time by
                  writing to us at{" "}
                  <a href={`mailto:${c.email}`} className="font-semibold text-gold-dark hover:underline">
                    {c.email}
                  </a>
                  .
                </p>
              ),
            },
            {
              title: "4. Email Communications via Gmail",
              body: (
                <p>
                  Enquiry notifications are delivered to our sales team through
                  email services operated by{" "}
                  <strong>Google (Gmail)</strong>. When your enquiry reaches us
                  by email, Google processes that transmission under its own
                  privacy safeguards. Our outgoing replies are sent from our
                  official business mailbox,{" "}
                  <a href={`mailto:${c.email}`} className="font-semibold text-gold-dark hover:underline">
                    {c.email}
                  </a>
                  , and we never send marketing emails without your consent.
                </p>
              ),
            },
            {
              title: "5. Data Sharing",
              body: (
                <>
                  <p>We do not sell, rent or trade your personal data. We share it only with:</p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5">
                    <li>Our own sales and support staff, to handle your enquiry</li>
                    <li>Email provider (Google/Gmail) strictly for delivering enquiry notifications</li>
                    <li>Hosting and database providers, as required to operate this website securely</li>
                    <li>Authorities, where disclosure is required by applicable Indian law</li>
                  </ul>
                </>
              ),
            },
            {
              title: "6. Cookies & Analytics",
              body: (
                <p>
                  This website uses only essential cookies required for
                  security and session management. We do not use tracking or
                  advertising cookies. Hidden anti-spam fields are used on our
                  forms; they collect nothing beyond what you type.
                </p>
              ),
            },
            {
              title: "7. Data Retention & Security",
              body: (
                <p>
                  Enquiry records are stored in a secure, access-controlled
                  database and retained only as long as needed for our sales
                  process or to comply with legal obligations. We apply
                  reasonable technical and organisational measures to protect
                  your data against unauthorised access, alteration or loss.
                </p>
              ),
            },
            {
              title: "8. Your Rights",
              body: (
                <>
                  <p>You may request at any time:</p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5">
                    <li>A copy of the personal data we hold about you</li>
                    <li>Correction of inaccurate details</li>
                    <li>Deletion of your enquiry record from our systems</li>
                  </ul>
                  <p className="mt-3">
                    To exercise these rights, email{" "}
                    <a href={`mailto:${c.email}`} className="font-semibold text-gold-dark hover:underline">
                      {c.email}
                    </a>{" "}
                    or call {c.phoneDisplay || c.phone}.
                  </p>
                </>
              ),
            },
            {
              title: "9. Children's Privacy",
              body: (
                <p>
                  Our services are directed at businesses and adults. We do not
                  knowingly collect personal information from children under
                  18.
                </p>
              ),
            },
            {
              title: "10. Changes to This Policy",
              body: (
                <p>
                  We may update this Privacy Policy from time to time. The
                  latest version will always be available on this page with a
                  revised &ldquo;last updated&rdquo; date.
                </p>
              ),
            },
            {
              title: "11. Contact Us",
              body: (
                <>
                  <p>{c.companyLegalName}</p>
                  <p className="mt-2">{c.address}</p>
                  <p className="mt-2">
                    Email:{" "}
                    <a href={`mailto:${c.email}`} className="font-semibold text-gold-dark hover:underline">
                      {c.email}
                    </a>
                    {" · "}Phone: {c.phoneDisplay || c.phone}
                  </p>
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
            <Link href="/terms" className="text-gold-dark hover:underline">
              Terms &amp; Conditions
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
