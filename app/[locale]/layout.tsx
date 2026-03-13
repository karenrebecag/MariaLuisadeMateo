import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { TransitionProvider } from "@/src/lib/transition-context";
import { RecaptchaProvider } from "@/src/components/providers/RecaptchaProvider";
import { routing } from "@/src/i18n/routing";

const SITE_URL = "https://demateo.mx";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const canonicalPath = locale === "es" ? "" : `/${locale}`;
  const title = t("title");
  const description = t("description");

  return {
    title: {
      absolute: title,
      template: `%s | María Luisa de Mateo`,
    },
    description,
    alternates: {
      canonical: `${SITE_URL}${canonicalPath}`,
      languages: {
        es: `${SITE_URL}`,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonicalPath}`,
      locale: locale === "es" ? "es_MX" : "en_US",
    },
    twitter: {
      title,
      description,
    },
  };
}

function PersonJsonLd({ locale }: { locale: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "María Luisa de Mateo Venturini",
    jobTitle: locale === "es" ? "Artista Visual" : "Visual Artist",
    description:
      locale === "es"
        ? "Pintora realista mexicana. Retratos al óleo, realismo abstracto, paisajes y naturaleza muerta."
        : "Mexican realist painter. Oil portraits, abstract realism, landscapes and still life.",
    url: SITE_URL,
    image: `${SITE_URL}/og-image.jpg`,
    sameAs: [
      "https://www.instagram.com/maria_luisa_de_mateo/",
      "https://www.artsy.net/artist/de-mateo",
    ],
    knowsAbout: [
      "Oil Painting",
      "Portraiture",
      "Abstract Realism",
      "Still Life",
    ],
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Universidad Nacional Autónoma de México (UNAM)",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "University of California, Berkeley",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ciudad de México",
      addressCountry: "MX",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "María Luisa de Mateo",
    url: SITE_URL,
    inLanguage: ["es", "en"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <PersonJsonLd locale={locale} />
        <WebSiteJsonLd />
      </head>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <RecaptchaProvider>
            <TransitionProvider>{children}</TransitionProvider>
          </RecaptchaProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
