"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Phone, MapPin, Building2, Package, Loader2, Trash2, ExternalLink } from "lucide-react";
import { updateLeadStatus, deleteLead } from "@/lib/actions/admin";
import {
  prismaBusinessTypeToLabel,
  prismaLeadStatusToLabel,
} from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type LeadRow = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  city: string | null;
  businessType: "BUILDER" | "CONTRACTOR" | "ARCHITECT" | "INTERIOR_DESIGNER" | "DEALER" | "RETAILER" | "REAL_ESTATE" | "HOTEL" | "OTHER";
  productId: string | null;
  productName: string | null;
  product: { name: string; slug: string } | null;
  quantity: string | null;
  message: string | null;
  projectName: string | null;
  projectLocation: string | null;
  expectedDate: string | null;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "CLOSED";
  createdAt: Date;
};

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "CLOSED"] as const;
const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-gold/20 text-gold-dark border-gold/40",
  CONTACTED: "bg-blue-100 text-blue-800 border-blue-200",
  QUALIFIED: "bg-purple-100 text-purple-800 border-purple-200",
  CONVERTED: "bg-green-100 text-green-800 border-green-200",
  CLOSED: "bg-stone-100 text-stone border-stone-200",
};

export default function LeadsPanel({ leads }: { leads: LeadRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (statusFilter === "ALL" ? leads : leads.filter((l) => l.status === statusFilter)),
    [leads, statusFilter],
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: leads.length };
    for (const s of STATUSES) c[s] = leads.filter((l) => l.status === s).length;
    return c;
  }, [leads]);

  function onStatusChange(id: string, status: LeadRow["status"]) {
    startTransition(async () => {
      await updateLeadStatus(id, status);
      router.refresh();
    });
  }

  function onDelete(id: string, name: string) {
    if (!confirm(`Delete enquiry from "${name}"?`)) return;
    startTransition(async () => {
      await deleteLead(id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {["ALL", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors",
              statusFilter === s
                ? "border-gold bg-gold text-charcoal"
                : "border-stone-300 bg-white text-stone hover:border-gold/60 hover:text-gold-dark",
            )}
          >
            {s === "ALL" ? "All" : prismaLeadStatusToLabel(s)}
            <span className="ml-1.5 opacity-60">{counts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="border border-stone-200 bg-white px-8 py-20 text-center text-sm text-stone">
            No enquiries match this filter.
          </div>
        )}

        {filtered.map((lead) => (
          <div key={lead.id} className="border border-stone-200 bg-white">
            <div className="flex flex-wrap items-start gap-4 px-6 py-4">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal text-sm font-bold text-gold">
                {lead.name[0].toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-serif text-base font-bold text-charcoal">
                    {lead.name}
                  </p>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]",
                      STATUS_STYLES[lead.status],
                    )}
                  >
                    {prismaLeadStatusToLabel(lead.status)}
                  </span>
                  <span className="text-[11px] text-stone">
                    {formatDate(lead.createdAt)}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-stone">
                  {lead.company && (
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-gold-dark" />
                      {lead.company}
                    </span>
                  )}
                  <span>{prismaBusinessTypeToLabel(lead.businessType)}</span>
                  {lead.city && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gold-dark" />
                      {lead.city}
                    </span>
                  )}
                  {lead.quantity && <span>Qty: {lead.quantity}</span>}
                  {lead.expectedDate && <span>Wanted by: {lead.expectedDate}</span>}
                  {lead.projectName && <span>Project: {lead.projectName}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={lead.status}
                  onChange={(e) => onStatusChange(lead.id, e.target.value as LeadRow["status"])}
                  className="border border-stone-300 bg-white px-3 py-2 text-[12px] text-charcoal focus:border-gold focus:outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {prismaLeadStatusToLabel(s)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => onDelete(lead.id, lead.name)}
                  title="Delete lead"
                  className="flex h-8 w-8 items-center justify-center rounded-[2px] text-stone transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-stone-100 bg-stone-50/60 px-6 py-3 text-[12px]">
              <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 text-charcoal/75 hover:text-gold-dark">
                <Mail className="h-3.5 w-3.5 text-gold-dark" /> {lead.email}
              </a>
              <a href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`} className="inline-flex items-center gap-1.5 text-charcoal/75 hover:text-gold-dark">
                <Phone className="h-3.5 w-3.5 text-gold-dark" /> {lead.phone}
              </a>
              {lead.productName && (
                <span className="inline-flex items-center gap-1.5 text-charcoal/75">
                  <Package className="h-3.5 w-3.5 text-gold-dark" /> {lead.productName}
                </span>
              )}
              {lead.product?.slug && (
                <Link
                  href={`/products/${lead.product.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-gold-dark hover:text-gold"
                >
                  View product <ExternalLink className="h-3 w-3" />
                </Link>
              )}
              {lead.projectLocation && (
                <span className="inline-flex items-center gap-1.5 text-charcoal/75">
                  <MapPin className="h-3.5 w-3.5 text-gold-dark" /> {lead.projectLocation}
                </span>
              )}
            </div>

            {lead.message && (
              <button
                onClick={() => setOpenId(openId === lead.id ? null : lead.id)}
                className="block w-full border-t border-stone-100 px-6 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-stone transition-colors hover:text-gold-dark"
              >
                {openId === lead.id ? "Hide message" : "Show message"}
              </button>
            )}
            {openId === lead.id && lead.message && (
              <p className="border-t border-stone-100 bg-white px-6 py-4 text-[13px] leading-relaxed text-charcoal/80">
                {lead.message}
              </p>
            )}
          </div>
        ))}
      </div>

      {pending && (
        <p className="flex items-center gap-2 text-[11px] text-stone">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Updating…
        </p>
      )}
    </div>
  );
}