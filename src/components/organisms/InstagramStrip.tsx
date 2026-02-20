import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Text } from "@/src/components/atoms/Typography";
import { RevealOnScroll } from "@/src/components/atoms/RevealOnScroll";
import { DraggableMarquee, type MarqueeItem } from "./DraggableMarquee";
import { getInstagramPosts } from "@/src/lib/instagram";

const INSTAGRAM_USERNAME = "maria_luisa_de_mateo";

/** Static fallback — uses the artwork already in /public/images */
const FALLBACK_ITEMS: MarqueeItem[] = [
  { src: "/images/carlota.webp",      alt: "Carlota",      caption: "Carlota" },
  { src: "/images/retratos.webp",     alt: "Retratos",     caption: "Retratos" },
  { src: "/images/adolescentes.webp", alt: "Adolescentes", caption: "Adolescentes" },
  { src: "/images/enfrascados.webp",  alt: "Enfrascados",  caption: "Enfrascados" },
  { src: "/images/hojas.webp",        alt: "Hojas",        caption: "Hojas" },
  { src: "/images/zanates.webp",      alt: "Zanates",      caption: "Zanates" },
  { src: "/images/realismo.webp",     alt: "Realismo",     caption: "Realismo" },
  { src: "/images/repeticiones.webp", alt: "Repeticiones", caption: "Repeticiones" },
  { src: "/images/tempestades.webp",  alt: "Tempestades",  caption: "Tempestades" },
  { src: "/images/dibujo.webp",       alt: "Dibujo",       caption: "Dibujo" },
  { src: "/images/maria-luisa.webp",  alt: "María Luisa",  caption: "María Luisa" },
];

export async function InstagramStrip() {
  const t = await getTranslations("instagram");
  const posts = await getInstagramPosts(INSTAGRAM_USERNAME);
  const items: MarqueeItem[] = posts ?? FALLBACK_ITEMS;

  return (
    <section id="instagram" className="noise-bg" aria-label={t("ariaLabel")}>
      {/* Section header */}
      <RevealOnScroll className="section-padding pb-0" selector=".flex > *">
        <div className="max-width">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {/* Left — heading block */}
            <div className="flex flex-col gap-3">
              <Text variant="label" className="text-primary">
                {t("label")}
              </Text>
              <h2 className="font-serif text-[var(--type-h2)] leading-tight tracking-tight text-card-foreground">
                {t("title")}
              </h2>
              <p className="max-w-[38ch] font-sans text-base leading-relaxed text-muted-foreground">
                {t("description")}
              </p>
            </div>

            {/* Right — handle + link */}
            <div className="flex flex-col items-start gap-1 md:items-end">
              <Link
                href={`https://www.instagram.com/${INSTAGRAM_USERNAME}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif italic text-xl leading-tight text-card-foreground underline-offset-4 hover:underline"
              >
                @{INSTAGRAM_USERNAME}
              </Link>
              <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                {t("follow")}
              </span>
            </div>
          </div>
        </div>
      </RevealOnScroll>

      {/* Full-bleed draggable marquee */}
      <RevealOnScroll className="mt-10 pb-[var(--section-py)]" selector=":scope > *">
        <DraggableMarquee items={items} direction="left" duration={40} />
      </RevealOnScroll>
    </section>
  );
}
