import thumbnailHotwheels from "../../../assets/thumbnails/hotwheels.webp";
import thumbnailOrdia from "../../../assets/thumbnails/ordia.webp";
import thumbnailFinflow from "../../../assets/thumbnails/finflow.webp";
import thumbnailSuenan from "../../../assets/thumbnails/suenan.webp";

import type { ProjectPreview } from "../../types";

export default [
  {
    title: "Hot Wheels Collection",
    slug: "hotwheels",
    thumbnail: thumbnailHotwheels,
    description: "Galería web de mi colección",
  },
  {
    title: "OrdIA",
    slug: "ordia",
    thumbnail: thumbnailOrdia,
    description: "PWA de organización personal",
  },
  {
    title: "FinFlow",
    slug: "finflow",
    thumbnail: thumbnailFinflow,
    description: "PWA de finanzas personales",
  },
  {
    title: "Palabras que Suenan",
    slug: "suenan",
    thumbnail: thumbnailSuenan,
    description: "App de cartas con frases",
  },
] as const satisfies ProjectPreview[];
