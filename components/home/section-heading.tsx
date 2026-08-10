import { cn } from "@/lib/utils";
import Reveal from "@/components/site/reveal";

export default function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  dark = false,
  className,
}: {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mb-12 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {kicker && (
        <p className={cn("section-kicker mb-3", align === "center" && "mx-auto text-center")}>
          {kicker}
        </p>
      )}
      <h2
        className={cn(
          "display font-bold",
          dark ? "text-white" : "text-charcoal",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-[15px] leading-relaxed",
            dark ? "text-white/60" : "text-stone",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}