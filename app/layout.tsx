import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CÉLÉBRATION NIGHT — HAGIAZO Ministry",
  description: "CÉLÉBRATION NIGHT — Une génération. Une foi. Une célébration.",
  openGraph: {
    title: "CÉLÉBRATION NIGHT — HAGIAZO Ministry",
    description: "CÉLÉBRATION NIGHT — Une génération. Une foi. Une célébration.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "CÉLÉBRATION NIGHT — HAGIAZO Ministry",
    description: "CÉLÉBRATION NIGHT — Une génération. Une foi. Une célébration.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${bebasNeue.variable} ${montserrat.variable}`}>
      <body className="font-body min-h-screen bg-cn-ember-dark text-cn-white antialiased">
        {children}
      </body>
    </html>
  );
}
