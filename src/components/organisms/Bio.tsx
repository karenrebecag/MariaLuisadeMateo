"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Heading, Text } from "@/src/components/atoms/Typography";
import { Divider } from "@/src/components/atoms/Divider";
import { useSplitReveal } from "@/src/hooks/useSplitReveal";
import { useTransitionReady } from "@/src/hooks/useTransitionReady";
import { gsap, ScrollTrigger } from "@/src/lib/gsap-registry";

export function Bio() {
  const t = useTranslations("bio");
  const sectionRef = useSplitReveal();
  const statsRef = useRef<HTMLDivElement>(null);
  const ready = useTransitionReady();

  const stats = [
    { value: t("stats.unamValue"), label: t("stats.unamLabel") },
    { value: t("stats.berkeleyValue"), label: t("stats.berkeleyLabel") },
    { value: t("stats.exhibitionsValue"), label: t("stats.exhibitionsLabel") },
    { value: t("stats.techniqueValue"), label: t("stats.techniqueLabel") },
  ];

  useEffect(() => {
    if (!ready) return;

    const container = statsRef.current;
    if (!container) return;

    const items = Array.from(
      container.querySelectorAll<HTMLElement>("[data-stat]")
    );

    gsap.set(items, { y: 48, autoAlpha: 0 });

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top 82%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          ease: "power4.inOut",
          stagger: 0.1,
          onComplete: () => { gsap.set(items, { clearProps: "all" }); },
        });
      },
    });

    return () => st.kill();
  }, [ready]);

  return (
    <section id="bio" className="noise-bg section-padding pb-0">
      <div ref={sectionRef} className="max-width">
        <div>
          <Text variant="label" className="mb-4 text-primary">
            {t("label")}
          </Text>
          <Heading as="h2" className="max-w-3xl text-balance" data-split data-split-reveal="words">
            {t("title")}
          </Heading>
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <Text className="leading-relaxed">{t("p1")}</Text>
            <Text className="leading-relaxed">{t("p2")}</Text>
            <Text className="leading-relaxed">{t("p3")}</Text>
          </div>
          <div className="space-y-6">
            <Text className="leading-relaxed">{t("p4")}</Text>
            <Text className="leading-relaxed">{t("p5")}</Text>
            <Text className="leading-relaxed">{t("p6")}</Text>
          </div>
        </div>

        <Divider className="mt-16 mb-0" />
      </div>

      {/* Full-bleed red stats block */}
      <div
        id="stats"
        ref={statsRef}
        className="photo-texture relative bg-primary overflow-hidden"
        style={{
          marginLeft: "calc(-1 * var(--section-px))",
          marginRight: "calc(-1 * var(--section-px))",
        }}
      >
        <div
          className="max-width grid grid-cols-2 gap-px md:grid-cols-4"
          style={{ padding: "var(--section-py) var(--section-px)" }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              data-stat
              className="flex flex-col gap-3 px-4 py-2 first:pl-0"
            >
              <span
                className="font-serif italic text-white leading-none"
                style={{
                  fontSize: "var(--type-h3)",
                  letterSpacing: "var(--tracking-tight)",
                }}
              >
                {stat.value}
              </span>
              <p
                className="text-white/65 leading-snug"
                style={{
                  fontSize: "var(--type-small)",
                  letterSpacing: "var(--tracking-normal)",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
