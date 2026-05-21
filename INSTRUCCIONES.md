# Portafolio Juan Quintero — Instrucciones de setup

Este paquete contiene **solo los archivos modificados** que reemplazan los del proyecto original (`portfolio-2025-main`). El resto del código (Three.js, GSAP, animaciones, etc.) se queda como está.

---

## Paso 1 — Copiar los archivos sobre el proyecto original

Descomprime tu copia del repo original (`portfolio-2025-main`). Luego copia los archivos de este paquete **respetando la misma estructura de carpetas**, sobrescribiendo los originales.

Mapa de qué reemplaza qué:

| Archivo de este paquete | Reemplaza en el proyecto |
|---|---|
| `index.html` | `index.html` |
| `src/i18n/constants/index.ts` | `src/i18n/constants/index.ts` |
| `src/i18n/messages/namespaces/common/en.json` | mismo path (sobrescribir) |
| `src/content/social.ts` | mismo path |
| `src/content/projects/index.ts` | mismo path |
| `src/content/projects/previews/index.ts` | mismo path |
| `src/content/projects/previews/en.ts` | mismo path |
| `src/content/projects/en/hotwheels.ts` | **archivo nuevo** |
| `src/content/projects/en/ordia.ts` | **archivo nuevo** |
| `src/content/projects/en/finflow.ts` | **archivo nuevo** |
| `src/content/projects/en/suenan.ts` | **archivo nuevo** |
| `src/components/tagVariants.ts` | mismo path |
| `src/components/Footer.vue` | mismo path |
| `src/features/home/components/Hero.vue` | mismo path |
| `src/features/home/components/BoxServices.vue` | mismo path |
| `src/features/home/components/BoxDescription.vue` | mismo path |
| `src/features/home/components/BoxDetails.vue` | mismo path |

---

## Paso 2 — Borrar lo que ya no se usa

Para que el build no se enrede ni cargue cosas viejas, **borra**:

```
src/content/projects/de/                  (carpeta completa — alemán)
src/content/projects/previews/de.ts       (preview alemán)
src/content/projects/en/cubewar.ts        (proyectos del autor original)
src/content/projects/en/quibbo.ts
src/content/projects/en/sharkie.ts
src/content/projects/en/pokedex.ts
src/content/projects/en/particles.ts
src/content/projects/en/streakon.ts
src/i18n/messages/namespaces/common/de.json
public/de/                                (carpeta alemana entera)
```

Las imágenes de los proyectos viejos (`src/assets/images/projects/cubewar/`, etc.) también puedes borrarlas para alivianar el repo.

---

## Paso 3 — Agregar tus propias imágenes

Necesitas tomar screenshots de cada proyecto y guardarlos en `.webp` (o convertirlos desde PNG/JPG con cualquier conversor online tipo squoosh.app).

**Thumbnails** — uno por proyecto, ~600×450 px aprox., en:

```
src/assets/thumbnails/hotwheels.webp
src/assets/thumbnails/ordia.webp
src/assets/thumbnails/finflow.webp
src/assets/thumbnails/suenan.webp
```

**Imágenes del detalle** — 3 a 4 por proyecto, ~1200×800 px, en:

```
src/assets/images/projects/hotwheels/hotwheels-0.webp ... hotwheels-3.webp
src/assets/images/projects/ordia/ordia-0.webp ... ordia-3.webp
src/assets/images/projects/finflow/finflow-0.webp ... finflow-3.webp
src/assets/images/projects/suenan/suenan-0.webp ... suenan-2.webp   (este tiene 3)
```

Los nombres deben coincidir exactamente con los `import` de cada archivo `.ts`. Si quieres más o menos imágenes, edita el `.ts` correspondiente.

---

## Paso 4 — Probar localmente

```bash
npm install
npm run dev
```

Abre http://localhost:3000

---

## Paso 5 — Deploy en Vercel

1. Crea repo en GitHub y haz push del proyecto.
2. Ve a https://vercel.com → **Add New** → **Project** → importa tu repo.
3. Vercel detecta Vite automáticamente. Confirma:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy. Listo, te da una URL `*.vercel.app` que puedes vincular a tu dominio después.

---

## Notas importantes

- **Licencia del proyecto original:** el footer mantiene el crédito a David Heckhoff con link a https://david-hckh.com. No lo quites — es requisito de la licencia para poder usar este código.
- **Logo:** el SVG del logo (forma hexagonal en `index.html` y `Logo.vue`) es de David. Si quieres uno propio, reemplaza el `d` del `path` en `index.html` con tu propio SVG.
- **Música/sonidos:** los audios en `sounds/` son del proyecto original. Puedes mantenerlos o cambiarlos.
- **Páginas legales:** `public/privacy.html` y `public/legal.html` están en inglés con datos del autor original. Si los enlazas desde el footer, edítalos con tus datos o desactiva esos links.
- **About copy:** está corto a propósito en el JSON. Edita `about-intro` en `src/i18n/messages/namespaces/common/en.json` si quieres expandirlo.

---

## Si algo falla

- Error de import faltante en `.webp`: te falta esa imagen, agrégala o quita ese `components` entry del `.ts`.
- Error de tag desconocido: agrega la tag en `src/components/tagVariants.ts`.
- TypeScript se queja: `npm run typecheck` te dice exactamente dónde.
