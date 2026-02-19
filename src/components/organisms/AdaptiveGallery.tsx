"use client";

import { useState, useEffect } from "react";
import { MasonryGallery } from "./MasonryGallery";
import { MobileMasonryGallery } from "./MobileMasonryGallery";

export function AdaptiveGallery() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    // Detect screen size on mount
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent flash during SSR - render nothing until client-side detection
  if (isMobile === null) {
    return <div className="h-screen" aria-hidden="true" />;
  }

  return isMobile ? <MobileMasonryGallery /> : <MasonryGallery />;
}
