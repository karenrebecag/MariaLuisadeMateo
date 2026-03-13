# CMS para subir y editar obra manualmente

## Estado actual del flujo de datos

### 1. Galeria principal (portfolio)

**Archivo:** `src/data/gallery-images.ts`

```typescript
export interface GalleryImage {
  src: string;   // URL en Cloudflare R2
  alt: string;   // Titulo (sirve como nombre de la obra)
  slug: string;  // Identificador para la URL /artwork/[slug]
}
```

- **47 obras** definidas en un array estatico `ALL_IMAGES`
- Imagenes alojadas en Cloudflare R2 (`pub-62c41549a44642efbcd3f775bdb039b3.r2.dev`)
- Formato WebP
- Las paginas individuales de cada obra se pre-generan en build time via `generateStaticParams()`
- El sitemap (`app/sitemap.ts`) genera URLs para las 47 obras en ambos idiomas

### 2. Obra disponible (venta via Artsy)

**Archivo:** `src/lib/artsy.ts`

```typescript
export interface ArtsyArtwork {
  src: string;        // URL de imagen (proxied)
  alt: string;        // Titulo
  slug: string;       // Slug de Artsy
  medium: string;     // Tecnica (ej. "Oleo sobre tela")
  year: string;       // Anio de creacion
  dimensions: string; // Dimensiones fisicas
  price: string;      // Mensaje de precio
  artsyUrl: string;   // Link a Artsy
}
```

- Consulta GraphQL al API publico de Artsy (hasta 24 obras)
- Cache de 1 hora con revalidacion de Next.js
- Proxy de imagenes en `/api/artsy-proxy` para manejar CORS
- Fallback a `FALLBACK_WORKS` estatico si Artsy falla

### 3. Flujo de datos actual

```
BUILD TIME:
gallery-images.ts (47 items) --> generateStaticParams() --> 47 paginas /artwork/[slug]

RUNTIME - Homepage:
  ALL_IMAGES --> shuffleImages() --> MasonryGallery (desktop) / MobileMasonryGallery (mobile)
  getArtsyArtworks() --> ArtsyWorksLoader --> AvailableWorks
  Fallback: FALLBACK_WORKS --> AvailableWorks

RUNTIME - Pagina individual:
  slug --> buscar en ALL_IMAGES --> ArtworkView
```

---

## Que requeriria una integracion con CMS headless

### Campos necesarios por obra

| Campo | Tipo | Requerido | Notas |
|-------|------|-----------|-------|
| titulo | text | si | Nombre de la obra |
| slug | text (auto) | si | Generado del titulo |
| imagen | media/image | si | Subida directa o URL externa |
| tecnica | text | no | Ej. "Oleo sobre tela" |
| anio | number | no | Anio de creacion |
| dimensiones | text | no | Ej. "100 x 80 cm" |
| descripcion_es | rich text | no | Descripcion en espaniol |
| descripcion_en | rich text | no | Descripcion en ingles |
| disponible | boolean | no | Si esta a la venta |
| precio | text | no | Rango o "Consultar" |
| categoria | select | no | Retrato, Paisaje, Naturaleza muerta, etc. |
| orden | number | no | Para controlar el orden en galeria |
| destacada | boolean | no | Mostrar en posiciones prominentes |

### Cambios requeridos en el codebase

| Archivo | Cambio |
|---------|--------|
| `src/data/gallery-images.ts` | Reemplazar array estatico por fetch al CMS |
| `src/lib/artsy.ts` | Mantener como fuente secundaria o migrar datos a CMS |
| `app/[locale]/artwork/[slug]/page.tsx` | Adaptar `generateStaticParams()` y metadata para leer del CMS |
| `app/sitemap.ts` | Fetch de slugs desde CMS en vez del array |
| `src/components/organisms/MasonryGallery.tsx` | Recibir datos via props desde server component |
| `src/components/organisms/AvailableWorks.tsx` | Filtrar obras con `disponible: true` desde CMS |
| `src/components/templates/ArtworkView.tsx` | Mostrar campos adicionales (tecnica, dimensiones, descripcion) |
| `next.config.mjs` | Agregar dominio del CMS a `remotePatterns` si las imagenes se alojan ahi |

---

## Opciones de CMS recomendadas

### 1. Payload CMS (Recomendado)

- **Por que:** Se integra nativamente con Next.js (mismo repo), usa la misma base de datos, SSR nativo
- **Hosting:** Self-hosted en el mismo deploy de Vercel o en su propio servidor
- **Base de datos:** PostgreSQL o MongoDB
- **Ventajas:**
  - Panel admin embebido en la misma app Next.js
  - TypeScript nativo, genera tipos automaticamente
  - Media library integrada (puede usar Cloudflare R2 como storage)
  - Relaciones, drafts, versionado
  - Gratuito y open source
- **Desventajas:**
  - Requiere base de datos (costo adicional si no se tiene)
  - Setup inicial mas complejo que un SaaS
- **Complejidad de integracion:** Media

### 2. Sanity

- **Por que:** CMS headless con excelente DX, real-time editing, generous free tier
- **Hosting:** SaaS (Sanity.io)
- **Ventajas:**
  - GROQ (lenguaje de consulta potente)
  - Sanity Studio personalizable
  - CDN de imagenes con transformaciones on-the-fly
  - Free tier generoso (100K documentos, 500K API requests/mes)
  - Plugin oficial para Next.js con ISR/revalidation
- **Desventajas:**
  - Dependencia de servicio externo
  - Curva de aprendizaje con GROQ
- **Complejidad de integracion:** Baja-Media

### 3. Notion (via API existente)

- **Por que:** Ya se usa Notion en el workspace; la artista podria editar desde una interfaz familiar
- **Ventajas:**
  - Interfaz ya conocida
  - Sin costo adicional
  - API funcional para leer bases de datos
- **Desventajas:**
  - API limitada y lenta
  - No es un CMS real (sin webhooks confiables, sin CDN de imagenes)
  - Rate limits
- **Complejidad de integracion:** Baja (pero con limitaciones)

### 4. Storyblok

- **Por que:** Visual editor, buen free tier, optimizado para Next.js
- **Ventajas:**
  - Editor visual (la artista ve cambios en tiempo real)
  - CDN de imagenes incluido
  - Webhooks para revalidacion
- **Desventajas:**
  - Free tier limitado a 1 usuario
- **Complejidad de integracion:** Baja-Media

---

## Estimacion de complejidad y alcance

| Aspecto | Estimacion |
|---------|------------|
| **Complejidad general** | Media |
| **Archivos afectados** | 8-10 |
| **Riesgo de regresion** | Bajo (los componentes visuales no cambian, solo la fuente de datos) |

### Fases sugeridas

**Fase 1 - Setup del CMS**
- Elegir e instalar CMS
- Definir schema/coleccion de obras
- Migrar las 47 obras actuales al CMS

**Fase 2 - Integracion con Next.js**
- Crear funciones de fetch (`getArtworks()`, `getArtworkBySlug()`)
- Reemplazar `gallery-images.ts` por fetch al CMS
- Adaptar `generateStaticParams()` y sitemap
- Configurar ISR o webhook para revalidacion

**Fase 3 - Campos enriquecidos**
- Agregar tecnica, dimensiones, descripcion bilingue al schema
- Actualizar `ArtworkView` para mostrar los nuevos campos
- Unificar Artsy + CMS en una sola fuente (opcional)

**Fase 4 - Media management**
- Configurar storage de imagenes (Cloudflare R2 o CDN del CMS)
- Panel para subir nuevas obras con optimizacion automatica
