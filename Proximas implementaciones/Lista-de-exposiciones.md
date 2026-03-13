# Lista de exposiciones

## Donde vive el contenido biografico actualmente

### Textos de bio

**Archivos de traduccion:**
- `src/i18n/messages/es.json` → clave `bio` (6 parrafos: p1–p6)
- `src/i18n/messages/en.json` → misma estructura

**Componente:**
- `src/components/organisms/Bio.tsx` — renderiza stats + parrafos

### Mencion de exposiciones

Las exposiciones solo se mencionan de forma generica:

1. **Stat "30+"** en la barra de estadisticas:
   ```json
   "exhibitionsValue": "30+",
   "exhibitionsLabel": "Exposiciones"
   ```

2. **Parrafo p6** (ultimo de la bio):
   > "Ha realizado exposiciones tanto en México como en el extranjero. Los diferentes temas en sus pinturas son expresiones de estas exposiciones."

3. **Formulario de contacto** — opcion de asunto:
   ```json
   "subjectExhibition": "Exposición / Colaboración"
   ```

**No existe** una lista de exposiciones, ni datos estructurados, ni seccion dedicada.

---

## Que requeriria una seccion dedicada de exposiciones

### Estructura de datos propuesta

```typescript
// src/data/exhibitions.ts
interface Exhibition {
  id: string;                    // "galeria-arte-2024"
  title_es: string;              // "Miradas del Silencio"
  title_en: string;              // "Gazes of Silence"
  type: "solo" | "group";        // Individual o colectiva
  venue: string;                 // "Galeria de Arte Contemporaneo"
  city: string;                  // "Ciudad de Mexico"
  country: string;               // "Mexico"
  year: number;                  // 2024
  month?: number;                // 3 (opcional, para orden dentro del anio)
  description_es?: string;       // Descripcion breve
  description_en?: string;
  imageUrl?: string;             // Foto de la exposicion o cartel
  externalUrl?: string;          // Link a resena, catalogo, o venue
}
```

### Ejemplo de datos

```typescript
const EXHIBITIONS: Exhibition[] = [
  {
    id: "catedral-valdivia-2023",
    title_es: "Museo Catedral Valdivia",
    title_en: "Cathedral Museum Valdivia",
    type: "solo",
    venue: "Museo de la Catedral",
    city: "Valdivia",
    country: "Chile",
    year: 2023,
  },
  {
    id: "galeria-cdmx-2022",
    title_es: "Retratos y Realidades",
    title_en: "Portraits and Realities",
    type: "solo",
    venue: "Galeria XYZ",
    city: "Ciudad de Mexico",
    country: "Mexico",
    year: 2022,
    description_es: "Exposicion individual de 15 retratos al oleo.",
    description_en: "Solo exhibition of 15 oil portraits.",
  },
  // ... 30+ exposiciones
];
```

---

## Opciones de UI

### Opcion A: Timeline vertical (recomendada)

Lista cronologica inversa, agrupada por anio:

```
EXPOSICIONES

2024
─────────────────────────────
● Miradas del Silencio          Individual
  Galeria de Arte, CDMX

● Colectiva de Realismo         Colectiva
  Museo Nacional, CDMX

2023
─────────────────────────────
● Museo Catedral Valdivia       Individual
  Valdivia, Chile

2022
─────────────────────────────
...
```

- Agrupada por anio con separadores visuales
- Badge "Individual" / "Colectiva"
- Ciudad y venue debajo del titulo
- Animacion de entrada escalonada con GSAP (consistente con el resto del sitio)

### Opcion B: Grid de tarjetas con imagen

Para exposiciones que tengan foto o cartel disponible:

```
+------------------+  +------------------+
| [foto/cartel]    |  | [foto/cartel]    |
| Titulo           |  | Titulo           |
| Venue, Ciudad    |  | Venue, Ciudad    |
| 2024 · Individual|  | 2023 · Colectiva |
+------------------+  +------------------+
```

### Opcion C: Hibrido

- Grid de tarjetas para las exposiciones destacadas (con imagen)
- Timeline para el listado completo debajo

---

## Componentes y archivos involucrados

### Archivos nuevos

| Archivo | Descripcion |
|---------|-------------|
| `src/data/exhibitions.ts` | Datos de exposiciones |
| `src/components/organisms/Exhibitions.tsx` | Componente principal (timeline o grid) |
| `app/[locale]/exhibitions/page.tsx` | Pagina dedicada (opcional, si no va en homepage) |

### Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `app/[locale]/page.tsx` | Agregar seccion de exposiciones en homepage |
| `src/i18n/messages/es.json` | Traducciones: label, titulo, tipos |
| `src/i18n/messages/en.json` | Mismas traducciones en ingles |
| `src/components/organisms/Bio.tsx` | Actualizar p6 con link a la seccion de exposiciones |
| `src/components/organisms/Header.tsx` | Agregar link "Exposiciones" al menu (opcional) |
| `app/globals.css` | Estilos para timeline/grid |
| `app/sitemap.ts` | Agregar URL de pagina de exposiciones (si es pagina aparte) |

---

## CMS vs datos estaticos

| Criterio | Estatico | CMS |
|----------|----------|-----|
| **Frecuencia de actualizacion** | Baja (1-3 exposiciones/anio) | Cualquier frecuencia |
| **Quien actualiza** | Desarrollador | La artista directamente |
| **Complejidad de setup** | Minima | Requiere CMS previo |
| **Tiempo de implementacion** | Rapido | Depende del CMS |

### Recomendacion

**Empezar con datos estaticos** (`src/data/exhibitions.ts`):

- Las exposiciones pasadas no cambian
- Solo se agregan 1-3 nuevas al anio
- Un array TypeScript es suficiente y no requiere infraestructura extra
- Si se implementa el CMS (ver `CMS-para-obra.md`), migrar a una coleccion del CMS

---

## Estimacion de complejidad y alcance

| Aspecto | Estimacion |
|---------|------------|
| **Complejidad general** | Baja |
| **Archivos nuevos** | 2-3 |
| **Archivos modificados** | 5-6 |
| **Riesgo de regresion** | Muy bajo (seccion nueva independiente) |

### Fases sugeridas

**Fase 1 — Datos y componente basico**
- Crear `exhibitions.ts` con datos estructurados
- Recopilar lista de 30+ exposiciones (requiere input de la artista)
- Crear componente `Exhibitions.tsx` con timeline

**Fase 2 — Integracion en el sitio**
- Agregar seccion en homepage o como pagina dedicada
- Traducciones es/en
- Animaciones GSAP de entrada

**Fase 3 — Enriquecimiento (opcional)**
- Fotos de exposiciones
- Links a resenas o catalogos
- Schema.org ExhibitionEvent para SEO

### Dependencias

- La lista completa de exposiciones requiere informacion de la artista
- Si se decide pagina aparte vs seccion en homepage, afecta la navegacion
- Puede integrarse con el sistema de series (ver `Sistema-de-categorias-por-series.md`) vinculando exposiciones con las obras que se mostraron
