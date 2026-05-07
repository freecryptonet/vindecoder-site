"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;

export function VinSearchForm({
  size = "default",
  initialVin,
}: {
  size?: "default" | "large";
  initialVin?: string;
}) {
  const router = useRouter();
  const [vin, setVin] = useState(initialVin ?? "");
  const [error, setError] = useState<string | null>(null);

  const isValid = VIN_RE.test(vin.toUpperCase());

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const cleaned = vin.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
    if (!VIN_RE.test(cleaned)) {
      setError(
        cleaned.length === 17
          ? "VIN contains invalid characters (I, O, Q are not allowed)."
          : `VIN must be 17 characters. Got ${cleaned.length}.`,
      );
      return;
    }
    setError(null);
    router.push(`/vin-decoder/${cleaned}`);
  }

  const inputCls =
    size === "large"
      ? "h-14 text-lg"
      : "h-11 text-base";
  const buttonCls =
    size === "large"
      ? "h-14 px-6 text-base"
      : "h-11 px-5 text-sm";

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <input
            value={vin}
            onChange={(e) => {
              setVin(e.target.value.toUpperCase());
              if (error) setError(null);
            }}
            maxLength={17}
            spellCheck={false}
            autoCapitalize="characters"
            autoComplete="off"
            placeholder="1HGCM82633A123456"
            aria-label="Vehicle Identification Number"
            aria-invalid={error ? "true" : undefined}
            className={cn(
              "vin-mono w-full rounded-btn border-2 border-border bg-surface px-4 tracking-wider text-slate-950 outline-none transition-colors",
              "focus:border-slate-950",
              isValid && "border-brand-green",
              inputCls,
            )}
          />
          {isValid ? (
            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-green"
              aria-hidden
            >
              ✓
            </span>
          ) : null}
        </div>
        <button
          type="submit"
          className={cn(
            "rounded-btn bg-brand-red font-semibold text-white transition-colors hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:opacity-60",
            buttonCls,
          )}
        >
          Decode VIN
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-sm text-brand-red" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-xs text-muted">
          17 characters · letters and numbers only · I, O, Q not used
        </p>
      )}
    </form>
  );
}
