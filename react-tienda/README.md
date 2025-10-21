# React Tienda (Webpack + Karma/Jasmine)

Proyecto React para tienda de prueba, usando Webpack clásico para desarrollo y build, y Karma/Jasmine para pruebas.

## Scripts

- Desarrollo: `npm run dev` (Webpack Dev Server)
- Build producción: `npm run build` (Webpack)
- Lint: `npm run lint`
- Tests: `npm run test` (Karma + ChromeHeadless)

## Requisitos

- Node.js 18+ y npm

## Instalación

1. `npm install`
2. Desarrollo: `npm run dev` y abrir `http://localhost:5173/`
3. Producción: `npm run build` y servir `dist/`

## Estructura

- `src/` componentes, páginas y utilidades
- `public/` assets estáticos (favicon, imágenes)
- `tests/` pruebas Jasmine
- `webpack.config.cjs` configuración de Webpack
- `karma.conf.js` configuración de Karma

## Pruebas (Karma/Jasmine)

- Ejecutar: `npm run test`
- Motor: `karma-esbuild` compila JS/JSX para ChromeHeadless
- Cobertura mínima: 10 ejemplos (specs) entre utilidades y autenticación

## Imágenes

- Todas las imágenes de producto son locales en `public/images/` para funcionar sin internet.
- Se usan SVGs representativos de categorías (electrónica, audio, hogar, deportes, ropa) fieles al catálogo de la tienda.

## Notas

- No se usa Vite en este proyecto.
- Tailwind v4 vía PostCSS (`@tailwindcss/postcss`).
- Autenticación básica mediante `AuthContext` y `localStorage`.
