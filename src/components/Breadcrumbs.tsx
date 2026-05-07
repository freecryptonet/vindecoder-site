import Link from "next/link";

export type Crumb = { href?: string; label: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.href && !isLast ? (
                <Link
                  href={c.href}
                  className="hover:text-slate-950 transition-colors"
                >
                  {c.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "font-medium text-slate-950" : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {c.label}
                </span>
              )}
              {!isLast ? <span aria-hidden>›</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
