"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { z } from "zod";
import { submitLead, type LeadActionResult } from "@/lib/actions/leads";
import { leadSchema } from "@/lib/validation/schemas";
import { BUSINESS_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ProductOption = { id: string; name: string; slug: string };

type LeadFormInput = z.input<typeof leadSchema>;
type LeadFormOutput = z.output<typeof leadSchema>;

const inputCls =
  "w-full border border-charcoal/20 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-stone/60 focus:border-gold focus:outline-none transition-colors";
const labelCls =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/75";

export default function LeadForm({ products }: { products: ProductOption[] }) {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<LeadActionResult | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormInput, unknown, LeadFormOutput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      city: "",
      businessType: "" as LeadFormInput["businessType"],
      productId: searchParams.get("product") ?? "",
      productName: "",
      quantity: "",
      projectName: "",
      projectLocation: "",
      expectedDate: "",
      message: "",
      consent: false,
      website: "",
    },
  });

  const onSubmit = async (values: LeadFormOutput) => {
    const res = await submitLead(values);
    if (res.ok) {
      setResult(res);
      return;
    }
    if (res.fieldErrors) {
      for (const [field, messages] of Object.entries(res.fieldErrors)) {
        if (field === "form") continue;
        setError(field as keyof LeadFormInput, {
          message: messages[0],
        });
      }
    }
    setResult(res);
  };

  if (result?.ok && result.message) {
    return (
      <div className="flex flex-col items-center border border-gold/40 bg-white px-8 py-16 text-center">
        <CheckCircle2 className="h-12 w-12 text-gold-dark" />
        <h2 className="mt-5 font-serif text-2xl font-bold text-charcoal">
          Inquiry Received
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-stone">
          {result.message}
        </p>
        <Link href="/" className="btn-outline-dark mt-8">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="border border-charcoal/10 bg-white p-6 sm:p-8">
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register("website")}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className={labelCls}>
            Full Name *
          </label>
          <input id="lead-name" className={inputCls} placeholder="Your name" {...register("name")} />
          {errors.name && (
            <p className="mt-1.5 text-[12px] text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="lead-company" className={labelCls}>
            Company
          </label>
          <input id="lead-company" className={inputCls} placeholder="Company / firm name" {...register("company")} />
        </div>
        <div>
          <label htmlFor="lead-email" className={labelCls}>
            Email *
          </label>
          <input id="lead-email" type="email" className={inputCls} placeholder="you@company.com" {...register("email")} />
          {errors.email && (
            <p className="mt-1.5 text-[12px] text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="lead-phone" className={labelCls}>
            Phone / WhatsApp *
          </label>
          <input id="lead-phone" className={inputCls} placeholder="+91 …" {...register("phone")} />
          {errors.phone && (
            <p className="mt-1.5 text-[12px] text-red-600">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="lead-city" className={labelCls}>
            City
          </label>
          <input id="lead-city" className={inputCls} placeholder="Darbhanga, Patna…" {...register("city")} />
        </div>
        <div>
          <label htmlFor="lead-business" className={labelCls}>
            Business Type *
          </label>
          <select id="lead-business" defaultValue="" className={inputCls} {...register("businessType")}>
            <option value="" disabled>
              Select your business type
            </option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {errors.businessType && (
            <p className="mt-1.5 text-[12px] text-red-600">{errors.businessType.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="lead-product" className={labelCls}>
            Product of Interest
          </label>
          <select id="lead-product" defaultValue={searchParams.get("product") ?? ""} className={inputCls} {...register("productId")}>
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
          <input id="lead-qty" className={inputCls} placeholder="e.g. 5,000 sq.ft" {...register("quantity")} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="lead-message" className={labelCls}>
            Project / Requirement Details
          </label>
          <textarea
            id="lead-message"
            rows={4}
            className={inputCls}
            placeholder="Tell us about your project — scale, site, timelines…"
            {...register("message")}
          />
          {errors.message && (
            <p className="mt-1.5 text-[12px] text-red-600">{errors.message.message}</p>
          )}
        </div>
      </div>

      <label className="mt-6 flex items-start gap-3 text-[13px] text-charcoal/80">
        <input type="checkbox" className="mt-0.5 h-4 w-4 accent-gold" {...register("consent")} />
        <span>
          I agree to be contacted by Shiv Aadi regarding this enquiry. We
          respect your privacy — no spam, no sharing of your details. *
        </span>
      </label>
      {errors.consent && (
        <p className="mt-1.5 text-[12px] text-red-600">{errors.consent.message}</p>
      )}

      {result?.message && !result.ok && (
        <div className="mt-5 flex items-start gap-2.5 border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {result.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn("btn-gold mt-6 w-full", isSubmitting && "opacity-60")}
      >
        {isSubmitting ? (
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
