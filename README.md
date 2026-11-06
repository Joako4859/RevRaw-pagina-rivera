# Portfolio de foto y video de autos

Sitio de portfolio y servicios (React + Vite, API serverless en `/api`, Postgres).

## Desarrollo
```
npm install
npm run dev
npm test
npm run build
```

## Despliegue

1. Iniciar sesión y vincular el proyecto:
   ```
   npx vercel login
   npx vercel link
   ```
2. Crear una base Postgres desde Vercel Storage (Neon) y conectarla al proyecto para que `DATABASE_URL` quede configurada en **Production**.
3. Ejecutar una vez el contenido de `db/schema.sql` en el SQL editor de la base. Sin este paso, cada envío del formulario de contacto devuelve error.
4. Desplegar a producción:
   ```
   npx vercel --prod
   ```

Para probar el formulario en local usar `npx vercel dev`. `npm run dev` no sirve la ruta `/api`, así que el formulario no funciona con ese comando.

## Docker
```
docker compose up --build
```
Web en http://localhost:8080.

Lo que hace y lo que no hace la imagen:
- La imagen sirve el front-end estático con nginx.
- El servicio `db` es un Postgres local que carga `db/schema.sql` al iniciarse. Es sólo para desarrollo local.
- La función `/api/contact` corre en Vercel. Con Docker el formulario de contacto sólo funciona contra Vercel (o con `npx vercel dev`), no contra el nginx del contenedor.

## Configuración
Marca y contacto en `src/config.js`. Variables de entorno en `.env.example`.
