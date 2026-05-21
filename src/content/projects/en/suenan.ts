import suenan0 from "../../../assets/images/projects/suenan/suenan-0.webp";
import suenan1 from "../../../assets/images/projects/suenan/suenan-1.webp";
import suenan2 from "../../../assets/images/projects/suenan/suenan-2.webp";

import type { ProjectContent } from "../../types";

export default {
  title: "Palabras que Suenan",
  theme: "dark",
  tags: ["html", "css", "javascript"],
  videoBorder: false,
  live: "https://juanqui2907.github.io/Suenan/",
  description:
    "App de cartas deslizables en español: frases reflexivas, chistes y piropos para compartir.<br/><br/>Interfaz tipo swipe con gestos táctiles, sin backend ni instalación — lista para usarse desde el navegador en cualquier dispositivo.",
  components: [
    {
      type: "media",
      props: {
        type: "image",
        src: suenan0,
        alt: "Carta de frase reflexiva",
        caption: "Frases reflexivas",
      },
    },
    {
      type: "media",
      props: {
        type: "image",
        src: suenan1,
        alt: "Carta de chiste",
        caption: "Chistes y piropos",
      },
    },
    {
      type: "media",
      props: {
        type: "image",
        src: suenan2,
        alt: "Gesto de swipe",
        caption: "Navegación por swipe",
      },
    },
  ],
} as const satisfies ProjectContent;
