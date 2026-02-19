"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/src/lib/gsap-registry";

export function usePageTransition() {
  const columnsRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const el = columnsRef.current;
    if (!el) return;

    const columns = el.querySelectorAll<HTMLElement>(".transition-column");

    gsap.set(columns, { yPercent: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
      },
    });

    tl.to(columns, {
      yPercent: -100,
      duration: 0.8,
      stagger: 0.08,
      ease: "power3.inOut",
      delay: 0.3,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return { columnsRef, isComplete };
}
