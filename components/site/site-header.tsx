"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Phone,
  Clock,
  MapPin,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  MessageCircle,
  Search,
  Camera,
} from "lucide-react";
import Logo from "./logo";
import { cn } from "@/lib/utils";
import type { Category } from "@/app/generated/prisma/client";

type ContactInfo = {
  phoneDisplay: string;
  whatsapp: string;
  hours: string;
  address: string;
  email: string;
};

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Projects", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function SiteHeader({
  categories,
  contact,
}: {
  categories: (Category & { children: Category[] })[];
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
    <header className="sticky top-0 z-50 w-full bg-charcoal text-white shadow-[0_1px_0_rgb(255_204_0/0.25)]">
      {/* ── Top bar ─────────────────────────────── */}
      <div className="border-b border-white/10 bg-onyx">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white/60 sm:px-6">
          <div className="hidden min-w-0 items-center gap-5 lg:flex">
            <span className="inline-flex min-w-0 items-center gap-1.5 truncate">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
              <span className="truncate">{contact.address}</span>
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Clock className="h-3.5 w-3.5 shrink-0 text-gold" />
              <span className="truncate">{contact.hours}</span>
            </span>
            <a
              href={`tel:${contact.phoneDisplay.replace(/[^0-9+]/g, "")}`}
              className="inline-flex items-center gap-1.5 text-white transition-colors hover:text-gold"
            >
              <Phone className="h-3.5 w-3.5 text-gold" />
              {contact.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* ── Main bar ────────────────────────────── */}
      <div className="relative z-50 border-b border-white/10 bg-charcoal/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button
            type="button"
            className="text-white/80 transition-colors hover:text-gold lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Logo dark className="shrink-0" />

          {/* Desktop search - large prominent search */}
          <form
            action="/search"
            className="relative mx-3 hidden max-w-xl flex-1 min-w-0 xl:block"
            role="search"
          >
            <label className="relative block">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                name="q"
                type="search"
                placeholder="Search tiles, marble, sanitaryware, granite…"
                aria-label="Search products"
                className="h-12 w-full rounded-[2px] border border-white/15 bg-onyx pl-14 pr-12 text-base text-white placeholder:text-white/35 transition-colors duration-300 focus:border-gold focus:outline-none"
              />
            </label>
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center text-white/50 transition-colors hover:text-gold"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-4 text-[11px] font-medium uppercase tracking-[0.12em] xl:gap-6 xl:text-[12px] xl:tracking-[0.16em] lg:flex">
            {NAV_ITEMS.slice(0, 2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/80 transition-colors hover:text-gold"
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
                  "inline-flex items-center gap-1 text-white/80 transition-colors hover:text-gold",
                  openCategories && "text-gold",
                )}
              >
                Categories
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-300",
                    openCategories && "rotate-180",
                  )}
                />
              </button>
              {openCategories && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-4">
                  <div className="w-[720px] border border-gold/20 bg-charcoal p-6 shadow-2xl">
                    <div className="grid grid-cols-3 gap-x-8 gap-y-5">
                      {categories.map((cat) => (
                        <div key={cat.id}>
                          <Link
                            href={`/categories/${cat.slug}`}
                            className="font-serif text-sm font-semibold uppercase tracking-wide text-gold transition-colors hover:text-gold-light"
                          >
                            {cat.name}
                          </Link>
                          {cat.children.length > 0 && (
                            <ul className="mt-2 space-y-1.5">
                              {cat.children.map((child) => (
                                <li key={child.id}>
                                  <Link
                                    href={`/categories/${child.slug}`}
                                    className="text-[12px] text-white/65 transition-colors hover:text-white"
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
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-gold transition-colors hover:text-gold-light"
                      >
                        View all products
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {NAV_ITEMS.slice(2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/80 transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/#try-in-your-room"
              className="hidden items-center gap-2 rounded-md border border-gold/60 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold transition-all duration-300 hover:bg-gold hover:text-charcoal 2xl:inline-flex"
            >
              <Camera className="h-4 w-4" />
              Try in Your Room
            </Link>
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-md bg-gold px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-charcoal transition-all duration-300 hover:bg-gold-light hover:shadow-gold sm:inline-flex"
              >
                <MessageCircle className="h-4 w-4" />
                Get Quote
              </a>
            )}
            <a
              href={`tel:${contact.phoneDisplay.replace(/[^0-9+]/g, "")}`}
              className="hidden items-center gap-2 rounded-md border border-white/25 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:border-gold hover:text-gold xl:inline-flex"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────── */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-charcoal lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
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
                  Categories
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
                        {cat.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/categories/${child.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="block py-1.5 pl-4 text-[12px] text-white/50 transition-colors hover:text-gold"
                          >
                            <ChevronRight className="mr-1 inline h-3 w-3" />
                            {child.name}
                          </Link>
                        ))}
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