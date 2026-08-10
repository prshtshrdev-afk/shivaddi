import Link from "next/link";
import {
  Package,
  FolderTree,
  Inbox,
  FileText,
  HardHat,
  Images,
  ArrowRight,
  CircleDollarSign,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { prismaBusinessTypeToLabel, prismaLeadStatusToLabel } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [products, publishedProducts, categories, leads, newLeads, blogPosts, projects, gallery] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { published: true } }),
      prisma.category.count(),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.blogPost.count(),
      prisma.project.count(),
      prisma.galleryImage.count(),
    ]);

  const recentLeads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { product: { select: { name: true } } },
  });

  const stats = [
    { label: "Products", value: products, sub: `${publishedProducts} published`, href: "/admin/products", icon: Package },
    { label: "Categories", value: categories, sub: "catalog groups", href: "/admin/categories", icon: FolderTree },
    { label: "Leads", value: leads, sub: `${newLeads} new`, href: "/admin/leads", icon: Inbox, accent: newLeads > 0 },
    { label: "Blog Posts", value: blogPosts, sub: "articles", href: "/admin/blog", icon: FileText },
    { label: "Projects", value: projects, sub: "case studies", href: "/admin/projects", icon: HardHat },
    { label: "Gallery", value: gallery, sub: "images", href: "/admin/gallery", icon: Images },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-charcoal">Dashboard</h1>
        <p className="mt-1 text-[13px] text-stone">
          Overview of the store at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`group border bg-white p-5 transition-all duration-300 hover:shadow-card ${
              s.accent ? "border-gold" : "border-stone-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <s.icon className="h-5 w-5 text-gold-dark" />
              <ArrowRight className="h-3.5 w-3.5 text-stone transition-transform group-hover:translate-x-0.5 group-hover:text-gold-dark" />
            </div>
            <p className="mt-4 font-serif text-3xl font-bold text-charcoal">
              {s.value}
            </p>
            <p className="mt-0.5 text-[12px] font-semibold text-charcoal/70">
              {s.label}
            </p>
            <p className="text-[11px] text-stone">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="border border-stone-200 bg-white">
          <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
            <h2 className="font-serif text-lg font-bold text-charcoal">
              Recent Leads
            </h2>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-dark hover:text-gold"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <CircleDollarSign className="h-8 w-8 text-stone/40" />
              <p className="mt-3 text-sm text-stone">
                No enquiries yet. Once the B2B form goes live, leads will
                appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="flex items-center gap-4 px-6 py-4">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${
                      lead.status === "NEW" ? "bg-gold text-charcoal" : "bg-stone-300 text-charcoal"
                    }`}
                  >
                    {lead.name[0].toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-charcoal">
                      {lead.name}
                      {lead.company ? ` · ${lead.company}` : ""}
                    </p>
                    <p className="truncate text-[12px] text-stone">
                      {prismaBusinessTypeToLabel(lead.businessType)}
                      {lead.product?.name ? ` — ${lead.product.name}` : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                      {formatDate(lead.createdAt)}
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-dark">
                      {prismaLeadStatusToLabel(lead.status)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <div className="border border-stone-200 bg-white p-6">
            <h2 className="font-serif text-lg font-bold text-charcoal">
              Quick Actions
            </h2>
            <div className="mt-4 space-y-2.5">
              {[
                { href: "/admin/products/new", label: "Add Product" },
                { href: "/admin/categories/new", label: "Add Category" },
                { href: "/admin/blog/new", label: "Write Post" },
                { href: "/admin/projects/new", label: "Add Project" },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center justify-between rounded-[2px] border border-stone-200 px-4 py-3 text-[13px] font-medium text-charcoal transition-colors hover:border-gold hover:text-gold-dark"
                >
                  {a.label}
                  <ArrowRight className="h-4 w-4 text-stone" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}