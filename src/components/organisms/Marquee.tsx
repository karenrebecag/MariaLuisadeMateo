"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/src/lib/gsap-registry";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  text?: string;
  className?: string;
}

export function Marquee({ text = "de Mateo", className }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const items = track.querySelectorAll<HTMLElement>(".marquee-item");
    const totalWidth = items[0]?.offsetWidth ?? 0;

    const tl = gsap.to(track, {
      x: -totalWidth,
      duration: 20,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tl.kill();
    };
  }, []);

  const repeats = Array.from({ length: 6 });

  return (
    <div className={cn("overflow-hidden py-10 md:py-16", className)}>
      <div ref={trackRef} className="flex w-max items-center">
        {repeats.map((_, i) => (
          <div key={i} className="marquee-item flex shrink-0 items-center gap-8 px-8">
            <span className="whitespace-nowrap font-serif text-6xl italic text-foreground/10 md:text-8xl">
              {text}
            </span>
            <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}
