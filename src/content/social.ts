export const social = [
  { url: "mailto:jfqc123@gmail.com", name: "mail" },
  { url: "https://github.com/juanqui2907", name: "github" },
  { url: "https://www.linkedin.com/in/juan-felipe-quintero-caballero-a79a21337/", name: "linkedin" },
  { url: "https://x.com/Juan80341326", name: "x" },
] as const satisfies { url: string; name: "mail" | "github" | "instagram" | "linkedin" | "x" }[];
