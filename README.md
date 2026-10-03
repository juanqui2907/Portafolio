# Portafolio — Juan Quintero · V2

Portafolio personal en **HTML + CSS + JavaScript puro**, con Three.js vía CDN. **Sin build y sin dependencias locales.**

## Qué cambió en la V2

- **TerraShield como Featured Project** con una visual técnica propia.
- **Previews visuales** para Hot Wheels Collection, Rutina, FinFlow, Palabras que Suenan y PowerFlow Electronics.
- Efectos inspirados en Rare UI adaptados a vanilla JS/CSS:
  - spotlight reactivo al cursor;
  - elevación/reveal en previews;
  - botones magnéticos;
  - paneles con glow muy sutil.
- **LAB trifásico ampliado** con:
  - frecuencia 40–80 Hz;
  - amplitud y velocidad;
  - FAULT;
  - UNBALANCE;
  - VOLTAGE SAG;
  - THD y estado de red dinámicos;
  - RESET.
- **Vercel Web Analytics y Speed Insights** preparados para despliegue estático.
- Eventos de interacción preparados para proyectos, descarga de CV, contacto, LAB y easter eggs.

## Easter eggs

### Hot Wheels
- **Click en el carro 3D**: activa Hot Wheels mode.
- **Escribir `race`**: activa el mismo modo.

### Grid Failure / Blackout
Está oculto dentro del LAB. Para dispararlo hay que llevar el sistema a una combinación concreta de inestabilidad:

1. Activar `FAULT`.
2. Activar `UNBALANCE`.
3. Activar `VOLTAGE SAG`.
4. Bajar la frecuencia a **50 Hz o menos**.

La interfaz ejecuta una secuencia visual de protección: detección de inestabilidad → trip → island mode → black start → restauración.

## Vercel Analytics

El `index.html` incluye los scripts estáticos de Web Analytics y Speed Insights. En Vercel debes habilitar estas funciones desde el dashboard del proyecto.

Los eventos personalizados se envían mediante `window.va('event', ...)`; si el plan del proyecto no admite custom events, la interfaz sigue funcionando normalmente.

## Notas

- Three.js se carga desde `unpkg` mediante importmap.
- El osciloscopio continúa siendo canvas 2D puro.
- Se respeta `prefers-reduced-motion` para reducir animaciones si el navegador lo solicita.
- Los previews de proyectos son UI ligera hecha en HTML/CSS: no añaden imágenes pesadas ni nuevas dependencias.
