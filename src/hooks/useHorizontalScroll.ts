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

        const totalWidth = panels.reduce((acc, panel) => acc + panel.offsetWidth, 0);
        const scrollDistance = totalWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1,
            end: () => `+=${scrollDistance}`,
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
