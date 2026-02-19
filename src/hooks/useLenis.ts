"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/src/lib/gsap-registry";

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // On touch devices (iOS/Android), Lenis conflicts with GSAP ScrollTrigger pinning:
    // it introduces lerp lag (issue 1), breaks pin release (issue 2), and its touch
    // event interception fights with normalizeScroll (issue 3).
    // Native inertia scroll is sufficient on touch — normalizeScroll handles iOS quirks.
    if (ScrollTrigger.isTouch === 1) {
      ScrollTrigger.normalizeScroll(true);
      return;
    }

    const lenis = new Lenis({
      lerp: 0.165,
      wheelMultiplier: 1.25,
    });

    lenisRef.current = lenis;

    // Connect Lenis to ScrollTrigger (Osmo pattern)
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
