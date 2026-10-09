# Repelón Conecta

Marketplace local para Repelón (Atlántico): los negocios del pueblo publican
sus productos y los compradores arman un pedido por negocio (domicilio o
recoger en tienda). Un pedido siempre pertenece a **un solo negocio**.

- **Backend**: Spring Boot 4 (API REST) sobre Supabase Postgres. Es el dueño
  del esquema (`ddl-auto=update`).
- **Autenticación**: Supabase Auth (correo + clave, sin SMS/OTP). El backend
  valida el JWT que emite Supabase; **no** hay endpoint de registro: el
  usuario se crea en la primera llamada a `GET /api/me`.
- **Frontend**: Next.js 16 (App Router) + Tailwind v4, mobile-first.

## La app en cuatro toques

La pantalla principal (`/`) **es el mapa**, no un extra: se abre la app, se ve
dónde está cada negocio y se toca un pin. Los seis destinos de la barra
inferior son Inicio, Negocios (`/negocios`), Turismo, Fondo
(`/fondo-emprender`), Mi tienda y Perfil: el que está encendido se dibuja
como una píldora verde con la etiqueta en blanco, igual que en la cabecera de
escritorio.

| Qué se ve | Dónde |
|---|---|
| Mapa a pantalla completa, pin verde si está abierto y gris si está cerrado | `/` |
| Filtros flotando sobre el mapa (categoría, "Abiertos ahora") | `/` |
| Ficha del negocio: foto grande, mapa chico, productos en rejilla de 2 con botón **+** de ancho completo | `/negocios/[slug]` |
| Carrito y checkout con total en pesos grandes y botones de 48 px | `/carrito`, `/checkout` |
| Pedidos con el estado en color y un toque para el detalle | `/pedidos` |
| Fondo Emprender (capital semilla del SENA): qué es, requisitos y cómo postular | `/fondo-emprender` |
| Panel del vendedor (con pin arrastrable al crear el negocio) y de admin (ubicación con sugerencias y pin arrastrable) | `/perfil` → Mi negocio, `/admin` |

## Estructura

```
RepelonConecta/
  RepelonConecta/        backend Spring Boot (Maven)
  frontend/             app Next.js
```

## Requisitos

- JDK 17+ (probado con JDK 21) y Maven
- Node 20+ (probado con Node 24)
- Un proyecto Supabase (Postgres + Auth + Storage)

## Backend

Variables de entorno (ver `src/main/resources/application.properties`):

| Variable | Para qué |
|---|---|
| `DB_URL` | JDBC de Supabase. Lleva `?sslmode=require` y la clave URL-encoded. |
| `DB_USER` / `DB_PASSWORD` | credenciales de la base |
| `SUPABASE_JWT_SECRET` | solo proyectos HS256 clásicos; los proyectos nuevos (JWT signing keys) validan con JWKS vía `SUPABASE_URL` |
| `SUPABASE_JWT_ISSUER` | p. ej. `https://<proyecto>.supabase.co/auth/v1` |
| `SUPABASE_URL` / `SUPABASE_STORAGE_BUCKET` | Storage de fotos de productos |
| `CORS_ORIGINS` | orígenes permitidos (por defecto `http://localhost:3000`) |
| `SEED` | `true` siembra 5 negocios de ejemplo en una base vacía |
| `AUTO_APPROVE` | `true` (MVP): el negocio queda aprobado al crearse |

```powershell
mvn -B spring-boot:run
```

Sin `SUPABASE_URL` (proyectos nuevos con JWKS) ni `SUPABASE_JWT_SECRET`
(proyectos clásicos con HS256) el arranque real no sirve para probar login.
Los tests usan H2 (`src/test/resources/application-test.properties`) y no
necesitan Supabase:

```powershell
mvn -B test
```

## Frontend

```powershell
Copy-Item .env.local.example .env.local   # y rellena tus credenciales
npm install
npm run dev
```

Variables (`NEXT_PUBLIC_*`, ver `.env.local.example`): `NEXT_PUBLIC_API_URL`,
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (o
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`), `NEXT_PUBLIC_SUPABASE_BUCKET` y
`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Sin credenciales la app igual arranca y
avisa que Supabase o el mapa no están configurados.

El mapa embebido (home, búsqueda, ficha del negocio y selector del vendedor)
es **Google Maps** con la API de JavaScript (`src/components/Mapa.tsx`), que
se carga con `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (`src/lib/env.ts`). Esa clave
es pública y viaja en el bundle a propósito: hay que restringirla en Google
Cloud Console a los dominios de la app (Credenciales → restricciones de
referrer) y vigilar la cuota de uso. Como los negocios vienen sin
latitud/longitud, `src/lib/geocodificar.ts` resuelve su dirección con
Nominatim a través del proxy `src/app/api/geocode/route.ts` (Nominatim no
envía cabeceras CORS, así que el navegador no puede pedirle nada directo) y
guarda el resultado en el navegador para no repetir consultas ni pasar del
límite de una por segundo. El botón "Cómo llegar" abre Google Maps con la
ruta desde el centro del pueblo; "Ver en OpenStreetMap" abre OpenStreetMap
con el punto exacto. El panel `/admin` usa el mismo proxy para editar la
ubicación de negocios y zonas (`admin/EditorUbicacion.tsx`): sugerencias
mientras se escribe (`?n=5`), geocodificación inversa al mover el pin y
guardado con `PUT /api/negocios/{id}` o `PUT /api/zonas/{id}`.

La altura de la barra de marca y la de la barra inferior están en
`src/app/globals.css` como tokens `--spacing-cabecera`, `--spacing-nav` y
`--spacing-nav-total`. Si se cambia una, se cambian las tres: el mapa de la
home mide el alto disponible con esos mismos números.

### Paleta

Blanco de fondo, verde (`#16A34A`) solo para barra de marca, "Abierto" y pin
abierto, azul (`#2563EB`) solo para agregar, confirmar, cómo llegar y pedir.
Negro para títulos y un gris suave (negro con opacidad) para lo secundario.
Precios siempre visibles y en grande.

## Flujo y estados del pedido

`PEDIDO_RECIBIDO → EN_PREPARACION → EN_CAMINO → ENTREGADO`

- `RECHAZADO` solo lo pone el negocio; `CANCELADO` solo el comprador.
- El comprador no puede cancelar si el pedido ya salió (`EN_CAMINO`).
- El negocio puede **confirmar el pago sin mover el estado** (acción aparte).
- `CANCELADO` y `RECHAZADO` quedan fuera de las sumas de ventas.

## Roles

- Crear un negocio (`POST /api/negocios`) promueve al usuario a `VENDEDOR`
  automáticamente.
- **Admin**: no hay UI para asignarlo. Marca el `rol` de un usuario como
  `ADMIN` directamente en la base y entra a `/admin`.

## Despliegue

Producción corre en dos servicios conectados:

| Pieza | Dónde | Cómo |
|---|---|---|
| Backend (Spring Boot) | **Render** (Web Service, plan free) | Blueprint: `New > Blueprint` sobre este repo, usando el `render.yaml` de la raíz |
| Frontend (Next.js) | **Vercel** | Root Directory `ReplonConecta/frontend` (integración con el repo: redespliega en cada push) |

### Render — backend

El blueprint define `rootDir: ReplonConecta/ReplonConecta`, build
`sh mvnw -B clean package -DskipTests`, arranque
`java -jar target/RepelonConecta-0.0.1-SNAPSHOT.jar`, health check
`/actuator/health` y `DDL_AUTO=update`, `AUTO_APPROVE=true`, `SEED=true`
(`SEED` solo importa en la primera arrancada sobre base vacía; después se
cambia a `false` en el archivo). El puerto lo inyecta Render en `PORT` y la
aplicación lo lee antes de `SERVER_PORT`.

El panel pide estas variables (van con `sync: false`, es decir, los valores
reales viven en el panel y **nunca** en el archivo ni en git):

| Variable | Valor |
|---|---|
| `DB_URL` | `jdbc:postgresql://db.<proyecto>.supabase.co:5432/postgres?sslmode=require` |
| `DB_USER` / `DB_PASSWORD` | credenciales del proyecto Supabase |
| `SUPABASE_URL` | `https://<proyecto>.supabase.co` |
| `SUPABASE_JWT_ISSUER` | `https://<proyecto>.supabase.co/auth/v1` |
| `CORS_ORIGINS` | URL exacta del front, p. ej. `https://repelon-conecta.vercel.app` |

### Vercel — frontend

Variables de la consola (las `NEXT_PUBLIC_*` se compilan en el build:
cambiar una obliga a **redesplegar**):

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL pública del servicio de Render |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<proyecto>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | publishable key del proyecto |
| `NEXT_PUBLIC_SUPABASE_BUCKET` | `productos` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | clave de Maps (o `GCP_API_KEY`, `GCP_API_KEY_2`, `GCP_API_KEY_3` como respaldos) |

### Notas

- El backend debe validar el JWT del **mismo** proyecto Supabase con el que
  el front inicia sesión (JWT signing keys → JWKS automático, sin secreto).
- El plan gratuito de Render **se duerme** tras ~15 min sin peticiones: la
  primera llamada tarda 30-60 s en despertar el servicio.
- Restringir la clave de Google Maps por referrer a `https://<dominio>/*`
  en Google Cloud Console.
- `/abrir-admin` (firma de sesión admin de pruebas) solo funciona en
  `localhost`; no llevarla a producción.

## Mejoras para la fase 2

- **Pagos en línea** (pasarela tipo Wompi/Mercado Pago) en vez de confirmación
  manual del vendedor.
- **Subida real de fotos** a Supabase Storage (hoy `imagenUrl` se envía tal cual;
  falta el uploader en el panel del vendedor).
- **Notificaciones**: avisar al negocio de un pedido nuevo y al comprador de
  cada cambio de estado (push/WhatsApp/email).
- **Búsqueda y filtros**: por categoría, barrio, precio y distancia.
- **Reparto**: asignar domiciliario, tarifas y seguimiento en mapa.
- **Calificaciones** de negocio y productos.
- **Chat** comprador–vendedor por pedido.
- **Panel de admin**: aprobación con motivo, moderación de productos, reportes
  y exportación de ventas.
- **Operación**: migraciones con Flyway en vez de `ddl-auto=update`, paginación
  en listados, pruebas de integración de servicios (hoy solo test de contexto),
  CI y despliegue.
- **Aprovechar Supabase**: RLS + PostgREST para lecturas públicas, y `pg_cron`
  para cierres del día.
