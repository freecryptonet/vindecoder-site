/**
 * Compact icon for NHTSA fuel-type strings.
 *
 * NHTSA's vPIC returns fuelTypePrimary as strings like "Gasoline",
 * "Diesel", "Electric", "Compressed Natural Gas (CNG)", "Flexible Fuel
 * Vehicle (FFV)", "Hybrid", "Hydrogen Fuel Cell". We bucket these into
 * a small set of visual categories.
 */

const ICON_FILL = "currentColor";

function categorize(fuel: string): "ev" | "hybrid" | "diesel" | "cng" | "h2" | "ffv" | "gas" {
  const f = fuel.toLowerCase();
  if (/electric|battery|bev/.test(f) && !/hybrid/.test(f)) return "ev";
  if (/hybrid|phev|hev/.test(f)) return "hybrid";
  if (/diesel/.test(f)) return "diesel";
  if (/cng|natural gas|lpg|propane/.test(f)) return "cng";
  if (/hydrogen|fuel cell/.test(f)) return "h2";
  if (/flex|ffv|ethanol|e85/.test(f)) return "ffv";
  return "gas";
}

export function FuelIcon({
  fuel,
  size = 14,
  className = "inline-block",
}: {
  fuel: string | null | undefined;
  size?: number;
  className?: string;
}) {
  if (!fuel) return null;
  const kind = categorize(fuel);

  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: ICON_FILL,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };

  switch (kind) {
    case "ev":
      // Lightning bolt
      return (
        <svg {...common}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "hybrid":
      // Leaf + bolt
      return (
        <svg {...common}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 22 17 7" />
        </svg>
      );
    case "diesel":
      // Gas pump (with D)
      return (
        <svg {...common}>
          <line x1="3" y1="22" x2="15" y2="22" />
          <line x1="4" y1="9" x2="14" y2="9" />
          <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
          <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5" />
        </svg>
      );
    case "cng":
      // Gas cylinder
      return (
        <svg {...common}>
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect x="6" y="6" width="12" height="16" rx="3" />
          <line x1="6" y1="11" x2="18" y2="11" />
        </svg>
      );
    case "h2":
      // Atom-style for fuel cell
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2" />
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </svg>
      );
    case "ffv":
      // Recycle-style triangle (flex-fuel)
      return (
        <svg {...common}>
          <path d="m14 16-3 3 3 3" />
          <path d="M18.6 13l1.4-1.4" />
          <path d="M19 19a9 9 0 1 0-9-9" />
        </svg>
      );
    case "gas":
    default:
      // Gas pump
      return (
        <svg {...common}>
          <line x1="3" y1="22" x2="15" y2="22" />
          <line x1="4" y1="9" x2="14" y2="9" />
          <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
          <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5" />
        </svg>
      );
  }
}
