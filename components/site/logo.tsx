import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function LogoMark({ className, width = 160, height = 160 }: { className?: string; width?: number; height?: number }) {
  return (
    <Image
      src="/shivadii-logo.jpg"
      alt="Shiv Aadi Logo"
      width={width}
      height={height}
      className={cn("transition-transform duration-300 group-hover:scale-105", className)}
      aria-hidden
    />
  );
}

export function LogoMarkResponsive({ className }: { className?: string }) {
  return (
    <div className={cn("w-[70px] h-[70px] lg:w-[160px] lg:h-[160px]", className)}>
      <Image
        src="/shivadii-logo.jpg"
        alt="Shiv Aadi Logo"
        fill
        sizes="(max-width: 1023px) 70px, 160px"
        className="object-contain transition-transform duration-300 group-hover:scale-105"
        aria-hidden
      />
    </div>
  );
}

export default function Logo({
  className,
  responsive = false,
}: {
  className?: string;
  responsive?: boolean;
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
      {responsive ? <LogoMarkResponsive /> : <LogoMark />}
    </Link>
  );
}