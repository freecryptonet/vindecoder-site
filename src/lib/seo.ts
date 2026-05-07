/**
 * Schema.org JSON-LD builders — emit structured data so Google can render
 * rich results, sitelink searchboxes, breadcrumbs, etc. Pair with the
 * <JsonLd> component in src/components/JsonLd.tsx to inject into the tree.
 */

const SITE = "https://vindecoder.site";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}#website`,
    name: "VinDecoder",
    alternateName: "VinDecoder.site",
    url: SITE,
    description:
      "Free VIN decoder powered by official NHTSA data. Recalls, complaints, safety ratings, and TSBs for any 17-digit VIN.",
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/vin-decoder/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE}#organization`,
    name: "VinDecoder",
    url: SITE,
    logo: `${SITE}/icon.png`,
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.url ? { item: c.url } : {}),
    })),
  };
}

export interface VehicleJsonLdInput {
  vin: string;
  year: string | number;
  make: string;
  model: string;
  trim?: string;
  bodyClass?: string;
  fuelType?: string;
  driveType?: string;
  url: string;
}

export function vehicleJsonLd(v: VehicleJsonLdInput) {
  const name = `${v.year} ${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ""}`;
  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name,
    vehicleIdentificationNumber: v.vin,
    brand: { "@type": "Brand", name: v.make },
    model: v.model,
    modelDate: String(v.year),
    ...(v.bodyClass ? { bodyType: v.bodyClass } : {}),
    ...(v.fuelType ? { fuelType: v.fuelType } : {}),
    ...(v.driveType ? { driveWheelConfiguration: v.driveType } : {}),
    url: v.url,
  };
}
