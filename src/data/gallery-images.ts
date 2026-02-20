// All artwork images hosted on Cloudflare R2
const BASE = "https://pub-62c41549a44642efbcd3f775bdb039b3.r2.dev/de-mateo";

export interface GalleryImage {
  src: string;
  alt: string;
}

export const ALL_IMAGES: GalleryImage[] = [
  { src: `${BASE}/alex.webp`, alt: "Alex" },
  { src: `${BASE}/armando.webp`, alt: "Armando" },
  { src: `${BASE}/carlota1.webp`, alt: "Carlota I" },
  { src: `${BASE}/carlota2.webp`, alt: "Carlota II" },
  { src: `${BASE}/chava-retrato.webp`, alt: "Chava Retrato" },
  { src: `${BASE}/diana-leon.webp`, alt: "Diana León" },
  { src: `${BASE}/dibujo-1.webp`, alt: "Dibujo I" },
  { src: `${BASE}/dibujo-2.webp`, alt: "Dibujo II" },
  { src: `${BASE}/dibujo.webp`, alt: "Dibujo" },
  { src: `${BASE}/enfrascados-1.webp`, alt: "Enfrascados I" },
  { src: `${BASE}/enfrascados-2.webp`, alt: "Enfrascados II" },
  { src: `${BASE}/enfrascados-3.webp`, alt: "Enfrascados III" },
  { src: `${BASE}/enfrascados-4.webp`, alt: "Enfrascados IV" },
  { src: `${BASE}/enfrascados-5.webp`, alt: "Enfrascados V" },
  { src: `${BASE}/enfrascados-6.webp`, alt: "Enfrascados VI" },
  { src: `${BASE}/enfrascados-7.webp`, alt: "Enfrascados VII" },
  { src: `${BASE}/enfrascados-8.webp`, alt: "Enfrascados VIII" },
  { src: `${BASE}/esta-vez.webp`, alt: "Esta Vez" },
  { src: `${BASE}/hoja-1.webp`, alt: "Hoja" },
  { src: `${BASE}/museo-catedral-valdivia.webp`, alt: "Museo Catedral Valdivia" },
  { src: `${BASE}/pablo.webp`, alt: "Pablo" },
  { src: `${BASE}/pau.webp`, alt: "Pau" },
  { src: `${BASE}/poema-exposiciones.webp`, alt: "Poema Exposiciones" },
  { src: `${BASE}/re.webp`, alt: "Re" },
  { src: `${BASE}/realismo_abstracto_1.webp`, alt: "Realismo Abstracto I" },
  { src: `${BASE}/realismo_abstracto_4.webp`, alt: "Realismo Abstracto IV" },
  { src: `${BASE}/realismo_abstracto_8.webp`, alt: "Realismo Abstracto VIII" },
  { src: `${BASE}/realismo_abstracto_12.webp`, alt: "Realismo Abstracto XII" },
  { src: `${BASE}/retratos-1.webp`, alt: "Retratos I" },
  { src: `${BASE}/retratos-2.webp`, alt: "Retratos II" },
  { src: `${BASE}/retratos-3.webp`, alt: "Retratos III" },
  { src: `${BASE}/retratos-4.webp`, alt: "Retratos IV" },
  { src: `${BASE}/retratos-5.webp`, alt: "Retratos V" },
  { src: `${BASE}/retratos-6.webp`, alt: "Retratos VI" },
  { src: `${BASE}/retratos-7.webp`, alt: "Retratos VII" },
  { src: `${BASE}/retratos-8.webp`, alt: "Retratos VIII" },
  { src: `${BASE}/san-uorge-y-el-dragon.webp`, alt: "San Jorge y el Dragón" },
  { src: `${BASE}/tal-vez.webp`, alt: "Tal Vez" },
  { src: `${BASE}/tempestades-9.webp`, alt: "Tempestades IX" },
  { src: `${BASE}/tempestades-11.webp`, alt: "Tempestades XI" },
  { src: `${BASE}/zanate-1.webp`, alt: "Zanate I" },
  { src: `${BASE}/zanate-2.webp`, alt: "Zanate II" },
  { src: `${BASE}/zanate-3.webp`, alt: "Zanate III" },
  { src: `${BASE}/zanate-4.webp`, alt: "Zanate IV" },
  { src: `${BASE}/zanate-5.webp`, alt: "Zanate V" },
  { src: `${BASE}/zanate-6.webp`, alt: "Zanate VI" },
  { src: `${BASE}/zanate-7.webp`, alt: "Zanate VII" },
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
