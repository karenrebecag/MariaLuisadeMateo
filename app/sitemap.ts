import type { MetadataRoute } from "next";
import { ALL_IMAGES } from "@/src/data/gallery-images";

const SITE_URL = "https://demateo.mx";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["es", "en"];

  // Home pages
  const homePages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: locale === "es" ? SITE_URL : `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
    alternates: {
      languages: {
        es: SITE_URL,
        en: `${SITE_URL}/en`,
      },
    },
  }));

  // Artwork pages
  const artworkPages: MetadataRoute.Sitemap = ALL_IMAGES.flatMap((img) =>
    locales.map((locale) => ({
      url:
        locale === "es"
          ? `${SITE_URL}/artwork/${img.slug}`
          : `${SITE_URL}/${locale}/artwork/${img.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          es: `${SITE_URL}/artwork/${img.slug}`,
          en: `${SITE_URL}/en/artwork/${img.slug}`,
        },
      },
    })),
  );

  return [...homePages, ...artworkPages];
}
