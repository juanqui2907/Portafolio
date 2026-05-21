import hotwheels0 from "../../../assets/images/projects/hotwheels/hotwheels-0.webp";
import hotwheels1 from "../../../assets/images/projects/hotwheels/hotwheels-1.webp";
import hotwheels2 from "../../../assets/images/projects/hotwheels/hotwheels-2.webp";
import hotwheels3 from "../../../assets/images/projects/hotwheels/hotwheels-3.webp";

import type { ProjectContent } from "../../types";

export default {
  title: "Hot Wheels Collection",
  theme: "dark",
  tags: ["html", "css", "javascript"],
  videoBorder: false,
  live: "https://juanqui2907.github.io",
  description:
    "Galería web interactiva de mi colección personal de Hot Wheels — más de 75 carros a escala organizados por año, premium y Matchbox.<br/><br/>Construida en HTML, CSS y JavaScript puro: visor de imágenes ampliadas con navegación entre fotos, secciones para 'carros a conseguir', y diseño responsive para verla cómoda desde el celular.",
  components: [
    {
      type: "media",
      props: {
        type: "image",
        src: hotwheels0,
        alt: "Inicio de la colección",
        caption: "Sobre mí y portada",
      },
    },
    {
      type: "media",
      props: {
        type: "image",
        src: hotwheels1,
        alt: "Carros a conseguir",
        caption: "Lista de wishlist y premium",
      },
    },
    {
      type: "media",
      props: {
        type: "image",
        src: hotwheels2,
        alt: "Colección 2024",
        caption: "Colección Hot Wheels 2024",
      },
    },
    {
      type: "media",
      props: {
        type: "image",
        src: hotwheels3,
        alt: "Visor de imagen ampliada",
        caption: "Visor con navegación",
      },
    },
  ],
} as const satisfies ProjectContent;
