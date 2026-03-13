"use client";

import { useRef, type ReactNode } from "react";
import { useScrollReveal } from "@/src/hooks/useScrollReveal";

interface RevealOnScrollProps {
  children: ReactNode;
  as?: keyof HTMLElementTagNameMap;
  className?: string;
  stagger?: number;
  selector?: string;
}

export function RevealOnScroll({
  children,
  className,
  stagger = 0.12,
  selector = ":scope > *",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollReveal(ref, { selector, stagger });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
