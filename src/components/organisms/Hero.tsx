"use client";

import Image from "next/image";
import { Heading, Text } from "@/src/components/atoms/Typography";
import { useReveal } from "@/src/hooks/useReveal";

export function Hero() {
  const titleRef = useReveal({ y: 80, duration: 1.2 });
  const subtitleRef = useReveal({ y: 40, delay: 0.3 });

  return (
    <section className="relative flex min-h-screen items-end pb-16 md:pb-24">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="Featured artwork by de Mateo"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12">
        <div ref={titleRef}>
          <Heading as="h1" className="max-w-4xl text-balance">
            Art is the lie that enables us to realize the truth
          </Heading>
        </div>
        <div ref={subtitleRef} className="mt-6">
          <Text className="max-w-lg text-foreground/70">
            A curated collection of works exploring light, form, and the human condition.
          </Text>
        </div>
      </div>
    </section>
  );
}
