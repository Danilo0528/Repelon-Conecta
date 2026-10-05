# Repelón Conecta — Estado del proyecto

> Documento de trabajo: qué pedía la idea, qué ya está hecho y qué falta,
> con evidencia en el código (`archivo:línea`). Actualizado: octubre de 2026.

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
| Backend | Spring Boot (Java 17+), `ReplonConecta/` |
| Base de datos | Supabase Postgres (`application.properties:20`) |
| Autenticación | Supabase Auth (email + clave) validada con JWT/JWKS en el backend (`application.properties:45-51`) |
| Mapas | Leaflet + OpenStreetMap, sin claves (`src/components/Mapa.tsx`) |
| Geocodificación | Nominatim vía proxy propio (`src/app/api/geocode/route.ts`) |
| Roles | `COMPRADOR`, `VENDEDOR`, `ADMIN` |

Tres personas usan la app: el **vecino** que busca y compra, el **dueño de
negocio** que publica y despacha, y el **admin** que vigila la plataforma.

---

## 3. Lo que ya está hecho ✅

### Público (cualquiera)

- **Home con mapa del pueblo**: hero, pines de todos los negocios, sección
  "El pueblo en el mapa" con encuadre, chip de ubicación y atribución OSM
  (`src/app/page.tsx`).
- **Búsqueda y filtros de negocios**: texto libre, chips de categoría,
  barrio, "abiertos ahora" (`src/app/negocios/page.tsx:26-33`) →
  `GET /api/negocios?texto=&barrio=&abierto=&categoriaId=`
  (`NegocioController.java:46-55`).
- **Ficha del negocio**: foto, estado abierto/cerrado, dirección, WhatsApp,
  mapa con pines, "Cómo llegar" y "Ver en OpenStreetMap"
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

- Métricas generales (6 cifras) y **gestión de negocios**: aprobar/suspender,
  destacar/quitar, eliminar (`src/app/admin/page.tsx`,
  `AdminController.java:43-62`, `CatalogoController.java:97-98`).
- Aprobación de negocios nuevos configurable (`AUTO_APPROVE`,
  `application.properties:65`).

### Plataforma

- Geocodificación automática de negocios sin coordenadas (Nominatim con
  caché y respeto de 1 req/s) (`src/lib/geocodificar.ts:44-52`).
- Semilla de datos: 9 categorías, 5 negocios, 25 productos de Repelón
  (`SeedData.java:156`, `SeedData.java:177-185`).
- Diseño con la plantilla (glassmorphism, Fraunces + Manrope, nav flotante),
  home y navegación alineados a la plantilla y **todas las pantallas
  adaptadas a PC** (rejillas de 2-4 columnas, formularios centrados).
- Verificación en verde: `tsc --noEmit` ✅, `eslint` 0 errores (4 warnings
  preexistentes), `next build` ✅ (14 rutas).

---

## 4. Qué falta frente a la idea 🔴🟠🟡

### 🔴 P0 — Lo que hace falta para que la idea funcione

| # | Brecha | Evidencia | Qué hay que hacer |
| --- | --- | --- | --- |
| 1 | **No existe búsqueda de productos.** "Yuca" no se encuentra: `texto` solo compara el **nombre y la descripción del negocio**, nunca lo que vende | `NegocioRepository.java:40-41` | Endpoint `GET /api/productos?texto=` (nombre + descripción + categoría, **filtrado a productos agrícolas y pesqueros**, con `stock > 0`), y pantalla de resultados: tarjeta de producto → negocio que lo tiene → link a la ficha |
| 2 | **No se entienden cantidades.** "20 kilos" no significa nada hoy: `Producto` tiene `stock` como número suelo y la unidad está **escrita dentro del nombre** ("Yuca (kilo)", `SeedData.java:156`) | `Producto.java:64` | Campo `unidad` (kilo, libra, arroba, manojo, cantarillo, bandeja… — confirmar lista con el cliente) en producto, y que la búsqueda interprete la cantidad ("20 kilos" → filtra/ordena por unidad y stock ≥ 20) |
| 3 | **El mapa no responde a la búsqueda.** Los pines siempre muestran todos los negocios; el resultado de buscar "cemento" no se ve en el mapa | `src/app/page.tsx` (lista de pines estática) | Que al buscar un producto se resalten en el mapa solo los negocios que lo tienen, con el resultado como ficha/chip |
| 4 | **No hay una pantalla "¿dónde consigo X?"** La búsqueda actual devuelve **negocios**, no productos; el vecino termina abriendo ficha por ficha a ver qué venden | `src/app/negocios/page.tsx` | Flujo nuevo: buscador global (home y `/negocios`) que devuelva **productos agrícolas/pesqueros** con precio, negocio, barrio y estado |
| 5 | **Catálogo sin acotar**: el cliente definió el alcance (agro, pesca y turismo) pero hoy hay 9 categorías con ferretería, droguería, tienda, etc. y el home/listados muestran todo (`SeedData.java:177-185`) | decisión del cliente, oct. 2026 | Filtrar buscador, listados y home a esas 3 familias; crear categoría **Turismo**; decidir el destino de los negocios fuera de alcance (¿ocultar del mapa y listado?) |

### 🟠 P1 — Calidad de la respuesta

| # | Brecha | Evidencia | Qué hay que hacer |
| --- | --- | --- | --- |
| 6 | **Ubicación poco exacta**: los negocios sin coordenadas se geocodifican con Nominatim sin sesgo de país ni `viewbox` (cae fuera del pueblo o en la vereda vecina) — *baja: el cliente confirma que hoy están bien ubicados* | `src/app/api/geocode/route.ts:33`, `src/lib/geocodificar.ts:43` | Agregar `countrycodes=co` + `viewbox` de Repelón y `bounded=1`; incentivar el pin manual (`MapaSelector` ya existe) y opción "usar mi ubicación" desde el celular |
| 7 | **Sin fotos de productos**: el bucket de Supabase Storage está declarado (`productos`) pero **no existe una sola línea de subida**; todo cae al placeholder o a las fotos fijas de `public/img/` | `application.properties:52`, `env.ts:23`, grep `storage\|upload` = 0 | Upload desde el navegador con `@supabase/supabase-js` + RLS por negocio, guardar URL en `logoUrl`/`imagenUrl` (`ui.tsx:166` ya lo espera) |
| 8 | **Pocos datos reales**: la semilla tiene "Yuca (kilo)" pero el catálogo real del pueblo depende de que los dueños carguen productos | `SeedData.java:68-71` (seed solo en base vacía) | El cliente dice que **él proporciona las direcciones y los mapas**: recibir su lista de negocios (dirección + coordenadas o referencia) y cargarla — con `viewbox` ya no hace falta geocodificar a mano |
| 9 | **Quitar carrito, checkout y pedidos de la v1**: el cliente confirmó que la app **no maneja dinero ni consultas** — solo sirve de intermediario: ver el **perfil del vendedor** y hablar por **WhatsApp** (cuestionario 20 refinada + 18); hoy existen `/carrito`, `/checkout` y `/pedidos` con `DOMICILIO` por defecto | `src/app/checkout/page.tsx:24`, `carrito/page.tsx`, `pedidos/`, `PedidoController.java` | Ocultar carrito/checkout/pedidos (y direcciones del perfil), dejar **botón "WhatsApp"** en ficha de negocio y en producto (ya hay `Negocio.whatsapp`); atrás no se borra nada (si más adelante piden pedidos, vuelve) |

### 🟡 P2 — Admin y plataforma completos

| # | Brecha | Evidencia | Qué hay que hacer |
| --- | --- | --- | --- |
| 10 | **El admin no administra todo**: hoy solo métricas + negocios. No puede ver **usuarios** ni cambiar roles/bloquear (no hay endpoint) | `UsuarioController.java:35-50` (solo perfil propio) | `GET /api/admin/usuarios`, `PATCH .../rol`, `PATCH .../activo` + tabla en `/admin` |
| 11 | **El admin no ve todos los pedidos**: solo la métrica; corregir/cancelar pedidos ajenos no existe | `PedidoController.java:69-101` (por negocio) | Listado global con filtros y anulación admin |
| 12 | **Categorías sin UI**: el backend ya permite crear/borrar categorías (`POST/DELETE /api/categorias`) pero **nadie las pinta** | `CatalogoController.java:50,58` | Sección "Categorías" en `/admin` (es lo más barato: solo frontend) |
| 13 | **No se pueden agregar/editar páginas ni textos del home** (hero, beneficios, avisos están escritos en código) | `src/app/page.tsx` (texto fijo) | Definir alcance: ¿texto editable del home (rápido) o CMS de páginas nuevas (spec aparte)? |
| 14 | **Casi no hay tests**: backend solo el test de contexto; frontend ninguno | `RepelonConectaApplicationTests.java` | Mínimo: tests de los servicios de búsqueda/pedido con `/tdd` |

> Nota: los estudiantes-admin **operan todo** (carga, moderación, pedidos,
> WhatsApp con los negocios) → este bloque P2 es su panel de día a día, no
> un extra: sube su importancia para la feria.

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

El trabajo tiene varias piezas con decisiones pendientes (punto 5), así que
la ruta del flujo de trabajo del repo es:

1. `/grill-with-docs` — cerrar las preguntas abiertas del punto 5 y dejar
   ADR/glosario.
2. `/to-spec` + `/to-tickets` — spec + tickets con bloqueos (P0 primero:
   búsqueda de **productos agrícolas y pesqueros** → unidades → mapa de
   resultados → pantalla "¿dónde consigo X?").
3. `/implement` por ticket, con `/tdd` adentro y `/code-review` al cierre.

Orden por prioridad:

| Prioridad | Entrega | Por qué |
| --- | --- | --- |
| **P0** | Búsqueda de productos agro/pesca + unidades + resultados en el mapa | Es literalmente el objetivo del profesor, con el alcance que acaba de definir |
| **P1** | Fotos (Supabase Storage) y ubicación exacta (viewbox + pin) | Sin fotos y sin pin preciso, la respuesta se ve pobre o falla |
| **P2** | Admin ampliado (usuarios, pedidos, categorías con UI) | Cierra el ciclo de soporte de la plataforma |
| **P3** | Páginas editables / CMS y tests | Crecimiento, no bloquea la idea |

---

## 7. Cómo verificar el estado actual

```bash
# Frontend
cd ReplonConecta/frontend
npx tsc --noEmit     # sin errores
npm run lint         # 0 errores, 4 warnings preexistentes
npm run build        # 14 rutas compiladas

# Backend
cd ReplonConecta/ReplonConecta
./mvnw test          # solo el test de contexto hoy
```

Ejecutar la app: backend en `:8080`, frontend en `:3000`; la semilla se
activa con `SEED=true` la primera vez (`application.properties:73`).
