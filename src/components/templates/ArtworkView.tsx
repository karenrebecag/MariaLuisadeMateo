"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { SmoothScrollWrapper } from "@/src/components/templates/SmoothScrollWrapper";
import { usePageTransitionNav } from "@/src/lib/transition-context";
import type { GalleryImage } from "@/src/data/gallery-images";

export function ArtworkView({
  artwork,
  locale,
}: {
  artwork: GalleryImage;
  locale: string;
}) {
  const { navigateWithTransition } = usePageTransitionNav();
  const t = useTranslations("artwork");

  return (
    <SmoothScrollWrapper>
      <main className="flex min-h-screen flex-col px-6 pt-12 pb-24 md:px-12 lg:px-20">
        <button
          onClick={() => navigateWithTransition(`/${locale}`)}
          className="mb-12 self-start text-sm uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("back")}
        </button>

        <div className="flex flex-1 flex-col items-center justify-center gap-10">
          <div className="relative aspect-[3/4] w-[280px] shrink-0 overflow-hidden rounded-2xl bg-secondary md:w-[360px] lg:w-[440px]">
            <Image
              src={artwork.src}
              alt={artwork.alt}
              fill
              sizes="(max-width: 768px) 280px, (max-width: 1024px) 360px, 440px"
              className="object-cover"
              priority
            />
          </div>

          <h1 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
            {artwork.alt}
          </h1>
        </div>
      </main>
    </SmoothScrollWrapper>
  );
}

export function ArtworkNotFound({ locale }: { locale: string }) {
  const { navigateWithTransition } = usePageTransitionNav();
  const t = useTranslations("artwork");

  return (
    <SmoothScrollWrapper>
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl">{t("notFound")}</h1>
          <button
            onClick={() => navigateWithTransition(`/${locale}`)}
            className="mt-6 text-sm uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("backToGallery")}
          </button>
        </div>
      </main>
    </SmoothScrollWrapper>
  );
}
