# Repelón Market

Marketplace local para Repelón (Atlántico): los negocios del pueblo publican
sus productos y los compradores arman un pedido por negocio (domicilio o
recoger en tienda). Un pedido siempre pertenece a **un solo negocio**.

- **Backend**: Spring Boot 4 (API REST) sobre Supabase Postgres. Es el dueño
  del esquema (`ddl-auto=update`).
- **Autenticación**: Supabase Auth (correo + clave, sin SMS/OTP). El backend
  valida el JWT que emite Supabase; **no** hay endpoint de registro: el
  usuario se crea en la primera llamada a `GET /api/me`.
- **Frontend**: Next.js 16 (App Router) + Tailwind v4, mobile-first.

## Estructura

```
ReplonConecta/
  ReplonConecta/        backend Spring Boot (Maven)
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
| `SUPABASE_JWT_SECRET` | Project Settings > API > JWT Secret (obligatorio) |
| `SUPABASE_JWT_ISSUER` | p. ej. `https://<proyecto>.supabase.co/auth/v1` |
| `SUPABASE_URL` / `SUPABASE_STORAGE_BUCKET` | Storage de fotos de productos |
| `CORS_ORIGINS` | orígenes permitidos (por defecto `http://localhost:3000`) |
| `SEED` | `true` siembra 5 negocios de ejemplo en una base vacía |
| `AUTO_APPROVE` | `true` (MVP): el negocio queda aprobado al crearse |

```powershell
mvn -B spring-boot:run
```

Sin `SUPABASE_JWT_SECRET` el arranque real no sirve para probar login. Los
tests usan H2 (`src/test/resources/application-test.properties`) y no
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
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_SUPABASE_BUCKET`. Sin credenciales la app igual arranca y avisa
que Supabase no está configurado.

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
