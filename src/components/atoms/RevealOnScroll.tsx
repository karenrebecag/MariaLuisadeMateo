"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/src/lib/gsap-registry";
import { useTransitionReady } from "@/src/hooks/useTransitionReady";

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
  const ready = useTransitionReady();

  useEffect(() => {
    if (!ready) return;

    const el = ref.current;
    if (!el) return;

    const items = Array.from(el.querySelectorAll<HTMLElement>(selector));
    if (!items.length) items.push(el);

    gsap.set(items, { y: 48, autoAlpha: 0 });

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 82%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          ease: "power4.inOut",
          stagger,
          onComplete: () => {
            gsap.set(items, { clearProps: "all" });
          },
        });
      },
    });

    return () => st.kill();
  }, [ready, stagger, selector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
