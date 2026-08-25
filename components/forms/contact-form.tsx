"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { z } from "zod";
import { submitContact, type ContactActionResult } from "@/lib/actions/contact";
import { contactSchema } from "@/lib/validation/schemas";
import { cn } from "@/lib/utils";

type ContactFormInput = z.input<typeof contactSchema>;
type ContactFormOutput = z.output<typeof contactSchema>;

const inputCls =
  "w-full border border-charcoal/20 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-stone/60 focus:border-gold focus:outline-none transition-colors";
const labelCls =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/75";

export default function ContactForm() {
  const [result, setResult] = useState<ContactActionResult | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput, unknown, ContactFormOutput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = async (values: ContactFormOutput) => {
    const res = await submitContact(values);
    if (res.ok) {
      setResult(res);
      return;
    }
    if (res.fieldErrors) {
      for (const [field, messages] of Object.entries(res.fieldErrors)) {
        if (field === "form") continue;
        setError(field as keyof ContactFormInput, {
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
          Message Sent
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-stone">
          {result.message}
        </p>
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
          <label htmlFor="c-name" className={labelCls}>Name *</label>
          <input id="c-name" className={inputCls} placeholder="Your name" {...register("name")} />
          {errors.name && (
            <p className="mt-1.5 text-[12px] text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="c-phone" className={labelCls}>Phone *</label>
          <input id="c-phone" className={inputCls} placeholder="+91 …" {...register("phone")} />
          {errors.phone && (
            <p className="mt-1.5 text-[12px] text-red-600">{errors.phone.message}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="c-email" className={labelCls}>Email *</label>
          <input id="c-email" type="email" className={inputCls} placeholder="you@email.com" {...register("email")} />
          {errors.email && (
            <p className="mt-1.5 text-[12px] text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="c-subject" className={labelCls}>Subject</label>
          <input id="c-subject" className={inputCls} placeholder="e.g. Bulk tile requirement" {...register("subject")} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="c-message" className={labelCls}>Message *</label>
          <textarea
            id="c-message"
            rows={5}
            className={inputCls}
            placeholder="How can we help?"
            {...register("message")}
          />
          {errors.message && (
            <p className="mt-1.5 text-[12px] text-red-600">{errors.message.message}</p>
          )}
        </div>
      </div>

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
          "Send Message"
        )}
      </button>
    </form>
  );
}
