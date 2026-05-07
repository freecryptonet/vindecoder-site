import Link from "next/link";
import { cn } from "@/lib/cn";

export function YearPill({
  year,
  href,
  active = false,
}: {
  year: number;
  href?: string;
  active?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center rounded-chip px-2.5 py-1 text-xs font-semibold tabular-nums transition-colors";
  const filled = "bg-slate-950 text-white";
  const outline =
    "border border-border bg-surface text-slate-950 hover:border-slate-950";

  if (!href) {
    return <span className={cn(base, active ? filled : outline)}>{year}</span>;
  }
  return (
    <Link href={href} className={cn(base, active ? filled : outline)}>
      {year}
    </Link>
  );
}
