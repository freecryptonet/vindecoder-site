import Link from "next/link";

const cols: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Decode",
    links: [
      { href: "/", label: "VIN Decoder" },
      { href: "/makes", label: "Browse Makes" },
      { href: "/wmi", label: "WMI Directory" },
      { href: "/vin-year-chart", label: "VIN Year Chart" },
    ],
  },
  {
    heading: "Safety",
    links: [
      { href: "/recalls", label: "Recalls" },
      { href: "/recalls/most-recalled-cars", label: "Most Recalled Cars" },
      { href: "/compare", label: "Compare Cars" },
      { href: "/vehicle-types", label: "Vehicle Types" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: "/guides", label: "Buyer's Guides" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-slate-950 text-slate-300">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {cols.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
                {col.heading}
              </h3>
              <ul className="space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} VinDecoder. Not affiliated with any
            vehicle manufacturer.
          </p>
          <a
            href="https://www.nhtsa.gov/"
            rel="noopener noreferrer"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-card border border-slate-700 bg-slate-900 px-3 py-1.5 font-semibold uppercase tracking-wider text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
            aria-label="Data sourced from the National Highway Traffic Safety Administration"
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 2L4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3zm0 4.5l5 1.9V11c0 3.5-2.3 6.6-5 7.9-2.7-1.3-5-4.4-5-7.9V8.4l5-1.9z" />
            </svg>
            Data source: NHTSA
          </a>
        </div>
      </div>
    </footer>
  );
}
