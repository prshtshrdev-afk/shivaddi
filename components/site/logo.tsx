import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/shivadii-logo.png"
      alt="Shiv Aadi Logo"
      width={72}
      height={72}
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
    </Link>
  );
}