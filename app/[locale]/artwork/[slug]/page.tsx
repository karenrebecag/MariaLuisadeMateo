import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ALL_IMAGES } from "@/src/data/gallery-images";
import { ArtworkView, ArtworkNotFound } from "@/src/components/templates/ArtworkView";

const SITE_URL = "https://demateo.mx";

export function generateStaticParams() {
  return ALL_IMAGES.map((img) => ({ slug: img.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const artwork = ALL_IMAGES.find((img) => img.slug === slug);

  if (!artwork) {
    return { title: "Obra no encontrada" };
  }

  const t = await getTranslations({ locale, namespace: "metadata" });
  const artistName = "Maria Luisa de Mateo";
  const title = `${artwork.alt} — ${artistName}`;
  const description =
    locale === "es"
      ? `"${artwork.alt}" — Obra de ${artistName}. Pintura al óleo. Portafolio de arte realista.`
      : `"${artwork.alt}" — Artwork by ${artistName}. Oil painting. Realist art portfolio.`;

  const localePath = locale === "es" ? "" : `/${locale}`;
  const canonicalUrl = `${SITE_URL}${localePath}/artwork/${slug}`;

  return {
    title: artwork.alt,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        es: `${SITE_URL}/artwork/${slug}`,
        en: `${SITE_URL}/en/artwork/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: artwork.src,
          alt: artwork.alt,
        },
      ],
      locale: locale === "es" ? "es_MX" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [artwork.src],
    },
  };
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const artwork = ALL_IMAGES.find((img) => img.slug === slug);

  if (!artwork) {
    return <ArtworkNotFound locale={locale} />;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.alt,
    image: artwork.src,
    url: `${SITE_URL}/${locale}/artwork/${slug}`,
    artist: {
      "@type": "Person",
      name: "Maria Luisa de Mateo Venturini",
    },
    artMedium: "Oil on canvas",
    artform: "Painting",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArtworkView artwork={artwork} locale={locale} />
    </>
  );
}
