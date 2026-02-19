"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/src/lib/gsap-registry";

interface UseHorizontalScrollOptions {
  panelSelector: string;
}

export function useHorizontalScroll({ panelSelector }: UseHorizontalScrollOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(panelSelector, track);
        if (panels.length === 0) return;

        const getScrollDistance = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: container,
            pin: true,
            anticipatePin: 1,
            scrub: 1,
            end: () => `+=${getScrollDistance()}`,
            invalidateOnRefresh: true,
          },
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.set(track, { x: 0 });
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [panelSelector]);

  return { containerRef, trackRef };
}
