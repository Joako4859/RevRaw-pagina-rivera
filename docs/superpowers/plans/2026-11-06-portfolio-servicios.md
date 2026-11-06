# Portfolio y servicios foto/video — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Página React publicada en Vercel con portada, galería filtrable, servicios y formulario de presupuesto guardado en PostgreSQL.

**Architecture:** SPA de Vite + React en la raíz del repo. Un único endpoint REST `POST /api/contact` como función serverless de Vercel (`api/contact.js`) que valida y guarda en Postgres con `pg`. La validación vive en `src/lib/validateContact.js` y la usan tanto el formulario como la función. Las fotos son archivos estáticos en `public/photos/` descritos en `src/data/works.js`.

**Tech Stack:** React 18, Vite 5, Vitest, Node 20+ (funciones Vercel), `pg`, PostgreSQL (Neon vía Vercel), Docker.

**Spec:** `docs/superpowers/specs/2026-11-06-portfolio-servicios-design.md`

## Global Constraints

- Español en todo el texto visible.
- Marca provisoria en `src/config.js` (`BRAND = "RIVERA MEDIA"`, `CONTACT_EMAIL`, `WHATSAPP`); no repetir el nombre en otro archivo.
- Categorías de galería exactas: `Autos`, `KTM`, `Eventos`.
- Servicios exactos: `Sesiones privadas de autos`, `Videos para marcas`, `Cobertura de eventos`.
- Tema oscuro; animaciones solo con `opacity`/`transform` lentas (≥ 400 ms) y desactivadas bajo `prefers-reduced-motion: reduce`.
- Sin secretos en el repo: `DATABASE_URL` solo por variable de entorno; `.env.example` sin valores reales.
- JavaScript (no TypeScript) para ir rápido.

## Review Focus

- Formulario enviado dos veces seguidas: el botón se deshabilita mientras envía y no crea duplicados por doble clic.
- Base de datos caída o `DATABASE_URL` ausente: la función responde 500 con mensaje claro y el formulario muestra error, nunca "enviado".
- Campos con espacios, HTML o texto muy largo (>2000 caracteres): se recortan/rechazan y no rompen la página.
- Email inválido o vacío: rechazado con mensaje por campo.
- Categoría de filtro sin fotos o foto que no carga: la galería muestra estado vacío / imagen de reemplazo sin romper el layout.
- Método distinto de POST en `/api/contact`: 405.

---

### Task 1: Scaffold, config y Docker

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/config.js`, `.gitignore`, `.env.example`, `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `vercel.json`, `README.md`

**Interfaces:**
- Produces: `src/config.js` exporta `BRAND: string`, `CONTACT_EMAIL: string`, `WHATSAPP: string`, `CATEGORIES: ["Autos","KTM","Eventos"]`, `SERVICES: {title:string, text:string}[]` (3 elementos con los títulos exactos de Global Constraints).

- [ ] **Step 1:** `git init`, crear proyecto Vite React a mano (`npm create vite` no interactivo): dependencias `react`, `react-dom`, `pg`; dev `vite`, `@vitejs/plugin-react`, `vitest`, `jsdom`, `@testing-library/react`. Scripts: `dev`, `build`, `test` (`vitest run`).
- [ ] **Step 2:** `Dockerfile` multi-stage (node:20-alpine: `npm ci`, `npm run build`, servir `dist` con nginx:alpine). `docker-compose.yml` con servicio `web` (puerto 8080) y servicio `db` (postgres:16, volumen, monta `db/schema.sql` en `/docker-entrypoint-initdb.d`). `.dockerignore` excluye `node_modules`, `.env`, `.superpowers`.
- [ ] **Step 3:** `vercel.json` con rewrite SPA que NO capture `/api/*`. `.gitignore` incluye `node_modules`, `dist`, `.env`, `.vercel`, `.superpowers`.
- [ ] **Step 4:** Run `npm install && npm run build`. Expected: build OK sin errores.
- [ ] **Step 5:** Commit `chore: scaffold vite react + docker + vercel config`.

### Task 2: Validación del contacto (lógica compartida)

**Files:**
- Create: `src/lib/validateContact.js`
- Test: `src/lib/validateContact.test.js`

**Interfaces:**
- Produces: `validateContact(input: unknown) -> { ok: true, value: {name:string, email:string, service:string, message:string} } | { ok: false, errors: Record<string,string> }`. `service` debe ser uno de `SERVICES[].title`. Recorta espacios; `name` 2–80, `message` 10–2000, email con regex simple.

- [ ] **Step 1:** Escribir tests: `valida entrada correcta y recorta espacios`, `rechaza email inválido (errors.email)`, `rechaza nombre vacío`, `rechaza mensaje de 2001 caracteres`, `rechaza servicio fuera de la lista`, `rechaza null y no-objetos sin lanzar`.
- [ ] **Step 2:** `npx vitest run src/lib/validateContact.test.js` → FAIL (módulo no existe).
- [ ] **Step 3:** Implementar `validateContact` en el archivo; importa `SERVICES` de `src/config.js`.
- [ ] **Step 4:** Run mismo comando → PASS.
- [ ] **Step 5:** Commit `feat: contact validation`.

### Task 3: Endpoint REST y base de datos

**Files:**
- Create: `api/contact.js`, `db/schema.sql`
- Test: `api/contact.test.js`

**Interfaces:**
- Consumes: `validateContact` (Task 2).
- Produces: `export default async function handler(req, res)` (estilo Vercel Node). `POST /api/contact` con JSON `{name,email,service,message}` → `201 {ok:true}`; inválido → `400 {ok:false, errors}`; otro método → `405`; fallo de DB o falta `DATABASE_URL` → `500 {ok:false, error:"No pudimos guardar tu pedido, probá de nuevo."}`. Tabla `quote_requests(id serial pk, name, email, service, message, created_at timestamptz default now())`.

- [ ] **Step 1:** Tests con `req/res` falsos y `pg` mockeado (`vi.mock("pg")`): `201 con datos válidos y hace INSERT parametrizado`, `400 con email inválido y no toca la DB`, `405 en GET`, `500 si la query lanza`, `500 si falta DATABASE_URL`.
- [ ] **Step 2:** Run `npx vitest run api/contact.test.js` → FAIL.
- [ ] **Step 3:** Implementar handler con un `Pool` creado perezosamente y consulta parametrizada (`$1..$4`), nunca concatenada. Escribir `db/schema.sql` con `CREATE TABLE IF NOT EXISTS`.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: POST /api/contact with postgres`.

### Task 4: Datos y filtro de galería

**Files:**
- Create: `src/data/works.js`, `src/lib/filterWorks.js`, `public/photos/.gitkeep`
- Test: `src/lib/filterWorks.test.js`

**Interfaces:**
- Produces: `works: {id:string, src:string, title:string, category:"Autos"|"KTM"|"Eventos", alt:string}[]` (ejemplos provisorios apuntando a `/photos/...`); `filterWorks(works, category: string) -> Work[]` donde `"Todos"` devuelve todo y una categoría sin fotos devuelve `[]`.

- [ ] **Step 1:** Tests: `Todos devuelve todas`, `filtra por categoría`, `categoría sin fotos devuelve []`, `no muta el arreglo original`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implementar. **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: works data and filter`.

### Task 5: Interfaz (portada, galería, servicios, contacto)

**Files:**
- Create: `src/App.jsx`, `src/styles.css`, `src/components/{Nav,Hero,Gallery,Lightbox,Services,ContactForm,Footer}.jsx`
- Test: `src/components/ContactForm.test.jsx`, `src/components/Gallery.test.jsx`

**Interfaces:**
- Consumes: `BRAND, CATEGORIES, SERVICES, CONTACT_EMAIL` (Task 1), `works`/`filterWorks` (Task 4), `validateContact` (Task 2), `POST /api/contact` (Task 3).
- Produces: `<Gallery works={Work[]} />` con botones de filtro (`role="tab"`) y cuadrícula; clic en una foto abre `<Lightbox work onClose onPrev onNext />` (cierra con Esc). `<ContactForm />` hace `fetch("/api/contact")` y muestra estados `idle | sending | sent | error`; botón deshabilitado en `sending`.

- [ ] **Step 1:** Tests: `Gallery filtra al clickear KTM`, `Gallery muestra "Todavía no hay fotos en esta categoría" cuando está vacía`, `ContactForm muestra errores por campo y no llama fetch si es inválido`, `ContactForm muestra éxito en 201`, `ContactForm muestra error en 500 y re-habilita el botón`, `ContactForm deshabilita el botón mientras envía` (fetch mockeado).
- [ ] **Step 2:** Run `npx vitest run src/components` → FAIL.
- [ ] **Step 3:** Implementar componentes y `styles.css`: fondo casi negro, un color de acento, tipografía grande (Google Fonts, 1 familia), grilla responsive, `<img loading="lazy">` con `onError` que oculta/reemplaza la imagen, fade-in lento de la portada y bloques con `IntersectionObserver`, todo dentro de `@media (prefers-reduced-motion: no-preference)`. La portada usa la primera foto de `works`.
- [ ] **Step 4:** Run `npx vitest run` → todo PASS. Run `npm run build` → OK.
- [ ] **Step 5:** Commit `feat: ui sections`.

### Task 6: Fotos reales, verificación visual y publicación

**Files:**
- Modify: `src/data/works.js`, `src/config.js`
- Create: `README.md` (sección de despliegue)

- [ ] **Step 1:** El usuario copia sus fotos a `public/photos/`; actualizar `works.js` con archivo, título, categoría y `alt` reales; actualizar `BRAND`, `CONTACT_EMAIL`, `WHATSAPP`.
- [ ] **Step 2:** `npm run dev`, abrir en el navegador integrado y revisar portada, filtros, lightbox y formulario a ancho de celular (375) y de escritorio. Corregir lo que se vea mal.
- [ ] **Step 3:** El usuario inicia sesión en Vercel (`npx vercel login`), vincula el proyecto y crea la base (Storage → Postgres/Neon) para obtener `DATABASE_URL`; ejecuta `db/schema.sql` en la consola SQL de la base.
- [ ] **Step 4:** `npx vercel --prod`. Probar en la URL pública: enviar un pedido real y verificar que la fila aparece en la base. Expected: 201 y fila visible.
- [ ] **Step 5:** Commit `docs: deployment and real content`.
