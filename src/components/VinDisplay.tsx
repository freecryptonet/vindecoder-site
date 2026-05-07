"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export function VinDisplay({ vin }: { vin: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(vin);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // older browsers — silently no-op
    }
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-btn border border-border bg-surface-alt px-3 py-1.5">
      <span className="vin-mono text-sm font-semibold text-slate-950">{vin}</span>
      <button
        type="button"
        onClick={copy}
        className={cn(
          "rounded-chip border border-border bg-surface px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider transition-colors",
          copied ? "border-brand-green text-brand-green" : "text-muted hover:text-slate-950",
        )}
        aria-label="Copy VIN to clipboard"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
