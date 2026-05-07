import Link from "next/link";
import { cn } from "@/lib/cn";

export type MetricTone = "red" | "orange" | "blue" | "purple" | "green" | "slate";

const toneStyles: Record<MetricTone, { count: string; chip: string }> = {
  red: { count: "text-brand-red", chip: "bg-brand-red/10 text-brand-red" },
  orange: { count: "text-brand-orange", chip: "bg-brand-orange/10 text-brand-orange" },
  blue: { count: "text-brand-blue", chip: "bg-brand-blue/10 text-brand-blue" },
  purple: { count: "text-[#7C3AED]", chip: "bg-[#7C3AED]/10 text-[#7C3AED]" },
  green: { count: "text-brand-green", chip: "bg-brand-green/10 text-brand-green" },
  slate: { count: "text-slate-950", chip: "bg-slate-950/5 text-slate-950" },
};

export function MetricCard({
  count,
  label,
  summary,
  tone = "slate",
  href,
}: {
  count: number | string;
  label: string;
  summary?: string;
  tone?: MetricTone;
  href?: string;
}) {
  const Tag = href ? Link : "div";
  const styles = toneStyles[tone];
  return (
    <Tag
      href={href as string}
      className={cn(
        "block rounded-card border border-border bg-surface p-5 shadow-sm",
        href && "transition-shadow hover:shadow-md",
      )}
    >
      <div className="flex items-baseline justify-between">
        <span className={cn("text-3xl font-bold tracking-tight", styles.count)}>
          {count}
        </span>
        <span
          className={cn(
            "rounded-chip px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
            styles.chip,
          )}
        >
          {label}
        </span>
      </div>
      {summary ? (
        <p className="mt-2 text-sm text-muted">{summary}</p>
      ) : null}
      {href ? (
        <p className="mt-3 text-xs font-medium text-brand-blue">View →</p>
      ) : null}
    </Tag>
  );
}
