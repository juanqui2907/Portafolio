import finflow0 from "../../../assets/images/projects/finflow/finflow-0.webp";
import finflow1 from "../../../assets/images/projects/finflow/finflow-1.webp";
import finflow2 from "../../../assets/images/projects/finflow/finflow-2.webp";
import finflow3 from "../../../assets/images/projects/finflow/finflow-3.webp";

import type { ProjectContent } from "../../types";

export default {
  title: "FinFlow",
  theme: "dark",
  tags: ["html", "css", "javascript", "pwa", "localstorage"],
  videoBorder: false,
  live: "https://juanqui2907.github.io/FinFlow/",
  description:
    "PWA mobile-first de finanzas personales: registro de transacciones, metas de ahorro, proyecciones de saldo, contador de denominaciones en pesos colombianos y exportación a PDF.<br/><br/>Una sola página HTML con localStorage — sin backend, instalable en el celular y lista para usarse offline.",
  components: [
    {
      type: "media",
      props: {
        type: "image",
        src: finflow0,
        alt: "Pantalla principal",
        caption: "Balance y transacciones",
      },
    },
    {
      type: "media",
      props: {
        type: "image",
        src: finflow1,
        alt: "Metas de ahorro",
        caption: "Metas de ahorro y progreso",
      },
    },
    {
      type: "media",
      props: {
        type: "image",
        src: finflow2,
        alt: "Proyección de saldo",
        caption: "Proyecciones a futuro",
      },
    },
    {
      type: "media",
      props: {
        type: "image",
        src: finflow3,
        alt: "Contador de denominaciones",
        caption: "Conteo de billetes en COP",
      },
    },
  ],
} as const satisfies ProjectContent;
