import Link from "next/link";

export function CtaCard({
  headline,
  body,
  buttonLabel,
  buttonHref,
}: {
  headline: string;
  body?: string;
  buttonLabel: string;
  buttonHref: string;
}) {
  return (
    <div className="rounded-card border-2 border-brand-red/40 bg-brand-red/5 p-6">
      <h3 className="text-h2 text-slate-950">{headline}</h3>
      {body ? <p className="mt-2 text-sm text-muted">{body}</p> : null}
      <Link
        href={buttonHref}
        className="mt-4 inline-flex items-center rounded-btn bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red/90 transition-colors"
      >
        {buttonLabel}
      </Link>
    </div>
  );
}
