import { prisma } from "@/lib/prisma";
import LeadsPanel from "@/components/admin/leads-panel";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true, slug: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-charcoal">Leads</h1>
        <p className="mt-1 text-[13px] text-stone">
          {leads.length} B2B enquir{leads.length === 1 ? "y" : "ies"} received.
        </p>
      </div>
      <LeadsPanel leads={leads} />
    </div>
  );
}