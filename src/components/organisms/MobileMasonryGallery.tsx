"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { usePageTransitionNav } from "@/src/lib/transition-context";

// Mobile version: only 10 paintings for performance
const mobileGallery = [
  { src: "/images/carlota.webp", alt: "Carlota", slug: "carlota", aspect: "aspect-[3/4]" },
  { src: "/images/tempestades.webp", alt: "Tempestades", slug: "tempestades", aspect: "aspect-[4/3]" },
  { src: "/images/adolescentes.webp", alt: "Adolescentes", slug: "adolescentes", aspect: "aspect-square" },
  { src: "/images/repeticiones.webp", alt: "Repeticiones", slug: "repeticiones", aspect: "aspect-[3/4]" },
  { src: "/images/enfrascados.webp", alt: "Enfrascados", slug: "enfrascados", aspect: "aspect-[4/3]" },
  { src: "/images/zanates.webp", alt: "Zanates", slug: "zanates", aspect: "aspect-[3/4]" },
  { src: "/images/retratos.webp", alt: "Retratos", slug: "retratos", aspect: "aspect-square" },
  { src: "/images/hojas.webp", alt: "Hojas", slug: "hojas", aspect: "aspect-[3/4]" },
  { src: "/images/realismo.webp", alt: "Realismo Abstracto", slug: "realismo-abstracto", aspect: "aspect-[4/3]" },
  { src: "/images/dibujo.webp", alt: "Dibujos", slug: "dibujos", aspect: "aspect-square" },
];

export function MobileMasonryGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { navigateWithTransition } = usePageTransitionNav();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Masonry layout calculation (CSS Grid fallback with JS positioning)
    const layout = () => {
      const items = Array.from(container.children) as HTMLElement[];
      const cols = 2;
      const gap = 12; // 0.75rem = 12px
      const colHeights = [0, 0];

      items.forEach((item, i) => {
        const height = item.offsetHeight;
        const shortestCol = colHeights[0] <= colHeights[1] ? 0 : 1;

        item.style.position = 'absolute';
        item.style.width = `calc((100% - ${gap}px) / 2)`;
        item.style.left = shortestCol === 0 ? '0' : `calc(50% + ${gap / 2}px)`;
        item.style.top = `${colHeights[shortestCol]}px`;

        colHeights[shortestCol] += height + gap;
      });

      container.style.height = `${Math.max(...colHeights)}px`;
    };

    // Wait for images to load
    const images = container.querySelectorAll('img');
    let loadedCount = 0;
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        layout();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        checkAllLoaded();
      } else {
        img.addEventListener('load', checkAllLoaded);
        img.addEventListener('error', checkAllLoaded);
      }
    });

    // Fallback if no images
    if (images.length === 0) {
      layout();
    }

    // Recalculate on window resize
    const debounce = (fn: () => void, delay: number) => {
      let timeout: NodeJS.Timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(fn, delay);
      };
    };

    const onResize = debounce(layout, 150);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section id="gallery" className="noise-bg py-12 px-4">
      {/* Masonry grid */}
      <div ref={containerRef} className="relative mx-auto max-w-2xl">
        {mobileGallery.map((item, idx) => (
          <div
            key={idx}
            className="mb-3"
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
            <div className={`masonry-hover relative w-full overflow-hidden rounded-2xl ${item.aspect}`}>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="50vw"
                className="masonry-hover__img object-cover"
                loading="lazy"
              />
              <div className="masonry-hover__overlay">
                <span className="masonry-hover__title">{item.alt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
