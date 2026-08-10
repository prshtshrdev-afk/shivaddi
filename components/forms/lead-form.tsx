"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { submitLeadAction, type LeadActionResult } from "@/lib/actions/leads";
import { BUSINESS_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ProductOption = { id: string; name: string; slug: string };

const initialState: LeadActionResult = { ok: false, message: "" };

const inputCls =
  "w-full border border-charcoal/20 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-stone/60 focus:border-gold focus:outline-none transition-colors";
const labelCls =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/75";

export default function LeadForm({ products }: { products: ProductOption[] }) {
  const searchParams = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState(
    searchParams.get("product") ?? "",
  );

  const [state, formAction, pending] = useActionState(submitLeadAction, initialState);
  const [website, setWebsite] = useState("");

  if (state.ok && state.message) {
    return (
      <div className="flex flex-col items-center border border-gold/40 bg-white px-8 py-16 text-center">
        <CheckCircle2 className="h-12 w-12 text-gold-dark" />
        <h2 className="mt-5 font-serif text-2xl font-bold text-charcoal">
          Inquiry Received
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-stone">
          {state.message}
        </p>
        <Link href="/" className="btn-outline-dark mt-8">
          Back to Home
        </Link>
      </div>
    );
  }

  const fieldError = (name: string) =>
    state.fieldErrors?.[name]?.[0];

  return (
    <form action={formAction} className="border border-charcoal/10 bg-white p-6 sm:p-8">
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className={labelCls}>
            Full Name *
          </label>
          <input id="lead-name" name="name" required className={inputCls} placeholder="Your name" />
          {fieldError("name") && (
            <p className="mt-1.5 text-[12px] text-red-600">{fieldError("name")}</p>
          )}
        </div>
        <div>
          <label htmlFor="lead-company" className={labelCls}>
            Company
          </label>
          <input id="lead-company" name="company" className={inputCls} placeholder="Company / firm name" />
        </div>
        <div>
          <label htmlFor="lead-email" className={labelCls}>
            Email *
          </label>
          <input id="lead-email" name="email" type="email" required className={inputCls} placeholder="you@company.com" />
          {fieldError("email") && (
            <p className="mt-1.5 text-[12px] text-red-600">{fieldError("email")}</p>
          )}
        </div>
        <div>
          <label htmlFor="lead-phone" className={labelCls}>
            Phone / WhatsApp *
          </label>
          <input id="lead-phone" name="phone" required className={inputCls} placeholder="+91 …" />
          {fieldError("phone") && (
            <p className="mt-1.5 text-[12px] text-red-600">{fieldError("phone")}</p>
          )}
        </div>
        <div>
          <label htmlFor="lead-city" className={labelCls}>
            City
          </label>
          <input id="lead-city" name="city" className={inputCls} placeholder="Darbhanga, Patna…" />
        </div>
        <div>
          <label htmlFor="lead-business" className={labelCls}>
            Business Type *
          </label>
          <select id="lead-business" name="businessType" required defaultValue="" className={inputCls}>
            <option value="" disabled>
              Select your business type
            </option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {fieldError("businessType") && (
            <p className="mt-1.5 text-[12px] text-red-600">{fieldError("businessType")}</p>
          )}
        </div>
        <div>
          <label htmlFor="lead-product" className={labelCls}>
            Product of Interest
          </label>
          <select
            id="lead-product"
            name="productId"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className={inputCls}
          >
            <option value="">Select a product (optional)</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="lead-qty" className={labelCls}>
            Approx. Quantity
          </label>
          <input id="lead-qty" name="quantity" className={inputCls} placeholder="e.g. 5,000 sq.ft" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="lead-message" className={labelCls}>
            Project / Requirement Details
          </label>
          <textarea
            id="lead-message"
            name="message"
            rows={4}
            className={inputCls}
            placeholder="Tell us about your project — scale, site, timelines…"
          />
          {fieldError("message") && (
            <p className="mt-1.5 text-[12px] text-red-600">{fieldError("message")}</p>
          )}
        </div>
      </div>

      <label className="mt-6 flex items-start gap-3 text-[13px] text-charcoal/80">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 accent-gold"
        />
        <span>
          I agree to be contacted by Shiv Aadi regarding this enquiry. We
          respect your privacy — no spam, no sharing of your details. *
        </span>
      </label>
      {fieldError("consent") && (
        <p className="mt-1.5 text-[12px] text-red-600">{fieldError("consent")}</p>
      )}

      {state.message && !state.ok && (
        <div className="mt-5 flex items-start gap-2.5 border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className={cn("btn-gold mt-6 w-full", pending && "opacity-60")}
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Submit Enquiry"
        )}
      </button>

      <p className="mt-4 text-center text-[11px] uppercase tracking-[0.16em] text-stone">
        Response within 24 hours
      </p>
    </form>
  );
}