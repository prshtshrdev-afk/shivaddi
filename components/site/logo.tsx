import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-12 w-12 items-center justify-center border border-gold/60 bg-charcoal text-[15px] font-bold tracking-tight text-gold",
        className,
      )}
      aria-hidden
    >
      <span className="font-display">SA</span>
      <span className="absolute -left-1 -top-1 h-2 w-2 border-l border-t border-gold" />
      <span className="absolute -bottom-1 -right-1 h-2 w-2 border-b border-r border-gold" />
    </span>
  );
}

export default function Logo({
  dark = false,
  className,
}: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-3",
        className,
      )}
      aria-label="Shiv Aadi – Mithila Tiles & Marbles House – Home"
    >
      <LogoMark className="transition-transform duration-300 group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-2xl font-bold tracking-wide",
            dark ? "text-white" : "text-charcoal",
          )}
        >
          SHIV <span className="text-gold">AADI</span>
        </span>
        <span
          className={cn(
            "mt-1 text-[10px] font-medium uppercase tracking-[0.24em]",
            dark ? "text-white/60" : "text-charcoal/60",
          )}
        >
          Mithila Tiles &amp; Marbles House
        </span>
      </span>
    </Link>
  );
}