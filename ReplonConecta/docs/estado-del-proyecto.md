# Repelón Conecta — Estado del proyecto

> Documento de trabajo: qué pedía la idea, qué ya está hecho y qué falta,
> con evidencia en el código (`archivo:línea`). Actualizado: octubre de
> 2026 — **P0 (buscador) y P1 (ubicación + fotos) entregados**.

---

## 1. La idea (objetivo del profesor / el estudiante)

En las palabras de quien pidió el trabajo:

> Que si una persona busca, por ejemplo, **una ferretería**, o busca **dónde
> puedo encontrar 20 kilos de yuca** y cosas así del pueblo de Repelón,
> **aparezca en la plataforma**. Hay un mapa. Ese es el objetivo.

Desglose de lo que pide, en tres partes:

1. **Búsqueda por lo que la gente habla**: no solo nombres de negocios
   ("Ferretería Don Chucho"), sino **productos y cantidades**
   ("20 kilos de yuca", "cemento", "alambre").
2. **Respuesta local**: lo que aparezca debe ser de Repelón — quién lo tiene,
   en qué barrio, a qué precio, si está abierto.
3. **Mapa**: la respuesta se ve sobre el mapa del pueblo, no solo en una
   lista: llegar a ver **dónde** queda quien vende lo que busqué.

**Refinamiento del cliente (octubre 2026):** tres decisiones que acotan
todo el alcance:

1. **Solo negocios agrícolas, pesqueros y de turismo** del pueblo de
   Repelón — en sus palabras: *"Solo negocios agrícolas y pesqueros … y lo
   del turismo del pueblo de Repelón"*. El catálogo y la búsqueda son del
   campo, la pesca y el turismo; ferreterías, droguerías y tiendas de barrio
   **quedan fuera**.
2. **Los precios son públicos**: se muestran en los resultados de búsqueda
   y en la ficha, comparables entre negocios.
3. **Sin domicilios**: el tema de los domicilios queda descartado — el
   pedido es para recoger en el negocio (el flujo `DOMICILIO` de checkout
   hay que quitarlo o apagarlo).
4. **Datos los pone el cliente**: *"ellos van a proporcionar las direcciones
   y los mapas"* — las direcciones (y coordenadas) de los negocios llegan de
   ellos, no hay que geocodificar el pueblo a mano.

> ℹ️ La referencia a *"lo A"* en el mensaje del cliente fue un error de dedo:
> no agrega ningún rubro.

---

## 2. Qué es la plataforma hoy

| Pieza | Estado |
| --- | --- |
| Frontend | Next.js 16 (App Router) + React 19 + Tailwind 4, `frontend/` |
| Backend | Spring Boot 4 (Java 21), `ReplonConecta/` |
| Base de datos | Supabase Postgres (`application.properties:20`) |
| Autenticación | Supabase Auth (email + clave) validada con JWT/JWKS en el backend (`application.properties:45-51`) |
| Mapas | Google Maps (API de JavaScript) con `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (`src/components/Mapa.tsx`) |
| Geocodificación | Nominatim vía proxy propio, acotada a Repelón (`countrycodes=co` + `viewbox` + `bounded=1`) y con modo de sugerencias (`?n=5`) para el editor de `/admin` (`src/app/api/geocode/route.ts`) |
| Fotos | Supabase Storage, bucket `productos` (público), subida desde `/admin` con sesión (`src/lib/subirImagen.ts`), o **pegando una URL** con "Poner URL" (sin Storage) |
| Roles | `COMPRADOR`, `VENDEDOR`, `ADMIN` |

Tres personas usan la app: el **vecino** que busca y compra, el **dueño de
negocio** que publica y despacha, y el **admin** que vigila la plataforma.

---

## 3. Lo que ya está hecho ✅

### Público (cualquiera)

- **Home con mapa del pueblo**: hero, pines de todos los negocios, sección
  "El pueblo en el mapa" con encuadre, chip de ubicación y crédito de Google
  Maps (`src/app/page.tsx`).
- **Sección Fondo Emprender en el home** (título y párrafo editables desde
  el panel) con las tres promesas del programa y salida a la página propia
  `/fondo-emprender`, que explica qué es, requisitos, los cuatro pasos de la
  postulación y el acompañamiento del SENA. Es contenido propio, no un
  incrustado del sitio del SENA, para que la sección no dependa de que ese
  sitio esté de pie durante la presentación
  (`src/app/page.tsx`, `src/app/fondo-emprender/page.tsx`).
- **Búsqueda y filtros de negocios**: texto libre, chips de categoría,
  barrio, "abiertos ahora" (`src/app/negocios/page.tsx:26-33`) →
  `GET /api/negocios?texto=&barrio=&abierto=&categoriaId=`
  (`NegocioController.java:46-55`).
- **Ficha del negocio**: foto, estado abierto/cerrado, dirección, WhatsApp,
  mapa con pines, "Cómo llegar" (Google Maps) y "Ver en OpenStreetMap"
  (`src/app/negocios/[slug]/page.tsx`).
- **Catálogo de productos por negocio** con precio, stock y disponibilidad
  (`ProductoController.java:41`).
- **Carrito → checkout → pedido**: domicilio o recoger, 4 formas de pago,
  referencia y notas (`src/app/checkout/page.tsx`, `PedidoController.java:53`).
- **Seguimiento del pedido** por el comprador con estados
  (`PEDIDO_RECIBIDO → EN_PREPARACION → EN_CAMINO → ENTREGADO`) y resumen por
  WhatsApp (`src/app/pedidos/[id]/page.tsx`, `WhatsappService.java`).
- **Perfil y direcciones guardadas** (`src/app/perfil/page.tsx`,
  `CatalogoController.java:69-81`).

### Vendedor

- Crea y edita su negocio, publica productos (CRUD), abre/cierra, ve métricas de venta
  (`src/app/vendedor/page.tsx`, `ProductoController.java`, `NegocioController.java:83-107`).
- **Selector de ubicación en el mapa** (`MapaSelector` en
  `src/components/Mapa.tsx`): el dueño puede poner el pin exacto al crear el
  negocio — la herramienta para la precisión ya existe, es optativa.
- Panel por negocio: productos y pedidos con transición de estados
  (`src/app/vendedor/negocios/[id]/page.tsx`).

### Admin (lo que hay hoy)

- **Panel al estándar de administración**: `admin/layout.tsx` con guard de
  sesión/rol **antes** de montar las páginas (las llamadas a
  `/api/admin/*` ya no salen sin rol), sidebar fijo en PC + cajón con
  hamburguesa en móvil, chip de sesión ("Conectado como … ADMIN") con
  **Cerrar sesión** y navegación pública oculta en `/admin*`
  (`BarraNavegacion.tsx`).
- **Seis rutas con menú lateral** (una por tema, operación diaria
  primero y contenido del home al final): `/admin` (resumen con 6 métricas
  **clickeables** —"Pendientes" abre Negocios con `?filtro=pendientes`— y
  accesos rápidos), `/admin/negocios` (buscador por nombre/dueño + chips
  Todos/Pendientes/Aprobados que leen `?filtro=`), `/admin/usuarios`,
  `/admin/pedidos`, `/admin/contenido` (categorías + textos del home) y
  `/admin/zonas` (zonas turísticas). Piezas compartidas en
  `admin/ui-admin.tsx` (avisos, estado de lista, tarjetas `glass`) y
  botones/campos con `min-h-12` = 48 px
  (`SeccionNegocios.tsx`, `CampoUrlImagen.tsx`).
- **Crear/editar en ventana flotante**: Zonas, Categorías y Textos abren
  una ventana (`VentanaAdmin` en `admin/ui-admin.tsx`: Escape, ✕ y
  Cancelar; sin cierre por clic fuera, para no perder lo escrito a medio
  escribir); el listener de Escape vive en un ref (deps solo `[abierto]`)
  para no robar el foco del input con cada tecla, y al cerrar el foco
  vuelve al botón que abrió. Los avisos y errores se montan **dentro** de
  la ventana cuando está abierta (si no quedarían tapados tras la capa
  oscura) y en la sección cuando está cerrada; en Textos la sección
  muestra vista previa de los valores actuales. Las acciones de un clic
  (aprobar, destacar, rol, anular) se quedan inline.
- **Gestión de negocios**: aprobar/suspender, destacar/quitar, eliminar
  (`SeccionNegocios.tsx`, `AdminController.java:43-62`,
  `CatalogoController.java:97-98`).
- **Ubicación exacta desde el panel**: cada negocio y cada zona turística
  tiene un bloque **"Ubicación"** con el mismo editor
  (`admin/EditorUbicacion.tsx`): campo de dirección con sugerencias de
  Nominatim al teclear (solo aparecen tras un cambio de texto; si el
  buscador no encuentra la dirección se avisa y se sugiere poner el pin a
  mano), botones **Usar mi ubicación** (GPS), **Buscar en el mapa** y
  **Quitar pin**, el texto `Pin en lat, lng` y un `MapaSelector`
  arrastrable: mover el punto invierte el geocoder y ofrece **"Usar esta
  dirección"** con el texto del punto (si el campo estaba vacío se llena
  solo). En `/admin/negocios` el bloque abre/cierra por tarjeta y se guarda
  con `PUT /api/negocios/{id}` (`direccion`, `latitud`, `longitud`); en
  `/admin/zonas` vive en la ventana de crear/editar y se guarda con
  `PUT /api/zonas/{id}`. `NegocioAdminResponse` ahora incluye
  `latitud`/`longitud` (`NegocioDtos.java`, `AdminService.aAdmin()`) para
  sembrar el editor, y `MapaSelector` oculta el marcador cuando el punto es
  `null` (`Mapa.tsx`). Verificado en navegador: sugerencias al teclear,
  elección → dirección + pin exactos, clic en el mapa → pin movido +
  dirección inversa, guardar conserva la base y 0 errores de consola.
- Aprobación de negocios nuevos configurable (`AUTO_APPROVE`,
  `application.properties:65`).
- **Usuarios**: listado completo, cambiar rol y activar/desactivar — con la
  regla de que el admin no se puede tocar a sí mismo (ni en la API ni en la
  UI) (`GET/PATCH /api/admin/usuarios`, `SeccionUsuarios.tsx`).
- **Pedidos globales**: todos los pedidos de la plataforma con filtros y
  anulación admin (solo estados previos a salir; devuelve el stock)
  (`GET/PATCH /api/admin/pedidos`, `SeccionPedidos.tsx`).
- **Categorías**: crear (nombre/slug/icono) y desactivar desde
  `/admin/contenido` (`POST/DELETE /api/categorias` + `SeccionCategorias.tsx`).
- **Textos del inicio**: 9 textos editables del home (hero, mapa, turismo,
  Fondo Emprender, invitación final) con valor por defecto en código; campo
  vacío = restaurar (`GET/PUT /api/inicio/textos`, `src/lib/inicio.ts`,
  `SeccionTextosInicio.tsx` y la lista blanca `CLAVES_INICIO` de
  `ConfigService.java`).
- **Zonas turísticas**: las fichas de "Turismo en Repelón" se crean,
  editan y borran desde su propia dirección `/admin/zonas`; la ubicación
  usa el mismo `EditorUbicacion` de los negocios (sugerencias, GPS y pin
  arrastrable con dirección inversa) en vez de los dos botones sueltos de
  antes (`GET/POST/PUT/DELETE /api/zonas`, `SeccionZonas.tsx`).

### Plataforma

- Geocodificación automática de negocios sin coordenadas (Nominatim con
  caché y respeto de 1 req/s) (`src/lib/geocodificar.ts:44-52`).
- Semilla de datos acotada al alcance: 3 categorías (agro, pesca,
  turismo), 2 negocios (Agro Repelón + Pescadería La Barra) y 8 productos
  con unidad kilo/libra (`config/SeedData.java`; log de arranque:
  `Seed completo: 2 negocios, 8 productos, 3 categorias.`).
- Diseño con la plantilla (glassmorphism, Fraunces + Manrope, nav flotante),
  home y navegación alineados a la plantilla y **todas las pantallas
  adaptadas a PC** (rejillas de 2-4 columnas, formularios centrados).
- Verificación en verde: `tsc --noEmit` ✅, `eslint` 0 errores (4 warnings
  preexistentes), `next build` ✅ (22 rutas), `mvnw test` ✅ (41 tests),
  `npm test` ✅ (11 tests con Vitest).

### P0 entregado (octubre 2026) ✅

Los 6 tickets del P0 (`.scratch/p0-buscador/issues/`) están cerrados:

- **Buscador público "¿dónde consigo X?"**: `GET /api/buscar`
  (`BusquedaController.java`, permitAll en `SecurityConfig.java`) con
  limpieza de la consulta (sin números ni relleno: *"20 kilos de yuca"* →
  `yuca`), filtro por categoría y barrio (`BusquedaService.java`,
  `ProductoRepository.buscarCandidatos`). Pantalla `/buscar` con **lista y
  mapa al mismo tiempo**, chips Todo/Agro/Pesca/Turismo y estado vacío con
  pista (`src/app/buscar/page.tsx`).
- **Unidades kilo/libra**: enum `UnidadProducto` + campo `unidad` en
  `Producto`/`ProductoRequest`/respuestas; se muestra en resultados y
  ficha como "$ X / kilo|libra" (`entity/Producto.java`, `dto/ProductoDtos.java`).
- **Alcance único por lado**: backend `config/Alcance.java`
  (`FAMILIAS`/`CON_PRODUCTO`) y frontend `src/lib/alcance.ts`
  (`SLUGS_ALCANCE`/`enAlcance`). Los listados públicos ocultan con
  `NOT EXISTS` los negocios con productos fuera de alcance — aunque
  tengan productos del proyecto; sin productos o con categoría null son
  visibles (`NegocioRepository.buscarPublico/destacadosPublicos/barriosPublicos`).
- **Sección Turismo en el home**: zonas turísticas **cargadas por los
  estudiantes desde `/admin`** (tabla `zonas_turisticas`, 6 en el seed:
  Embalse del Guájaro, Caleta de pescadores, Avistamiento de aves,
  Banco Totumo Bijibana, Parque principal, Villa Rosa) sin precios, con
  banda de imagen (foto por URL o ilustración de respaldo) y ventana
  flotante al presionar la ficha: la info del lugar y "Abrir en Google
  Maps". Si el backend no responde, el home usa la lista estática de
  `src/lib/turismo.ts` de respaldo (`zonaALugar`, `src/app/page.tsx`,
  `enlaceGoogleMaps` en `src/lib/maps.ts`).
- **Flujo que termina en WhatsApp**: botón verde precargado con el saludo
  y el producto en la ficha y en cada resultado
  (`src/lib/whatsapp.ts`, `CLASE_BOTON_VERDE` en `ui.tsx`);
  carrito/checkout/pedidos **ocultos, no borrados** — `COMPRAS_ACTIVAS=false`
  (`src/lib/compras.ts`), enlaces fuera del header/ficha y redirects a `/`
  (`next.config.ts`).
- **Panel del vendedor**: dropdown de unidad (kilo|libra) al crear y
  **editar** producto; al editar, la unidad guardada sale seleccionada
  (`src/app/vendedor/negocios/[id]/page.tsx`, PUT `/api/productos/{id}`).
- **Tests del backend en verde: 16** — `BusquedaServiceTests` (10, con
  semilla como regresión), `BusquedaControllerTests` (2),
  `AlcanceCatalogoTests` (3: semilla = 3 familias, todo producto con
  unidad, listado oculta rubros fuera de alcance) y contexto (1).
- **Verificación de la entrega**: recorrido automatizado con Playwright
  en celular (390) y PC (1280): buscar "yuca" → lista+mapa → ficha →
  WhatsApp, filtros, estado vacío, turismo, cero rastros de carrito
  (14/14 checks) + checks de alcance (15/15); sin scroll horizontal en
  ninguna pantalla.

### P1 entregado (octubre 2026) ✅

Tickets en `.scratch/p1-calidad/issues/` (01 y 02 cerrados, 04
externo):

- **Geocodificación acotada a Repelón**: el proxy de Nominatim envía
  `countrycodes=co` + `viewbox` (centro de Repelón ±0.12°) +
  `bounded=1` — una dirección ambigua ya no cae en otro municipio
  (probado: "Barranquilla" devuelve vacío, "Calle 10, Repelón" cae en
  la caja) (`src/app/api/geocode/route.ts`).
- **"Usar mi ubicación" en /buscar**: botón sobre el mapa →
  `navigator.geolocation` → pin propio azul (fuera de la capa de
  resultados, no se borra al refiltrar) + centrado; permiso denegado
  muestra aviso y la búsqueda sigue (`src/app/buscar/page.tsx`,
  `MapaNegocios` con prop `miUbicacion`).
- **Fotos en Supabase Storage**: `src/lib/subirImagen.ts` valida
  (imagen ≤ 5 MB), redimensiona en canvas (lado máx. 1280, JPEG) y
  sube a `negocios/{id}/` o `productos/{id}/` con la sesión de
  Supabase; el panel `/admin` sube **logo por negocio** (PUT
  `/api/negocios/{id}`) y **foto por producto** (PUT
  `/api/productos/{id}` con el payload completo), con vista previa.
  `NegocioAdminResponse` ahora incluye `logoUrl`. Verificado en
  Supabase: el bucket `productos` **existe y es legible**; la
  escritura anónima está bloqueada.
- **Imágenes por URL (vía rápida para estudiantes)**: en `/admin`,
  junto a cada "Subir logo/foto" hay un botón **"Poner URL"** que
  guarda un enlace `https://…` sin pasar por Supabase Storage (el
  backend solo guarda el texto en `logoUrl`/`imagenUrl`; si había
  imagen, dejar el campo vacío y "Quitar" la borra). En turismo, el
  campo **Foto por URL** de "Zonas turísticas" hace lo mismo con
  `imagenUrl` de la base y apaga la ilustración. Pensado para cargar
  muchas imágenes sin tocar código.
- **Pendiente manual de fotos** (en las notas del ticket 02): correr
  el SQL de políticas RLS de escritura para `authenticated` y probar
  la subida con la sesión del administrador (la misma cuenta que
  recibe el rol ADMIN con el SQL pospuesto).
- **Playwright 6/6** del P1 (`cdp/verificar-p1.mjs`): pin propio con
  permiso concedido, aviso con permiso denegado, `/admin` sin sesión →
  `/entrar`, sin scroll horizontal. Regresión P0 **14/14**.

### P2 entregado (octubre 2026) ✅

Tickets en `.scratch/p2-admin/issues/` (01–05 cerrados con notas, 06 =
verificación):

- **Usuarios admin**: `GET /api/admin/usuarios` y
  `PATCH /api/admin/usuarios/{id}` (rol y activo, con guard: aplicar sobre
  la propia cuenta devuelve 400) + sección "Usuarios" en `/admin` (selector
  de rol, Desactivar/Reactivar con confirm; la propia fila no muestra
  controles) (`AdminController.java`, `UsuarioService.listarTodos/actualizar`,
  `SeccionUsuarios.tsx`).
- **Pedidos globales**: `GET /api/admin/pedidos` (más recientes primero) y
  `PATCH /api/admin/pedidos/{id}/cancelar` + sección "Pedidos" con filtros
  por estado y texto y botón "Anular" (mismas reglas del backend: solo
  PEDIDO_RECIBIDO/EN_PREPARACION; el stock vuelve al negocio)
  (`PedidoService.todos/cancelar`, `SeccionPedidos.tsx`).
- **Categorías con UI**: sección "Categorías" en `/admin` sobre los
  `POST/DELETE /api/categorias` que ya existían — crear con nombre/slug/
  icono y desactivar con aviso extra para las tres familias del alcance
  (`SeccionCategorias.tsx`).
- **Textos del inicio editables** (decisión acordada: texto editable
  simple, **no** CMS): 7 claves con whitelist en `ConfigService.CLAVES_INICIO`,
  tabla `config_textos`, `GET /api/inicio/textos` **público** y `PUT` solo
  admin; el home los lee y los defectos viven en `src/lib/inicio.ts` —
  guardar un campo vacío restaura el original
  (`ConfigTexto.java`, `ConfigService.java`, `InicioController.java`,
  `SeccionTextosInicio.tsx`, `src/app/page.tsx`).
- **Zonas turísticas con geolocalización** (petición del usuario):
  tabla `zonas_turisticas` con las 6 zonas del seed (nombre/descripción/
  dirección/lat-lng opcional/foto por URL/motivo de ilustración/orden),
  `GET /api/zonas` público y POST/PUT/DELETE solo ADMIN
  (`ZonaTuristica.java`, `ZonaDtos.java`, `ZonaTuristicaService.java`,
  `ZonaTuristicaController.java`, permitAll en `SecurityConfig.java`) +
  sección "Zonas turísticas" en `/admin`
  (`SeccionZonas.tsx`): **"Usar mi ubicación"** pone las coordenadas del
  celular y el nuevo modo inverso de `/api/geocode` (Nominatim reverse
  con la caja de Repelón chequeada en el servidor) traduce la dirección
  a texto; **"Buscar en el mapa"** hace lo contrario (dirección →
  coordenadas para que "Cómo llegar" funcione). El home lee la API y,
  si el backend no responde, usa la lista estática de respaldo.
- **Cuenta admin sembrada en local**: `SeedData.sembrarAdmin()`
  (`admin@repelonmarket.demo`, UUID sintético) para el perfil `test`; en
  Supabase el SQL de rol ADMIN **sigue pendiente** (paso manual).
- **Tests frontend con Vitest** (decisión acordada): vitest + jsdom +
  Testing Library, `npm test`; primer test del flujo de búsqueda
  (`src/app/buscar/page.test.tsx`, 3 casos: la `q` al escribir, el chip de
  categoría, el estado sin resultados), `vitest.config.mts`.
- **Dos bugs reales corregidos por la implementación**: `ItemPedido` dejó
  de usar `@GeneratedValue` (los id precargados morían en el merge en
  cascada) y `PedidoService` puso `@Transactional(readOnly=true)` en sus
  lecturas (LazyInitializationException al pintar `items`).
- **Tests del backend en verde: 41** — +`AdminCuentaTests` (7),
  `AdminPedidoTests` (3), `AdminCategoriaTests` (3, HTTP con JWT
  firmado), `ConfigTextosTests` (6), `ZonaTuristicaTests` (6: seed
  público, CRUD admin con JWT, coordenadas incompletas = 400, sin rol =
  403, sin sesión = 401, nombre vacío = 400).
- **Verificación**: `cdp/verificar-p2.mjs` **29/29** con sesión inyectada
  (JWT firmado con el secreto del perfil `test`): el resumen y las 6 rutas
  del panel (incluye `/admin/zonas`), guard de cuenta propia = 400, pedido
  creado por API y anulado en la UI, categoría creada y desactivada,
  textos guardados y reflejados en el home público. Panel:
  `cdp/verificar-admin.mjs` **23/23** (sidebar con 6 secciones, métrica →
  `?filtro=pendientes` con chip activo, accesos rápidos de Contenido y
  Zonas, navegación pública oculta en `/admin`, chip de sesión + Cerrar
  sesión, cajón móvil, rol sin permiso ve el aviso sin llamar a
  `/api/admin/*`, consola limpia). Regresión P0 **14/14**. Zonas:
  `cdp/verificar-zonas.mjs` **13/13** (ruta propia `/admin/zonas`,
  ventana flotante "Nueva zona" conservando el foco al escribir a mano,
  geolocalización con permiso simulado, creación, ficha nueva en el
  home = 7, geocoder normal, borrado y vuelta a 6). El diagnóstico de
  foco/avisos confirma: `activeElement` = input en las tres ventanas y
  el aviso de geolocalización dentro del diálogo, sin tapar.

---

## 4. Qué falta frente a la idea 🔴🟠🟡

### ✅ P0 — Cerrado: los 5 huecos de la idea, entregados

| # | Brecha original | Estado |
| --- | --- | --- |
| 1 | **No existía búsqueda de productos** ("yuca" no se encontraba) | ✅ `GET /api/buscar` + `/buscar`: nombre/descripción de producto, tokens limpios, alcance agro/pesca (`BusquedaService.java`) |
| 2 | **No se entendían cantidades**; unidad escrita en el nombre | ✅ Campo `unidad` (KILO/LIBRA) en producto, DTOs, semilla y UI; la consulta ignora los números ("20 kilos de yuca" → `yuca`) |
| 3 | **El mapa no respondía a la búsqueda** | ✅ `/buscar` pinta lista y mapa con los mismos datos: pines de los negocios que ofrecen el resultado, al mismo tiempo (`src/app/buscar/page.tsx`) |
| 4 | **No había pantalla "¿dónde consigo X?"** | ✅ Buscador global en el home → `/buscar` con filtros, estado vacío con pista y salida a ficha → WhatsApp |
| 5 | **Catálogo sin acotar** (9 categorías con ferretería, droguería…) | ✅ Alcance único (`Alcance.java` / `alcance.ts`), semilla con solo 3 familias y 2 negocios, listados/home/chips ocultan los rubros recortados, sección Turismo creada |

### 🟠 P1 — Calidad de la respuesta

| # | Brecha | Evidencia | Qué hay que hacer |
| --- | --- | --- | --- |
| 6 | ~~**Ubicación poco exacta**~~ | decisión del cliente (baja: hoy están bien) | ✅ **Entregado**: proxy de geocodificación con `countrycodes=co` + `viewbox` de Repelón ±0.12° + `bounded=1` (`src/app/api/geocode/route.ts`) y botón **"Usar mi ubicación"** en `/buscar` con pin propio azul y centrado (`MapaNegocios.miUbicacion`). El pin manual (`MapaSelector`) ya existía |
| 7 | **Sin fotos de productos**: el bucket de Supabase Storage está declarado (`productos`) pero **no existía una sola línea de subida**; todo cae al placeholder | `application.properties:52`, `env.ts:23` | ✅ **Entregado**: `src/lib/subirImagen.ts` (valida, redimensiona a 1280 px, sube con la sesión de Supabase) + panel `/admin` con "Subir logo" por negocio y "Subir foto" por producto (PUT con la URL). Bucket `productos` **verificado: existe y es legible**. ⏳ Paso manual: SQL de políticas RLS (en el ticket 02) + prueba con sesión admin |
| 8 | **Pocos datos reales**: la semilla tiene "Yuca (kilo)" pero el catálogo real del pueblo depende de que los dueños carguen productos | `SeedData.java:68-71` (seed solo en base vacía) | ⏳ **Externo**: el cliente dice que **él proporciona las direcciones y los mapas** — recibir su lista (ticket `p1-calidad/04`, bloqueado por los materiales) y cargarla; con el `viewbox` no hace falta geocodificar a mano |
| 9 | ~~Quitar carrito, checkout y pedidos de la v1~~ | decisión del cliente (cuestionario 20 refinada + 18) | ✅ **Entregado**: `COMPRAS_ACTIVAS=false` (`src/lib/compras.ts`) oculta carrito/checkout/pedidos en header, ficha y perfil; las rutas redirigen a `/` (`next.config.ts`); el flujo termina en el botón WhatsApp. Atrás no se borra nada (si más adelante piden pedidos, se reenciende el interruptor) |

### 🟢 P2 — Admin y plataforma completos (cerrado)

| # | Brecha | Evidencia | Estado |
| --- | --- | --- | --- |
| 10 | **El admin no administra todo**: hoy solo métricas + negocios. No puede ver **usuarios** ni cambiar roles/bloquear (no hay endpoint) | `UsuarioController.java:35-50` (solo perfil propio) | ✅ **Entregado**: `GET /api/admin/usuarios` + `PATCH {id}` (rol/activo con guard de cuenta propia) y sección "Usuarios" en `/admin` (`AdminController.java`, `UsuarioService.java`, `SeccionUsuarios.tsx`) |
| 11 | **El admin no ve todos los pedidos**: solo la métrica; corregir/cancelar pedidos ajenos no existe | `PedidoController.java:69-101` (por negocio) | ✅ **Entregado**: `GET /api/admin/pedidos` + `PATCH {id}/cancelar` y sección "Pedidos" con filtros y anulación (`SeccionPedidos.tsx`) |
| 12 | **Categorías sin UI**: el backend ya permite crear/borrar categorías (`POST/DELETE /api/categorias`) pero **nadie las pinta** | `CatalogoController.java:50,58` | ✅ **Entregado**: sección "Categorías" en `/admin` — crear (nombre/slug/icono) y desactivar con aviso en las familias del alcance (`SeccionCategorias.tsx`) |
| 13 | **No se pueden agregar/editar páginas ni textos del home** (hero, beneficios, avisos están escritos en código) | `src/app/page.tsx` (texto fijo) | ✅ **Entregado con alcance acordado**: 7 textos del home editables desde `/admin` (no CMS: whitelist + `config_textos` + `GET/PUT /api/inicio/textos`; defecto en `lib/inicio.ts`, campo vacío = restaurar) |
| 14 | **Tests**: backend ya tiene 16 tests en verde (buscador, alcance, semilla); **frontend sigue sin tests automatizados** | `BusquedaServiceTests.java`, `AlcanceCatalogoTests.java` | ✅ **Entregado**: Vitest + jsdom + Testing Library (`npm test`, 3 casos del flujo de búsqueda en `src/app/buscar/page.test.tsx`); backend subió de 16 a **41** tests (`mvnw test`) |
| 15 | **Turismo escrito en código**: las 6 fichas del home estaban pegadas en `src/lib/turismo.ts` — ni estudiantes ni admin podían agregar atractivos ni corregir direcciones | `src/lib/turismo.ts` (lista fija, sin endpoint) | ✅ **Entregado**: tabla `zonas_turisticas` + `GET/POST/PUT/DELETE /api/zonas` (lectura pública, escritura con rol ADMIN) + sección "Zonas turísticas" en `/admin` con **geolocalización** ("Usar mi ubicación" → coordenadas del celular → Nominatim inverso con caja de Repelón → dirección legible) y geocoder normal (dirección → coordenadas); el home lee la API con la lista estática como respaldo (`ZonaTuristica*.java`, `SeccionZonas.tsx`, `zonaALugar`, modo reverse en `src/app/api/geocode/route.ts`) |

> Nota: los estudiantes-admin **operan todo** (carga, moderación, pedidos,
> WhatsApp con los negocios) → este bloque P2 es su panel de día a día, no
> un extra: sube su importancia para la feria.

### Nota: qué queda pendiente fuera del P0

El P0 de la feria (buscador + alcance + WhatsApp), el P1 (ubicación
precisa + fotos) y el P2 (panel admin completo: usuarios, pedidos,
categorías, textos del home y tests de frontend) están entregados. Queda
aparte, por prioridad:

1. **Fotos — pasos manuales**: correr el SQL de políticas RLS del
   bucket (en el ticket `p1-calidad/02`) y probar la subida con la
   sesión del admin. La UI y la librería ya están.
2. **Rol ADMIN inicial**: correr `UPDATE usuarios SET rol='ADMIN'` en el
   SQL Editor de Supabase — pospuesto a propósito (la app no permite
   auto-promoción).
3. **Materiales del cliente**: lista real de negocios (direcciones y
   referencias), logos, fotos y textos del home (mientras tanto, los de
   ejemplo; ticket `p1-calidad/04`).
4. **La pregunta de sostenimiento** (gratis para los negocios — se verá
   después). Un CMS de páginas nuevas queda fuera por ahora: los textos
   que el cliente quiera cambiar ya se editan desde el panel.

---

## 5. Preguntas abiertas (para el profesor / el estudiante)

> **✅ Respondidas (oct. 2026):**
> 1. Alcance de negocios: **solo agrícolas, pesqueros y de turismo** del
>    pueblo — ferreterías, droguerías y tiendas quedan fuera (fue la
>    pregunta 7).
> 2. **Precios públicos**: visibles en la búsqueda y en la ficha. Los
>    productos con precio son **los pescados y los productos agrícolas**
>    (respuesta de oct. 2026): el turismo queda como ficha sin precios.
> 3. **La app solo es intermediaria**: **sin dinero y sin consultas** en
>    la app — se ve el **perfil del vendedor** y se habla por **WhatsApp**
>    (carrito, checkout y pedidos fuera de la v1; sin domicilios).
> 4. **Datos los pone el cliente**: él proporciona las direcciones y los
>    mapas de los negocios (fue la pregunta 6).
> 5. **Fotos las suben los estudiantes** (no el dueño ni el admin): el
>    upload va en un panel pensado para eso.
> 6. **Resultado en mapa y en lista, los dos** — "para que se vea más
>    dinámico": la búsqueda pinta lista de productos y resalta los pines
>    de esos negocios al mismo tiempo.
> 7. **Operación = los estudiantes (admins) hacen todo**: cargan negocios,
>    productos y fotos, moderan y atienden por WhatsApp. El **rol de admin
>    primero lo recibes tú** y luego tú se lo compartes al equipo. Contexto:
>    es un **proyecto estudiantil para una feria**, así que la demo y el
>    panel admin son el centro. **Pendiente (para después):** correr el
>    `UPDATE usuarios SET rol='ADMIN'` en el SQL Editor de Supabase — la
>    app no deja auto-promoción (`UsuarioService.java:62-64`).
> 8. **Ubicación**: los negocios están bien ubicados en el mapa (nada mal
>    ubicado) → el ajuste fino de coordenadas baja de prioridad.
> 9. **Turismo**: solo direcciones y zonas turísticas del pueblo — sin
>    productos ni precios (sección aparte en el home).
> 10. **Sin cuenta**: todo es libre — buscar, ver precios y consultar sin
>     registrarse.
> 11. **La app es solo intermediaria**: sin dinero ni consultas en la app
>     (cuestionario 20 refinada, 18) — se ve el **perfil del vendedor** y
>     se habla por **WhatsApp**; cualquier aviso también es WhatsApp y lo
>     coordinan ellos (21) → **carrito, checkout, pedidos y
>     notificaciones fuera de la v1**.
> 12. **Sin avisos** de producto agotado o de temporada (22).
> 13. **Negocios**: la lista de los que entran la pasa el cliente (26).
> 14. **WhatsApp/teléfono visible** en la ficha de cada negocio (27).
> 15. **Gratis** para los negocios; después se verá cómo sostenerla (28).
> 16. **Fecha de entrega: 5 días** (15).
> 17. **Unidades: kilos y libras** (9).
> 18. **La búsqueda sí es por producto**: "20 kilos de yuca" → lista con
>     precio (mapa + lista) → perfil del vendedor → WhatsApp. Cierra la
>     tensión "solo perfil vs. buscar productos" (decisiones 2 y 12).
>
> El detalle de cada respuesta está en `cuestionario-cliente.md`.

**✅ Cerradas todas (28 de 28).** Las 6 que el cliente no respondió se
**cerraron por decisión** ("no se pregunta más"), con estos por defecto:

- **Cantidades (3)**: basta con encontrar el producto — "20 kilos" no se
  interpreta; el precio sale en kilo/libra.
- **Productos (8)**: mezcla — la lista de negocios la pasa el cliente y
  los productos arrancan de ejemplo, que los estudiantes editan.
- **Páginas (11)**: sin CMS; textos del home fijos.
- **Mínimo de la entrega (12)**: el **buscador** (la idea central).
- **Algo más (14)**: nada nuevo.
- **Materiales (23)**: los de ejemplo hasta que el cliente pase los suyos.

> Las preguntas 2, 5 y 24 se habían cerrado antes **por síntesis** de las
> respuestas (lista + mapa con precio → perfil → WhatsApp; ambas
> búsquedas; categorías = agro, pesca y turismo).

---

## 6. Ruta sugerida

1. ✅ `/grill-with-docs` → cuestionario cerrado (28/28) con ADRs de la
   carpeta `docs/`.
2. ✅ `/to-spec` + `/to-tickets` → `spec-p0-buscador.md` (25 US) + 6
   tickets en `.scratch/p0-buscador/issues/`.
3. ✅ `/implement` por ticket → **P0 completo** (01-05 cerrados; 06 =
   verificación final de la entrega).
4. Siguiente: revisión de código (`/code-review`) y el bloque P2
   (admin); el P1 (fotos + ubicación) ya se entregó.

Orden por prioridad:

| Prioridad | Entrega | Por qué |
| --- | --- | --- |
| **P0** ✅ | Búsqueda de productos agro/pesca + unidades + resultados en el mapa + alcance acotado + WhatsApp | Es literalmente el objetivo del profesor, con el alcance que definió el cliente |
| **P1** ✅ | Fotos (Supabase Storage) y ubicación exacta (viewbox + pin) | Sin fotos y sin pin preciso, la respuesta se ve pobre o falla |
| **P2** ✅ | Admin ampliado (usuarios, pedidos, categorías con UI) | Cierra el ciclo de soporte de la plataforma |
| **P3** | Páginas editables / CMS y tests de frontend | Crecimiento, no bloquea la idea |

---

## 7. Cómo verificar el estado actual

```bash
# Frontend
cd ReplonConecta/frontend
npx tsc --noEmit     # sin errores
npm run lint         # 0 errores, 4 warnings preexistentes
npm run build        # 22 rutas compiladas
npm test             # 11 tests de Vitest en verde

# Backend
cd ReplonConecta/ReplonConecta
./mvnw test          # 41 tests en verde
```

Ejecutar la app: backend en `:8080`, frontend en `:3000`. En local el
backend corre con el perfil `test` (H2 en memoria con la semilla puesta);
en producción la semilla se activa con `SEED=true` la primera vez
(`application.properties:73`).

Para probar el panel `/admin` en local basta abrir
`http://localhost:3000/abrir-admin` en cualquier navegador (incluido el
integrado de VS Code): la página firma el token de desarrollo con el
secreto del perfil `test`, deja la sesión en localStorage y redirige a
`/admin`. Solo funciona en `localhost` y con `NEXT_PUBLIC_DEV_ADMIN_SECRET`
definido (solo en `.env.local`); en el hosting muestra "Atajo solo para
local". Alternativa con Edge automatizable:
`node cdp/abrir-admin.mjs`.
