import Link from "next/link";
import { TrustStrip } from "./TrustStrip";

const navItems = [
  { href: "/makes", label: "Makes" },
  { href: "/recalls", label: "Recalls" },
  { href: "/complaints", label: "Complaints" },
  { href: "/wmi", label: "WMI" },
  { href: "/guides", label: "Guides" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
      <div className="container-page flex h-14 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-950"
        >
          <Wordmark />
          <span>VinDecoder</span>
        </Link>
        <nav aria-label="Primary">
          <ul className="hidden items-center gap-5 text-sm font-medium text-slate-950 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-brand-red transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-border bg-surface-alt py-1.5">
        <TrustStrip className="container-page" />
      </div>
    </header>
  );
}

function Wordmark() {
  return (
    <svg viewBox="0 0 28 28" width="22" height="22" aria-hidden>
      <rect x="2" y="2" width="24" height="24" rx="6" fill="#0F172A" />
      <path
        d="M9 10 L14 18 L19 10"
        stroke="#FFFFFF"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="14" cy="22" r="1.4" fill="#B91C1C" />
    </svg>
  );
}
