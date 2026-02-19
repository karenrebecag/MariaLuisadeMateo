import Link from "next/link";
import { Text } from "@/src/components/atoms/Typography";
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
  const posts = await getInstagramPosts(INSTAGRAM_USERNAME);
  const items: MarqueeItem[] = posts ?? FALLBACK_ITEMS;

  return (
    <section id="instagram" aria-label="Instagram de María Luisa de Mateo">
      {/* Section header — follows page horizontal rhythm */}
      <div className="section-padding pb-0">
        <div className="max-width">
          <div className="flex items-end justify-between">
            <div>
              <Text variant="label" className="mb-4 text-primary">
                En Instagram
              </Text>
              <p className="font-serif italic text-[var(--type-h3)] leading-tight text-card-foreground">
                @{INSTAGRAM_USERNAME}
              </p>
            </div>
            <Link
              href={`https://www.instagram.com/${INSTAGRAM_USERNAME}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Ver perfil →
            </Link>
          </div>
        </div>
      </div>

      {/* Full-bleed draggable marquee */}
      <div className="mt-10 pb-[var(--section-py)]">
        <DraggableMarquee items={items} direction="left" duration={40} />
      </div>
    </section>
  );
}
