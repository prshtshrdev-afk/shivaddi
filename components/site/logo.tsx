import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/shivadii-logo.webp"
      alt="Shiv Aadi Logo"
      width={48}
      height={48}
      className={cn("transition-transform duration-300 group-hover:scale-105", className)}
      aria-hidden
    />
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