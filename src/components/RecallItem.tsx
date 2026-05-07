import Link from "next/link";

export type RecallItemData = {
  campaignId: string;
  title: string;
  components?: string[];
  date: string;
  href?: string;
};

export function RecallItem({ recall }: { recall: RecallItemData }) {
  const Wrap = recall.href
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={recall.href!} className="block hover:bg-surface-alt rounded-card transition-colors">
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  return (
    <Wrap>
      <article className="border-b border-border p-4 last:border-b-0">
        <div className="flex items-baseline justify-between gap-3">
          <span className="vin-mono text-xs font-semibold text-brand-red">
            {recall.campaignId}
          </span>
          <time className="text-xs text-muted">{recall.date}</time>
        </div>
        <h3 className="mt-1 text-sm font-semibold text-slate-950">
          {recall.title}
        </h3>
        {recall.components?.length ? (
          <p className="mt-1 text-xs text-muted">
            {recall.components.join(" • ")}
          </p>
        ) : null}
      </article>
    </Wrap>
  );
}
