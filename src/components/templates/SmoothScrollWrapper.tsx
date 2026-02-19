"use client";

import { useLenis } from "@/src/hooks/useLenis";

interface SmoothScrollWrapperProps {
  children: React.ReactNode;
}

export function SmoothScrollWrapper({ children }: SmoothScrollWrapperProps) {
  useLenis();
  return <>{children}</>;
}
