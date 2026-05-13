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
  {
    slug: "vin-check-vs-carfax",
    title: "VIN check vs Carfax: what's actually different",
    description:
      "Carfax/AutoCheck pull from insurance claims and dealer records. Free NHTSA-based VIN checks pull from federal recall and complaint databases. Each one tells you something the other can't.",
    publishedAt: "2026-05-13",
    intro:
      "A free VIN check and a $40 Carfax report look like the same thing on the surface — type in 17 characters, get a vehicle's history back. They're not. The two services answer different questions, and using only one means missing half the picture.",
    sections: [
      {
        heading: "What the free NHTSA-based check gives you",
        body: "Three federal databases, all free: vPIC for the structured decode (year, make, model, engine, body class), the Recalls API for every open campaign affecting that exact VIN, and the Complaints API for every owner report filed about that year/make/model. That's authoritative data straight from the federal government — Carfax doesn't have richer recall data than this.",
      },
      {
        heading: "What Carfax has that the free check doesn't",
        body: "Insurance loss reports (accident dates, severity), service records reported by participating dealers, title-brand history from state DMVs, and lien/registration history. The recurring weakness: independent shops and non-network dealers don't report to Carfax, so a car's service history is often patchier than the report implies. And Carfax won't catch an accident that the insurer didn't open a claim on.",
      },
      {
        heading: "When to use both",
        body: "Buying used: run the free NHTSA check first (every time, it costs nothing), then spend $40 on a Carfax or AutoCheck only if (a) the car looks otherwise good and (b) you need to verify the title isn't branded. NMVTIS — the federal title-history database — gives you the same title-brand data Carfax does for $2.50 from approved providers if Carfax's insurance/service history doesn't matter to you.",
      },
      {
        heading: "Where each service gets it wrong",
        body: "NHTSA data is current and accurate but only covers safety/regulatory information — it tells you nothing about how a specific car was driven or maintained. Carfax is broader but probabilistic: missing data is recorded as 'no records found,' which buyers misread as 'no accidents,' which isn't the same thing. Treat both as inputs to a decision, not the decision itself.",
      },
    ],
  },
  {
    slug: "vin-no-data-found",
    title: "Why your VIN returns 'no data found' on NHTSA",
    description:
      "VIN validates fine but NHTSA returns nothing? Six common causes — the most common is that NHTSA only tracks US-market vehicles, and the second is a typo you can't see.",
    publishedAt: "2026-05-13",
    intro:
      "A 17-character VIN that passes the check-digit test should decode cleanly through NHTSA's vPIC API. When it returns 'no data found' or an Error Code 1 ('Check Digit Inconsistent'), there's a handful of specific causes worth ruling out in order.",
    sections: [
      {
        heading: "Cause 1: The vehicle was never sold in the US",
        body: "NHTSA only catalogs vehicles certified for sale in the United States. A European or JDM (Japanese Domestic Market) car imported under the 25-year rule, a Canadian-market variant with a Canadian-only spec, or a gray-market import will all decode partially (since the WMI is still ISO 3779 standard) but won't have NHTSA recall, complaint, or safety data attached. That's the most common reason for an empty result on a real VIN.",
      },
      {
        heading: "Cause 2: The check digit is wrong (typo)",
        body: "A single character mistake — most often an I/1 or O/0 confusion despite ISO 3779 banning I, O, and Q from VINs — invalidates the check digit. The full VIN won't pass NHTSA's validator. Recheck against the dashboard plate, the door jamb sticker, and the title — all three must agree.",
      },
      {
        heading: "Cause 3: The car is too old (pre-1981)",
        body: "The 17-character ISO 3779 standard took effect for the 1981 model year. Vehicles from 1980 and earlier carry 11–13 character VINs that don't fit modern decoders. NHTSA doesn't catalog them. If you're checking a classic car, you'll need the original manufacturer build sheet instead.",
      },
      {
        heading: "Cause 4: Off-road, ag, or special equipment",
        body: "Tractors, fork-lifts, construction equipment, all-terrain motorcycles, and various low-volume kits use non-VIN identifier formats (SN, PIN, or proprietary IDs). They pass surface validation but return nothing from vPIC because they're outside the on-road vehicle scope NHTSA tracks.",
      },
      {
        heading: "Cause 5: The VIN is fake or stolen",
        body: "Fraudulent VINs sometimes look right because they're literally copied off a real vehicle. The duplicate may decode fine on NHTSA (it's just the source VIN's data) but cross-checks against title and registration databases will fail. If the dashboard VIN, door-jamb sticker, and title don't all match, treat the car as stolen until proven otherwise.",
      },
      {
        heading: "Cause 6: A new model just released",
        body: "NHTSA's catalog can lag the manufacturer by 4–8 weeks at the start of a new model year. A 2026 vehicle you're decoding in October 2025 might genuinely have no entry yet — the manufacturer hasn't submitted the spec sheet. Wait two months and try again.",
      },
    ],
  },
  {
    slug: "european-vin-format",
    title: "European VINs: how they differ from US VINs",
    description:
      "Same 17-character ISO 3779 standard, different conventions. European VINs often skip the check digit, encode the model code at position 7–8, and follow EU type-approval rather than NHTSA.",
    publishedAt: "2026-05-13",
    intro:
      "An ISO 3779 VIN is 17 characters anywhere in the world, but the conventions inside those 17 vary. European-market vehicles follow the ECE/EU type-approval system rather than NHTSA's FMVSS, which shows up in subtle differences when you decode the VIN.",
    sections: [
      {
        heading: "Position 9: the check digit lottery",
        body: "North American VINs require a valid check digit at position 9 — a modular hash of the other 16 characters. European VINs don't. ISO 3779 allows position 9 to encode a model-specific code instead. So a German-market BMW VIN can have any character at position 9 and still be valid. Decoders that strictly enforce the US check digit will reject perfectly real European VINs.",
      },
      {
        heading: "WMI starts with W, V, S, T, X, Y, Z",
        body: "First-character country codes for European manufacturers: W = Germany (Audi, BMW, Mercedes, VW, Porsche), V = France (Renault, Peugeot, Citroën) and Spain (SEAT), S = United Kingdom (Jaguar, Land Rover, Mini, Rolls-Royce), T = Switzerland and Czech Republic (Škoda), Y = Sweden (Volvo) and Finland, Z = Italy (Fiat, Ferrari, Lamborghini, Maserati, Alfa Romeo), X covers Russia. Some manufacturers also have multiple WMIs depending on plant.",
      },
      {
        heading: "VDS encoding is plant-specific, not standardized",
        body: "Positions 4–8 (Vehicle Descriptor Section) are even less standardized in Europe than in North America. BMW's positions 4–7 encode body style and engine in a 4-character model code; VW Group's encoding is different; Mercedes uses yet another convention. There's no universal lookup table, which is why decoder accuracy on European cars depends heavily on the specific OEM coverage of the database.",
      },
      {
        heading: "What's not in the VIN: the country of sale",
        body: "A 'European VIN' is really a manufacturer-issued VIN — it doesn't encode which European country the car was sold in. A BMW assembled in Munich (WBA…) might have been first registered in Germany, France, Italy, or anywhere else. Country of sale comes from the registration documents, not the VIN.",
      },
      {
        heading: "Why a US-market BMW has a different VIN than the German one",
        body: "Manufacturers operate parallel VIN ranges per market. A US-market 3-Series gets a WBA-leading VIN that does include a check digit and is certified to FMVSS; the same model built in Munich for the European market gets a WBA VIN without the check digit, certified to EU type-approval. The car is mechanically near-identical; the VIN format reflects the regulatory regime it was built for.",
      },
    ],
  },
  {
    slug: "pre-1981-vin-decoding",
    title: "Decoding pre-1981 vehicle identification numbers",
    description:
      "The modern 17-character VIN took effect in 1981. Before that, manufacturers used 11- to 13-character VINs with no universal convention — here's how to read them.",
    publishedAt: "2026-05-13",
    intro:
      "If you're looking at a vehicle from 1980 or earlier and the VIN is only 11–13 characters, you're not looking at a damaged or partial VIN — you're looking at the pre-ISO-3779 era when each manufacturer rolled their own format. Decoding takes manufacturer-specific knowledge that NHTSA's modern vPIC doesn't cover.",
    sections: [
      {
        heading: "Why 1981 was the breakpoint",
        body: "NHTSA's standardization rule (49 CFR Part 565) required the 17-character VIN format for all 1981+ model-year vehicles sold in the US. Manufacturers had been moving toward longer VINs through the 1970s anyway — by 1980 most US-market cars carried 13-character VINs — but pre-1981 there was no required structure. Each manufacturer encoded what they wanted in whatever length they chose.",
      },
      {
        heading: "Typical 1970s American VIN structure",
        body: "Most US manufacturers in the 1970s used 13-character VINs: 1 character for division (e.g., Chevrolet), 2 characters for series, 2 characters for body style, 1 character for engine, 1 character for model year, 1 character for plant, then a 5-digit sequence. The position of each field shifted by year and manufacturer.",
      },
      {
        heading: "Decoding without an online tool",
        body: "Pre-1981 VINs need manufacturer build sheets, period dealer reference cards, or restoration-club databases. Marque-specific clubs (the Camaro Research Group, the Mustang Owner's Museum, the Mopar Decoder Ring) maintain decoders for their nameplates. For trucks and AMC/Pontiac/Olds variants, you'll find scanned dealer manuals on enthusiast forums that walk through each character's encoding for that specific year.",
      },
      {
        heading: "Title and registration matter more than the VIN itself",
        body: "Because pre-1981 VINs can't be machine-decoded against NHTSA, your authority sources are the original title, the Manufacturer's Statement of Origin (MSO) if available, and any matching-numbers documentation. Frame-stamped VINs may be partial or worn; for collector-grade cars, multiple stampings (frame, engine, transmission, drivetrain) need to agree.",
      },
      {
        heading: "Insurance and import implications",
        body: "Insuring or registering a pre-1981 vehicle in a state that requires VIN inspection can take an in-person review by DMV or a licensed inspector, because the database checks modern tools run will simply return no result. That's normal for the era — not a sign of fraud. Bring period documentation if you have it.",
      },
    ],
  },
  {
    slug: "vin-stolen-vehicle-check",
    title: "How to check if a car was stolen using a VIN",
    description:
      "Free and paid options for confirming a vehicle isn't reported stolen — from the NICB VIN check to NMVTIS title-history reports.",
    publishedAt: "2026-05-13",
    intro:
      "Buying a stolen vehicle is buying a problem you didn't sign up for: the title will be void, the insurer will recover the car, and any money you paid is gone. Checking against theft databases takes 30 seconds and costs nothing.",
    sections: [
      {
        heading: "NICB VINCheck — free, fast, US-only",
        body: "The National Insurance Crime Bureau runs vincheck.nicb.org, a free lookup that returns whether the VIN appears in (1) an insurance theft report that wasn't recovered, or (2) an insurance salvage record. Five free lookups per IP per day. Coverage is excellent for US-insured vehicles; vehicles insured in Mexico or Canada won't appear.",
      },
      {
        heading: "NMVTIS — federal title-history coverage",
        body: "The National Motor Vehicle Title Information System tracks title transactions across all 50 state DMVs. Title brands like 'salvage,' 'rebuilt,' or 'fire' show up here even when Carfax misses them. A theft-recovery vehicle (stolen then recovered, still titled to original owner) will often carry a special brand in NMVTIS that's not visible elsewhere. Reports cost $2.50–$10 from approved providers (vehiclehistory.bja.ojp.gov/nmvtis_approved_providers).",
      },
      {
        heading: "Cross-check the physical VIN",
        body: "A stolen vehicle is sometimes given a 'clean' VIN by swapping the dashboard plate or door-jamb sticker with one from a junked donor car. The federal-mandated VIN locations are (1) the dashboard plate visible through the windshield, (2) the door jamb sticker, (3) the title, and (4) a hidden stamping on the frame or firewall. If all four don't match exactly, walk away — that's the strongest single signal of a swapped VIN.",
      },
      {
        heading: "Check the title state",
        body: "States with 'title-washing' loopholes (looser brand-disclosure rules) have historically been used to launder stolen-and-rebranded vehicles. Cross-reference the title's most-recent issuing state against the NMVTIS history — a title that bounced through three states in 18 months with different brand strings is suspicious.",
      },
      {
        heading: "What to do if a check comes back hot",
        body: "Do not buy the car. Contact local law enforcement — they need the VIN, the seller's contact info, and the meeting location. The seller is in immediate possession of stolen property, which is a federal-level crime; police will handle the seizure. Trying to negotiate or warn the seller before contacting police gives them time to flee.",
      },
    ],
  },
  {
    slug: "trailer-rv-vin-explained",
    title: "Trailer and RV VINs: how they differ from car VINs",
    description:
      "Trailers and RVs follow the same 17-character ISO 3779 format as cars but have different WMI ranges and very different recall coverage. Here's what to know.",
    publishedAt: "2026-05-13",
    intro:
      "A trailer VIN looks identical to a car VIN — same 17 characters, same WMI/VDS/VIS structure. But the data NHTSA holds on a trailer or motorhome is much thinner, and the recall coverage is differently scoped.",
    sections: [
      {
        heading: "Trailer-specific WMI ranges",
        body: "Trailer manufacturers often have dedicated WMIs separate from their truck/car operations. Carry-On Trailer Corp, PJ Trailers, Big Tex, Sundowner, and Featherlite each have distinct three-character WMI prefixes. The trailer's body type appears in the VDS but the encoding is manufacturer-specific — there's no universal table for 'utility' vs 'cargo' vs 'flatbed.'",
      },
      {
        heading: "Motorhome VINs: built on a chassis VIN",
        body: "A Class A or Class C motorhome typically has two VINs — one for the chassis (Ford, Freightliner, Mercedes-Benz, Workhorse) and one for the coach (Winnebago, Tiffin, Forest River, Thor). Recalls track both. A Ford F-53 chassis recall affects every Class A motorhome built on it regardless of coachbuilder. Always decode both VINs when buying a used RV.",
      },
      {
        heading: "What NHTSA tracks for trailers and RVs",
        body: "Open recall campaigns: yes, fully. Owner complaints: limited — owners file far fewer complaints on trailers than on cars, so coverage is thin. Safety ratings: no — NHTSA doesn't crash-test trailers or RVs. EPA fuel economy: only for the chassis. Towing-specific data (GAWR, GVWR, tongue weight): available via vPIC under the trailer's own VIN.",
      },
      {
        heading: "FMVSS 120 and 121: trailer-specific standards",
        body: "Trailers above 10,000 lbs GVWR must comply with FMVSS 121 (air brake system) and FMVSS 120 (tires). A trailer recall on a brake-system defect can ground the whole rig until repaired — and the dealer doing the repair must be a trailer-certified shop, not a regular car dealer.",
      },
      {
        heading: "Why you can't insure or register without a VIN",
        body: "Some homebuilt utility trailers (cargo carrier you welded yourself, etc.) don't have a manufacturer-issued VIN. Most states will issue a 'state-issued' or 'assigned' VIN after a DMV inspection, which lets you title and insure the trailer. The format is shorter and doesn't appear in NHTSA — it's a state-only ID, not an ISO 3779 VIN.",
      },
    ],
  },
  {
    slug: "motorcycle-vin-explained",
    title: "Motorcycle VINs explained",
    description:
      "Motorcycle VINs follow ISO 3779 but the VDS encodes displacement and frame type instead of body style. Here's how to decode them and where NHTSA coverage falls short.",
    publishedAt: "2026-05-13",
    intro:
      "A motorcycle VIN is 17 characters and follows the same WMI/VDS/VIS structure as a car. The encoding in the middle is different — there's no body style for a bike — but the same year/plant/serial rules apply.",
    sections: [
      {
        heading: "Where to find the VIN on a motorcycle",
        body: "Two universal locations: stamped on the steering head (under the handlebars, between the front fork tubes) and on a sticker affixed to the frame or steering tube. Some manufacturers also stamp the engine block, but the engine number is a separate identifier — engines get swapped, so the engine number doesn't always match the bike's VIN.",
      },
      {
        heading: "What the VDS encodes on a bike",
        body: "Without a body style or door count to encode, manufacturers use positions 4–8 for displacement (in cc or cubic inches), engine type (single/twin/triple/four), frame configuration (street/sport/cruiser/dual-sport), and intended market (US-49-state, California, Europe). Harley-Davidson, Honda, Yamaha, Kawasaki, Suzuki, BMW Motorrad, and Ducati each have their own VDS encoding — there's no universal motorcycle decoder.",
      },
      {
        heading: "NHTSA recall coverage is solid",
        body: "Motorcycle recall campaigns are tracked in the same NHTSA system as cars. Common motorcycle-specific recall categories: fuel-system leaks, brake-system corrosion (especially on older BMWs and Hondas), throttle body issues, ECU firmware, and tire-related campaigns. The recall lookup on this site returns the same data for a bike VIN as for a car VIN.",
      },
      {
        heading: "Crash-test ratings: none",
        body: "NHTSA does not crash-test motorcycles. There's no equivalent 5-Star rating, no rollover score. The closest data is from European agencies (Euro NCAP doesn't test bikes either) and from independent testing by Motorcycle Consumer News and the Motorcycle Industry Council. For real-world safety information, NHTSA's complaint database and recall history are the better signal.",
      },
      {
        heading: "Theft is more common than for cars",
        body: "Motorcycles get stolen at roughly four times the per-vehicle rate of cars. NICB VINCheck and NMVTIS both cover bikes, and the data tends to be slightly fresher because the insurance industry processes bike theft claims faster. Run both checks before buying used.",
      },
    ],
  },
  {
    slug: "vin-check-digit-explained",
    title: "What is the VIN check digit, and how to verify yours",
    description:
      "Position 9 of every US-market VIN is a mathematical hash of the other 16 characters. Here's the algorithm and a worked example.",
    publishedAt: "2026-05-13",
    intro:
      "Every North American VIN includes a check digit at position 9 — a single character (0–9 or X) computed from the other 16 characters. The math takes 30 seconds; the value is that a typo or fabricated VIN can be caught instantly.",
    sections: [
      {
        heading: "The algorithm in one paragraph",
        body: "Convert each character to a number (1–9 for digits, 1–9 cycling for letters per a fixed table that skips I, O, Q). Multiply each position by a weight (positions 1, 2, 3, 4, 5, 6, 7 use weights 8, 7, 6, 5, 4, 3, 2; position 8 uses weight 10; position 9 is the check digit itself; positions 10–17 use weights 9, 8, 7, 6, 5, 4, 3, 2). Sum the products. Take the sum modulo 11. If the remainder is 10, the check digit is 'X' — otherwise the digit equals the remainder.",
      },
      {
        heading: "The letter-to-number conversion table",
        body: "A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, J=1, K=2, L=3, M=4, N=5, P=7, R=9, S=2, T=3, U=4, V=5, W=6, X=7, Y=8, Z=9. Digits 0–9 are themselves. Letters I, O, Q never appear in VINs (they look like 1, 0, 0) so they have no value.",
      },
      {
        heading: "A worked example: 1HGCM82633A004352",
        body: "Position-by-position values: 1, 8, 7, 3, 4, 1, 8, 2, 6 (check digit), 3, 3, 1, 0, 0, 4, 3, 5, 2. Weighted sum: (1·8)+(8·7)+(7·6)+(3·5)+(4·4)+(1·3)+(8·2)+(2·10) + (3·9)+(3·8)+(1·7)+(0·6)+(0·5)+(4·4)+(3·3)+(5·2)+(2·1) = 8+56+42+15+16+3+16+20 + 27+24+7+0+0+16+9+10+2 = 176+95 = 271. 271 mod 11 = 7 — but the VIN has 6 at position 9, so this VIN would actually fail check-digit validation. (We picked a sample VIN; real Hondas validate correctly.)",
      },
      {
        heading: "Why some VINs validate as 'X'",
        body: "When the modulo result is exactly 10, position 9 must be the literal letter X. This is a deliberate ISO design choice — using X avoids confusion with the digit '0' and prevents needing a two-character check at position 9. About 9% of all valid VINs end up with X at position 9, just by the math.",
      },
      {
        heading: "European VINs skip this entirely",
        body: "European-market vehicles aren't required to have a valid check digit at position 9. Manufacturers may use that position to encode a model code instead. If you're decoding what looks like an invalid VIN that's actually European, the check digit will simply fail — and that's expected. See our guide on European VIN format for the full picture.",
      },
    ],
  },
  {
    slug: "nhtsa-5-star-safety-ratings",
    title: "Understanding NHTSA 5-Star safety ratings",
    description:
      "What each star measures, how the tests work, and why two cars with the same overall rating can have very different real-world crash performance.",
    publishedAt: "2026-05-13",
    intro:
      "The 5-Star Safety Ratings program (also called NCAP — New Car Assessment Program) is NHTSA's standardized crash-test scoring for new vehicles sold in the US. The overall star count is a simplification of three distinct tests with different methodologies.",
    sections: [
      {
        heading: "The three crash tests",
        body: "Frontal Crash: 35 mph head-on into a rigid barrier with two crash dummies (driver and front passenger). Side Crash: a 3,015-lb deformable barrier struck the vehicle at 38.5 mph, plus a 20 mph pole test on the driver's side. Rollover Resistance: the static stability factor (track width vs center-of-gravity height) plus a dynamic 'fishhook' maneuver. Each test gets its own 1–5 star score; the overall rating is a weighted average.",
      },
      {
        heading: "What an 'overall 5-star' rating actually requires",
        body: "All three sub-test scores must be at 4 or 5 stars. A vehicle with 5-star frontal and side crash scores but a 3-star rollover (common for tall SUVs) caps the overall rating at 4 stars. NHTSA started using this combined rating in 2011; pre-2011 ratings used different methodology and aren't directly comparable.",
      },
      {
        heading: "Why two same-rated cars can crash differently",
        body: "The crash test measures injury risk for a specific dummy size in a specific impact configuration. A 5-star compact car and a 5-star SUV both score 5 stars within their own size class — but in a real-world crash between the two, the SUV's mass advantage means the compact occupant absorbs disproportionately more force. Star ratings don't compare across vehicle classes; the IIHS small-overlap test partially does.",
      },
      {
        heading: "The complementary IIHS ratings",
        body: "The Insurance Institute for Highway Safety runs its own crash program with overlapping but different tests: small-overlap front (25% offset, more representative of single-vehicle crashes into poles or trees), moderate-overlap front, side crash with a SUV-height barrier (more punishing than NHTSA's), roof strength, and headlight quality. Most cars rated highly by NHTSA also rate highly by IIHS but a few diverge on small-overlap specifically.",
      },
      {
        heading: "What's not tested",
        body: "Pedestrian protection, post-crash fire risk, EV battery thermal events, and active-safety system performance (AEB, lane-keep, blind-spot) are not part of the 5-Star Safety Rating. IIHS publishes separate ratings for AEB effectiveness, and NHTSA flags vehicles with notable post-crash fire history through recall campaigns rather than star scores.",
      },
    ],
  },
  {
    slug: "fmvss-explained",
    title: "Federal Motor Vehicle Safety Standards (FMVSS) explained",
    description:
      "FMVSS are the federal regulations every car sold in the US must meet. Here's the framework, the key standards by category, and how recalls fit in.",
    publishedAt: "2026-05-13",
    intro:
      "FMVSS — Federal Motor Vehicle Safety Standards — are the binding rules manufacturers must self-certify against before selling a vehicle in the United States. NHTSA writes them under authority of the 1966 National Traffic and Motor Vehicle Safety Act, and roughly 60 active standards cover every safety-relevant system in a modern car.",
    sections: [
      {
        heading: "The three categories",
        body: "FMVSS are numbered by category. 100-series: crash avoidance (brakes, tires, lighting, controls). 200-series: crashworthiness (occupant protection in a crash — airbags, seatbelts, glazing, fuel system integrity). 300-series: post-crash survivability (fuel leakage limits, fire prevention). The number system isn't strictly chronological — 126 is electronic stability control, added in 2007, while 209 (seat belt assemblies) dates to 1967.",
      },
      {
        heading: "Key 100-series standards",
        body: "FMVSS 105 (hydraulic brakes), 121 (air brake systems for trucks and trailers), 108 (lamps, reflectors, and signaling), 110 (tire selection and rim placards), 126 (ESC mandatory for all cars since MY 2012), 138 (tire pressure monitoring required since MY 2008). When a vehicle doesn't meet one of these on assembly, that's a manufacturing defect; when a population of vehicles in the field starts failing one, that's recall material.",
      },
      {
        heading: "Key 200-series standards",
        body: "FMVSS 208 (occupant crash protection — the airbag standard), 213 (child restraint systems), 214 (side impact protection), 216 (roof crush resistance — strengthened in 2009 forcing many SUVs to redesign), 226 (ejection mitigation, mandatory MY 2018+). Most high-profile recalls are 208 violations — defective airbag inflators, seatbelt anchor failures, frontal-crash dummy results outside spec.",
      },
      {
        heading: "How self-certification works",
        body: "Unlike Europe's type-approval (where a government body certifies each model before sale), the US uses self-certification: the manufacturer applies the FMVSS, runs the required tests, and signs a certification label that gets affixed to the door jamb. NHTSA only audits a small sample. When NHTSA's audits or consumer complaints reveal a non-compliance, the manufacturer must recall affected vehicles regardless of how long ago they were built.",
      },
      {
        heading: "Why FMVSS matters when buying used",
        body: "A vehicle sold legally in the US has met FMVSS as of its assembly date. A gray-market import (a JDM or EU spec brought in under the 25-year rule, or a Canadian Tradesman truck without US speed-rated tires) hasn't been certified — which means it can't be insured in many states without modification, and any safety recall coverage is voluntary on the importer's part. Always confirm the door-jamb FMVSS certification sticker exists.",
      },
    ],
  },
  {
    slug: "tsb-technical-service-bulletin",
    title: "What is a Technical Service Bulletin (TSB), and how to find them",
    description:
      "TSBs aren't recalls. They're a manufacturer's official acknowledgement of a recurring issue plus the dealer-side fix. Here's how to read them and where they sit relative to recalls.",
    publishedAt: "2026-05-13",
    intro:
      "A Technical Service Bulletin (TSB) is a document a manufacturer issues to its dealer network describing a known issue on a specific year/make/model — and the diagnostic procedure or repair the dealer should apply when an owner brings the symptom in. Unlike recalls, TSBs are not free fixes and they're not mandatory.",
    sections: [
      {
        heading: "TSB vs Recall: the key distinction",
        body: "A recall is mandated when NHTSA determines a defect creates an unreasonable safety risk; the manufacturer must contact every affected owner and repair the vehicle for free. A TSB is the manufacturer's own determination that 'enough customers are reporting X that we're standardizing the dealer response.' TSBs cover all the issues that don't rise to safety-critical: rough idle, peeling paint, infotainment glitches, transmission shift hesitation, water leaks.",
      },
      {
        heading: "What's in a typical TSB",
        body: "A TSB number (manufacturer-assigned, format varies), the affected vehicle population (year, model, build date range, plant code), the symptom description, the diagnostic procedure, the parts list with part numbers, the labor time allotted, and warranty-claim codes. Some TSBs include 'goodwill' provisions — out-of-warranty repairs the dealer can submit for partial manufacturer reimbursement, especially within the first year or two after warranty expiry.",
      },
      {
        heading: "Where to find TSBs publicly",
        body: "NHTSA publishes a TSB database for every vehicle in their system — go to nhtsa.gov, look up the year/make/model, and the TSB list appears alongside the recall list. Each entry shows the TSB title, date, and component summary. The full PDFs aren't always free; some manufacturers release them, others restrict access to dealers and require a subscription (ALLDATA, Mitchell1, ProDemand).",
      },
      {
        heading: "Why TSBs matter to a buyer",
        body: "A vehicle with 30 TSBs against it for transmission, climate-control, and electrical issues is more troublesome than one with three TSBs for paint and a minor sensor. Reading the TSB list before buying tells you what known issues are 'common enough that the manufacturer wrote a fix for them' — a more reliable signal than scattered owner forum posts.",
      },
      {
        heading: "TSB-to-recall pipeline",
        body: "TSBs sometimes graduate to recalls when the underlying issue turns out to be safety-related. A transmission TSB for 'occasional loss of forward drive' that turns out to be intermittent rather than just inconvenient can trigger a recall under FMVSS 105. NHTSA's Office of Defects Investigation watches TSB databases for trends — if a manufacturer has issued multiple TSBs on the same component over time, an investigation often follows.",
      },
    ],
  },
  {
    slug: "spot-flood-damaged-car",
    title: "How to spot a flood-damaged car before buying",
    description:
      "Flood-damaged cars look fine on day one and start failing electronically over the next 24–36 months. Here's what to inspect and what to refuse to inspect.",
    publishedAt: "2026-05-13",
    intro:
      "Flood-damaged vehicles are among the most expensive used-car mistakes you can make. The wiring corrodes incrementally for years after submersion; the airbag-control module may pass diagnostic checks while sitting in a slowly oxidizing state. Avoiding one means knowing where to look.",
    sections: [
      {
        heading: "Check the title and the NMVTIS history first",
        body: "Federally branded 'Flood' titles are the easiest signal. A clean title in a state that recently flooded (look up the NOAA storm record for the title's issue state) deserves extra scrutiny. NMVTIS history (vehiclehistory.bja.ojp.gov, $2.50 from approved providers) will show flood brands even when the current state-issued title has 'washed' them off.",
      },
      {
        heading: "Smell tests",
        body: "Open the doors and the trunk and take a deep breath. Mildew, mold, and old-water smells are unmistakable — sellers spray air freshener but the underlying scent comes back as soon as the cabin warms up. If the trunk has a strong fresh-smelling carpet shampoo that doesn't match the rest of the car, that's a flag.",
      },
      {
        heading: "Look at the unobtainable spots",
        body: "Lift the carpet edge near the rocker panel — silt or mud at the base of the carpet means flood-line. Look under the dashboard with a flashlight — dried-out water marks on the bottom of the dash trim are diagnostic. Pop the spare tire well — silt and rust there is impossible to clean up convincingly. Pull the seatbelt all the way out and look at the bottom of the belt webbing for water staining.",
      },
      {
        heading: "Inspect the wiring harness",
        body: "Open the fuse box(es) — any green corrosion on the fuse terminals or relay sockets is a giveaway. Look under the engine for chalky white residue on the alternator and starter (water-deposit minerals). Check the underside of the hood-prop ball joints and the windshield-washer pump connectors for white-green oxidation.",
      },
      {
        heading: "Diagnostic-scan tells",
        body: "A pre-purchase OBD-II scan on a flood car will often show intermittent BCM, ABS, or airbag-system DTCs — codes that come and go as corrosion shifts inside connectors. A clean scan today isn't reassurance on a suspect car; ask for the scan to be repeated 48 hours later. A reputable seller will agree.",
      },
      {
        heading: "What to do if you've already bought one",
        body: "Federal Title Branding rules require sellers to disclose a flood brand on the title at transfer. If they didn't, you have a fraud claim. Document with photographs and a mechanic's affidavit, then file with your state attorney general and the FTC. State lemon-law treble damages often apply on top of the federal odometer fraud and DPPA causes of action.",
      },
    ],
  },
  {
    slug: "lemon-laws-by-state",
    title: "Lemon laws by state: which states have the strongest buyer protections",
    description:
      "Every state has a lemon law; not all are equal. Here's how to tell which states give you a refund, which only require repair attempts, and the patchier states for used-car buyers.",
    publishedAt: "2026-05-13",
    intro:
      "Lemon laws are state-level statutes that require manufacturers to refund or replace a vehicle that can't be repaired to spec within a defined number of attempts or days out-of-service. Every state has one for new cars; coverage for used cars varies dramatically.",
    sections: [
      {
        heading: "The federal floor: Magnuson-Moss",
        body: "The 1975 Magnuson-Moss Warranty Act sets a federal baseline — any written warranty must be honored, and consumers can sue for breach. It doesn't require a refund; it just makes warranty terms enforceable in federal court. State lemon laws stack on top of Magnuson-Moss and add the specific 'refund or replacement' remedy when the warranty obligation fails.",
      },
      {
        heading: "Strongest state laws (new cars)",
        body: "California, New York, Connecticut, New Jersey, and Massachusetts are the consensus top tier: 4 repair attempts (or 30 days out of service) on the same defect, refund or replacement plus attorney's fees, and arbitration is available but not mandatory. Most also cover used cars sold with a manufacturer warranty still in effect.",
      },
      {
        heading: "Used-car coverage varies wildly",
        body: "Massachusetts and New York have used-car-specific lemon laws with explicit refund triggers (the dealer must give a written warranty per the state's rules). New Jersey has one too. California's protection extends to certified pre-owned vehicles via the dealer's written warranty. Most other states limit used-car protection to whatever the warranty document explicitly promises — read the warranty before buying, especially the 'goodwill' clause and the arbitration provision.",
      },
      {
        heading: "How to invoke the law",
        body: "Document every repair attempt: dates, mileage, shop name, exact symptom description, parts replaced, and time the vehicle was held. Write a certified-mail letter to the manufacturer (not the dealer) describing the recurring issue and demanding either a refund or a replacement under your state's lemon law. Most state lemon laws give the manufacturer 30 days to respond before you can file in court.",
      },
      {
        heading: "Arbitration: the manufacturer's preferred path",
        body: "Most state lemon laws allow the manufacturer to demand arbitration before court. Arbitrators favor manufacturers when arbitration is run by the manufacturer's own program (BBB AUTO LINE, NCDS); state-run arbitration is much more even-handed. Check your state's specific statute for which arbitration program applies — and if it's manufacturer-run, expect to go to court for the refund or replacement.",
      },
    ],
  },
  {
    slug: "vin-mismatch-explained",
    title: "What does 'VIN mismatch' mean, and what to do",
    description:
      "A VIN mismatch flag — when the dashboard plate, door jamb sticker, title, and frame stamp don't all agree — is the strongest single signal of a stolen or rebodied vehicle. Here's what each mismatch typically indicates.",
    publishedAt: "2026-05-13",
    intro:
      "Modern vehicles carry the VIN in four federally-mandated locations: the dashboard plate visible through the windshield, the door-jamb sticker, the title document, and a hidden stamping on the frame or firewall. They must all agree. When they don't, you're looking at one of a small set of specific problems.",
    sections: [
      {
        heading: "Dashboard plate doesn't match the door jamb",
        body: "Most common cause of a real VIN mismatch: a replaced windshield where the installer swapped or omitted the plate. Honest mistake, usually fixable by ordering an OEM replacement plate. Less commonly: a stolen vehicle where the thief replaced the plate to match a donor VIN. Cross-check both against the title and the frame stamp — if all four don't agree, treat as suspect.",
      },
      {
        heading: "Door jamb sticker missing or replaced",
        body: "Door jamb stickers can be damaged in collision repair. A reputable body shop reorders the OEM sticker from the manufacturer's parts catalog (VIN-specific, $30–$60). A junked sticker with a different VIN means a swapped door, common after a crash where the body shop sourced a junkyard replacement.",
      },
      {
        heading: "Title doesn't match the dashboard plate",
        body: "Title-document mismatches are usually clerical — DMV data-entry mistakes are surprisingly frequent. If the title VIN differs by one character, ask the seller to apply for a corrected title before you buy. If the title VIN differs by more than one character, walk away — that's a sign of title fraud or a stolen-and-rebranded vehicle.",
      },
      {
        heading: "Frame VIN doesn't match the dashboard",
        body: "The frame VIN is the hardest one to fake because reaching it requires partial disassembly. A frame-VIN mismatch on a vehicle with all other VINs in agreement is almost always either (a) a frame replacement after major crash damage that was never declared, or (b) a vehicle assembled from two different totaled donors. Both are red flags. Refuse the sale.",
      },
      {
        heading: "Where to verify each VIN location",
        body: "The dashboard plate is on the driver's side, visible from outside through the windshield. The door jamb sticker is on the driver's door jamb (look for the federal certification label). The frame VIN's exact location is manufacturer-specific — typically a stamped pad on the right-front frame rail, the firewall, or under the front passenger seat. Manufacturer service manuals (alldatadiy.com subscription) document the precise spot for every model.",
      },
    ],
  },
  {
    slug: "title-washing-explained",
    title: "Title washing: what it is and how to detect it",
    description:
      "Moving a salvage-branded vehicle through multiple states to strip the brand off the title is illegal but common. NMVTIS exists to catch it. Here's how it works and how to verify.",
    publishedAt: "2026-05-13",
    intro:
      "Title washing is the practice of re-registering a vehicle that's been branded 'Salvage,' 'Rebuilt,' 'Flood,' or another state-specific designation in a different state with looser brand-disclosure rules, in order to obtain a clean-looking title. It's illegal in every state but enforcement varies.",
    sections: [
      {
        heading: "How the wash works mechanically",
        body: "Step 1: vehicle is totaled and gets a 'Salvage' brand from the original state. Step 2: the vehicle is sold at auction to an out-of-state buyer who registers it in a state that either (a) doesn't carry over the brand on out-of-state titles or (b) doesn't check NMVTIS at all. Step 3: the new state issues a fresh title with no brand. Step 4: the vehicle gets resold to a consumer who can't see the original brand.",
      },
      {
        heading: "States historically vulnerable to washing",
        body: "Brand-handling rules have changed significantly since federal NMVTIS reporting became mandatory in 2009. Pre-2009 the most-cited 'wash states' were Alabama, Mississippi, Louisiana, and Georgia, but all four have tightened. Today's gaps tend to involve states that haven't fully reconciled their title-issuance software with NMVTIS, plus cross-border issues with Canadian provinces where the federal NMVTIS database doesn't reach.",
      },
      {
        heading: "Why NMVTIS catches most of them",
        body: "Every state DMV is now required to report title transactions into NMVTIS. The federal database aggregates brand history across all 50 states — so even if a 'Salvage' brand was stripped during a state-to-state transfer, the original brand is still in NMVTIS and shows up on the report. NMVTIS reports cost $2.50–$10 from approved providers.",
      },
      {
        heading: "What washed vehicles look like in the wild",
        body: "Title shows recent transfers across two or more states within a short time window. State of issuance doesn't match the seller's residence. The car shows signs of moderate-to-heavy collision repair (uneven panel gaps, mismatched paint shade, replacement airbag sticker on the steering wheel) but the title is clean. The seller pushes hard on a fast cash sale before you can do an NMVTIS check.",
      },
      {
        heading: "What to do if you've bought a washed title",
        body: "Federal law (49 USC § 32710 for odometer fraud, 49 USC § 32705 for false certification of title brands) creates a private right of action with treble damages or $10,000, whichever is greater, plus attorney's fees. State consumer protection statutes often stack on top. Document the original brand from NMVTIS, the seller's representation in the bill of sale, and any title-search certificate the dealer provided. File with state attorney general and FTC simultaneously — federal involvement tends to accelerate state response.",
      },
    ],
  },
];

export function findGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
