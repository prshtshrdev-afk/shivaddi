"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Inbox,
  FileText,
  HardHat,
  Images,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/projects", label: "Projects", icon: HardHat },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({
  user,
  children,
}: {
  user: { name?: string | null; email?: string | null };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/admin-login");
    router.refresh();
  }

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-[2px] px-4 py-2.5 text-[13px] font-medium transition-colors",
            isActive(item)
              ? "bg-gold/15 text-gold"
              : "text-white/60 hover:bg-white/5 hover:text-white",
          )}
        >
          <item.icon className="h-4.5 w-4.5" />
          {item.label}
        </Link>
      ))}
      <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-[2px] px-4 py-2.5 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-4.5 w-4.5" />
          View Site
        </a>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-[2px] px-4 py-2.5 text-[13px] font-medium text-red-300/80 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4.5 w-4.5" />
          Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-charcoal lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/admin" className="block">
            <p className="font-serif text-lg font-bold leading-tight text-white">
              Shiv Aadi
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-gold">
              Admin Panel
            </p>
          </Link>
        </div>
        {nav}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-charcoal px-4 py-3 lg:hidden">
        <Link href="/admin">
          <p className="font-serif text-base font-bold text-white">Shiv Aadi</p>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center text-white"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-charcoal">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <p className="font-serif font-bold text-white">
                Shiv Aadi&nbsp;<span className="text-gold">Admin</span>
              </p>
              <button
                onClick={() => setOpen(false)}
                className="text-white/60"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 hidden items-center justify-between border-b border-stone-200 bg-white/90 px-8 py-3.5 backdrop-blur lg:flex">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
            {NAV.find((n) => isActive(n))?.label ?? "Admin"}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
              {(user.name ?? user.email ?? "A")[0].toUpperCase()}
            </div>
            <div className="text-right">
              <p className="text-[12px] font-semibold text-charcoal">
                {user.name}
              </p>
              <p className="text-[11px] text-stone">{user.email}</p>
            </div>
          </div>
        </header>
        <main className="px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}