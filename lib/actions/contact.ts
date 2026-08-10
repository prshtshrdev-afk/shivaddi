"use server";

import { headers } from "next/headers";
import { contactSchema } from "@/lib/validation/schemas";
import { sendContactEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export type ContactActionResult = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitContactAction(
  _prevState: ContactActionResult,
  formData: FormData,
): Promise<ContactActionResult> {
  const input = Object.fromEntries(
    Array.from(formData.entries()).map(([k, v]) => [
      k,
      typeof v === "string" ? v : "",
    ]),
  ) as unknown as {
    name: string;
    email: string;
    phone: string;
    subject?: string;
    message: string;
    website?: string;
  };
  return submitContact(input);
}

export async function submitContact(
  input: { name: string; email: string; phone: string; subject?: string; message: string; website?: string },
): Promise<ContactActionResult> {
  const reqHeaders = await headers();
  const ip = getClientIp(reqHeaders);

  if (input.website) {
    return { ok: true, message: "Thanks — your message has been sent." };
  }

  const rl = rateLimit(`contact:${ip}`, 3, 10 * 60 * 1000);
  if (!rl.ok) {
    return {
      ok: false,
      message: "Too many messages from this device. Please try again in a few minutes.",
    };
  }

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors };
  }

  const d = parsed.data;

  try {
    await sendContactEmail({
      name: d.name,
      email: d.email,
      phone: d.phone,
      subject: d.subject || undefined,
      message: d.message,
    });
    return {
      ok: true,
      message:
        "Thank you! Your message has been received. Our team will get back to you within 24 hours.",
    };
  } catch (error) {
    console.error("[contact] Failed to send:", error);
    return {
      ok: false,
      message:
        "Something went wrong. Please try again, or call us directly on the number above.",
    };
  }
}