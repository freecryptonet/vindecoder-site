export type SpecRow = { label: string; value: string | null | undefined };

export function SpecsGrid({ rows }: { rows: SpecRow[] }) {
  const visible = rows.filter((r) => r.value && String(r.value).trim() !== "");
  if (visible.length === 0) return null;
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
      {visible.map((r) => (
        <div key={r.label} className="flex items-baseline justify-between gap-3 border-b border-border py-2 last:border-b-0">
          <dt className="text-xs font-medium uppercase tracking-wider text-muted">
            {r.label}
          </dt>
          <dd className="text-right text-sm font-medium text-slate-950">
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
