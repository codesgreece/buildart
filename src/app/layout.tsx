import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4f2ee",
};

const display = Instrument_Serif({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BUILDART — Από τα θεμέλια μέχρι την ολοκλήρωση",
    template: "%s · BUILDART",
  },
  description:
    "Κατασκευαστική εταιρεία και προμηθευτής δομικών υλικών στη Θεσσαλονίκη. Κουφώματα PVC, θωρακισμένες πόρτες, αντλίες θερμότητας, λέβητες, κλιματιστικά, τζάκια και ενεργειακή αναβάθμιση από το 1985.",
  keywords: [
    "κατασκευαστική εταιρεία Θεσσαλονίκη",
    "ενεργειακή αναβάθμιση",
    "κουφώματα PVC",
    "αντλίες θερμότητας",
    "λέβητες αερίου",
    "κλιματιστικά",
    "ενεργειακά τζάκια",
    "ηλιακοί θερμοσίφωνες",
    "θωρακισμένες πόρτες",
    "BUILDART",
  ],
  authors: [{ name: "BUILDART" }],
  openGraph: {
    type: "website",
    locale: "el_GR",
    siteName: "BUILDART",
    title: "BUILDART — Από τα θεμέλια μέχρι την ολοκλήρωση",
    description:
      "Ολοκληρωμένες λύσεις κατασκευής, ανακαίνισης και ενεργειακής αναβάθμισης στη Θεσσαλονίκη.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BUILDART",
    description: "Από τα θεμέλια μέχρι την ολοκλήρωση.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="el"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--ba-bg)] text-[var(--ba-ink)]">
        {children}
      </body>
    </html>
  );
}
