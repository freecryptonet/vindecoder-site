import { cn } from "@/lib/cn";

/**
 * Compact license-plate-styled badge for a US state abbreviation.
 * Used on /license-plate/[state] pages to give them visual identity
 * without shipping 51 SVG state flags (heavy + maintenance).
 */
export function StateBadge({
  abbr,
  name,
  size = "md",
  className,
}: {
  abbr: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims =
    size === "lg"
      ? { w: 88, h: 56, abbrSize: "text-2xl", nameSize: "text-[10px]" }
      : size === "md"
        ? { w: 64, h: 40, abbrSize: "text-base", nameSize: "text-[9px]" }
        : { w: 44, h: 28, abbrSize: "text-xs", nameSize: "hidden" };
  return (
    <span
      className={cn(
        "inline-flex flex-col items-center justify-center rounded-card border-2 border-slate-950/80 bg-yellow-50 px-2 font-bold leading-none text-slate-950 shadow-sm",
        className,
      )}
      style={{ width: dims.w, height: dims.h }}
      aria-label={name || abbr}
    >
      <span className={cn("vin-mono tracking-wider", dims.abbrSize)}>
        {abbr}
      </span>
      {name && size !== "sm" ? (
        <span
          className={cn(
            "mt-0.5 truncate uppercase tracking-wider text-slate-600",
            dims.nameSize,
          )}
          style={{ maxWidth: dims.w - 8 }}
        >
          {name}
        </span>
      ) : null}
    </span>
  );
}
