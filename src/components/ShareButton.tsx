"use client";

import { useState } from "react";

export function ShareButton({
  title,
  text,
}: {
  title: string;
  text?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "shared">("idle");

  async function handleClick() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    // Prefer the native share sheet on mobile/Safari, fall back to clipboard.
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as Navigator).share({ title, text, url });
        setState("shared");
        setTimeout(() => setState("idle"), 1500);
        return;
      } catch {
        // User cancelled or share unsupported — fall through to clipboard.
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setState("copied");
        setTimeout(() => setState("idle"), 1500);
      } catch {
        // ignore
      }
    }
  }

  const label =
    state === "copied"
      ? "Link copied!"
      : state === "shared"
        ? "Shared!"
        : "Share";

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 rounded-card border border-border bg-surface px-3 py-1 text-xs font-semibold text-slate-950 transition-colors hover:bg-surface-alt"
      aria-label="Share this report"
    >
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      {label}
    </button>
  );
}
