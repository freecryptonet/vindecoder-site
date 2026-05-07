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
      { href: "/complaints", label: "Complaints" },
      { href: "/specs", label: "Vehicle Types" },
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
        <div className="mt-10 border-t border-slate-800 pt-6 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} VinDecoder. Vehicle data via{" "}
            <a
              href="https://www.nhtsa.gov/"
              className="underline hover:text-white"
              rel="noopener"
            >
              NHTSA
            </a>
            . Not affiliated with any vehicle manufacturer.
          </p>
        </div>
      </div>
    </footer>
  );
}
