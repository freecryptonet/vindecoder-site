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
          {flags.crash ? (
            <Flag tone="red">
              <CrashIcon /> Crash
            </Flag>
          ) : null}
          {flags.fire ? (
            <Flag tone="red">
              <FireIcon /> Fire
            </Flag>
          ) : null}
          {flags.injury ? (
            <Flag tone="orange">
              <InjuryIcon /> Injury
            </Flag>
          ) : null}
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
        "inline-flex items-center gap-1 rounded-chip px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        cls,
      )}
    >
      {children}
    </span>
  );
}

function CrashIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 1L8 8L1 9L6 14L4.5 21L12 17.5L19.5 21L18 14L23 9L16 8L12 1Z" />
    </svg>
  );
}

function FireIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C9 6 6 8 6 13a6 6 0 0 0 12 0c0-2.5-1.5-4-2-6-2 1.5-2 3-2 3s-1-4-2-8Z" />
    </svg>
  );
}

function InjuryIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <rect x="3" y="9" width="18" height="6" rx="2" transform="rotate(-30 12 12)" />
      <circle cx="9" cy="14" r="1" fill="currentColor" />
      <circle cx="13" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}
