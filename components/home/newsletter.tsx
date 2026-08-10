"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Mail, Send } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setStatus("error");
      return;
    }
    setStatus("done");
  };

  return (
    <div className="border-b border-white/10 bg-onyx">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-12 sm:px-6 lg:flex-row">
        <div className="text-center lg:text-left">
          <p className="section-kicker mb-2">Stay Inspired</p>
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
            Design Ideas &amp; Offers, <span className="text-gold">In Your Inbox</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/60">
            New collections, project stories and dealer price updates — once a
            month, no spam.
          </p>
        </div>

        {status === "done" ? (
          <div className="flex w-full max-w-md items-center gap-3 border border-gold/50 bg-gold/10 px-5 py-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-gold" />
            <p className="text-sm text-white/85">
              Thank you for subscribing! We&apos;ll be in touch.
            </p>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            noValidate
          >
            <label className="relative flex-1">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="Enter your email address"
                aria-label="Email address"
                className={cnInput(status === "error")}
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-gold px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-charcoal transition-all duration-300 hover:bg-gold-light hover:shadow-gold"
            >
              <Send className="h-4 w-4" />
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function cnInput(error: boolean) {
  return `h-12 w-full rounded-[2px] border bg-charcoal px-11 text-sm text-white placeholder:text-white/35 transition-colors duration-300 focus:outline-none ${
    error
      ? "border-tilak"
      : "border-white/20 focus:border-gold"
  }`;
}