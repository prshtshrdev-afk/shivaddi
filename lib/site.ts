import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  BUSINESS_TYPES,
  PROJECT_TYPES,
  PRICE_TYPES,
  LEAD_STATUSES,
} from "@/lib/constants";

export { BUSINESS_TYPES, PROJECT_TYPES, PRICE_TYPES, LEAD_STATUSES };

export type SiteSettings = Record<string, string>;

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const rows = await prisma.siteSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
});

export const getSiteSetting = async (key: string) => {
  const settings = await getSiteSettings();
  return settings[key] ?? "";
};

export const getPageContent = cache(
  async (page: string, section: string) => {
    try {
      const rows = await prisma.pageContent.findMany({
        where: { page, section },
        select: { key: true, content: true },
      });
      return Object.fromEntries(rows.map((r) => [r.key, r.content]));
    } catch {
      return {};
    }
  },
);

export async function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "";
  return url || "http://localhost:3000";
}

export async function getContactInfo(settings: SiteSettings = {}) {
  const s = Object.keys(settings).length ? settings : await getSiteSettings();
  return {
    companyName: s["companyName"] || "Shiv Aadi",
    companyLegalName: s["companyLegalName"] || "SHIV AADI MITHILA TILES & MARBLES HOUSE",
    gstin: s["gstin"] || "",
    tagline: s["companyTagline"] || "Mithila Tiles & Marbles House",
    phone: s["phone"] || "",
    phoneDisplay: s["phoneDisplay"] || s["phone"] || "",
    whatsapp: s["whatsapp"] || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
    email: s["email"] || "",
    b2bEmail: s["b2bEmail"] || "",
    address: s["address"] || "",
    addressShort: s["addressShort"] || s["address"] || "",
    mapsUrl: s["mapsUrl"] || "",
    hours: s["hours"] || "Mon – Sat: 9:00 AM – 8:00 PM",
    instagram: s["instagram"] || "",
    facebook: s["facebook"] || "",
    youtube: s["youtube"] || "",
  };
}

export function getWhatsaAppLink(number: string, text?: string) {
  const clean = number.replace(/[^0-9]/g, "");
  if (!clean) return "";
  const params = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${clean}${params}`;
}