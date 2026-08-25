"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { leadSchema, type LeadFormValues } from "@/lib/validation/schemas";
import { sendB2BInquiryEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { prismaBusinessTypeToLabel } from "@/lib/types";

export type LeadActionResult = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitLeadAction(
  _prevState: LeadActionResult,
  formData: FormData,
): Promise<LeadActionResult> {
  const consent = formData.get("consent") === "on";
  const input = Object.fromEntries(
    Array.from(formData.entries()).map(([k, v]) => [
      k,
      typeof v === "string" ? v : "",
    ]),
  ) as unknown as LeadFormValues & { website?: string };
  return submitLead({ ...input, consent });
}

export async function submitLead(
  input: LeadFormValues & { website?: string },
): Promise<LeadActionResult> {
  const reqHeaders = await headers();
  const ip = getClientIp(reqHeaders);

  // Honeypot: bots fill hidden fields – silently accept but drop.
  if ((input as { website?: string }).website) {
    console.warn("[lead] Honeypot triggered – submission dropped.", { ip });
    return { ok: true, message: "Thank you. Your enquiry has been received." };
  }

  // Anti-spam rate limit: max 3 submissions per 10 minutes per IP.
  const rl = rateLimit(`lead:${ip}`, 3, 10 * 60 * 1000);
  if (!rl.ok) {
    return {
      ok: false,
      message:
        "Too many enquiries from this device. Please try again in a few minutes.",
    };
  }

  const parsed = leadSchema.safeParse(input);
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
    const lead = await prisma.lead.create({
      data: {
        name: d.name,
        company: d.company || null,
        email: d.email,
        phone: d.phone,
        city: d.city || null,
        businessType: d.businessType,
        productId: d.productId || null,
        productName: d.productName || null,
        quantity: d.quantity || null,
        message: d.message || null,
        projectName: d.projectName || null,
        projectLocation: d.projectLocation || null,
        expectedDate: d.expectedDate || null,
        consent: d.consent,
        ip,
      },
    });

    try {
      console.log("[lead] Sending B2B inquiry email to:", process.env.B2B_INQUIRY_EMAIL);
      console.log("[lead] Gmail OAuth configured:", Boolean(process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN));
      await sendB2BInquiryEmail({
        name: lead.name,
        company: lead.company ?? undefined,
        phone: lead.phone,
        email: lead.email,
        city: lead.city ?? undefined,
        businessType: prismaBusinessTypeToLabel(lead.businessType),
        product: lead.productName ?? undefined,
        quantity: lead.quantity ?? undefined,
        projectName: lead.projectName ?? undefined,
        projectLocation: lead.projectLocation ?? undefined,
        expectedDate: lead.expectedDate ?? undefined,
        message: lead.message ?? undefined,
      });
      console.log("[lead] B2B inquiry email sent successfully");
    } catch (emailError) {
      console.error("[lead] Email notification failed:", emailError);
    }

    return {
      ok: true,
      message:
        "Thank you! Your enquiry has been received. Our sales team will get back to you within 24 hours.",
    };
  } catch (dbError) {
    console.error("[lead] Failed to save lead:", dbError);
    return {
      ok: false,
      message:
        "Something went wrong. Please try again, or call us directly on the number above.",
    };
  }
}