# Sistema de categorias por series

## Modelo de datos actual

### GalleryImage (galeria principal)

```typescript
// src/data/gallery-images.ts
interface GalleryImage {
  src: string;   // URL en Cloudflare R2
  alt: string;   // Titulo de la obra
  slug: string;  // Identificador para URL
}
```

- **48 obras** en un array plano `ALL_IMAGES`
- **Sin categorias, tags, series ni agrupacion** de ningun tipo
- Se muestran en orden aleatorio (Fisher-Yates shuffle)
- Desktop: 47 obras | Mobile: 10 obras aleatorias

### WorkItem (obra disponible)

```typescript
// src/components/organisms/AvailableWorks.tsx
interface WorkItem {
  src: string;
  alt: string;
  slug: string;
  medium: string;      // Tecnica
  dimensions?: string;
  price?: string;
  artsyUrl?: string;
}
```

- Viene de Artsy API o de un fallback estatico (9 obras)
- Tampoco tiene campo de serie/categoria

### ArtworkView (pagina individual)

- Solo muestra imagen + titulo
- No muestra tecnica, dimensiones, serie, ni descripcion

---

## Series naturales identificadas en las obras

Del analisis de nombres en `gallery-images.ts`:

| Serie | Obras | Cantidad |
|-------|-------|----------|
| **Enfrascados** | I, II, III, IV, V, VI, VII, VIII | 8 |
| **Retratos** | I, II, III, IV, V, VI, VII, VIII | 8 |
| **Zanate** | I, II, III, IV, V, VI, VII | 7 |
| **Realismo Abstracto** | I, IV, VIII, XII | 4 |
| **Dibujo** | Dibujo, Dibujo I, Dibujo II | 3 |
| **Carlota** | I, II | 2 |
| **Tempestades** | IX, XI | 2 |
| **Retratos individuales** | Alex, Armando, Chava, Diana Leon, Pablo, Pau, Re | 7 |
| **Obras sueltas** | Esta Vez, Tal Vez, Hoja, San Jorge y el Dragon, etc. | ~7 |

---

## Cambios al modelo de datos para soportar series

### Nueva interface propuesta

```typescript
interface GalleryImage {
  src: string;
  alt: string;
  slug: string;
  // --- Campos nuevos ---
  series?: string;          // "enfrascados", "retratos", "zanate", etc.
  seriesOrder?: number;     // Orden dentro de la serie (I=1, II=2...)
  technique?: string;       // "Oleo sobre tela"
  year?: number;            // 2023
  dimensions?: string;      // "100 x 80 cm"
}
```

### Definicion de series

```typescript
// src/data/series.ts (nuevo archivo)
interface Series {
  id: string;              // "enfrascados"
  title_es: string;        // "Enfrascados"
  title_en: string;        // "Absorbed"
  description_es: string;  // Descripcion de la serie en espanol
  description_en: string;  // Descripcion de la serie en ingles
  slug: string;            // Para URL /series/enfrascados
  coverImage: string;      // Imagen representativa de la serie
  order: number;           // Orden de aparicion en la navegacion
}
```

### Asociacion serie-obras

Cada obra referencia su serie por `id`:

```typescript
// gallery-images.ts
{
  src: "https://...r2.dev/de-mateo/enfrascados-1.webp",
  alt: "Enfrascados I",
  slug: "enfrascados-1",
  series: "enfrascados",    // <-- referencia al id de la serie
  seriesOrder: 1,
  technique: "Oleo sobre tela",
  year: 2022,
}
```

Funciones helper:

```typescript
// Obtener obras de una serie
const getArtworksBySeries = (seriesId: string) =>
  ALL_IMAGES.filter(img => img.series === seriesId)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));

// Obtener todas las series con conteo
const getAllSeries = () =>
  SERIES.map(s => ({
    ...s,
    count: ALL_IMAGES.filter(img => img.series === s.id).length
  }));
```

---

## Componentes UI que necesitarian cambios

### 1. MasonryGallery.tsx (galeria desktop)

**Cambio:** Agregar filtros por serie arriba de la galeria

- Barra horizontal de chips/botones con nombres de series
- Chip "Todas" activo por defecto
- Al seleccionar una serie, filtrar `ALL_IMAGES` antes de distribuir en columnas
- Re-animar el layout con GSAP Flip al cambiar filtro
- Ya existe infraestructura de filtrado en `useMasonry.ts` (`data-filter-status`)

### 2. MobileMasonryGallery.tsx (galeria mobile)

**Cambio:** Mismo sistema de filtros adaptado a mobile

- Scroll horizontal de chips
- Filtrar el subset de 10 imagenes por serie seleccionada

### 3. ArtworkView.tsx (pagina individual de obra)

**Cambio:** Mostrar serie y navegacion entre obras de la misma serie

- Badge con nombre de la serie (link a la pagina de serie)
- Flechas "Anterior / Siguiente" dentro de la serie
- Mostrar tecnica, dimensiones, anio si estan disponibles

### 4. AdaptiveGallery.tsx (wrapper)

**Cambio:** Pasar estado de filtro activo a ambos componentes hijos

### 5. Nuevo: SeriesPage (pagina dedicada por serie)

**Ruta:** `/[locale]/series/[slug]`

- Header con titulo y descripcion de la serie
- Grid de todas las obras de esa serie en orden
- Metadata SEO con schema.org Collection

### 6. Nuevo: SeriesIndex (indice de series)

**Ruta:** `/[locale]/series`

- Grid de tarjetas, cada una con la imagen de portada de la serie
- Nombre, descripcion corta, y conteo de obras

### 7. Header.tsx (navegacion)

**Cambio:** Considerar agregar link a "Series" en el menu

### 8. sitemap.ts

**Cambio:** Agregar URLs de paginas de series

---

## Archivos afectados

| Archivo | Tipo de cambio |
|---------|---------------|
| `src/data/gallery-images.ts` | Agregar campos `series`, `seriesOrder`, `technique`, `year` |
| `src/data/series.ts` | **Nuevo** — Definicion de series con descripciones bilingues |
| `src/components/organisms/MasonryGallery.tsx` | Agregar barra de filtros + logica de filtrado |
| `src/components/organisms/MobileMasonryGallery.tsx` | Agregar filtros mobile |
| `src/components/organisms/AdaptiveGallery.tsx` | Pasar estado de filtro |
| `src/components/templates/ArtworkView.tsx` | Mostrar serie + navegacion intra-serie |
| `app/[locale]/series/page.tsx` | **Nuevo** — Indice de series |
| `app/[locale]/series/[slug]/page.tsx` | **Nuevo** — Pagina individual de serie |
| `src/i18n/messages/es.json` | Agregar traducciones de series |
| `src/i18n/messages/en.json` | Agregar traducciones de series |
| `app/sitemap.ts` | Agregar URLs de series |
| `src/hooks/useMasonry.ts` | Activar logica de filtrado existente |

---

## Estimacion de complejidad y alcance

| Aspecto | Estimacion |
|---------|------------|
| **Complejidad general** | Media-Alta |
| **Archivos nuevos** | 3 (series data, 2 paginas) |
| **Archivos modificados** | 9 |
| **Riesgo de regresion** | Medio (el layout de galeria es complejo con GSAP) |

### Fases sugeridas

**Fase 1 — Modelo de datos**
- Crear `src/data/series.ts` con definicion de series
- Agregar campos `series` y `seriesOrder` a cada obra en `gallery-images.ts`
- Clasificar las 48 obras en sus series correspondientes

**Fase 2 — Filtrado en galeria**
- Implementar barra de filtros en MasonryGallery
- Activar `useMasonry.ts` para filtrado animado
- Adaptar MobileMasonryGallery con filtros

**Fase 3 — Paginas de serie**
- Crear `/series` (indice) y `/series/[slug]` (detalle)
- SEO: metadata, sitemap, structured data
- Traducciones es/en

**Fase 4 — Enriquecer pagina individual**
- Mostrar serie, tecnica, dimensiones en ArtworkView
- Navegacion "anterior/siguiente" dentro de la serie
- Link de regreso a la serie

### Dependencias

- Si se implementa el CMS (ver `CMS-para-obra.md`), las series deberian definirse ahi en vez de en archivos estaticos
- La clasificacion de las 48 obras en series requiere input de la artista
