import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  Camera,
  Search,
  FileText,
  ShieldCheck,
  Home,
} from "lucide-react";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "./social-icons";
import { prisma } from "@/lib/prisma";
import { getContactInfo } from "@/lib/site";
import { LogoMark } from "./logo";
import Newsletter from "@/components/home/newsletter";

export default async function Footer() {
  const s = await getContactInfo();
  const currentYear = new Date().getFullYear();

  const categories = await prisma.category.findMany({
    where: { published: true, parentId: null },
    orderBy: { displayOrder: "asc" },
    include: {
      children: { where: { published: true }, orderBy: { displayOrder: "asc" } },
    },
  });

  const areaLinks = categories
    .flatMap((c) => c.children)
    .slice(0, 6)
    .map((child) => ({ label: child.name, href: `/categories/${child.slug}` }));

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Our Projects", href: "/projects" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog & Trends", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
  ];

  const toolsLinks = [
    { label: "Try in Your Room", href: "/#try-in-your-room", icon: Camera },
    { label: "Search the Catalogue", href: "/search", icon: Search },
    { label: "Get B2B Quote", href: "/b2b-quote", icon: FileText },
    { label: "Plan a Showroom Visit", href: "/contact", icon: Home },
  ];

  const policyLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="bg-charcoal text-white">
      {/* ── Newsletter ───────────────────────────── */}
      <Newsletter />

      {/* ── CTA band ─────────────────────────────── */}
      <div className="border-b border-white/10 bg-onyx">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-12 sm:px-6 lg:flex-row">
          <div className="text-center lg:text-left">
            <p className="section-kicker mb-2">B2B &amp; Project Sales</p>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Looking for Tiles &amp; Marble for Your{" "}
              <span className="text-gold">Next Project?</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/60">
              Get competitive wholesale pricing, expert material guidance and
              reliable supply for projects of every scale across Bihar &amp;
              Jharkhand.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <a href="/b2b-quote" className="btn-gold">
              Get B2B Quote
            </a>
            <a
              href={`tel:${s.phone.replace(/[^0-9+]/g, "")}`}
              className="btn-outline-light"
            >
              <Phone className="h-4 w-4" />
              {s.phoneDisplay || s.phone || "Call Us"}
            </a>
          </div>
        </div>
      </div>

      {/* ── Main footer ──────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-12">
{/* Brand */}
          <div className="lg:col-span-3">
            <LogoMark className="h-16 w-16" />
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              Premium tiles, marble, granite and sanitaryware for homes and
              businesses across India. A decade of trusted supply to builders,
              architects and dealers.
            </p>
            <ul className="mt-6 space-y-3.5 text-sm text-white/65">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{s.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a
                  href={`tel:${s.phone.replace(/[^0-9+]/g, "")}`}
                  className="transition-colors hover:text-gold"
                >
                  {s.phoneDisplay || s.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a
                  href={`mailto:${s.email}`}
                  className="transition-colors hover:text-gold"
                >
                  {s.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{s.hours}</span>
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-3">
              {s.instagram && (
                <a
                  href={s.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-white/70 transition-all duration-300 hover:border-gold hover:bg-gold hover:text-charcoal"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}
              {s.facebook && (
                <a
                  href={s.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-white/70 transition-all duration-300 hover:border-gold hover:bg-gold hover:text-charcoal"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
              )}
              {s.youtube && (
                <a
                  href={s.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-white/70 transition-all duration-300 hover:border-gold hover:bg-gold hover:text-charcoal"
                >
                  <YoutubeIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Tiles by Type */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
              Tiles by Type
            </h3>
            <ul className="mt-5 space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="group inline-flex items-center gap-1 text-sm text-white/65 transition-colors hover:text-gold"
                  >
                    {cat.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-1 text-sm font-semibold text-gold transition-colors hover:text-gold-light"
                >
                  All Products
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Collections by Area */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
              Collections
            </h3>
            <ul className="mt-5 space-y-2.5">
              {areaLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-white/65 transition-colors hover:text-gold"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories/tiles"
                  className="group inline-flex items-center gap-1 text-sm font-semibold text-gold transition-colors hover:text-gold-light"
                >
                  Tiles Collection
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
              Company
            </h3>
            <ul className="mt-5 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-white/65 transition-colors hover:text-gold"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Policies */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
              Tools
            </h3>
            <ul className="mt-5 space-y-2.5">
              {toolsLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-gold"
                    >
                      <Icon className="h-3.5 w-3.5 text-gold/70" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <h3 className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-gold">
              Policies
            </h3>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-white/65 transition-colors hover:text-gold"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-gold/70" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-[11px] uppercase tracking-[0.14em] text-white/40 sm:px-6 md:flex-row">
          <p>
            © {currentYear} {s.companyLegalName}. All
            rights reserved.
          </p>
          <p className="text-white/30">
            {s.gstin ? <>GSTIN: {s.gstin} · </> : null}
            Tiles · Marble · Granite · Sanitaryware
          </p>
        </div>
      </div>
    </footer>
  );
}