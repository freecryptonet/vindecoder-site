import type { ReactNode } from "react";

export type SpecRow = {
  label: string;
  value: ReactNode;
  /** Optional small icon shown immediately before the value text. */
  icon?: ReactNode;
};

export function SpecsGrid({ rows }: { rows: SpecRow[] }) {
  const visible = rows.filter((r) => {
    if (r.value == null) return false;
    if (typeof r.value === "string") return r.value.trim() !== "";
    return true;
  });
  if (visible.length === 0) return null;
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
      {visible.map((r) => (
        <div
          key={r.label}
          className="flex items-baseline justify-between gap-3 border-b border-border py-2 last:border-b-0"
        >
          <dt className="text-xs font-medium uppercase tracking-wider text-muted">
            {r.label}
          </dt>
          <dd className="flex items-center gap-1.5 text-right text-sm font-medium text-slate-950">
            {r.icon ? (
              <span className="text-muted" aria-hidden>
                {r.icon}
              </span>
            ) : null}
            <span>{r.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
