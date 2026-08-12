"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, Lock } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const rawCallbackUrl = searchParams.get("callbackUrl");
  const callbackUrl =
    rawCallbackUrl?.startsWith("/") && !rawCallbackUrl.startsWith("//")
      ? rawCallbackUrl
      : "/admin";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setPending(false);
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm border border-charcoal/10 bg-white p-8 shadow-card"
    >
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center bg-gold text-charcoal">
          <Lock className="h-5 w-5" />
        </span>
        <h1 className="mt-4 font-serif text-2xl font-bold text-charcoal">
          Admin Login
        </h1>
        <p className="mt-1.5 text-[13px] text-stone">
          Shiv Aadi – Mithila Tiles &amp; Marbles House
        </p>
      </div>

      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/75">
        Email
      </label>
      <input
        type="email"
        name="email"
        required
        autoComplete="email"
        className="mb-5 w-full border border-charcoal/20 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-stone/60 focus:border-gold focus:outline-none"
        placeholder="admin@shivaadi.in"
      />

      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/75">
        Password
      </label>
      <input
        type="password"
        name="password"
        required
        autoComplete="current-password"
        className="w-full border border-charcoal/20 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-stone/60 focus:border-gold focus:outline-none"
        placeholder="••••••••"
      />

      {error && (
        <div className="mt-5 flex items-start gap-2.5 border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <button type="submit" disabled={pending} className="btn-gold mt-6 w-full">
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}