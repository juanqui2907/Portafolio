# Portafolio — Juan Quintero

Portafolio personal. HTML + CSS + JS puro, Three.js vía CDN. **Cero build, cero dependencias locales.**

## Estructura

```
portfolio/
├── index.html     # Estructura completa
├── styles.css     # Diseño
├── app.js         # Three.js + osciloscopio + interacciones
├── og-image.png   # Preview para WhatsApp/LinkedIn/X (1200×630)
├── cv/            # Tus PDFs (electrónica, eléctrica, completo)
└── README.md
```

## Tus CVs

Coloca 3 archivos PDF dentro de la carpeta `cv/`:

```
cv/cv-electronica.pdf
cv/cv-electrica.pdf
cv/cv-completo.pdf
```

Si quieres cambiar los nombres, edítalos en `index.html` buscando `cv-menu`.

## Probar en local

Tres opciones:

**1. Doble click a `index.html`** — funciona, pero algunos navegadores bloquean los ES modules con `file://`. Mejor usar un servidor local:

**2. Python (si lo tienes):**
```bash
cd portfolio
python -m http.server 8000
# abre http://localhost:8000
```

**3. Node:**
```bash
npx serve portfolio
```

## Deploy en Vercel

### Opción rápida (drag & drop)
1. Entra a https://vercel.com/new
2. Arrastra la carpeta `portfolio` completa
3. Listo, te da una URL `*.vercel.app`

### Opción con GitHub (recomendada)
1. Crea un repo nuevo en GitHub, sube los archivos:
   ```bash
   cd portfolio
   git init
   git add .
   git commit -m "init"
   git remote add origin https://github.com/juanqui2907/portafolio.git
   git push -u origin main
   ```
2. En https://vercel.com → **Add New → Project** → importa el repo.
3. Vercel detecta que es estático. Sin configurar nada, **Deploy**.

Vercel te da deploys automáticos en cada push.

## Cosas que puedes personalizar fácil

| Qué | Dónde |
|---|---|
| Texto del about | `index.html`, sección `<section id="about">` |
| Skills (nombre, descripción, nivel) | `index.html`, lista `.skill-list` (el `--lvl: 85%` controla la barra) |
| Proyectos | `index.html`, grid `.proj-grid` |
| Color de acento | `styles.css`, variable `--accent` (ahora ámbar `#ffb84d`) |
| Tipografías | `index.html` (Google Fonts) + `styles.css` (`--font-*`) |
| Carro 3D | `app.js`, sección `BUILD THE CAR` |

## Easter eggs

- **Click en el carro 3D**: activa "Hot Wheels mode" — el carro acelera, cambia a naranja, y aparece un enlace a tu colección.
- **Teclado: escribir `race`** en cualquier momento: mismo efecto.

## Notas

- Three.js se carga desde unpkg vía importmap, no necesitas instalar nada.
- Si Vercel no levanta los módulos ES, revisa que `vercel.json` no esté forzando un build. No lo necesitas.
- Las animaciones del scroll usan `IntersectionObserver` (compatible con todos los navegadores modernos).
- El canvas del osciloscopio es 2D puro, no Three.js — más liviano.

## Tu próximo paso

1. Probar local
2. Push a GitHub
3. Conectar a Vercel
4. Vincular dominio propio si quieres (Vercel lo hace en 3 clicks)

Si después quieres agregar más proyectos o cambiar la estética, el código es tuyo y está hecho para que lo entiendas y modifiques sin pelearte con un framework.
