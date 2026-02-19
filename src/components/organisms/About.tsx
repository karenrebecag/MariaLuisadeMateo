"use client";

import { Heading, Text } from "@/src/components/atoms/Typography";
import { Divider } from "@/src/components/atoms/Divider";
import { useReveal } from "@/src/hooks/useReveal";

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: "12+", label: "Years of Experience" },
  { value: "200+", label: "Artworks Created" },
  { value: "40+", label: "Exhibitions" },
  { value: "15", label: "Awards" },
];

export function About() {
  const sectionRef = useReveal({ y: 60, stagger: 0.15, childSelector: ".about-item" });

  return (
    <section id="about" className="px-6 py-24 md:px-12 md:py-32">
      <div ref={sectionRef}>
        <div className="about-item">
          <Text variant="label" className="mb-4 text-primary">
            About
          </Text>
          <Heading as="h2" className="max-w-3xl">
            Creating art that speaks to the soul
          </Heading>
        </div>

        <div className="about-item mt-10 max-w-2xl">
          <Text>
            de Mateo is a multidisciplinary artist working at the intersection of
            photography, painting, and installation. With a practice rooted in
            observing the quiet poetry of everyday life, each work invites the viewer
            to pause, reflect, and find beauty in the overlooked.
          </Text>
        </div>

        <Divider className="about-item my-16" />

        <div className="about-item grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <span className="text-4xl font-light text-foreground md:text-5xl">
                {stat.value}
              </span>
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
