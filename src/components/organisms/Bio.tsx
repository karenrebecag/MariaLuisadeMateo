"use client";

import { useRef, useEffect } from "react";
import { Heading, Text } from "@/src/components/atoms/Typography";
import { Divider } from "@/src/components/atoms/Divider";
import { useSplitReveal } from "@/src/hooks/useSplitReveal";
import { useTransitionReady } from "@/src/hooks/useTransitionReady";
import { gsap, ScrollTrigger } from "@/src/lib/gsap-registry";

const stats = [
  { value: "UNAM", label: "Historia del Arte" },
  { value: "UC Berkeley", label: "Posgrado" },
  { value: "30+", label: "Exposiciones" },
  { value: "Óleo", label: "Técnica principal" },
];

export function Bio() {
  const sectionRef = useSplitReveal();
  const statsRef = useRef<HTMLDivElement>(null);
  const ready = useTransitionReady();

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
            Biografia
          </Text>
          <Heading as="h2" className="max-w-3xl text-balance" data-split data-split-reveal="words">
            Maria Luisa de Mateo
          </Heading>
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <Text className="leading-relaxed">
              La pintura de Maria Luisa de Mateo Venturini es realista por el simple placer de recrear momentos de realidad, texturas de realidad, emociones de realidad, inmersion en los colores de la realidad. Muy lejana al hiper realismo, muy cercana al realismo abstracto en el que la realidad se construye en base a manchas, en base a colores.
            </Text>
            <Text className="leading-relaxed">
              Nacio en Ciudad de Mexico. Estudio Historia con especialidad en Arte en la UNAM obteniendo Mencion Honorifica. Realizo estudios de posgrado en Historia del Arte, en la Universidad de California en Berkeley, USA.
            </Text>
            <Text className="leading-relaxed">
              En un despiste muy disfrutado, estudio una maestria en Economia en la UNAM, tambien con Mencion Honorifica, aun cuando siempre supo que su pasion era la pintura.
            </Text>
          </div>
          <div className="space-y-6">
            <Text className="leading-relaxed">
              Sin paciencia para acudir a una formacion escolar, estudia, investiga y aprende de los grandes maestros, en particular de Velazquez, a quien copia y desmenuza. Posiblemente por su formacion de historiadora, su especialidad y mayor gozo es el retrato.
            </Text>
            <Text className="leading-relaxed">
              Aun cuando cualquier ejercicio con un pincel en la mano es igualmente gratificante. Sus pinturas estan en diferentes formatos, principalmente en oleo sobre tela, aun cuando tambien ha realizado grabados y serigrafias.
            </Text>
            <Text className="leading-relaxed">
              Ha realizado exposiciones tanto en Mexico como en el extranjero. Los diferentes temas en sus pinturas son expresiones de estas exposiciones.
            </Text>
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
