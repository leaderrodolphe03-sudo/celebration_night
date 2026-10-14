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
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CELEBRATION NIGHT — HAGIAZO Ministry",
  description: "CELEBRATION NIGHT — Une génération. Une foi. Une CELEBRATION.",
  openGraph: {
    title: "CELEBRATION NIGHT — HAGIAZO Ministry",
    description: "CELEBRATION NIGHT — Une génération. Une foi. Une CELEBRATION.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "CELEBRATION NIGHT — HAGIAZO Ministry",
    description: "CELEBRATION NIGHT — Une génération. Une foi. Une CELEBRATION.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${bebasNeue.variable} ${montserrat.variable}`}>
      <body className="font-body min-h-screen bg-cn-black text-cn-white antialiased">
        {children}
      </body>
    </html>
  );
}
