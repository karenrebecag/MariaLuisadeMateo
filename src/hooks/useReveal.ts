"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/src/lib/gsap-registry";

interface UseRevealOptions {
  y?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  childSelector?: string;
}

export function useReveal({
  y = 60,
  duration = 1,
  delay = 0,
  stagger = 0.1,
  childSelector,
}: UseRevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = childSelector
      ? gsap.utils.toArray<HTMLElement>(childSelector, el)
      : [el];

    gsap.set(targets, { y, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          y: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [y, duration, delay, stagger, childSelector]);

  return ref;
}
