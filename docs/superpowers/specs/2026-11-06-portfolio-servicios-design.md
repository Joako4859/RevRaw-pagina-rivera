# Portfolio y servicios de foto/video de autos — Diseño

## Intención
Página para que gente a la que le gustan los autos, y sobre todo fotógrafos o quienes quieran contratar servicios de media, vean el trabajo del usuario y le pidan un presupuesto. Es el proyecto final de la escuela (entrega hoy, 21:00): debe ser una página dinámica con las tecnologías React, Vercel y Docker. El usuario apunta a un acabado pulido y profesional.

## Contexto del usuario
Fotografía y edita autos que le avisan sus amigos (ej. Ferrari 458 Italia, Mercedes de drift), hace videos para Instagram, tiene un trabajo con una concesionaria KTM y graba cortos en la escuela. Tiene las fotos listas.

## Objetivos
- Portada con una foto de auto en pantalla grande, título y botón de presupuesto.
- Galería filtrable por Autos / KTM / Eventos, con lightbox.
- Sección de servicios: sesiones privadas de autos, videos para marcas, cobertura de eventos.
- Formulario de presupuesto que guarda los pedidos en PostgreSQL vía función de backend.
- Estilo oscuro y limpio, fotos protagonistas, funciona en celular y compu.

## No-objetivos
- Panel privado para subir trabajos (versión 2).
- Música.
- Modelo 3D.

## Anti-objetivos
- Efectos que marean: nada de rebotes, parpadeos, parallax agresivo; una sola cosa animada a la vez; respetar `prefers-reduced-motion`.
- Que el formulario parezca enviado cuando la base de datos falló.

## Restricciones
- Tecnologías pedidas por el usuario: React, Vercel, Docker.
- Elegidas por mí (no discutidas): Vite, Node.js, PostgreSQL, API REST, Postman para probar.
- Docker no está instalado en la máquina del usuario: el Dockerfile se escribe pero no se puede probar localmente.
- Publicar en Vercel y crear la base requiere que el usuario inicie sesión él mismo.

## Decisiones mías (a confirmar)
- Nombre de marca provisorio, definido en un solo lugar (`src/config.js`) para cambiarlo fácil.
- Idioma de la página: español.
- Base de datos: Postgres gestionado desde Vercel (Neon).

## Pendiente del usuario
- 12 a 20 fotos en `public/photos/`, con la categoría de cada una.
- Nombre/marca definitivo, email o WhatsApp de contacto.
