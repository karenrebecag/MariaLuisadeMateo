"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { gsap, ScrollTrigger } from "@/src/lib/gsap-registry";
import {
  ALL_IMAGES,
  shuffleImages,
  DESKTOP_COUNT,
} from "@/src/data/gallery-images";
import { usePageTransitionNav } from "@/src/lib/transition-context";

// Aspect-ratio cycle applied per item index
const ASPECT_CYCLE = [
  "aspect-[3/4]", "aspect-[4/3]", "aspect-square",
  "aspect-[3/4]", "aspect-[4/3]",
];

const COLS = 10;

// Map aspect class to approximate height ratio (relative to width = 1)
const ASPECT_HEIGHT: Record<string, number> = {
  "aspect-[3/4]": 4 / 3,
  "aspect-[4/3]": 3 / 4,
  "aspect-square": 1,
};

export function MasonryGallery() {
  const t = useTranslations("gallery");
  const locale = useLocale();
  const { navigateWithTransition } = usePageTransitionNav();
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  // Randomize images once on mount
  const [columns, setColumns] = useState<
    { src: string; alt: string; slug: string; aspect: string }[][]
  >([]);

  const handleImageClick = useCallback((slug: string) => {
    navigateWithTransition(`/${locale}/artwork/${slug}`);
  }, [navigateWithTransition, locale]);

  useEffect(() => {
    const shuffled = shuffleImages(ALL_IMAGES).slice(0, DESKTOP_COUNT);
    // Distribute items into the shortest column (by accumulated height)
    const cols: { src: string; alt: string; slug: string; aspect: string }[][] = Array.from(
      { length: COLS },
      () => []
    );
    const colHeights = new Array(COLS).fill(0);

    shuffled.forEach((img, i) => {
      const aspect = ASPECT_CYCLE[i % ASPECT_CYCLE.length];
      // Find the column with the smallest accumulated height
      let minIdx = 0;
      for (let c = 1; c < COLS; c++) {
        if (colHeights[c] < colHeights[minIdx]) minIdx = c;
      }
      cols[minIdx].push({ src: img.src, alt: img.alt, slug: img.slug, aspect });
      colHeights[minIdx] += ASPECT_HEIGHT[aspect] ?? 1;
    });

    setColumns(cols);
  }, []);

  useEffect(() => {
    if (columns.length === 0) return;

    const wrap = wrapRef.current;
    const track = trackRef.current;
    const intro = introRef.current;

    if (!wrap || !track || !intro) return;

    // ── Reveal animation: stagger intro panel elements on enter ───
    const revealEls = Array.from(
      intro.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    gsap.set(revealEls, { y: 48, autoAlpha: 0 });

    const revealST = ScrollTrigger.create({
      trigger: wrap,
      start: "top 78%",
      once: true,
      onEnter: () => {
        gsap.to(revealEls, {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power4.inOut",
          stagger: 0.13,
          onComplete: () => { gsap.set(revealEls, { clearProps: "all" }); },
        });
      },
    });

    // ── Horizontal scroll (desktop only) ─────────────────────────
    let initialized = false;

    function initScroll() {
      if (initialized || !track) return;
      if (window.innerWidth <= 767) return;

      const scrollDist = track.scrollWidth - window.innerWidth;
      if (scrollDist <= 0) return;

      initialized = true;

      const getScrollDist = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -getScrollDist(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${getScrollDist()}`,
          scrub: 0.5,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      setTimeout(() => ScrollTrigger.refresh(), 100);
    }

    const initTimer = setTimeout(initScroll, 300);

    return () => {
      clearTimeout(initTimer);
      revealST.kill();
      ScrollTrigger.getAll()
        .filter((s) => s.trigger === wrap)
        .forEach((s) => s.kill());
      gsap.set(track, { clearProps: "x" });
    };
  }, [columns]);

  // Don't render grid until shuffled
  if (columns.length === 0) {
    return <section id="gallery" className="noise-bg h-screen" />;
  }

  return (
    <section id="gallery" className="noise-bg">
      {/* Horizontal scroll wrapper */}
      <div ref={wrapRef} className="h-screen overflow-x-auto overflow-y-hidden md:h-auto md:overflow-hidden">
        <div
          ref={trackRef}
          className="flex h-full w-max gap-3 p-3 md:h-auto md:gap-4 md:p-4"
        >
          {/* Intro panel — presentación de María Luisa */}
          <div
            ref={introRef}
            className="relative flex w-[min(90vw,500px)] shrink-0 flex-col justify-center gap-8 px-8 md:w-[480px] md:px-12"
            style={{ height: "100vh" }}
          >
            {/* Circular portrait */}
            <div
              data-reveal
              className="relative h-44 w-44 overflow-hidden rounded-full ring-1 ring-neutral-200 dark:ring-neutral-700"
            >
              <Image
                src="https://pub-62c41549a44642efbcd3f775bdb039b3.r2.dev/maria-luisa-1.webp"
                alt="María Luisa de Mateo"
                fill
                sizes="176px"
                className="object-cover object-top"
                priority
              />
            </div>

            {/* Name block */}
            <div data-reveal className="flex flex-col gap-3">
              <p className="font-sans text-sm uppercase tracking-[0.28em] text-neutral-400 dark:text-neutral-500">
                {t("subtitle")}
              </p>
              <h2 className="font-serif text-5xl leading-[1.02] tracking-tight text-primary md:text-6xl">
                María Luisa<br />de Mateo
              </h2>
            </div>

            {/* Bio */}
            <p
              data-reveal
              className="max-w-[26ch] font-sans text-lg leading-relaxed text-neutral-500 dark:text-neutral-400"
            >
              {t("tagline")}
            </p>

            {/* Scroll hint */}
            <div
              data-reveal
              className="absolute bottom-10 left-8 flex items-center gap-2.5 md:left-12"
            >
              <span className="animate-bounce inline-block font-sans text-sm uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">
                {t("scrollHint")}
              </span>
            </div>
          </div>

          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex w-[260px] shrink-0 flex-col gap-3 md:w-[300px] md:gap-4">
              {col.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  type="button"
                  onClick={() => handleImageClick(item.slug)}
                  className={`masonry-hover relative w-full overflow-hidden rounded-2xl ${item.aspect} cursor-pointer border-0 bg-transparent p-0`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 767px) 50vw, 300px"
                    className="masonry-hover__img object-cover"
                    loading="lazy"
                  />
                  <div className="masonry-hover__overlay">
                    <span className="masonry-hover__title">{item.alt}</span>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
