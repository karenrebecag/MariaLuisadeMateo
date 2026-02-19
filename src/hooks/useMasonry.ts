"use client";

import { useEffect, useCallback, type RefObject } from "react";

export function useMasonry(containerRef: RefObject<HTMLDivElement | null>) {
  const layout = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const cs = getComputedStyle(container);
    const cols = parseInt(cs.getPropertyValue("--masonry-col")) || 4;
    const rawGap = cs.getPropertyValue("--masonry-gap").trim();
    let gapPx = 16;
    if (rawGap.endsWith("px")) {
      gapPx = parseFloat(rawGap);
    } else if (rawGap.endsWith("rem")) {
      gapPx = parseFloat(rawGap) * parseFloat(getComputedStyle(document.documentElement).fontSize);
    } else {
      gapPx = parseFloat(rawGap) || 16;
    }

    const colHeights = Array(cols).fill(0);
    container.style.position = "relative";

    const items = Array.from(container.children) as HTMLElement[];
    const visibleItems = items.filter(
      (el) => el.getAttribute("data-filter-status") !== "not-active"
    );

    // Hide non-active items
    items.forEach((el) => {
      if (el.getAttribute("data-filter-status") === "not-active") {
        el.style.position = "absolute";
        el.style.opacity = "0";
        el.style.visibility = "hidden";
      }
    });

    const wCalc = (index: number) => {
      const colWidth = (container.offsetWidth - (cols - 1) * gapPx) / cols;
      return {
        width: colWidth,
        left: index * (colWidth + gapPx),
      };
    };

    visibleItems.forEach((el) => {
      const shortest = colHeights.indexOf(Math.min(...colHeights));
      const { width, left } = wCalc(shortest);

      el.style.position = "absolute";
      el.style.width = `${width}px`;
      el.style.top = `${colHeights[shortest]}px`;
      el.style.left = `${left}px`;
      el.style.opacity = "1";
      el.style.visibility = "visible";
      el.style.transition = "top 0.5s cubic-bezier(0.625,0.05,0,1), left 0.5s cubic-bezier(0.625,0.05,0,1), opacity 0.5s cubic-bezier(0.625,0.05,0,1)";

      colHeights[shortest] += el.offsetHeight + gapPx;
    });

    container.style.height = `${Math.max(...colHeights)}px`;
    container.style.transition = "height 0.5s cubic-bezier(0.625,0.05,0,1)";
  }, [containerRef]);

  useEffect(() => {
    layout();

    const handleResize = () => layout();
    const debounced = debounce(handleResize, 100);
    window.addEventListener("resize", debounced);

    // Watch images
    const container = containerRef.current;
    if (container) {
      const imgs = container.querySelectorAll("img");
      const debouncedLayout = debounce(layout, 50);
      imgs.forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", debouncedLayout, { once: true });
          img.addEventListener("error", debouncedLayout, { once: true });
        }
      });
    }

    return () => {
      window.removeEventListener("resize", debounced);
    };
  }, [layout, containerRef]);

  return { recalc: layout };
}

function debounce(fn: () => void, delay: number) {
  let t: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(t);
    t = setTimeout(fn, delay);
  };
}
