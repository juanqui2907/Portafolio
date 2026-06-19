# Portafolio — Juan Quintero

Portafolio personal. HTML + CSS + JS puro, Three.js vía CDN. **Cero build, cero dependencias locales.**

## Easter eggs

- **Click en el carro 3D**: activa "Hot Wheels mode" — el carro acelera, cambia a naranja, y aparece un enlace a tu colección.
- **Teclado: escribir `race`** en cualquier momento: mismo efecto.

## Notas

- Three.js se carga desde unpkg vía importmap, no necesitas instalar nada.
- Si Vercel no levanta los módulos ES, revisa que `vercel.json` no esté forzando un build. No lo necesitas.
- Las animaciones del scroll usan `IntersectionObserver` (compatible con todos los navegadores modernos).
- El canvas del osciloscopio es 2D puro, no Three.js — más liviano.