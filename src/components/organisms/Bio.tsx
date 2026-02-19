"use client";

import { Heading, Text } from "@/src/components/atoms/Typography";
import { Divider } from "@/src/components/atoms/Divider";
import { useReveal } from "@/src/hooks/useReveal";

const stats = [
  { value: "UNAM", label: "Historia del Arte" },
  { value: "UC Berkeley", label: "Posgrado" },
  { value: "30+", label: "Exposiciones" },
  { value: "Oleo", label: "Tecnica Principal" },
];

export function Bio() {
  const sectionRef = useReveal({ y: 60, stagger: 0.15, childSelector: ".bio-item" });

  return (
    <section id="bio" className="section-padding">
      <div ref={sectionRef}>
        <div className="bio-item">
          <Text variant="label" className="mb-4 text-primary">
            Biografia
          </Text>
          <Heading as="h2" className="max-w-3xl text-balance">
            Maria Luisa de Mateo
          </Heading>
        </div>

        <div className="bio-item mt-12 grid gap-12 md:grid-cols-2">
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

        <Divider className="bio-item my-16" />

        <div className="bio-item grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <Text as="span" variant="stat">
                {stat.value}
              </Text>
              <Text variant="caption" className="mt-2">
                {stat.label}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
