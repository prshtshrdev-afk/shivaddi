export const BUSINESS_TYPES = [
  { value: "BUILDER", label: "Builder" },
  { value: "CONTRACTOR", label: "Contractor" },
  { value: "ARCHITECT", label: "Architect" },
  { value: "INTERIOR_DESIGNER", label: "Interior Designer" },
  { value: "DEALER", label: "Dealer" },
  { value: "RETAILER", label: "Retailer" },
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "HOTEL", label: "Hotel / Hospitality" },
  { value: "OTHER", label: "Other" },
] as const;

export const PROJECT_TYPES = [
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "HOTEL", label: "Hotel" },
  { value: "OFFICE", label: "Office" },
  { value: "RETAIL", label: "Retail" },
  { value: "OTHER", label: "Other" },
] as const;

export const PRICE_TYPES = [
  { value: "EXACT", label: "Exact Price" },
  { value: "FROM", label: "Starting From" },
  { value: "ON_REQUEST", label: "Price on Request" },
] as const;

export const LEAD_STATUSES = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "CONVERTED", label: "Converted" },
  { value: "CLOSED", label: "Closed" },
] as const;