# Estados disponible / vendido por pieza

## Estructura de datos actual

### GalleryImage (galeria principal — 48 obras)

```typescript
// src/data/gallery-images.ts
interface GalleryImage {
  src: string;   // URL en Cloudflare R2
  alt: string;   // Titulo
  slug: string;  // Identificador URL
}
```

- **No existe** campo de disponibilidad, estado ni precio
- Array plano sin metadata de venta

### WorkItem (seccion "Obra disponible")

```typescript
// src/components/organisms/AvailableWorks.tsx
interface WorkItem {
  src: string;
  alt: string;
  slug: string;
  medium: string;
  dimensions?: string;
  price?: string;       // <-- unico campo relacionado a venta
  artsyUrl?: string;
}
```

- `price` viene del campo `saleMessage` de Artsy
- No es un booleano de estado, es texto libre (ej. "Contact for price", "Sold", "$3,500")
- El fallback estatico (9 obras) no tiene `price`

### Artsy GraphQL (fuente externa)

```graphql
query {
  artist(id: "de-mateo") {
    artworksConnection {
      edges {
        node {
          title
          saleMessage    # "Contact for price" | "Sold" | "$X,XXX"
          slug
          medium
          ...
        }
      }
    }
  }
}
```

- `saleMessage` es el unico indicador de disponibilidad desde Artsy
- Artsy tambien expone `availability` y `isSold` en su API pero **no se consultan actualmente**

---

## Campos a agregar

### Opcion A: Campo simple (recomendada para inicio)

```typescript
interface GalleryImage {
  src: string;
  alt: string;
  slug: string;
  // --- Nuevo ---
  status?: "available" | "sold" | "not-for-sale";
}
```

### Opcion B: Modelo completo (para CMS futuro)

```typescript
interface GalleryImage {
  src: string;
  alt: string;
  slug: string;
  // --- Nuevos ---
  status: "available" | "sold" | "reserved" | "not-for-sale";
  price?: string;            // "$3,500" o "Consultar"
  soldDate?: string;         // Fecha de venta (ISO)
  collector?: string;        // "Coleccion privada" (opcional, para credito)
  artsyUrl?: string;         // Link a Artsy si aplica
}
```

### WorkItem actualizado

```typescript
interface WorkItem {
  src: string;
  alt: string;
  slug: string;
  medium: string;
  dimensions?: string;
  price?: string;
  artsyUrl?: string;
  // --- Nuevo ---
  status: "available" | "sold" | "reserved" | "not-for-sale";
}
```

---

## Mapeo de datos de Artsy a estados

| `saleMessage` de Artsy | Estado mapeado | Logica |
|------------------------|----------------|--------|
| `"Sold"` | `sold` | Texto exacto "Sold" |
| `"Contact for price"` | `available` | Indica que se puede comprar |
| `"$3,500"` (precio) | `available` | Tiene precio = disponible |
| `""` (vacio) | `available` | Default si no hay mensaje |
| `"On hold"` | `reserved` | Reservada |

Funcion de mapeo propuesta:

```typescript
function mapArtsyStatus(saleMessage: string): WorkItem["status"] {
  const msg = saleMessage.toLowerCase().trim();
  if (msg === "sold") return "sold";
  if (msg === "on hold") return "reserved";
  return "available";
}
```

Campos adicionales de Artsy que se podrian consultar:

```graphql
node {
  saleMessage
  availability     # "for sale" | "sold" | "on hold" | "not for sale"
  isSold           # boolean
  isPriceHidden    # boolean
}
```

Agregar `availability` al query GraphQL daria un mapeo mas robusto que depender solo de `saleMessage`.

---

## Cambios de UI necesarios

### 1. AvailableWorks.tsx — Badge de estado

```
+---------------------------+
|                           |
|        [imagen]           |
|                           |
+---------------------------+
| Titulo                    |
| Oleo sobre tela           |
| 100 x 80 cm               |
| ● Disponible   $3,500    |  <-- badge verde
+---------------------------+

+---------------------------+
|                           |
|        [imagen]           |
|     (overlay oscuro)      |
|       VENDIDO             |  <-- overlay + texto
+---------------------------+
| Titulo                    |
| Oleo sobre tela           |
| ● Vendido                 |  <-- badge rojo/gris
+---------------------------+
```

- Badge de color: verde (disponible), gris (vendido), amarillo (reservado)
- Obras vendidas: overlay sutil sobre la imagen + opacidad reducida
- Obras vendidas no deberian tener link a Artsy

### 2. ArtworkView.tsx — Pagina individual

- Mostrar estado de disponibilidad debajo del titulo
- Boton "Consultar precio" si `status === "available"`
- Texto "Vendido — Coleccion privada" si `status === "sold"`

### 3. MasonryGallery.tsx — Galeria principal (opcional)

- Pequeno indicador en el hover overlay (punto verde/rojo)
- No bloquear la visualizacion de obras vendidas, solo indicar estado

### 4. Filtro opcional

- En AvailableWorks: toggle "Mostrar vendidas" (ocultas por defecto)
- O tabs: "Disponibles" | "Vendidas" | "Todas"

### 5. Traducciones (es.json / en.json)

```json
{
  "status": {
    "available": "Disponible",
    "sold": "Vendido",
    "reserved": "Reservado",
    "notForSale": "No disponible para venta",
    "contactPrice": "Consultar precio"
  }
}
```

---

## Archivos afectados

| Archivo | Cambio |
|---------|--------|
| `src/data/gallery-images.ts` | Agregar campo `status` a cada obra |
| `src/lib/artsy.ts` | Agregar `availability` al query GraphQL + funcion de mapeo |
| `src/components/organisms/AvailableWorks.tsx` | Badge de estado, overlay en vendidas, filtro |
| `src/components/templates/ArtworkView.tsx` | Mostrar estado + CTA de consulta |
| `src/components/organisms/MasonryGallery.tsx` | Indicador sutil en hover (opcional) |
| `app/globals.css` | Estilos para badges y overlays de estado |
| `src/i18n/messages/es.json` | Traducciones de estados |
| `src/i18n/messages/en.json` | Traducciones de estados |

---

## Estimacion de complejidad y alcance

| Aspecto | Estimacion |
|---------|------------|
| **Complejidad general** | Baja-Media |
| **Archivos modificados** | 8 |
| **Archivos nuevos** | 0 |
| **Riesgo de regresion** | Bajo |

### Fases sugeridas

**Fase 1 — Modelo de datos**
- Agregar campo `status` a `GalleryImage`
- Clasificar las 48 obras (requiere input de la artista)
- Agregar `availability` al query GraphQL de Artsy
- Crear funcion `mapArtsyStatus()`

**Fase 2 — UI en AvailableWorks**
- Badge de estado (disponible/vendido)
- Overlay visual en obras vendidas
- Ocultar/mostrar vendidas

**Fase 3 — UI en pagina individual**
- Estado en ArtworkView
- CTA "Consultar precio" o "Vendido"

**Fase 4 — Galeria principal (opcional)**
- Indicador sutil en hover de MasonryGallery

### Dependencias

- Si se implementa el CMS (ver `CMS-para-obra.md`), el estado se gestionaria desde ahi
- La clasificacion inicial (disponible/vendido) requiere confirmacion de la artista
- Se puede sincronizar automaticamente con Artsy si se usa su campo `availability`
