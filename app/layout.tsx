import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { TransitionProvider } from "@/src/lib/transition-context";
import { CustomCursor } from "@/src/components/atoms/CustomCursor";
import "./globals.css";
import "./navigation.css";

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
      <body className="font-sans antialiased">
        <CustomCursor />
        <TransitionProvider>
          {children}
        </TransitionProvider>
        <Analytics />
      </body>
    </html>
  );
}
