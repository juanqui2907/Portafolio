import ordia0 from "../../../assets/images/projects/ordia/ordia-0.webp";
import ordia1 from "../../../assets/images/projects/ordia/ordia-1.webp";
import ordia2 from "../../../assets/images/projects/ordia/ordia-2.webp";
import ordia3 from "../../../assets/images/projects/ordia/ordia-3.webp";

import type { ProjectContent } from "../../types";

export default {
  title: "OrdIA",
  theme: "dark",
  tags: ["html", "css", "javascript", "pwa", "localstorage"],
  videoBorder: false,
  live: "https://juanqui2907.github.io/OrdIA/",
  description:
    "PWA personal de organización: temporizadores múltiples, seguimiento de hábitos con rachas, calendario, lista de tareas con prioridades, materias y técnica Pomodoro configurable.<br/><br/>Todo se guarda en el navegador con localStorage, sin backend. Modo claro/oscuro y diseño mobile-first para usarla todos los días.",
  components: [
    {
      type: "media",
      props: {
        type: "image",
        src: ordia0,
        alt: "Vista de hoy",
        caption: "Vista principal y temporizadores",
      },
    },
    {
      type: "media",
      props: {
        type: "image",
        src: ordia1,
        alt: "Hábitos y progreso",
        caption: "Hábitos con racha y progreso",
      },
    },
    {
      type: "media",
      props: {
        type: "image",
        src: ordia2,
        alt: "Do It y prioridades",
        caption: "Lista de tareas con prioridades",
      },
    },
    {
      type: "media",
      props: {
        type: "image",
        src: ordia3,
        alt: "Pomodoro",
        caption: "Pomodoro configurable",
      },
    },
  ],
} as const satisfies ProjectContent;
