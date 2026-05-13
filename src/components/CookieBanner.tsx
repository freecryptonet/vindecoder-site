"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "vd_consent_v1";

type ConsentState = "accepted" | "rejected";

/**
 * Minimal GDPR-style cookie consent banner.
 *
 * Behavior:
 * - Renders nothing until first paint check is complete (avoids hydration mismatch).
 * - Reads `vd_consent_v1` from localStorage. If already set → hidden.
 * - On Accept / Reject → stores state, dispatches a `vd-consent` window event
 *   so GA4 / future ad scripts can opt in/out.
 *
 * AdSense + ePrivacy compliance: lets EU users explicitly opt out of
 * non-essential cookies before any analytics or ad scripts process their data.
 * Pair with Google Consent Mode v2 in the GA4 gtag config for proper signal.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(STORAGE_KEY);
      if (!existing) setVisible(true);
    } catch {
      // localStorage blocked (incognito quotas, etc.) — show banner anyway.
      setVisible(true);
    }
  }, []);

  function record(state: ConsentState) {
    try {
      window.localStorage.setItem(STORAGE_KEY, state);
    } catch {
      // ignore — best-effort
    }
    window.dispatchEvent(
      new CustomEvent("vd-consent", { detail: { state } }),
    );
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-card border border-border bg-surface p-4 shadow-lg sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm text-slate-950">
          We use cookies to measure site traffic with Google Analytics. No
          personal data is sold. See our{" "}
          <Link
            href="/privacy-policy"
            className="underline hover:text-brand-red"
          >
            privacy policy
          </Link>
          .
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={() => record("rejected")}
            className="rounded-card border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-surface-alt"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => record("accepted")}
            className="rounded-card bg-brand-red px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-red/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
