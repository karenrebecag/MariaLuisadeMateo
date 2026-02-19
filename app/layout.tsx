import type { Metadata, Viewport } from "next";
import { Roboto, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { TransitionProvider } from "@/src/lib/transition-context";
import "./globals.css";
import "./navigation.css";

const _roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

const _playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Maria Luisa de Mateo | Pintura",
  description:
    "Portafolio de arte de Maria Luisa de Mateo Venturini. Pintura realista, retratos, paisajes y naturaleza muerta.",
};

export const viewport: Viewport = {
  themeColor: "#f5f2ed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${_roboto.variable} ${_playfair.variable} font-sans antialiased`}>
        <TransitionProvider>
          {children}
        </TransitionProvider>
        <Analytics />
      </body>
    </html>
  );
}
