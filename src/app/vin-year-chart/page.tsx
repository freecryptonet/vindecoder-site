import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

const SITE = "https://vindecoder.site";

export const metadata: Metadata = {
  title: "VIN Year Chart — Decode the 10th Character of Any 17-Digit VIN",
  description:
    "ISO 3779 model-year letter chart. Map the 10th character of a 17-digit VIN to a model year (1980–2039). Free reference, no signup.",
  alternates: { canonical: "/vin-year-chart" },
};

const ROWS: { ch: string; y1: number; y2: number }[] = [
  { ch: "A", y1: 1980, y2: 2010 }, { ch: "B", y1: 1981, y2: 2011 },
  { ch: "C", y1: 1982, y2: 2012 }, { ch: "D", y1: 1983, y2: 2013 },
  { ch: "E", y1: 1984, y2: 2014 }, { ch: "F", y1: 1985, y2: 2015 },
  { ch: "G", y1: 1986, y2: 2016 }, { ch: "H", y1: 1987, y2: 2017 },
  { ch: "J", y1: 1988, y2: 2018 }, { ch: "K", y1: 1989, y2: 2019 },
  { ch: "L", y1: 1990, y2: 2020 }, { ch: "M", y1: 1991, y2: 2021 },
  { ch: "N", y1: 1992, y2: 2022 }, { ch: "P", y1: 1993, y2: 2023 },
  { ch: "R", y1: 1994, y2: 2024 }, { ch: "S", y1: 1995, y2: 2025 },
  { ch: "T", y1: 1996, y2: 2026 }, { ch: "V", y1: 1997, y2: 2027 },
  { ch: "W", y1: 1998, y2: 2028 }, { ch: "X", y1: 1999, y2: 2029 },
  { ch: "Y", y1: 2000, y2: 2030 }, { ch: "1", y1: 2001, y2: 2031 },
  { ch: "2", y1: 2002, y2: 2032 }, { ch: "3", y1: 2003, y2: 2033 },
  { ch: "4", y1: 2004, y2: 2034 }, { ch: "5", y1: 2005, y2: 2035 },
  { ch: "6", y1: 2006, y2: 2036 }, { ch: "7", y1: 2007, y2: 2037 },
  { ch: "8", y1: 2008, y2: 2038 }, { ch: "9", y1: 2009, y2: 2039 },
];

export default function VinYearChartPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE },
          { name: "VIN Year Chart", url: `${SITE}/vin-year-chart` },
        ])}
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "VIN Year Chart" }]} />
        <header className="mt-6 max-w-3xl">
          <h1 className="text-h1-page text-slate-950">VIN Year Chart</h1>
          <p className="mt-3 text-base text-muted">
            The 10th character of a 17-digit VIN is the model year. ISO 3779
            cycles letters and digits on a 30-year loop, so any single letter
            maps to two possible years — the 11th character (plant code) and
            the surrounding context resolve which.
          </p>
          <p className="mt-2 text-sm text-muted">
            <strong>Excluded characters:</strong> I, O, Q, U, Z, and 0 are
            never used in position 10 to avoid confusion with similar-looking
            letters and numbers.
          </p>
        </header>

        <Card className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
                <th className="py-2 pr-4">Char</th>
                <th className="py-2 pr-4">Model year (cycle 1)</th>
                <th className="py-2">Model year (cycle 2)</th>
              </tr>
            </thead>
            <tbody className="font-medium text-slate-950">
              {ROWS.map((r) => (
                <tr key={r.ch} className="border-b border-border last:border-b-0">
                  <td className="py-2 pr-4 vin-mono text-base">{r.ch}</td>
                  <td className="py-2 pr-4 tabular-nums">{r.y1}</td>
                  <td className="py-2 tabular-nums">{r.y2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="mt-8 text-sm text-muted">
          <h2 className="text-h3 text-slate-950">A note on European VINs</h2>
          <p className="mt-2">
            ISO 3779 makes the year encoding optional outside North America.
            Some European-built vehicles set position 10 to a fixed character
            ('0' is common) regardless of build year. If a VIN&rsquo;s 10th
            character doesn&rsquo;t match the chart above, the year may be
            stamped on the manufacturer plate at the door jamb instead.
          </p>
        </Card>
      </div>
    </>
  );
}
