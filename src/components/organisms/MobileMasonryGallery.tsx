"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  ALL_IMAGES,
  shuffleImages,
  MOBILE_COUNT,
} from "@/src/data/gallery-images";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [selected, setSelected] = useState<{ src: string; alt: string } | null>(null);

  const handleImageClick = useCallback((src: string, alt: string) => {
    setSelected({ src, alt });
  }, []);

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
            <button
              type="button"
              onClick={() => handleImageClick(item.src, item.alt)}
              className={`masonry-hover relative w-full overflow-hidden rounded-2xl ${item.aspect} cursor-pointer border-0 bg-transparent p-0`}
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
            </button>
          </div>
        ))}
      </div>

      {/* Image preview overlay */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent
          className="max-w-[90vw] max-h-[90vh] w-auto border-0 bg-transparent p-0 shadow-none sm:max-w-[90vw] [&>button]:top-3 [&>button]:right-3 [&>button]:z-10 [&>button]:rounded-full [&>button]:bg-black/60 [&>button]:p-2 [&>button]:text-white [&>button]:backdrop-blur-sm [&>button]:hover:bg-black/80"
        >
          {selected && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative max-h-[75vh] w-auto overflow-hidden rounded-2xl">
                <Image
                  src={selected.src}
                  alt={selected.alt}
                  width={900}
                  height={1200}
                  className="max-h-[75vh] w-auto rounded-2xl object-contain"
                  priority
                />
              </div>
              <DialogTitle className="font-serif text-2xl tracking-tight text-white drop-shadow-lg">
                {selected.alt}
              </DialogTitle>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
