"use client";

import { useActionState, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactAction, type ContactActionResult } from "@/lib/actions/contact";
import { cn } from "@/lib/utils";

const initialState: ContactActionResult = { ok: false, message: "" };

const inputCls =
  "w-full border border-charcoal/20 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-stone/60 focus:border-gold focus:outline-none transition-colors";
const labelCls =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/75";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactAction, initialState);
  const [website, setWebsite] = useState("");

  if (state.ok && state.message) {
    return (
      <div className="flex flex-col items-center border border-gold/40 bg-white px-8 py-16 text-center">
        <CheckCircle2 className="h-12 w-12 text-gold-dark" />
        <h2 className="mt-5 font-serif text-2xl font-bold text-charcoal">
          Message Sent
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-stone">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="border border-charcoal/10 bg-white p-6 sm:p-8">
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
          <label htmlFor="c-name" className={labelCls}>Name *</label>
          <input id="c-name" name="name" required className={inputCls} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="c-phone" className={labelCls}>Phone *</label>
          <input id="c-phone" name="phone" required className={inputCls} placeholder="+91 …" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="c-email" className={labelCls}>Email *</label>
          <input id="c-email" name="email" type="email" required className={inputCls} placeholder="you@email.com" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="c-subject" className={labelCls}>Subject</label>
          <input id="c-subject" name="subject" className={inputCls} placeholder="e.g. Bulk tile requirement" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="c-message" className={labelCls}>Message *</label>
          <textarea
            id="c-message"
            name="message"
            rows={5}
            required
            className={inputCls}
            placeholder="How can we help?"
          />
        </div>
      </div>

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
          "Send Message"
        )}
      </button>
    </form>
  );
}