"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/src/lib/gsap-registry";
import { usePageTransitionNav } from "@/src/lib/transition-context";

// Real paintings from demateo.mx — repeated across columns
const paintings = [
  { src: "/images/carlota.webp", alt: "Carlota", slug: "carlota" },
  { src: "/images/tempestades.webp", alt: "Tempestades", slug: "tempestades" },
  { src: "/images/adolescentes.webp", alt: "Adolescentes", slug: "adolescentes" },
  { src: "/images/repeticiones.webp", alt: "Repeticiones", slug: "repeticiones" },
  { src: "/images/enfrascados.webp", alt: "Enfrascados", slug: "enfrascados" },
  { src: "/images/zanates.webp", alt: "Zanates", slug: "zanates" },
  { src: "/images/retratos.webp", alt: "Retratos", slug: "retratos" },
  { src: "/images/hojas.webp", alt: "Hojas", slug: "hojas" },
  { src: "/images/realismo.webp", alt: "Realismo Abstracto", slug: "realismo-abstracto" },
  { src: "/images/dibujo.webp", alt: "Dibujos", slug: "dibujos" },
];

// Build 10 columns x 5 items each, cycling through paintings
const columns = Array.from({ length: 10 }, (_, colIdx) => {
  const aspects = [
    ["aspect-[3/4]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]"],
    ["aspect-[4/3]", "aspect-[3/4]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]"],
    ["aspect-square", "aspect-[3/4]", "aspect-[4/3]", "aspect-[3/4]", "aspect-square"],
    ["aspect-[3/4]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]", "aspect-[3/4]"],
    ["aspect-[4/3]", "aspect-[3/4]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]"],
    ["aspect-square", "aspect-[4/3]", "aspect-[3/4]", "aspect-square", "aspect-[3/4]"],
    ["aspect-[3/4]", "aspect-[3/4]", "aspect-[4/3]", "aspect-[3/4]", "aspect-square"],
    ["aspect-[4/3]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]", "aspect-[3/4]"],
    ["aspect-square", "aspect-[3/4]", "aspect-[4/3]", "aspect-[3/4]", "aspect-[4/3]"],
    ["aspect-[3/4]", "aspect-[4/3]", "aspect-square", "aspect-[4/3]", "aspect-[3/4]"],
  ];

  return Array.from({ length: 5 }, (_, itemIdx) => {
    const paintingIdx = (colIdx * 5 + itemIdx) % paintings.length;
    return {
      src: paintings[paintingIdx].src,
      alt: paintings[paintingIdx].alt,
      slug: paintings[paintingIdx].slug,
      aspect: aspects[colIdx][itemIdx],
    };
  });
});

export function MasonryGallery() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { navigateWithTransition } = usePageTransitionNav();

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;

    if (!wrap || !track) return;

    let initialized = false;

    function initScroll() {
      if (initialized || !track) return;
      if (window.innerWidth <= 767) return;

      const scrollDist = track.scrollWidth - window.innerWidth;
      if (scrollDist <= 0) return;

      initialized = true;

      gsap.to(track, {
        x: -scrollDist,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${scrollDist}`,
          scrub: 1,
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
      ScrollTrigger.getAll()
        .filter((s) => s.trigger === wrap)
        .forEach((s) => s.kill());
      gsap.set(track, { clearProps: "x" });
    };
  }, []);

  return (
    <section id="gallery" className="pt-24 md:pt-28">
      {/* Horizontal scroll wrapper */}
      <div ref={wrapRef} className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max gap-3 p-3 md:gap-4 md:p-4"
        >
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex w-[260px] shrink-0 flex-col gap-3 md:w-[300px] md:gap-4">
              {col.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className={`masonry-hover relative w-full overflow-hidden rounded-2xl ${item.aspect}`}
                  onClick={() => navigateWithTransition(`/artwork/${item.slug}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigateWithTransition(`/artwork/${item.slug}`);
                    }
                  }}
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
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
