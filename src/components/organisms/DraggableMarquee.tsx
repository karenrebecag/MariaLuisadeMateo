"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, Observer } from "@/src/lib/gsap-registry";

export interface MarqueeItem {
  src: string;
  alt: string;
  caption?: string;
  link?: string;
}

interface DraggableMarqueeProps {
  items: MarqueeItem[];
  direction?: "left" | "right";
  duration?: number;
  multiplier?: number;
  sensitivity?: number;
}

export function DraggableMarquee({
  items,
  direction = "left",
  duration = 25,
  multiplier = 35,
  sensitivity = 0.01,
}: DraggableMarqueeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const collection = collectionRef.current;
    const list = listRef.current;
    if (!wrapper || !collection || !list) return;

    const wrapperWidth = wrapper.getBoundingClientRect().width;
    const listWidth = list.scrollWidth || list.getBoundingClientRect().width;
    if (!wrapperWidth || !listWidth) return;

    // Clone the list enough times to fill + overflow the viewport
    const minRequiredWidth = wrapperWidth + listWidth + 2;
    const clones: Element[] = [];
    while (collection.scrollWidth < minRequiredWidth) {
      const clone = list.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      collection.appendChild(clone);
      clones.push(clone);
    }

    const baseDirection = direction === "right" ? -1 : 1;
    const wrapX = gsap.utils.wrap(-listWidth, 0);
    const timeScale = { value: baseDirection };

    gsap.set(collection, { x: 0 });

    const marqueeLoop = gsap.to(collection, {
      x: -listWidth,
      duration,
      ease: "none",
      repeat: -1,
      onReverseComplete: () => { marqueeLoop.progress(1); },
      modifiers: {
        x: (x: string) => wrapX(parseFloat(x)) + "px",
      },
    });

    if (baseDirection < 0) marqueeLoop.progress(1);
    marqueeLoop.timeScale(timeScale.value);

    function applyTimeScale() {
      marqueeLoop.timeScale(timeScale.value);
    }

    const observer = Observer.create({
      target: wrapper,
      type: "pointer,touch",
      preventDefault: true,
      debounce: false,
      onChangeX: (e) => {
        let vel = (e.velocityX ?? 0) * -sensitivity;
        vel = gsap.utils.clamp(-multiplier, multiplier, vel);

        gsap.killTweensOf(timeScale);

        const restingDir = vel < 0 ? -1 : 1;

        gsap.timeline({ onUpdate: applyTimeScale })
          .to(timeScale, { value: vel, duration: 0.1, overwrite: true })
          .to(timeScale, { value: restingDir, duration: 1.0 });
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => {
        marqueeLoop.resume();
        applyTimeScale();
        observer.enable();
      },
      onEnterBack: () => {
        marqueeLoop.resume();
        applyTimeScale();
        observer.enable();
      },
      onLeave: () => {
        marqueeLoop.pause();
        observer.disable();
      },
      onLeaveBack: () => {
        marqueeLoop.pause();
        observer.disable();
      },
    });

    return () => {
      marqueeLoop.kill();
      observer.kill();
      trigger.kill();
      clones.forEach((c) => c.remove());
    };
  }, [items, direction, duration, multiplier, sensitivity]);

  return (
    <div
      ref={wrapperRef}
      className="draggable-marquee"
      aria-label="Galería de obras"
    >
      <div ref={collectionRef} className="draggable-marquee__collection">
        <div ref={listRef} className="draggable-marquee__list">
          {items.map((item, i) => {
            const inner = (
              <>
                <img
                  draggable={false}
                  loading={i < 5 ? "eager" : "lazy"}
                  src={item.src}
                  alt={item.alt}
                  className="draggable-marquee__item-img"
                />
                {item.caption && (
                  <div className="draggable-marquee__caption" aria-hidden="true">
                    <span className="draggable-marquee__caption-text">
                      {item.caption}
                    </span>
                  </div>
                )}
              </>
            );
            return (
              <div key={i} className="draggable-marquee__item">
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={-1}
                    aria-label={item.alt}
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
