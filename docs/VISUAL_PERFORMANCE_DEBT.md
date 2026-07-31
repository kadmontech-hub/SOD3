# Visual Performance Debt

## Decisión actual

La versión 2.0 conserva aproximadamente 143 MB de imágenes originales dentro de `public/assets/sod-visual`.

Se hizo intencionalmente para proteger la fidelidad visual durante la definición del MVP.

## Riesgos

- clones y deployments más pesados;
- transferencia elevada si el navegador visita muchas rutas;
- presión de memoria en mobile;
- caché PWA potencialmente grande tras navegación prolongada;
- imágenes PNG mayores de lo necesario.

## Mitigaciones ya presentes

- el service worker no precarga los 68 assets;
- las imágenes se solicitan por ruta;
- el Hub utiliza una sola imagen crítica como base;
- el build no genera copias adicionales dentro del ZIP fuente;
- Vercel sirve `/assets` con cache immutable.

## Próxima optimización

1. Inventario de uso real por ruta.
2. Conversión a AVIF/WebP.
3. `srcset` desktop/mobile.
4. Lazy loading fuera del primer viewport.
5. Preload solo de Portal, onboarding y Hub.
6. Variantes 2:1 para panoramas.
7. GLB/KTX2 para Núcleo, Semillas y Códigos.
8. Presupuesto objetivo inicial inferior a 12 MB por primera escena.
