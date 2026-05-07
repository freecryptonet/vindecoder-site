import Link from "next/link";
import { cn } from "@/lib/cn";

export type ComplaintItemData = {
  odiNumber: string;
  date: string;
  summary: string;
  flags?: { crash?: boolean; fire?: boolean; injury?: boolean };
  href?: string;
};

export function ComplaintItem({ complaint }: { complaint: ComplaintItemData }) {
  const flags = complaint.flags ?? {};
  const Tag = complaint.href ? Link : "div";
  return (
    <Tag
      href={complaint.href as string}
      className={cn(
        "block border-b border-border p-4 last:border-b-0",
        complaint.href && "hover:bg-surface-alt transition-colors",
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="vin-mono text-xs font-semibold text-brand-orange">
          ODI {complaint.odiNumber}
        </span>
        <time className="text-xs text-muted">{complaint.date}</time>
      </div>
      <p className="mt-1 line-clamp-3 text-sm text-slate-950">
        {complaint.summary}
      </p>
      {flags.crash || flags.fire || flags.injury ? (
        <div className="mt-2 flex gap-1.5">
          {flags.crash ? <Flag tone="red">Crash</Flag> : null}
          {flags.fire ? <Flag tone="red">Fire</Flag> : null}
          {flags.injury ? <Flag tone="orange">Injury</Flag> : null}
        </div>
      ) : null}
    </Tag>
  );
}

function Flag({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "red" | "orange";
}) {
  const cls =
    tone === "red"
      ? "bg-brand-red/10 text-brand-red"
      : "bg-brand-orange/10 text-brand-orange";
  return (
    <span
      className={cn(
        "rounded-chip px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        cls,
      )}
    >
      {children}
    </span>
  );
}
