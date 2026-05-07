export interface GuideSection {
  heading: string;
  body: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  intro: string;
  sections: GuideSection[];
}

export const GUIDES: Guide[] = [
  {
    slug: "how-to-read-a-vin",
    title: "How to read a VIN",
    description:
      "Every 17-character VIN is a structured code: the first 3 chars identify the manufacturer, the next 6 describe the vehicle, the last 8 pin down the specific unit.",
    publishedAt: "2026-05-07",
    intro:
      "Pop the hood of any modern Vehicle Identification Number and it falls apart into three sections. Reading them in order tells you who built the car, what it is, and which one it is.",
    sections: [
      {
        heading: "Positions 1–3: World Manufacturer Identifier (WMI)",
        body: "The first character marks the country (1, 4, 5 = United States; 2 = Canada; J = Japan; W = Germany). The second narrows down the manufacturer or country sub-region. The third signals the vehicle type or division — Ford uses 1FT for trucks, 1FA for cars, 1FM for SUVs, for example. Together those three characters pin down the plant and brand.",
      },
      {
        heading: "Positions 4–9: Vehicle Descriptor Section (VDS)",
        body: "Six characters describing the car: model, body style, engine, restraint system. Manufacturers encode these fields differently — there's no universal table — so the same character at position 7 means a different thing on a Toyota than on a Chevy. NHTSA's vPIC database stitches every manufacturer's encoding together and is what we query when you decode a VIN here.",
      },
      {
        heading: "Position 9: Check digit",
        body: "A mathematical hash of the other 16 characters. North American VINs require it; if it doesn't validate, the VIN is either typed wrong or fake. Some European VINs skip it (the 9th character can be a model code instead).",
      },
      {
        heading: "Position 10: Model year",
        body: "A single character from a 30-year cycle. A on a 1980 or 2010, P on a 1993 or 2023, S on a 1995 or 2025. The full chart lives at /vin-year-chart. Letters I, O, Q, U, Z, and the digit 0 are skipped to avoid look-alike confusion.",
      },
      {
        heading: "Position 11: Plant code",
        body: "Which factory built the car. A single character — manufacturer-specific. Useful when an investigation or recall affects only one plant's output.",
      },
      {
        heading: "Positions 12–17: Sequential serial number",
        body: "The unit number. Pure sequence — doesn't encode anything beyond which order it rolled off the line.",
      },
      {
        heading: "Where to find your VIN",
        body: "Three reliable spots: (1) the dashboard, visible through the windshield on the driver's side; (2) the door jamb sticker on the driver's door; (3) the title and registration documents. Insurance cards usually carry it too. If you find a VIN that's only 11 digits, you're looking at a pre-1981 vehicle — those don't follow the modern 17-character standard.",
      },
    ],
  },
  {
    slug: "buying-used-car-checklist",
    title: "Buying a used car checklist",
    description:
      "What to verify before signing on a used vehicle. VIN check, recall status, title brand, odometer plausibility, and the test drive.",
    publishedAt: "2026-05-07",
    intro:
      "A used car at a dealer has gone through some inspection. A used car off Marketplace or Craigslist hasn't. This checklist gets you to a no-surprises decision in under an hour.",
    sections: [
      {
        heading: "Step 1: Match the VINs",
        body: "Compare the VIN on the dashboard, the driver door jamb, and the title. If any of the three differ, walk away — that's the most reliable single signal of a stolen vehicle, a salvage retitle, or VIN fraud. While you're at it, confirm the year and make on the title match the dashboard.",
      },
      {
        heading: "Step 2: Run the VIN through a recall lookup",
        body: "Free check against NHTSA's database. Decode the VIN here or at NHTSA's site directly to see open recall campaigns. Open recalls aren't deal-breakers — most are remedied free at any franchised dealer — but you want to know going in. Pay extra attention to safety-critical components (airbags, brakes, fuel system, steering).",
      },
      {
        heading: "Step 3: Title check",
        body: "Ask for a clear title. A salvage or rebuilt title means the vehicle was totaled by an insurer at some point — not necessarily a problem (especially for hail-damage cars), but it caps resale value and may trigger insurance hassles. A flood-branded title is a hard pass unless you're buying for parts.",
      },
      {
        heading: "Step 4: Odometer plausibility",
        body: "Compare the dashboard reading against the title's stated mileage and any maintenance records. A late-model car with under 30,000 miles on it is great if the records back it up; if the seller can't produce any service history matching that mileage, treat it as a flag for rollback. We have a separate guide on odometer fraud at /guides/odometer-fraud-explained.",
      },
      {
        heading: "Step 5: Look up complaints for that year and model",
        body: "On a year-reliability hub here you'll see every NHTSA complaint owners filed for that exact year/make/model. Look for repeated component clusters — if 30% of the complaints mention the transmission, that's a known issue, not random.",
      },
      {
        heading: "Step 6: The test drive",
        body: "Cold-start the engine — knocks and lifter rattles only show on a cold engine. Drive at highway speed for at least 10 minutes; drift the steering between lanes to check for pull or loose play. Brake hard once on an empty road. Listen for clunks over speed bumps. Check that every dashboard light works and that no warning lights are lit.",
      },
      {
        heading: "Step 7: Pre-purchase inspection",
        body: "Spend $100–$200 on a pre-purchase inspection at an independent shop. They'll find what your test drive missed: leaking head gasket, frame damage, fluid contamination, worn suspension. On any car over $5,000 this is the cheapest insurance you'll ever buy.",
      },
    ],
  },
  {
    slug: "what-is-a-salvage-title",
    title: "What is a salvage title",
    description:
      "A salvage title means an insurer wrote off the vehicle. Here's what that means for you, what you can verify, and when a salvage car is still a good buy.",
    publishedAt: "2026-05-07",
    intro:
      "A salvage title doesn't always mean the car is dangerous — it just means an insurance company decided the cost of repairs exceeded a percentage of the vehicle's pre-loss value (typically 75% in most states). Sometimes that's because of catastrophic damage. Sometimes it's because the insured agreed to a write-off after a relatively minor incident on a low-value car.",
    sections: [
      {
        heading: "The brands you'll see",
        body: "Each state runs its own title-branding rules but the common labels: Salvage (totaled), Rebuilt or Reconstructed (totaled then repaired and re-inspected), Junk (parts only, can't be re-titled), Flood (water damage), Hail (hail damage only, often cosmetic), Lemon (state lemon-law buyback). The most relevant for a used buyer is the difference between Salvage and Rebuilt.",
      },
      {
        heading: "Why insurers total cars",
        body: "Two factors: the cost to repair and the pre-loss value. A 2010 Civic worth $7,000 with $5,500 in collision damage hits the 75% threshold and gets written off. The same damage on a 2024 BMW would be repaired without a title brand because the math works out. Older cars and cheap cars total easily; newer, more valuable cars rarely do.",
      },
      {
        heading: "Are salvage cars safe?",
        body: "Depends entirely on what was repaired and how. A car with a crushed roof that was straightened on a frame machine and re-painted is mechanically fine but may have compromised crash structure for the next collision. A flood car looks fine but the wiring harness will fail incrementally for the next decade. A hail car is essentially untouched mechanically. The brand alone doesn't tell you which.",
      },
      {
        heading: "When salvage is a fine buy",
        body: "Hail-only damage on a recent model. Theft-recovery vehicles (often re-titled salvage even when undamaged). Vehicles totaled on a low estimate where the actual repair cost was minor. In all three cases you're paying 50–60% of clean-title resale and getting a usable car. The trade-off is on resale: salvage cars sell for 20–40% less than clean-title equivalents.",
      },
      {
        heading: "When to walk away",
        body: "Flood brands are almost always a pass. Frame damage that wasn't disclosed or repaired in a frame-machine shop. Anything where the seller can't show the original damage report. And anywhere the title brand doesn't match what's stamped on the title — that's title washing, where someone retitled a salvage car in a state with looser branding rules to hide the brand.",
      },
      {
        heading: "How to verify",
        body: "Run the VIN through Carfax or AutoCheck (paid). NMVTIS — the federal National Motor Vehicle Title Information System — also tracks title brands across all 50 states; the report runs about $2.50 from approved providers. Free state DMV title look-ups exist for some states but coverage is uneven.",
      },
    ],
  },
  {
    slug: "odometer-fraud-explained",
    title: "Odometer fraud explained",
    description:
      "Rolling back the odometer is one of the oldest used-car scams. Modern digital dashes haven't killed it. Here's how it works and how to catch it.",
    publishedAt: "2026-05-07",
    intro:
      "The Department of Transportation estimates 450,000 odometer-rolled vehicles change hands each year in the US, costing buyers around $1 billion. Digital dashboards made it harder than the physical-gear days but didn't kill it — there's a thriving cottage industry of devices that splice into a car's CAN bus and write a lower number.",
    sections: [
      {
        heading: "How it gets done",
        body: "On older mechanical odometers, anyone with a Phillips head and 20 minutes can spin the gears back. On modern cars, an OBD-II programmer can rewrite the EEPROM that stores the mileage figure on the cluster. More sophisticated tools also rewrite the matching values stored in the BCM, ECM, and key fobs — without that, the car will throw a 'mileage mismatch' DTC at the next dealer scan.",
      },
      {
        heading: "How to catch it",
        body: "Compare the dashboard against (1) the title's stated mileage at last transfer, (2) any service records, (3) state inspection records, (4) the NMVTIS title report. A 2018 car showing 35,000 miles with three title transfers each at progressively lower mileages is fraud. So is a clean dashboard mileage on a car whose service intervals show 60,000 miles of work done.",
      },
      {
        heading: "Physical tells",
        body: "Wear on the steering wheel, driver seat bolster, and pedal rubber correlates strongly with miles. A 30,000-mile car has barely-touched pedals; a 130,000-mile car has worn pedal pads even if the bolsters were re-upholstered. Tires usually correlate too — original-equipment tires last 40–60k miles. Fresh tires on a low-mile car can mean the car wore through the originals.",
      },
      {
        heading: "OBD-II scan tells",
        body: "A scan tool can pull mileage from multiple control modules — ECM, BCM, transmission, ABS. If they don't match, a rollback was done sloppily. Any mechanic can do this in 5 minutes; some independent shops will do a free pre-purchase scan if you ask.",
      },
      {
        heading: "What to do if you bought one",
        body: "Federal law (49 USC §32710) gives you treble damages or $10,000, whichever is greater, plus attorney's fees, against anyone who knowingly altered the odometer or sold the vehicle without disclosing it. State lemon-law statutes often pile on. Document everything — pictures of the dash, the title, the bill of sale, any service records — and file a complaint with the FTC and your state attorney general before contacting the seller.",
      },
    ],
  },
  {
    slug: "nhtsa-recall-lookup-explained",
    title: "NHTSA recall lookup explained",
    description:
      "Where vehicle recall data comes from, what a campaign means, what 'remedy unavailable' means, and how to track an open recall to closure.",
    publishedAt: "2026-05-07",
    intro:
      "Every recall on a vehicle sold in the United States flows through NHTSA — the National Highway Traffic Safety Administration. The agency doesn't issue recalls itself; manufacturers issue them and NHTSA tracks, publishes, and (when manufacturers drag their feet) compels them.",
    sections: [
      {
        heading: "What a campaign actually is",
        body: "A recall campaign is a manufacturer's commitment to fix a specific defect on a specific population of vehicles. Each campaign gets a NHTSA Campaign Number (NHTSACampaignNumber, the 23V123000 format you see on this site). The number includes the year (23 = 2023), a vehicle/equipment letter (V for vehicle, E for equipment, T for tire), and a sequence number.",
      },
      {
        heading: "The four phases",
        body: "1. Investigation — NHTSA opens a Preliminary Evaluation or Engineering Analysis based on consumer complaints. 2. Defect determination — either the manufacturer accepts a defect exists, or NHTSA orders one. 3. Recall campaign — the manufacturer notifies owners and dealers and offers free repair. 4. Closure — when 95% of affected vehicles have been repaired, the campaign moves into ongoing-monitoring status. Some campaigns never close; old recalls on cars that have been scrapped just stay open.",
      },
      {
        heading: "What 'remedy unavailable' means",
        body: "Many fresh recalls list a remedy that's not yet available. The manufacturer is committed to fix the issue but hasn't finished engineering or sourcing the replacement parts. Owners get an interim notice with whatever workaround applies (often 'park outside' for fire risks). When the remedy is available, owners get a second letter with a dealer appointment instructions.",
      },
      {
        heading: "Free repair forever — well, mostly",
        body: "Manufacturers are obligated to repair safety recalls free of charge. Federal law generally caps that obligation at 15 model years from the vehicle's first sale, but most major OEMs honor recalls indefinitely on their own. The exception is electronic recalls on vehicles that need a hardware fix the manufacturer no longer carries.",
      },
      {
        heading: "VIN-specific recall checks",
        body: "Decoding a VIN against NHTSA's recall database returns only the campaigns that affect that exact unit — not every recall on the make and model. Two same-year Camrys built three weeks apart can have different recall populations because some campaigns target a narrow plant code or production date range. That's why a VIN check is more useful than a year-and-model check.",
      },
      {
        heading: "Park-it and park-outside warnings",
        body: "Two specific NHTSA flags worth knowing. 'Do Not Drive' (parkIt) means the agency considers the defect severe enough that owners shouldn't drive the vehicle until repaired. 'Park Outside' (parkOutSide) is for fire risks where the vehicle can self-ignite while parked — a 2010s Hyundai/Kia engine fire campaign was the most prominent example. We surface both flags prominently on the recall detail pages.",
      },
    ],
  },
];

export function findGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
