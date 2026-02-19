"use client";

import { useHorizontalScroll } from "@/src/hooks/useHorizontalScroll";
import { ImageCard } from "@/src/components/molecules/ImageCard";
import { Heading, Text } from "@/src/components/atoms/Typography";
import { useReveal } from "@/src/hooks/useReveal";

interface GalleryItem {
  src: string;
  alt: string;
  title: string;
  category: string;
}

const galleryItems: GalleryItem[] = [
  {
    src: "/images/gallery-1.jpg",
    alt: "Portrait in Red",
    title: "Portrait in Red",
    category: "Photography",
  },
  {
    src: "/images/gallery-2.jpg",
    alt: "Architectural Light",
    title: "Architectural Light",
    category: "Architecture",
  },
  {
    src: "/images/gallery-3.jpg",
    alt: "Still Composition",
    title: "Still Composition",
    category: "Still Life",
  },
  {
    src: "/images/gallery-4.jpg",
    alt: "Golden Hour",
    title: "Golden Hour",
    category: "Landscape",
  },
  {
    src: "/images/gallery-5.jpg",
    alt: "The Process",
    title: "The Process",
    category: "Documentary",
  },
];

export function HorizontalGallery() {
  const { containerRef, trackRef } = useHorizontalScroll({
    panelSelector: ".gallery-panel",
  });
  const headerRef = useReveal({ y: 40 });

  return (
    <section id="gallery">
      {/* Section header */}
      <div ref={headerRef} className="px-6 py-16 md:px-12 md:py-24">
        <Text variant="label" className="mb-4 text-primary">
          Selected Works
        </Text>
        <Heading as="h2">Gallery</Heading>
      </div>

      {/* Horizontal scroll container */}
      <div ref={containerRef} className="relative overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-6 px-6 pb-16 md:flex-nowrap md:gap-8 md:px-12 max-md:flex-col"
        >
          {galleryItems.map((item) => (
            <div
              key={item.title}
              className="gallery-panel w-full shrink-0 md:w-[40vw] lg:w-[35vw]"
            >
              <ImageCard
                src={item.src}
                alt={item.alt}
                title={item.title}
                category={item.category}
                aspectRatio="aspect-[3/4]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
