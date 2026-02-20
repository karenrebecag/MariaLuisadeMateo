import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./navigation.css";

export const metadata: Metadata = {
  title: "Maria Luisa de Mateo",
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
