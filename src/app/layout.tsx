import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vindecoder.site"),
  title: {
    default: "Free VIN Decoder — NHTSA Recalls, Safety Ratings & Vehicle History | VinDecoder",
    template: "%s | VinDecoder",
  },
  description:
    "Decode any 17-digit VIN. Get recalls, complaints, safety ratings, and TSBs from official NHTSA data. 100% free, instant, no signup.",
  applicationName: "VinDecoder",
  authors: [{ name: "VinDecoder" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "VinDecoder",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-surface">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
