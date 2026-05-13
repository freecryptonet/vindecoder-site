import { cn } from "@/lib/cn";

export function SafetyStars({
  rating,
  size = "md",
  showLabel = true,
}: {
  rating: number | string | null | undefined;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}) {
  // NHTSA returns ratings as strings like "5", "Not Rated", or empty. Treat
  // anything that doesn't parse to a 1-5 integer as "not rated" so we don't
  // show a misleading row of 5 empty stars labeled "0 of 5".
  const n = typeof rating === "string" ? parseInt(rating, 10) : (rating ?? NaN);
  const isRated = Number.isFinite(n) && n >= 1 && n <= 5;
  const px = size === "lg" ? 22 : size === "md" ? 16 : 13;
  if (!isRated) {
    return (
      <span
        className={cn(
          "inline-flex items-center text-muted",
          size === "lg" ? "text-sm" : "text-xs",
        )}
        aria-label="Not rated"
      >
        Not rated
      </span>
    );
  }
  const stars = Math.round(n);
  return (
    <span
      className="inline-flex items-center gap-1.5"
      aria-label={`${stars} of 5 stars`}
    >
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} filled={i < stars} size={px} />
        ))}
      </span>
      {showLabel ? (
        <span className={cn("text-muted", size === "lg" ? "text-base" : "text-xs")}>
          {stars} / 5
        </span>
      ) : null}
    </span>
  );
}

function Star({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={filled ? "fill-brand-orange" : "fill-border"}
      aria-hidden
    >
      <path d="M12 2.5l2.95 6.5 7.05.6-5.4 4.7 1.6 6.95L12 17.6 5.8 21.25l1.6-6.95L2 9.6l7.05-.6L12 2.5z" />
    </svg>
  );
}
