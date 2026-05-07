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
  const n = typeof rating === "string" ? parseInt(rating, 10) : (rating ?? 0);
  const stars = Math.max(0, Math.min(5, Number.isFinite(n) ? n : 0));
  const px = size === "lg" ? 22 : size === "md" ? 16 : 13;
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`${stars} of 5 stars`}>
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} filled={i < stars} size={px} />
        ))}
      </span>
      {showLabel && stars > 0 ? (
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
