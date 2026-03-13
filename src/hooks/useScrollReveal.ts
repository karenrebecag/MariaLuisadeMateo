"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/src/lib/gsap-registry";
import { useTransitionReady } from "@/src/hooks/useTransitionReady";

interface ScrollRevealOptions {
  /** CSS selector to find child elements to animate */
  selector?: string;
  /** Additional elements to include (e.g. a sibling ref) */
  extras?: React.RefObject<HTMLElement | null>[];
  /** Y offset in pixels (default: 48) */
  y?: number;
  /** Stagger delay between items (default: 0.12) */
  stagger?: number;
  /** Animation duration (default: 0.85) */
  duration?: number;
  /** ScrollTrigger start position (default: "top 82%") */
  start?: string;
}

/**
 * Hides elements before first paint (useLayoutEffect) then reveals them
 * with a staggered GSAP animation when they scroll into view.
 *
 * Eliminates the flash-of-visible-content that happens when gsap.set(autoAlpha:0)
 * runs inside useEffect (after paint) instead of useLayoutEffect (before paint).
 */
export function useScrollReveal(
  ref: React.RefObject<HTMLElement | null>,
  options: ScrollRevealOptions = {}
) {
  const {
    selector = ":scope > *",
    extras = [],
    y = 48,
    stagger = 0.12,
    duration = 0.85,
    start = "top 82%",
  } = options;

  const ready = useTransitionReady();
  const hasSetInitial = useRef(false);

  const getItems = () => {
    const el = ref.current;
    if (!el) return null;
    const items: HTMLElement[] = Array.from(
      el.querySelectorAll<HTMLElement>(selector)
    );
    for (const extra of extras) {
      if (extra.current) items.push(extra.current);
    }
    return items.length ? items : null;
  };

  // Phase 1: hide before first paint
  useLayoutEffect(() => {
    if (hasSetInitial.current) return;
    const items = getItems();
    if (!items) return;
    gsap.set(items, { y, autoAlpha: 0 });
    hasSetInitial.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Phase 2: reveal on scroll (after page transition)
  useEffect(() => {
    if (!ready) return;
    const el = ref.current;
    const items = getItems();
    if (!el || !items) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        gsap.to(items, {
          y: 0,
          autoAlpha: 1,
          duration,
          ease: "power4.inOut",
          stagger,
          onComplete: () => {
            gsap.set(items, { clearProps: "all" });
          },
        });
      },
    });

    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
}
