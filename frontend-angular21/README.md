# Frontend Angular 21

`npm install` y `npm start`. La grilla usa utilidades Tailwind y los controles, feedback y tema visual usan Angular Material. Sigue el patrón de Caprice: `app.config.ts`, `app.routes.ts`, una feature aislada en `features/catalogo` con `components`, `services`, `models` y rutas lazy. El template emplea el control flow nativo de Angular 21 (`@if` y `@for`). Integra Open-Meteo para el clima y TVMaze para el catálogo de películas/series; ambas APIs públicas funcionan sin token.
