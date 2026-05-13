import { cn } from "@/lib/cn";
import { makeFallbackColor, makeLogoPath } from "@/lib/makeLogos";

export function BrandLogo({
  make,
  slug,
  size = 48,
  className,
}: {
  make: string;
  /** Optional make slug — required to look up the brand logo. If omitted,
   * derives slug from the make name. */
  slug?: string;
  size?: number;
  className?: string;
}) {
  const effectiveSlug =
    slug ??
    make
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const logoPath = makeLogoPath(effectiveSlug);

  if (logoPath) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-card border border-border bg-white p-1.5",
          className,
        )}
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoPath}
          alt={`${make} logo`}
          width={size - 12}
          height={size - 12}
          loading="lazy"
          decoding="async"
          className="block max-h-full max-w-full object-contain"
        />
      </span>
    );
  }

  // Fallback: brand-colored monogram (two-letter initials, white text).
  const initials = make.includes(" ")
    ? make
        .split(/\s+/)
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : make.slice(0, 2).toUpperCase();
  const color = makeFallbackColor(effectiveSlug);
  const bg = color ? `#${color}` : undefined;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-card border border-border font-bold text-white",
        !bg && "bg-slate-800",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.32),
        backgroundColor: bg,
      }}
      aria-label={make}
    >
      {initials || "?"}
    </span>
  );
}
