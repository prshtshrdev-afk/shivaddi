"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Phone,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  MessageCircle,
  Search,
  MapPin,
} from "lucide-react";
import { LogoMark } from "./logo";
import { cn } from "@/lib/utils";
import type { Category } from "@/app/generated/prisma/client";

type ContactInfo = {
  phoneDisplay: string;
  whatsapp: string;
  hours: string;
  address: string;
  email: string;
};

const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "PRODUCTS", href: "/products" },
  { label: "PROJECTS", href: "/projects" },
  { label: "GALLERY", href: "/gallery" },
  { label: "BLOG", href: "/blog" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

const ADDRESS = "ANUMANDAL ROAD, BENIPATTI, NEAR ADITYA VISION & REGISTRY OFFICE, MADHUBANI, BIHAR";
const PHONES = "+91 85952 53597 / +91 80803 53597";

export default function SiteHeader({
  categories,
  contact,
}: {
  categories: (Category & { children: Category[]; _count?: { products: number } })[];
  contact: ContactInfo;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  const waLink = contact.whatsapp
    ? `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        "Hello Shiv Aadi! I'd like to enquire about tiles & marble.",
      )}`
    : "";

  return (
    <header className="sticky top-0 z-50 w-full bg-charcoal text-white">
      {/* ── 1. Top Information Bar ─────────────────────────────── */}
      <div className="hidden md:flex md:items-center md:justify-between md:px-6 md:py-1 border-b border-white/10 bg-onyx text-[9px] uppercase tracking-[0.14em] text-white/60 lg:px-8 lg:py-1.5 lg:text-[10px]">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gold flex-shrink-0" />
          <span className="truncate">{ADDRESS}</span>
        </div>
        <div className="flex items-center gap-4 ml-auto flex-shrink-0">
          <a
            href={`tel:${PHONES.split(" / ")[0].replace(/[^0-9+]/g, "")}`}
            className="inline-flex items-center gap-1.5 text-white transition-colors hover:text-gold whitespace-nowrap"
          >
            <Phone className="h-3.5 w-3.5 text-gold" />
            <span>{PHONES}</span>
          </a>
        </div>
      </div>

      {/* ── 2. Main Brand / Search / CTA Bar ────────────────────── */}
      <div className="relative z-50 border-b border-white/10 bg-charcoal/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2 lg:px-8 lg:py-2.5">
          {/* Left: Logo + Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:gap-4">
            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center text-white/80 transition-colors hover:text-gold md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
            <div className="flex-1 flex justify-center md:justify-start md:flex-none">
              <LogoMark className="h-16 w-20 shrink-0 md:h-16 md:w-20 lg:h-[90px] lg:w-[120px]" />
            </div>
            <div className="w-11 md:hidden" />
          </div>

          {/* Center: Search Box */}
          <form
            action="/search"
            className="hidden md:flex flex-1 max-w-md mx-4 relative lg:max-w-lg"
            role="search"
          >
            <label className="relative block w-full">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                name="q"
                type="search"
                placeholder="Search tiles, marble, sanitaryware…"
                aria-label="Search products"
                className="h-11 w-full rounded-[2px] border border-white/15 bg-onyx pl-12 pr-4 text-sm text-white placeholder:text-white/35 transition-colors duration-300 focus:border-gold focus:outline-none lg:h-12 lg:text-base"
              />
            </label>
          </form>

          {/* Right: CALL NOW button */}
          <div className="flex items-center flex-shrink-0">
            <a
              href={`tel:${contact.phoneDisplay.replace(/[^0-9+]/g, "")}`}
              className="hidden md:inline-flex items-center gap-2 rounded-[2px] border border-white/25 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:border-gold hover:text-gold lg:px-5 lg:py-2.5 lg:text-[11px]"
            >
              <Phone className="h-4 w-4" />
              CALL NOW
            </a>
          </div>
        </div>
      </div>

      {/* ── 3. Navigation Bar ───────────────────────────────────── */}
      <div className="hidden md:flex md:items-center md:justify-center md:gap-1 md:px-6 md:py-1 border-b border-white/10 bg-charcoal text-[10px] font-medium uppercase tracking-[0.12em] lg:px-8 lg:py-1.5 lg:text-[11px] lg:gap-1.5">
        {NAV_ITEMS.slice(0, 2).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-2.5 py-1.5 text-white/80 transition-colors hover:text-gold lg:px-3 lg:py-2"
          >
            {item.label}
          </Link>
        ))}

        {/* Categories dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setOpenCategories(true)}
          onMouseLeave={() => setOpenCategories(false)}
        >
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1.5 text-white/80 transition-colors hover:text-gold lg:px-3 lg:py-2",
              openCategories && "text-gold",
            )}
          >
            CATEGORIES
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-300",
                openCategories && "rotate-180",
              )}
            />
          </button>
{openCategories && (
            <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3 z-[100]">
              <div className="w-[1000px] max-w-[calc(100vw-40px)] overflow-hidden rounded-xl border border-white/10 bg-charcoal shadow-2xl">
                <div className="max-h-[450px] overflow-x-hidden overflow-y-auto p-7 custom-scrollbar">
                  <div className="grid grid-cols-5 gap-x-8 gap-y-8">
                    {categories.map((cat) => (
                      <div key={cat.id} className="min-w-0">
                        <Link
                          href={`/categories/${cat.slug}`}
                          className="font-serif text-sm font-semibold uppercase tracking-wide text-gold transition-colors hover:text-gold-light block pb-2 border-b border-white/10 mb-3"
                        >
                          {cat.name}
                        </Link>
                        {cat.children.length > 0 && (
                          <ul className="space-y-2">
                            {cat.children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={`/categories/${child.slug}`}
                                  className="block break-words text-xs leading-relaxed text-white/70 transition-colors hover:text-gold"
                                >
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-white/10 px-6 py-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold transition-colors hover:text-gold-light"
                  >
                    View all products
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {NAV_ITEMS.slice(3).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-2.5 py-1.5 text-white/80 transition-colors hover:text-gold lg:px-3 lg:py-2"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* ── Mobile Menu ────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-charcoal">
          <nav className="mx-auto max-w-7xl px-5 py-4">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 text-[13px] font-medium uppercase tracking-[0.14em] text-white/85 transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => setMobileCategoryOpen((v) => !v)}
                  className="flex w-full items-center justify-between py-2.5 text-left text-[13px] font-medium uppercase tracking-[0.14em] text-white/85 transition-colors hover:text-gold"
                >
                  CATEGORIES
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      mobileCategoryOpen && "rotate-180",
                    )}
                  />
                </button>
                {mobileCategoryOpen && (
                  <ul className="ml-4 space-y-1 border-l border-white/10 pl-4">
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          href={`/categories/${cat.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 text-[13px] text-white/70 transition-colors hover:text-gold"
                        >
                          {cat.name}
                        </Link>
                        {cat.children.length > 0 && (
                          <ul className="mt-1 space-y-1 pl-2 border-l border-white/10 ml-2">
                            {cat.children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={`/categories/${child.slug}`}
                                  onClick={() => setMobileOpen(false)}
                                  className="block py-1.5 pl-2 text-[11px] text-white/50 transition-colors hover:text-gold"
                                >
                                  <ChevronRight className="mr-1 inline h-3 w-3" />
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
              <a
                href={`tel:${contact.phoneDisplay.replace(/[^0-9+]/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-white/25 px-5 py-3 text-[12px] font-bold uppercase tracking-[0.16em] text-white"
              >
                <Phone className="h-4 w-4" />
                {contact.phoneDisplay}
              </a>
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-gold px-5 py-3 text-[12px] font-bold uppercase tracking-[0.16em] text-charcoal"
                >
                  <MessageCircle className="h-4 w-4" />
                  Get B2B Quote
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}