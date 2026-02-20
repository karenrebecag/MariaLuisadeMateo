"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ALL_IMAGES,
  shuffleImages,
  MOBILE_COUNT,
} from "@/src/data/gallery-images";

// Aspect-ratio pattern for mobile items (cycles)
const MOBILE_ASPECTS = [
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-square",
];

export function MobileMasonryGallery() {
  // Randomize images once on mount
  const [gallery, setGallery] = useState<
    { src: string; alt: string; aspect: string }[]
  >([]);

  useEffect(() => {
    const shuffled = shuffleImages(ALL_IMAGES).slice(0, MOBILE_COUNT);
    setGallery(
      shuffled.map((img, i) => ({
        src: img.src,
        alt: img.alt,
        aspect: MOBILE_ASPECTS[i % MOBILE_ASPECTS.length],
      }))
    );
  }, []);

  // Don't render until shuffled
  if (gallery.length === 0) {
    return <section id="gallery" className="noise-bg h-[60vh]" />;
  }

  return (
    <section id="gallery" className="noise-bg py-12 px-4">
      {/* CSS columns masonry — no JS positioning needed */}
      <div
        className="mx-auto max-w-2xl"
        style={{ columns: 2, columnGap: "12px" }}
      >
        {gallery.map((item, idx) => (
          <div
            key={idx}
            className="mb-3"
            style={{ breakInside: "avoid" }}
          >
            <div
              className={`masonry-hover relative w-full overflow-hidden rounded-2xl ${item.aspect}`}
            >
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
