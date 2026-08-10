import type { BusinessType } from "@/app/generated/prisma/enums";

export function prismaBusinessTypeToLabel(type: BusinessType): string {
  const labels: Record<BusinessType, string> = {
    BUILDER: "Builder",
    CONTRACTOR: "Contractor",
    ARCHITECT: "Architect",
    INTERIOR_DESIGNER: "Interior Designer",
    DEALER: "Dealer",
    RETAILER: "Retailer",
    REAL_ESTATE: "Real Estate",
    HOTEL: "Hotel / Hospitality",
    OTHER: "Other",
  };
  return labels[type] ?? type;
}

export function prismaLeadStatusToLabel(status: string): string {
  const labels: Record<string, string> = {
    NEW: "New",
    CONTACTED: "Contacted",
    QUALIFIED: "Qualified",
    CONVERTED: "Converted",
    CLOSED: "Closed",
  };
  return labels[status] ?? status;
}

export function prismaPriceTypeToLabel(type: string): string {
  const labels: Record<string, string> = {
    EXACT: "Exact Price",
    FROM: "Starting From",
    ON_REQUEST: "Price on Request",
  };
  return labels[type] ?? type;
}

export function prismaProjectTypeToLabel(type: string): string {
  const labels: Record<string, string> = {
    RESIDENTIAL: "Residential",
    COMMERCIAL: "Commercial",
    HOTEL: "Hotel",
    OFFICE: "Office",
    RETAIL: "Retail",
    OTHER: "Other",
  };
  return labels[type] ?? type;
}