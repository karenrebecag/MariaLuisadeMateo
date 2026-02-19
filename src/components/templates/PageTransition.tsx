"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/src/lib/gsap-registry";
import { cn } from "@/lib/utils";

const COLS = 5;

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const columns = wrap.querySelectorAll<HTMLElement>("[data-transition-column]");
    if (!columns.length) return;

    const tl = gsap.timeline({
      onComplete: () => setDone(true),
    });

    // Columns start covering the screen (yPercent: 100 = fully visible)
    tl.set(columns, { yPercent: 100 });

    // Slide columns down to reveal content (yPercent: 200 = below viewport)
    tl.to(columns, {
      yPercent: 200,
      duration: 0.6,
      ease: "power2.inOut",
      stagger: { each: 0.06, from: "start" },
      delay: 0.3,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <div
        ref={wrapRef}
        data-transition-wrap=""
        className={cn("transition-wrap", done && "hidden")}
        aria-hidden="true"
      >
        <div className="transition__panels">
          {Array.from({ length: COLS }).map((_, i) => (
            <div key={i} data-transition-column="" className="transition__panel" />
          ))}
        </div>
        <div className="transition__lines">
          {Array.from({ length: COLS }).map((_, i) => (
            <div
              key={i}
              className={cn("transition__line", i === COLS - 1 && "is--last")}
            />
          ))}
        </div>
      </div>
      {children}
    </>
  );
}
