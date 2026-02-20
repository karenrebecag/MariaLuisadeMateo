"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Text } from "@/src/components/atoms/Typography";
import { gsap, Flip, ScrollTrigger } from "@/src/lib/gsap-registry";
import { useTransitionReady } from "@/src/hooks/useTransitionReady";
import { usePageTransitionNav } from "@/src/lib/transition-context";

export interface WorkItem {
  src: string;
  alt: string;
  slug: string;
  medium: string;
  dimensions?: string;
  price?: string;
  artsyUrl?: string;
}

const FALLBACK_WORKS: WorkItem[] = [
  { src: "/images/carlota.webp",      alt: "Carlota",            slug: "carlota",            medium: "Óleo sobre tela" },
  { src: "/images/tempestades.webp",  alt: "Tempestades",        slug: "tempestades",        medium: "Óleo sobre tela" },
  { src: "/images/adolescentes.webp", alt: "Adolescentes",       slug: "adolescentes",       medium: "Óleo sobre tela" },
  { src: "/images/retratos.webp",     alt: "Retratos",           slug: "retratos",           medium: "Óleo sobre tela" },
  { src: "/images/enfrascados.webp",  alt: "Enfrascados",        slug: "enfrascados",        medium: "Óleo sobre tela" },
  { src: "/images/zanates.webp",      alt: "Zanates",            slug: "zanates",            medium: "Óleo sobre tela" },
  { src: "/images/hojas.webp",        alt: "Hojas",              slug: "hojas",              medium: "Óleo sobre tela" },
  { src: "/images/repeticiones.webp", alt: "Repeticiones",       slug: "repeticiones",       medium: "Óleo sobre tela" },
  { src: "/images/realismo.webp",     alt: "Realismo Abstracto", slug: "realismo-abstracto", medium: "Óleo sobre tela" },
];

interface AvailableWorksProps {
  works?: WorkItem[] | null;
}

export function AvailableWorks({ works: externalWorks }: AvailableWorksProps) {
  const t = useTranslations("availableWorks");
  const items = externalWorks ?? FALLBACK_WORKS;
  const isArtsy = !!externalWorks;
  const [activeLayout, setActiveLayout] = useState<"large" | "small">("large");
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const prevHeightRef = useRef<number>(0);
  const groupRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const activeTweenRef = useRef<gsap.core.Timeline | null>(null);
  const { navigateWithTransition } = usePageTransitionNav();
  const ready = useTransitionReady();

  // Reveal animation for header + grid
  useEffect(() => {
    if (!ready) return;

    const header = headerRef.current;
    const grid = groupRef.current;
    if (!header || !grid) return;

    const items = [
      ...Array.from(header.querySelectorAll<HTMLElement>(":scope > *")),
      grid,
    ];

    gsap.set(items, { y: 48, autoAlpha: 0 });

    const st = ScrollTrigger.create({
      trigger: header,
      start: "top 82%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          ease: "power4.inOut",
          stagger: 0.12,
          onComplete: () => { gsap.set(items, { clearProps: "all" }); },
        });
      },
    });

    return () => st.kill();
  }, [ready]);

  const handleLayoutChange = (newLayout: "large" | "small") => {
    if (newLayout === activeLayout) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveLayout(newLayout);
      return;
    }

    // Kill in-flight animation
    if (activeTweenRef.current) {
      activeTweenRef.current.kill();
      activeTweenRef.current = null;
      if (collectionRef.current) gsap.set(collectionRef.current, { clearProps: "height" });
    }

    // Capture Flip state + current height BEFORE React re-renders
    const group = groupRef.current;
    if (group) {
      const items = group.querySelectorAll<HTMLElement>("[data-layout-grid-item]");
      flipStateRef.current = Flip.getState(items, { simple: true });
    }
    if (collectionRef.current) {
      prevHeightRef.current = collectionRef.current.offsetHeight;
    }

    setActiveLayout(newLayout);
  };

  // Runs synchronously after React commits the new DOM — perfect for Flip
  useLayoutEffect(() => {
    if (!flipStateRef.current) return;

    const state = flipStateRef.current;
    flipStateRef.current = null;

    const collection = collectionRef.current;
    if (!collection) return;

    const prevH = prevHeightRef.current;
    collection.getBoundingClientRect(); // force reflow
    const nextH = collection.offsetHeight;

    gsap.set(collection, { height: prevH });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(collection, { clearProps: "height" });
        activeTweenRef.current = null;
      },
      onInterrupt: () => {
        gsap.set(collection, { clearProps: "height" });
      },
    });

    tl.add(
      Flip.from(state, {
        duration: 0.65,
        ease: "power4.inOut",
        absolute: true,
        nested: true,
        prune: true,
        stagger:
          activeLayout === "large"
            ? { each: 0.03, from: "end" }
            : { each: 0.03, from: "start" },
      }),
      0
    ).to(collection, { height: nextH, duration: 0.65, ease: "power4.inOut" }, 0);

    activeTweenRef.current = tl;
  }, [activeLayout]);

  return (
    <section id="obras" className="noise-bg section-padding">
      <div className="max-width">
        {/* Section header */}
        <div ref={headerRef} className="mb-10 flex flex-col gap-8 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <Text variant="label" className="text-primary">
              {t("label")}
            </Text>
            <h2
              className="font-serif leading-tight tracking-tight text-card-foreground"
              style={{ fontSize: "var(--type-h2)" }}
            >
              {t("title")}
            </h2>
            <p className="max-w-[38ch] font-sans text-base leading-relaxed text-muted-foreground">
              {t("description")}{" "}
              <a href="#contact" className="text-primary underline-offset-4 hover:underline">
                {t("descriptionLink")}
              </a>
              .
            </p>
          </div>

          {/* Layout toggle */}
          <div className="aw-buttons">
            <button
              onClick={() => handleLayoutChange("large")}
              aria-pressed={activeLayout === "large"}
              className={`aw-btn${activeLayout === "large" ? " is--active" : ""}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" className="aw-btn__icon" aria-hidden="true">
                <rect x="1" y="1" width="3.33" height="3.33" fill="currentColor" />
                <rect x="1" y="7.61" width="3.33" height="3.33" fill="currentColor" />
                <rect x="7.67" y="1" width="3.33" height="3.33" fill="currentColor" />
                <rect x="7.67" y="7.61" width="3.33" height="3.33" fill="currentColor" />
              </svg>
              <span className="aw-btn__label">{t("large")}</span>
            </button>
            <button
              onClick={() => handleLayoutChange("small")}
              aria-pressed={activeLayout === "small"}
              className={`aw-btn${activeLayout === "small" ? " is--active" : ""}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" className="aw-btn__icon" aria-hidden="true">
                <rect x="1" y="1" width="2.5" height="2.5" fill="currentColor" />
                <rect x="4.75" y="1" width="2.5" height="2.5" fill="currentColor" />
                <rect x="8.5" y="1" width="2.5" height="2.5" fill="currentColor" />
                <rect x="1" y="4.75" width="2.5" height="2.5" fill="currentColor" />
                <rect x="4.75" y="4.75" width="2.5" height="2.5" fill="currentColor" />
                <rect x="8.5" y="4.75" width="2.5" height="2.5" fill="currentColor" />
                <rect x="1" y="8.5" width="2.5" height="2.5" fill="currentColor" />
                <rect x="4.75" y="8.5" width="2.5" height="2.5" fill="currentColor" />
                <rect x="8.5" y="8.5" width="2.5" height="2.5" fill="currentColor" />
              </svg>
              <span className="aw-btn__label">{t("small")}</span>
            </button>
          </div>
        </div>

        {/* Grid */}
        <div ref={groupRef} data-layout-status={activeLayout} className="aw-grid">
          <div ref={collectionRef} className="aw-grid__collection">
            <div className="aw-grid__list">
              {items.map((work) => {
                const href = work.artsyUrl ?? `/artwork/${work.slug}`;
                const isExternal = !!work.artsyUrl;
                const handleClick = () => {
                  if (isExternal) {
                    window.open(href, "_blank", "noopener,noreferrer");
                  } else {
                    navigateWithTransition(href);
                  }
                };
                return (
                  <div
                    key={work.slug}
                    data-layout-grid-item
                    className="aw-grid__item"
                    onClick={handleClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClick();
                      }
                    }}
                  >
                    <div className="aw-grid__card">
                      <div className="aw-grid__card-visual">
                        {isArtsy ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={work.src}
                            alt={work.alt}
                            className="aw-grid__card-img object-cover absolute inset-0 w-full h-full"
                            loading="lazy"
                          />
                        ) : (
                          <Image
                            src={work.src}
                            alt={work.alt}
                            fill
                            sizes="(max-width: 767px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="aw-grid__card-img object-cover"
                          />
                        )}
                      </div>
                      <div className="aw-grid__card-details">
                        <h3 className="aw-grid__card-title">{work.alt}</h3>
                        <p className="aw-grid__card-sub">{work.medium}</p>
                        {work.dimensions && (
                          <p className="aw-grid__card-sub">{work.dimensions}</p>
                        )}
                        {work.price && (
                          <p className="aw-grid__card-price">{work.price}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
