import Link from "next/link";
import { VinSearchForm } from "@/components/VinSearchForm";

export default function NotFound() {
  return (
    <div className="container-page py-16 text-center">
      <h1 className="text-h1-page text-slate-950">That doesn&rsquo;t look like a VIN</h1>
      <p className="mt-3 text-sm text-muted">
        Vehicle Identification Numbers are 17 characters: letters and digits,
        no I, O, or Q.
      </p>
      <div className="mx-auto mt-8 max-w-xl">
        <VinSearchForm size="default" />
      </div>
      <p className="mt-6 text-xs text-muted">
        <Link href="/" className="hover:text-slate-950">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
