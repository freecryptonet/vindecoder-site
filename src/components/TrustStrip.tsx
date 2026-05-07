import { cn } from "@/lib/cn";

const items = [
  { label: "100% Free" },
  { label: "NHTSA Data" },
  { label: "No Ads" },
  { label: "Made in USA", flag: true },
];

export function TrustStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-muted",
        className,
      )}
      aria-label="Trust signals"
    >
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {item.flag ? <UsFlagIcon /> : <DotIcon />}
          <span>{item.label}</span>
          {i < items.length - 1 ? null : null}
        </span>
      ))}
    </div>
  );
}

function DotIcon() {
  return (
    <span className="inline-block h-1 w-1 rounded-full bg-brand-red" aria-hidden />
  );
}

function UsFlagIcon() {
  return (
    <svg
      viewBox="0 0 24 16"
      width="14"
      height="10"
      aria-hidden
      className="rounded-[2px]"
    >
      <rect width="24" height="16" fill="#B91C1C" />
      <rect y="2" width="24" height="2" fill="#FFFFFF" />
      <rect y="6" width="24" height="2" fill="#FFFFFF" />
      <rect y="10" width="24" height="2" fill="#FFFFFF" />
      <rect y="14" width="24" height="2" fill="#FFFFFF" />
      <rect width="10" height="8" fill="#1E40AF" />
    </svg>
  );
}
