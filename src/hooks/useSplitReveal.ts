"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/src/lib/gsap-registry";
import { useTransitionReady } from "@/src/hooks/useTransitionReady";

export function useSplitReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useTransitionReady();

  useEffect(() => {
    if (!ready) return;

    const container = ref.current;
    if (!container) return;

    const splits: InstanceType<typeof SplitText>[] = [];

    const init = () => {
      const headings = container.querySelectorAll<HTMLElement>("[data-split]");

      headings.forEach((heading) => {
        gsap.set(heading, { autoAlpha: 1 });

        const split = new SplitText(heading, {
          type: "lines, words",
          mask: "lines",
          autoSplit: true,
          onSplit(instance: InstanceType<typeof SplitText>) {
            return gsap.from(instance.words, {
              yPercent: 110,
              duration: 0.6,
              stagger: 0.06,
              ease: "expo.out",
              scrollTrigger: {
                trigger: heading,
                start: "clamp(top 80%)",
                once: true,
              },
            });
          },
        });

        splits.push(split);
      });

      ScrollTrigger.refresh();
    };

    document.fonts.ready.then(init);

    return () => {
      splits.forEach((s) => s.revert());
    };
  }, [ready]);

  return ref;
}
