// All artwork images hosted on Cloudflare R2
const BASE = "https://pub-62c41549a44642efbcd3f775bdb039b3.r2.dev/de-mateo";

export interface GalleryImage {
  src: string;
  alt: string;
  slug: string;
}

export const ALL_IMAGES: GalleryImage[] = [
  { src: `${BASE}/alex.webp`, alt: "Alex", slug: "alex" },
  { src: `${BASE}/armando.webp`, alt: "Armando", slug: "armando" },
  { src: `${BASE}/carlota1.webp`, alt: "Carlota I", slug: "carlota1" },
  { src: `${BASE}/carlota2.webp`, alt: "Carlota II", slug: "carlota2" },
  { src: `${BASE}/chava-retrato.webp`, alt: "Chava Retrato", slug: "chava-retrato" },
  { src: `${BASE}/diana-leon.webp`, alt: "Diana León", slug: "diana-leon" },
  { src: `${BASE}/dibujo-1.webp`, alt: "Dibujo I", slug: "dibujo-1" },
  { src: `${BASE}/dibujo-2.webp`, alt: "Dibujo II", slug: "dibujo-2" },
  { src: `${BASE}/dibujo.webp`, alt: "Dibujo", slug: "dibujo" },
  { src: `${BASE}/enfrascados-1.webp`, alt: "Enfrascados I", slug: "enfrascados-1" },
  { src: `${BASE}/enfrascados-2.webp`, alt: "Enfrascados II", slug: "enfrascados-2" },
  { src: `${BASE}/enfrascados-3.webp`, alt: "Enfrascados III", slug: "enfrascados-3" },
  { src: `${BASE}/enfrascados-4.webp`, alt: "Enfrascados IV", slug: "enfrascados-4" },
  { src: `${BASE}/enfrascados-5.webp`, alt: "Enfrascados V", slug: "enfrascados-5" },
  { src: `${BASE}/enfrascados-6.webp`, alt: "Enfrascados VI", slug: "enfrascados-6" },
  { src: `${BASE}/enfrascados-7.webp`, alt: "Enfrascados VII", slug: "enfrascados-7" },
  { src: `${BASE}/enfrascados-8.webp`, alt: "Enfrascados VIII", slug: "enfrascados-8" },
  { src: `${BASE}/esta-vez.webp`, alt: "Esta Vez", slug: "esta-vez" },
  { src: `${BASE}/hoja-1.webp`, alt: "Hoja", slug: "hoja-1" },
  { src: `${BASE}/museo-catedral-valdivia.webp`, alt: "Museo Catedral Valdivia", slug: "museo-catedral-valdivia" },
  { src: `${BASE}/pablo.webp`, alt: "Pablo", slug: "pablo" },
  { src: `${BASE}/pau.webp`, alt: "Pau", slug: "pau" },
  { src: `${BASE}/poema-exposiciones.webp`, alt: "Poema Exposiciones", slug: "poema-exposiciones" },
  { src: `${BASE}/re.webp`, alt: "Re", slug: "re" },
  { src: `${BASE}/realismo_abstracto_1.webp`, alt: "Realismo Abstracto I", slug: "realismo-abstracto-1" },
  { src: `${BASE}/realismo_abstracto_4.webp`, alt: "Realismo Abstracto IV", slug: "realismo-abstracto-4" },
  { src: `${BASE}/realismo_abstracto_8.webp`, alt: "Realismo Abstracto VIII", slug: "realismo-abstracto-8" },
  { src: `${BASE}/realismo_abstracto_12.webp`, alt: "Realismo Abstracto XII", slug: "realismo-abstracto-12" },
  { src: `${BASE}/retratos-1.webp`, alt: "Retratos I", slug: "retratos-1" },
  { src: `${BASE}/retratos-2.webp`, alt: "Retratos II", slug: "retratos-2" },
  { src: `${BASE}/retratos-3.webp`, alt: "Retratos III", slug: "retratos-3" },
  { src: `${BASE}/retratos-4.webp`, alt: "Retratos IV", slug: "retratos-4" },
  { src: `${BASE}/retratos-5.webp`, alt: "Retratos V", slug: "retratos-5" },
  { src: `${BASE}/retratos-6.webp`, alt: "Retratos VI", slug: "retratos-6" },
  { src: `${BASE}/retratos-7.webp`, alt: "Retratos VII", slug: "retratos-7" },
  { src: `${BASE}/retratos-8.webp`, alt: "Retratos VIII", slug: "retratos-8" },
  { src: `${BASE}/san-uorge-y-el-dragon.webp`, alt: "San Jorge y el Dragón", slug: "san-jorge-y-el-dragon" },
  { src: `${BASE}/tal-vez.webp`, alt: "Tal Vez", slug: "tal-vez" },
  { src: `${BASE}/tempestades-9.webp`, alt: "Tempestades IX", slug: "tempestades-9" },
  { src: `${BASE}/tempestades-11.webp`, alt: "Tempestades XI", slug: "tempestades-11" },
  { src: `${BASE}/zanate-1.webp`, alt: "Zanate I", slug: "zanate-1" },
  { src: `${BASE}/zanate-2.webp`, alt: "Zanate II", slug: "zanate-2" },
  { src: `${BASE}/zanate-3.webp`, alt: "Zanate III", slug: "zanate-3" },
  { src: `${BASE}/zanate-4.webp`, alt: "Zanate IV", slug: "zanate-4" },
  { src: `${BASE}/zanate-5.webp`, alt: "Zanate V", slug: "zanate-5" },
  { src: `${BASE}/zanate-6.webp`, alt: "Zanate VI", slug: "zanate-6" },
  { src: `${BASE}/zanate-7.webp`, alt: "Zanate VII", slug: "zanate-7" },
];

/** Fisher-Yates shuffle — returns a new array */
export function shuffleImages(images: GalleryImage[]): GalleryImage[] {
  const arr = [...images];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const DESKTOP_COUNT = 47;
export const MOBILE_COUNT = 10;
