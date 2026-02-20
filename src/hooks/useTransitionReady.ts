"use client";

import { useState, useEffect } from "react";

/**
 * Returns true once the page transition intro animation has completed.
 * ScrollTrigger-based animations should wait for this before initializing,
 * otherwise they fire behind the transition overlay and the user misses them.
 */
export function useTransitionReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handleReady = () => setReady(true);

    // If transition already completed before this hook mounted
    // (e.g. fast network, or no transition), start immediately
    // The PageTransition dispatches "pageTransitionComplete" on window
    window.addEventListener("pageTransitionComplete", handleReady, { once: true });

    return () => {
      window.removeEventListener("pageTransitionComplete", handleReady);
    };
  }, []);

  return ready;
}
