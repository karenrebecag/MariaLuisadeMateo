"use client";

import { use } from "react";
import Image from "next/image";
import { SmoothScrollWrapper } from "@/src/components/templates/SmoothScrollWrapper";
import { usePageTransitionNav } from "@/src/lib/transition-context";

// Same paintings data — will come from Payload CMS later
const paintings = [
  { src: "/images/carlota.webp", title: "Carlota", slug: "carlota", year: "2023", technique: "Óleo sobre tela", dimensions: "120 × 90 cm" },
  { src: "/images/tempestades.webp", title: "Tempestades", slug: "tempestades", year: "2023", technique: "Óleo sobre tela", dimensions: "150 × 100 cm" },
  { src: "/images/adolescentes.webp", title: "Adolescentes", slug: "adolescentes", year: "2022", technique: "Óleo sobre tela", dimensions: "130 × 95 cm" },
  { src: "/images/repeticiones.webp", title: "Repeticiones", slug: "repeticiones", year: "2022", technique: "Óleo sobre tela", dimensions: "100 × 80 cm" },
  { src: "/images/enfrascados.webp", title: "Enfrascados", slug: "enfrascados", year: "2021", technique: "Óleo sobre tela", dimensions: "110 × 85 cm" },
  { src: "/images/zanates.webp", title: "Zanates", slug: "zanates", year: "2021", technique: "Óleo sobre tela", dimensions: "140 × 100 cm" },
  { src: "/images/retratos.webp", title: "Retratos", slug: "retratos", year: "2020", technique: "Óleo sobre tela", dimensions: "90 × 70 cm" },
  { src: "/images/hojas.webp", title: "Hojas", slug: "hojas", year: "2020", technique: "Óleo sobre tela", dimensions: "100 × 80 cm" },
  { src: "/images/realismo.webp", title: "Realismo Abstracto", slug: "realismo-abstracto", year: "2019", technique: "Técnica mixta sobre tela", dimensions: "120 × 100 cm" },
  { src: "/images/dibujo.webp", title: "Dibujos", slug: "dibujos", year: "2019", technique: "Grafito sobre papel", dimensions: "50 × 35 cm" },
];

export default function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { navigateWithTransition } = usePageTransitionNav();

  const painting = paintings.find((p) => p.slug === slug);

  if (!painting) {
    return (
      <SmoothScrollWrapper>
        <main className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-4xl">Obra no encontrada</h1>
            <button
              onClick={() => navigateWithTransition("/")}
              className="mt-6 text-sm uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Volver a la galería
            </button>
          </div>
        </main>
      </SmoothScrollWrapper>
    );
  }

  return (
    <SmoothScrollWrapper>
      <main className="flex min-h-screen flex-col px-6 pt-12 pb-24 md:px-12 lg:px-20">
        {/* Back button */}
        <button
          onClick={() => navigateWithTransition("/")}
          className="mb-12 self-start text-sm uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Volver
        </button>

        {/* Artwork layout — image kept small */}
        <div className="flex flex-1 flex-col items-center justify-center gap-10 md:flex-row md:gap-16">
          {/* Small image */}
          <div className="relative aspect-[3/4] w-[240px] shrink-0 overflow-hidden rounded-2xl bg-secondary md:w-[280px] lg:w-[320px]">
            <Image
              src={painting.src}
              alt={painting.title}
              fill
              sizes="320px"
              className="object-cover"
              priority
            />
          </div>

          {/* Info panel */}
          <div className="max-w-sm">
            <h1 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
              {painting.title}
            </h1>

            <div className="mt-8 space-y-4 border-t border-border pt-8">
              <div className="flex justify-between gap-8">
                <span className="text-sm uppercase tracking-[0.15em] text-muted-foreground">
                  Año
                </span>
                <span className="text-sm">{painting.year}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-sm uppercase tracking-[0.15em] text-muted-foreground">
                  Técnica
                </span>
                <span className="text-sm text-right">{painting.technique}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-sm uppercase tracking-[0.15em] text-muted-foreground">
                  Dimensiones
                </span>
                <span className="text-sm">{painting.dimensions}</span>
              </div>
            </div>

            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              Descripción de la obra disponible próximamente.
            </p>
          </div>
        </div>
      </main>
    </SmoothScrollWrapper>
  );
}
