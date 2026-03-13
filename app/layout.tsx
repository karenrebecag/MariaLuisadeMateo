import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./navigation.css";

const SITE_URL = "https://demateo.mx";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "María Luisa de Mateo — Artista Mexicana",
    template: "%s | María Luisa de Mateo",
  },
  description:
    "Portafolio de arte de María Luisa de Mateo Venturini. Pintura realista, retratos, paisajes y naturaleza muerta. Óleo sobre tela.",
  keywords: [
    "María Luisa de Mateo",
    "artista mexicana",
    "pintura realista",
    "retratos al óleo",
    "arte contemporáneo México",
    "óleo sobre tela",
    "realismo abstracto",
    "paisajes",
    "naturaleza muerta",
    "arte CDMX",
  ],
  authors: [{ name: "María Luisa de Mateo Venturini" }],
  creator: "María Luisa de Mateo Venturini",
  openGraph: {
    type: "website",
    siteName: "María Luisa de Mateo",
    locale: "es_MX",
    alternateLocale: "en_US",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "María Luisa de Mateo — Artista Mexicana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f2ed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
