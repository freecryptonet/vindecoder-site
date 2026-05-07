import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

const SITE = "https://vindecoder.site";

export const metadata: Metadata = {
  title: "Vehicle Body Class Reference — NHTSA Body Type Definitions",
  description:
    "Definitions for every vehicle body class NHTSA returns when decoding a VIN: sedan, SUV, crossover, pickup, minivan, and the rarer ones too.",
  alternates: { canonical: "/vehicle-types" },
};

const CATEGORIES: { name: string; description: string; examples: string[] }[] = [
  {
    name: "Sedan/Saloon",
    description: "4-door passenger car with a separate trunk. The bedrock of US vehicle sales for decades, now down-trending against crossovers.",
    examples: ["Toyota Camry", "Honda Accord", "Tesla Model 3"],
  },
  {
    name: "Coupe",
    description: "2-door passenger car. Sport coupes share most of a sedan's underpinnings but with a fixed roofline and steeper rear glass.",
    examples: ["Ford Mustang", "Chevrolet Camaro", "Toyota GR86"],
  },
  {
    name: "Convertible/Cabriolet",
    description: "Passenger car with a folding or removable roof — soft-top fabric or a folding hardtop.",
    examples: ["Mazda MX-5 Miata", "Ford Bronco (soft top)", "Jeep Wrangler"],
  },
  {
    name: "Hatchback/Liftback",
    description: "Passenger car with a rear cargo door that lifts as one piece with the rear glass.",
    examples: ["Honda Civic Hatchback", "Toyota Corolla Hatchback", "VW Golf"],
  },
  {
    name: "Wagon",
    description: "Passenger car with an extended roofline over a flat cargo area. Practically extinct in the US market — Subaru Outback and a handful of luxury wagons remain.",
    examples: ["Subaru Outback", "Volvo V90", "Audi A4 allroad"],
  },
  {
    name: "Sport Utility Vehicle (SUV)",
    description: "Body-on-frame or unibody truck-derived vehicle, typically with all-wheel drive and elevated ride height. NHTSA still classifies many crossovers under this header.",
    examples: ["Toyota 4Runner", "Jeep Grand Cherokee", "Ford Expedition"],
  },
  {
    name: "Crossover",
    description: "Unibody passenger car platform with SUV-style packaging. The dominant US body style in the 2020s.",
    examples: ["Toyota RAV4", "Honda CR-V", "Tesla Model Y"],
  },
  {
    name: "Pickup",
    description: "Open-bed truck. NHTSA distinguishes light- (under 8,500 lb GVWR) and heavy-duty (above) for emissions and rating purposes.",
    examples: ["Ford F-150", "Chevrolet Silverado 1500", "Ram 1500"],
  },
  {
    name: "Minivan/Van",
    description: "Passenger or cargo van — sliding side doors, low floor, three rows in passenger configurations.",
    examples: ["Honda Odyssey", "Toyota Sienna", "Chrysler Pacifica"],
  },
  {
    name: "Cargo Van",
    description: "Commercial-spec van with no rear seats and cargo-only rear cabin.",
    examples: ["Ford Transit", "Mercedes-Benz Sprinter", "Ram ProMaster"],
  },
  {
    name: "Bus",
    description: "Passenger transport over 15 occupants. Includes school buses, transit buses, and motor coaches.",
    examples: ["Blue Bird Vision", "Thomas Saf-T-Liner C2", "Gillig Low-Floor"],
  },
  {
    name: "Motorcycle",
    description: "Two- or three-wheeled motor vehicle. NHTSA tracks recalls and complaints separately.",
    examples: ["Harley-Davidson Street Glide", "Honda Gold Wing", "Yamaha YZF-R3"],
  },
  {
    name: "Trailer",
    description: "Non-self-propelled vehicle pulled behind another vehicle. Travel trailers, boat trailers, utility trailers, semi trailers.",
    examples: ["Airstream Classic", "Wabash DuraPlate", "Featherlite stock trailer"],
  },
];

export default function VehicleTypesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "Vehicle Types", url: `${SITE}/vehicle-types` },
        ])}
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Vehicle Types" }]} />
        <header className="mt-6 max-w-3xl">
          <h1 className="text-h1-page text-slate-950">Vehicle Body Class Reference</h1>
          <p className="mt-3 text-base text-muted">
            When NHTSA decodes a VIN it returns a Body Class — one of the
            categories below. Manufacturers self-report this field, so a
            "Crossover" might appear as "SUV" depending on year and make.
          </p>
        </header>

        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {CATEGORIES.map((c) => (
            <li key={c.name}>
              <Card>
                <h2 className="text-h3 text-slate-950">{c.name}</h2>
                <p className="mt-2 text-sm text-muted">{c.description}</p>
                <p className="mt-3 text-xs uppercase tracking-wider text-muted">Examples</p>
                <p className="text-sm text-slate-950">{c.examples.join(" · ")}</p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
