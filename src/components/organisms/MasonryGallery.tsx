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
  const introRef = useRef<HTMLDivElement>(null);
  const { navigateWithTransition } = usePageTransitionNav();

  useEffect(() => {
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
      revealST.kill();
      ScrollTrigger.getAll()
        .filter((s) => s.trigger === wrap)
        .forEach((s) => s.kill());
      gsap.set(track, { clearProps: "x" });
    };
  }, []);

  return (
    <section id="gallery" className="noise-bg">
      {/* Horizontal scroll wrapper */}
      <div ref={wrapRef} className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max gap-3 p-3 md:gap-4 md:p-4"
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
                Pintura · México
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
              Obra que vive en el límite entre la figura y lo que
              la memoria retiene de ella.
            </p>

            {/* Scroll hint */}
            <div
              data-reveal
              className="absolute bottom-10 left-8 flex items-center gap-2.5 md:left-12"
            >
              <span className="animate-bounce inline-block font-sans text-sm uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">
                ↓ desplaza para recorrer
              </span>
            </div>
          </div>

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
