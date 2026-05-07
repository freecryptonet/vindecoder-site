/**
 * Year-page editorial helpers — turn raw NHTSA aggregates into the prose +
 * structured FAQ that lives at the top of /makes/[make]/[model]/[year].
 *
 * Both the intro paragraph and the FAQs are deterministic functions of the
 * counts; no LLM, no boilerplate. That keeps the language tight, lets the
 * page render without a build-time fetch, and avoids duplicate-content
 * pattern penalties — every Year page reads slightly different because the
 * counts differ.
 */

export interface YearEditorialInput {
  year: string | number;
  make: string;
  model: string;
  recallsCount: number;
  complaintsCount: number;
  safetyRating: string | null;
  investigationsCount: number;
  mfrCommsCount: number;
  topComponents?: string[];
}

export function yearEditorialIntro(d: YearEditorialInput): string {
  const ymm = `${d.year} ${d.make} ${d.model}`;
  const parts: string[] = [];

  // Sentence 1 — the headline counts.
  if (d.recallsCount > 0 || d.complaintsCount > 0) {
    const bits: string[] = [];
    if (d.recallsCount > 0)
      bits.push(`${d.recallsCount} NHTSA recall ${d.recallsCount === 1 ? "campaign" : "campaigns"}`);
    if (d.complaintsCount > 0)
      bits.push(`${d.complaintsCount} owner ${d.complaintsCount === 1 ? "complaint" : "complaints"}`);
    parts.push(
      `The ${ymm} has ${joinAnd(bits)} on file with the National Highway Traffic Safety Administration.`,
    );
  } else {
    parts.push(
      `The ${ymm} has no NHTSA recall campaigns or owner complaints on file. That can mean a clean record or low cumulative reporting volume — both are useful signals.`,
    );
  }

  // Sentence 2 — components / safety colour.
  const colour: string[] = [];
  if (d.topComponents && d.topComponents.length > 0) {
    const list = d.topComponents.slice(0, 2).map((c) => c.toLowerCase()).join(" and ");
    colour.push(`The most-reported components are ${list}.`);
  }
  if (d.safetyRating && /^[1-5]$/.test(d.safetyRating)) {
    colour.push(`NHTSA gave the model an overall ${d.safetyRating}-star rating in 5-Star Safety testing.`);
  }
  if (d.investigationsCount > 0) {
    colour.push(
      `${d.investigationsCount} defect ${d.investigationsCount === 1 ? "investigation" : "investigations"} ${d.investigationsCount === 1 ? "is" : "are"} on record.`,
    );
  }
  if (colour.length > 0) parts.push(colour.join(" "));

  // Sentence 3 — what the page covers.
  parts.push(
    `Below: every recall campaign, the most recent owner complaints, EPA fuel-economy figures, and any open NHTSA investigations or technical service bulletins for the ${ymm}.`,
  );

  return parts.join(" ");
}

export interface YearFaqEntry {
  question: string;
  answer: string;
}

export function yearFaqs(d: YearEditorialInput): YearFaqEntry[] {
  const ymm = `${d.year} ${d.make} ${d.model}`;
  const out: YearFaqEntry[] = [];

  out.push({
    question: `How many recalls does the ${ymm} have?`,
    answer:
      d.recallsCount === 0
        ? `The ${ymm} has no open NHTSA recall campaigns on file.`
        : `NHTSA lists ${d.recallsCount} recall ${d.recallsCount === 1 ? "campaign" : "campaigns"} for the ${ymm}. Each campaign affects a portion of the model year and lists the specific component, the safety risk, and the dealer remedy.`,
  });

  out.push({
    question: `How many owner complaints have been filed for the ${ymm}?`,
    answer:
      d.complaintsCount === 0
        ? `Owners haven't filed complaints with NHTSA for the ${ymm}.`
        : `Owners have filed ${d.complaintsCount} complaint${d.complaintsCount === 1 ? "" : "s"} with NHTSA for the ${ymm}. Each complaint includes the component category, a free-text description of the failure, and any crash, fire, injury, or fatality flags.`,
  });

  if (d.safetyRating && /^[1-5]$/.test(d.safetyRating)) {
    out.push({
      question: `What's the NHTSA safety rating for the ${ymm}?`,
      answer: `NHTSA's 5-Star Safety Ratings program gave the ${ymm} an overall ${d.safetyRating}-star rating across frontal-crash, side-crash, and rollover testing.`,
    });
  }

  if (d.investigationsCount > 0 || d.mfrCommsCount > 0) {
    const bits: string[] = [];
    if (d.investigationsCount > 0)
      bits.push(`${d.investigationsCount} defect investigation${d.investigationsCount === 1 ? "" : "s"}`);
    if (d.mfrCommsCount > 0)
      bits.push(`${d.mfrCommsCount} technical service bulletin${d.mfrCommsCount === 1 ? "" : "s"}`);
    out.push({
      question: `Are there active investigations or TSBs on the ${ymm}?`,
      answer: `NHTSA has ${joinAnd(bits)} on record for the ${ymm}. TSBs are guidance the manufacturer issues to dealers about field-reported issues and their remedies.`,
    });
  }

  return out;
}

function joinAnd(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/** FAQPage JSON-LD body. Pair with the JsonLd component. */
export function faqPageJsonLd(faqs: YearFaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
