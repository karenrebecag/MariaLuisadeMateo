"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/src/lib/gsap-registry";

export function ScrollProgressBar() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const wrap = wrapRef.current;
    if (!bar || !wrap) return;

    gsap.set(bar, { scaleX: 0 });

    const tween = gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });

    function onClick(e: MouseEvent) {
      const progress = e.clientX / wrap!.offsetWidth;
      const scrollPosition =
        progress * (document.body.scrollHeight - window.innerHeight);
      window.scrollTo({ top: scrollPosition, behavior: "smooth" });
    }

    wrap.addEventListener("click", onClick);

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      wrap.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div ref={wrapRef} className="progress-bar-wrap">
      <div ref={barRef} className="progress-bar" />
    </div>
  );
}
