"use client";

import { useEffect } from "react";
import { gsap } from "@/src/lib/gsap-registry";

export function CustomCursor() {
  useEffect(() => {
    gsap.set(".cursor", { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const xTo = gsap.quickTo(".cursor", "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(".cursor", "y", { duration: 0.6, ease: "power3" });

    let revealed = false;
    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!revealed) {
        gsap.to(".cursor", { autoAlpha: 1, duration: 0.3 });
        revealed = true;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return <div className="cursor" aria-hidden="true" />;
}
