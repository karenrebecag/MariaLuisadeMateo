"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/src/lib/gsap-registry";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(DrawSVGPlugin);
}

interface DoodlePath {
  d: string;
  strokeWidth?: number;
}

export const doodles = {
  brushStroke: {
    viewBox: "0 0 800 200",
    paths: [{ d: "M30 100C80 40 160 160 240 100C320 40 400 160 480 100C560 40 640 160 720 100C760 70 780 90 770 100", strokeWidth: 3 }],
  },
  spiral: {
    viewBox: "0 0 300 300",
    paths: [{ d: "M150 150C150 120 180 100 200 110C220 120 230 150 220 170C210 190 180 200 160 190C140 180 130 155 140 135C150 115 175 105 195 115C215 125 225 155 210 175C195 195 165 205 145 190C125 175 120 145 135 125C150 105 185 95 205 115", strokeWidth: 2.5 }],
  },
  starBurst: {
    viewBox: "0 0 200 200",
    paths: [
      { d: "M100 20L100 180", strokeWidth: 2 },
      { d: "M20 100L180 100", strokeWidth: 2 },
      { d: "M40 40L160 160", strokeWidth: 2 },
      { d: "M160 40L40 160", strokeWidth: 2 },
    ],
  },
  flowingVine: {
    viewBox: "0 0 100 600",
    paths: [{ d: "M50 30C20 80 80 130 50 180C20 230 80 280 50 330C20 380 80 430 50 480C20 530 60 560 50 570", strokeWidth: 2.5 }],
  },
  splatter: {
    viewBox: "0 0 300 300",
    paths: [
      { d: "M150 80C155 60 170 55 175 70C180 85 165 95 155 85", strokeWidth: 2 },
      { d: "M80 150C85 130 100 125 105 140C110 155 95 165 85 155", strokeWidth: 2 },
      { d: "M200 180C205 160 220 155 225 170C230 185 215 195 205 185", strokeWidth: 2 },
      { d: "M120 220C125 200 140 195 145 210C150 225 135 235 125 225", strokeWidth: 2 },
      { d: "M220 100C225 80 240 75 245 90C250 105 235 115 225 105", strokeWidth: 2 },
    ],
  },
  swoosh: {
    viewBox: "0 0 1000 400",
    paths: [{ d: "M30 350C150 350 200 50 350 50C500 50 450 350 600 350C750 350 700 50 850 50C920 50 960 150 970 200", strokeWidth: 3 }],
  },
  leaf: {
    viewBox: "0 0 200 200",
    paths: [
      { d: "M100 30C60 60 30 100 50 140C70 180 100 170 100 170C100 170 130 180 150 140C170 100 140 60 100 30Z", strokeWidth: 2 },
      { d: "M100 30C100 30 95 100 100 170", strokeWidth: 1.5 },
    ],
  },
  scribbleCircle: {
    viewBox: "0 0 250 250",
    paths: [{ d: "M125 40C180 35 220 70 225 125C230 180 195 220 140 225C85 230 40 195 35 140C30 85 65 45 120 40C175 35 215 65 220 120C225 175 190 215 135 220", strokeWidth: 2.5 }],
  },
  wavyLine: {
    viewBox: "0 0 600 80",
    paths: [{ d: "M20 40C60 10 100 70 140 40C180 10 220 70 260 40C300 10 340 70 380 40C420 10 460 70 500 40C540 10 570 50 580 40", strokeWidth: 2.5 }],
  },
} as const;

export type DoodleName = keyof typeof doodles;

interface DoodleScrollProps {
  doodle: DoodleName;
  className?: string;
  color?: string;
  start?: string;
  end?: string;
  stagger?: number;
}

export function DoodleScroll({
  doodle,
  className = "",
  color,
  start = "clamp(top 80%)",
  end = "clamp(bottom 20%)",
  stagger = 0.15,
}: DoodleScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const raw = doodles[doodle];
  const pathData: DoodlePath[] = raw.paths.map((p) => ({ d: p.d, strokeWidth: p.strokeWidth }));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const triggerEl = el.closest("section");
    const paths = el.querySelectorAll<SVGPathElement>("path");

    if (!triggerEl || !paths.length) return;

    const tween = gsap.fromTo(
      paths,
      { drawSVG: "0%" },
      {
        drawSVG: "100%",
        duration: 1,
        ease: "none",
        stagger,
        scrollTrigger: {
          trigger: triggerEl,
          start,
          end,
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none ${className}`}
      style={{ color: color || "var(--primary)" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={raw.viewBox}
        fill="none"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        {pathData.map((p, i) => (
          <path
            key={i}
            d={p.d}
            stroke="currentColor"
            strokeWidth={p.strokeWidth ?? 2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}
      </svg>
    </div>
  );
}
