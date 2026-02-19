"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface ImageCardProps {
  src: string;
  alt: string;
  title: string;
  category?: string;
  className?: string;
  aspectRatio?: string;
}

export function ImageCard({
  src,
  alt,
  title,
  category,
  className,
  aspectRatio = "aspect-[3/4]",
}: ImageCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <figure className={cn("group relative overflow-hidden", className)}>
      <div className={cn(aspectRatio, "relative w-full overflow-hidden bg-secondary")}>
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            "object-cover transition-all duration-700 ease-out group-hover:scale-105",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsLoaded(true)}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-4">
        <span className="text-sm font-light text-foreground">{title}</span>
        {category && (
          <span className="text-xs uppercase text-muted-foreground" style={{ letterSpacing: "var(--tracking-wide)" }}>
            {category}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
