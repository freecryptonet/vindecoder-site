import Link from "next/link";
import { formatNhtsaComponent } from "@/lib/utils";

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
  const componentLine = recall.components?.length
    ? recall.components.map(formatNhtsaComponent).filter(Boolean).join(" • ")
    : "";
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
        {componentLine ? (
          <p className="mt-1 text-xs text-muted">{componentLine}</p>
        ) : null}
      </article>
    </Wrap>
  );
}
