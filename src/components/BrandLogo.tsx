import { cn } from "@/lib/cn";

export function BrandLogo({
  make,
  size = 48,
  className,
}: {
  make: string;
  size?: number;
  className?: string;
}) {
  const initials = make
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-card border border-border bg-surface-alt font-bold text-slate-950",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.32) }}
      aria-label={make}
    >
      {initials || "?"}
    </span>
  );
}
