# Graph Report - Proyecto Edwin  (2026-11-06)

## Corpus Check
- 187 files · ~106,572 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 13, .properties 3, .cmd 2)

## Summary
- 1598 nodes · 4741 edges · 70 communities (49 shown, 21 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 262 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e44f95a0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- apiConSesion
- SecurityConfig.java
- [slug]/page.tsx
- frontend/package.json
- EditorProductos.tsx
- ZonaTuristica
- uuid
- CulturaPublicacion
- NegocioService
- PedidoRepository
- next
- .actualizar
- org.springframework.web.bind.annotation.GetMapping
- ZonaTuristicaTests.java
- app/page.tsx
- Categoria
- abrir-admin/page.tsx
- .actualizarTextosInicio
- SeccionPedidos.tsx
- useNegociosAdmin.ts
- Producto
- org.springframework.transaction.annotation.Transactional
- ui-admin.tsx
- SeccionNegocios.tsx
- .actualizarTextosInicio
- api.ts
- CarritoContext.tsx
- SeccionNegocios
- app/negocios/page.tsx
- useSesion
- ItemPedido
- SeccionZonas.tsx
- ZonaTuristicaService
- MetodoEntrega
- SesionContext.tsx
- template.sh
- PedidoDtos.java
- .actual
- JwtDecoderConfig.java
- CatalogoService
- AdminPedidoTests.java
- CatalogoController
- react
- SeccionHeroInicio
- maps.ts
- SeccionCultura
- UsuarioService
- org.junit.jupiter.api.Test
- .actualAdmin
- org.junit.jupiter.api.Test
- GlobalExceptionHandler.java
- tipos.ts
- IaAsistenteService.java
- tabla.ts
- geocodificar.ts
- admin/negocios/page.tsx
- CurrentUserService
- .metricasVendedor
- EditorGaleria
- ItemPedido
- WhatsappService
- ubicacion.ts
- inicio.ts
- MetodoPago
- SeccionZonas.tsx
- AlcanceCatalogoTests
- IconoCategoria.tsx

## God Nodes (most connected - your core abstractions)
1. `Negocio` - 86 edges
2. `Usuario` - 70 edges
3. `Pedido` - 64 edges
4. `Producto` - 58 edges
5. `react` - 49 edges
6. `CurrentUserService` - 44 edges
7. `Categoria` - 42 edges
8. `apiConSesion()` - 41 edges
9. `NegocioService` - 40 edges
10. `useDatos()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `FormEditarNegocio()` --calls--> `crearProducto()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/FormEditarNegocio.tsx → ReplonConecta/frontend/src/app/admin/useNegociosAdmin.ts
- `NegociosTabla()` --calls--> `cambiarEstado()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/NegociosTabla.tsx → ReplonConecta/frontend/src/app/admin/useNegociosAdmin.ts
- `eliminar()` --calls--> `apiConSesion()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/useNegociosAdmin.ts → ReplonConecta/frontend/src/lib/api.ts
- `guardar()` --indirect_call--> `fecha()`  [INFERRED]
  ReplonConecta/frontend/src/app/admin/SeccionCultura.tsx → ReplonConecta/frontend/src/lib/format.ts
- `subirArchivo()` --calls--> `subirImagen()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/SeccionZonas.tsx → ReplonConecta/frontend/src/lib/subirImagen.ts

## Import Cycles
- None detected.

## Communities (70 total, 21 thin omitted)

### Community 0 - "apiConSesion"
Cohesion: 0.16
Nodes (24): HeroMetrica(), MetricaSecundaria(), PaginaResumen(), desactivar(), DetallePedido(), MisPedidos(), FormularioProducto(), GestionNegocio() (+16 more)

### Community 1 - "SecurityConfig.java"
Cohesion: 0.12
Nodes (3): CorsConfig, JwtAuthoritiesConfig, SecurityConfig

### Community 2 - "[slug]/page.tsx"
Cohesion: 0.15
Nodes (17): Busqueda(), DIAS_HORARIO, Ficha(), FichaNegocio(), Horario(), BotonNumero(), writeText, GaleriaNegocio() (+9 more)

### Community 3 - "frontend/package.json"
Cohesion: 0.05
Nodes (49): eslint, eslint-config-next, jsdom, leaflet, react-dom, @supabase/supabase-js, tailwindcss, @tailwindcss/postcss (+41 more)

### Community 4 - "EditorProductos.tsx"
Cohesion: 0.15
Nodes (22): CampoUrlImagen(), EditorLogoNegocio(), EditorProductos(), EditorUbicacion(), moverPin(), traducirPin(), ubicarActual(), Resultado (+14 more)

### Community 6 - "uuid"
Cohesion: 0.09
Nodes (3): CulturaDtos, ProductoDtos, DireccionRepository

### Community 7 - "CulturaPublicacion"
Cohesion: 0.07
Nodes (4): Producto, UnidadProducto, KILO, LIBRA

### Community 9 - "PedidoRepository"
Cohesion: 0.15
Nodes (3): MetricasAdminResponse, MetricasVendedorResponse, PedidoRepository

### Community 10 - "next"
Cohesion: 0.12
Nodes (14): next, nextConfig, FILTROS, NegociosConFiltro(), PaginaNegocios(), BarraNavegacion(), ENLACES, BuscadorNav() (+6 more)

### Community 11 - ".actualizar"
Cohesion: 0.09
Nodes (7): NegocioDetalleResponse, NegocioUpdateRequest, RegistroNegocioRequest, TypeReference<List<String>>, WhatsappService, NegocioGaleriaTests, NegocioServiceTests

### Community 12 - "org.springframework.web.bind.annotation.GetMapping"
Cohesion: 0.20
Nodes (3): BusquedaController, CulturaController, ProductoController

### Community 14 - "app/page.tsx"
Cohesion: 0.15
Nodes (16): ControlZoom, FONDO_EMPRENDER, FONDO_MOTIVO, Inicio(), MOTIVO_TRAZO, RAZONES, SliderTurismo(), creditoImagen() (+8 more)

### Community 15 - "Categoria"
Cohesion: 0.09
Nodes (6): PublicacionRequest, PublicacionResponse, CulturaPublicacion, CulturaPublicacionRepository, CulturaService, CulturaServiceTests

### Community 16 - "abrir-admin/page.tsx"
Cohesion: 0.83
Nodes (3): AbrirAdmin(), b64u(), firmar()

### Community 19 - "useNegociosAdmin.ts"
Cohesion: 0.13
Nodes (27): cuerpoFotoProducto(), cuerpoNegocio(), FiltroNegocios, FORM_VACIO, formDesdeDetalle(), FormNegocio, FormProducto, PRODUCTO_VACIO (+19 more)

### Community 20 - "Producto"
Cohesion: 0.30
Nodes (12): encuadrar(), iconoDe(), mapaBase(), MapaMini(), MapaNegocios(), MapaSelector(), Marcador, NegocioMapa (+4 more)

### Community 21 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.09
Nodes (10): CambiarEstadoRequest, CrearPedidoRequest, LineaRequest, LineaResponse, PedidoDetalleResponse, PedidoDtos, ProductoRequest, ProductoResponse (+2 more)

### Community 22 - "ui-admin.tsx"
Cohesion: 0.15
Nodes (37): NegociosTabla(), PaginaPedidos(), ALCANCE, buscarCategoria(), COLUMNAS_CATEGORIAS, SeccionCategorias(), cerrar(), crear() (+29 more)

### Community 24 - ".actualizarTextosInicio"
Cohesion: 0.12
Nodes (6): InicioController, ConfigTexto, ConfigTextoRepository, ConfigService, TypeReference<List<String>>, ConfigTextosTests

### Community 25 - "api.ts"
Cohesion: 0.18
Nodes (18): EditorGaleria(), agregarPorUrl(), guardar(), lleno(), mover(), quitar(), subirArchivo(), Opciones (+10 more)

### Community 26 - "CarritoContext.tsx"
Cohesion: 0.23
Nodes (10): CarritoPagina(), Checkout(), Vacio(), Carrito, ContextoCarrito, ResultadoAgregar, useCarrito(), ValorCarrito (+2 more)

### Community 28 - "SeccionNegocios"
Cohesion: 0.17
Nodes (18): Cultura(), metadata, esFoto(), fechaCorta(), FeedCultura(), iniciales(), GaleriaCultura(), LightboxGaleria() (+10 more)

### Community 29 - "app/negocios/page.tsx"
Cohesion: 0.17
Nodes (6): PerfilRequest, UsuarioController, AdminActualizarRequest, UsuarioDtos, UsuarioResponse, UsuarioService

### Community 30 - "useSesion"
Cohesion: 0.15
Nodes (15): AdminLayout(), MenuPanel(), SECCIONES, Entrar(), FormularioEntrar(), DatosPerfil(), Direcciones(), agregar() (+7 more)

### Community 31 - "ItemPedido"
Cohesion: 0.13
Nodes (24): ListaNegocios(), FichaMapa(), AsistenteIaChat(), Mensaje, soloDigitos(), TarjetaNegocioIa(), urlGoogleMaps(), VideoFab() (+16 more)

### Community 32 - "SeccionZonas.tsx"
Cohesion: 0.08
Nodes (5): Rol, ADMIN, COMPRADOR, VENDEDOR, Usuario

### Community 33 - "ZonaTuristicaService"
Cohesion: 0.21
Nodes (6): ZonaTuristicaController, ZonaDtos, ZonaRequest, ZonaResponse, ZonaTuristicaService, TypeReference<List<String>>

### Community 34 - "MetodoEntrega"
Cohesion: 0.20
Nodes (4): PedidoResponse, MetodoEntrega, DOMICILIO, RECOGER_EN_TIENDA

### Community 35 - "SesionContext.tsx"
Cohesion: 0.14
Nodes (16): fraunces, manrope, metadata, plexMono, RootLayout(), viewport, Blobs(), PieConecta() (+8 more)

### Community 37 - "PedidoDtos.java"
Cohesion: 0.08
Nodes (3): DireccionRequest, DireccionResponse, Direccion

### Community 38 - ".actual"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 40 - "CatalogoService"
Cohesion: 0.17
Nodes (7): CatalogoController, CategoriaRequest, CatalogoDtos, CategoriaResponse, MetricasDtos, CategoriaRepository, CatalogoService

### Community 42 - "CatalogoController"
Cohesion: 0.12
Nodes (15): paths, key, sync, value, services, buildFilter, dockerContext, dockerfilePath (+7 more)

### Community 43 - "react"
Cohesion: 0.16
Nodes (16): react, PaginaContenido(), SeccionHeroInicio(), agregarPorUrl(), guardar(), lleno(), mover(), quitar() (+8 more)

### Community 44 - "SeccionHeroInicio"
Cohesion: 0.12
Nodes (7): EstadoPedido, CANCELADO, EN_CAMINO, EN_PREPARACION, ENTREGADO, PEDIDO_RECIBIDO, RECHAZADO

### Community 45 - "maps.ts"
Cohesion: 0.24
Nodes (10): VentanaLugar(), GOOGLE_MAPS_API_KEY, mapasGoogleConfigurado, direccionDe(), enlaceGoogleMaps(), enlaceRutaDesde(), iconoMarcador(), MotivoFalloMapas (+2 more)

### Community 46 - "SeccionCultura"
Cohesion: 0.22
Nodes (13): buscarPublicacion(), fechaCorta(), hoy(), medioValido(), porFecha(), SeccionCultura(), cerrarVentana(), eliminar() (+5 more)

### Community 48 - "org.junit.jupiter.api.Test"
Cohesion: 0.21
Nodes (11): devDependencies, husky@^9.1.7, lint-staged@^17.6.0, prettier@^3.9.10, scripts, prepare, test, typecheck (+3 more)

### Community 53 - "tipos.ts"
Cohesion: 0.11
Nodes (24): BuscarPagina(), ControlZoom, { apiMock }, YUCA, Campo(), OPCIONES_PAGO, ETIQUETA_SIGUIENTE, SIGUIENTE (+16 more)

### Community 54 - "IaAsistenteService.java"
Cohesion: 0.08
Nodes (8): Alcance, IaController, BusquedaDtos, ResultadoBusquedaResponse, ChatResponse, IaDtos, NegocioIa, IaAsistenteService

### Community 55 - "tabla.ts"
Cohesion: 0.29
Nodes (8): Direccion, filtrarYOrdenar(), normalizar(), Pagina, paginar(), COLUMNAS, Fila, FILAS

### Community 56 - "geocodificar.ts"
Cohesion: 0.29
Nodes (9): Cache, ConDireccion, consultaDe(), consultar(), guardarCache(), leerCache(), Pendiente, Punto (+1 more)

### Community 57 - "admin/negocios/page.tsx"
Cohesion: 0.29
Nodes (5): metadata, PASOS, PROMESAS, REQUISITOS, SECTORES

### Community 58 - "CurrentUserService"
Cohesion: 0.10
Nodes (14): AdminController, NegocioController, PedidoController, NegocioDtos, NegocioResponse, NegocioRepository, ProductoRepository, UsuarioRepository (+6 more)

### Community 64 - "ubicacion.ts"
Cohesion: 0.21
Nodes (10): GET(), reversa(), VIEWBOX, CENTRO_REPELON, CENTRO, Guardado, guardar(), leerGuardado() (+2 more)

### Community 65 - "inicio.ts"
Cohesion: 0.29
Nodes (6): CLAVE_IMAGENES_HERO, ClaveTextoInicio, IMAGENES_HERO_POR_DEFECTO, imagenesInicio(), TEXTO_INICIO, textoInicio()

### Community 66 - "MetodoPago"
Cohesion: 0.22
Nodes (5): MetodoPago, DAVIPLATA, EFECTIVO_CONTRA_ENTREGA, NEQUI, TRANSFERENCIA_BANCARIA

### Community 67 - "SeccionZonas.tsx"
Cohesion: 0.20
Nodes (13): aNumero(), buscarZona(), COLUMNAS_ZONAS, MOTIVOS, SeccionZonas(), cerrarVentana(), coordenadasValidas(), eliminar() (+5 more)

### Community 73 - "IconoCategoria.tsx"
Cohesion: 0.67
Nodes (3): dibujo(), IconoCategoria(), TRAZO

## Knowledge Gaps
- **18 isolated node(s):** `ADMIN`, `COMPRADOR`, `VENDEDOR`, `DOMICILIO`, `RECOGER_EN_TIENDA` (+13 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 425 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Usuario` connect `SeccionZonas.tsx` to `PedidoDtos.java`, `uuid`, `AlcanceCatalogoTests`, `NegocioService`, `AdminPedidoTests.java`, `CatalogoService`, `.actualizar`, `org.springframework.web.bind.annotation.GetMapping`, `ZonaTuristicaTests.java`, `UsuarioService`, `.actualAdmin`, `.actualizarTextosInicio`, `org.springframework.transaction.annotation.Transactional`, `CurrentUserService`, `jakarta.persistence.Entity`, `app/negocios/page.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **What connects `ADMIN`, `COMPRADOR`, `VENDEDOR` to the rest of the system?**
  _18 weakly-connected nodes found - possible missing edges._
- **Should `SecurityConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.12169312169312169 - nodes in this community are weakly interconnected._
- **Why does `Pedido` connect `ZonaTuristicaTests.java` to `SeccionZonas.tsx`, `MetodoPago`, `MetodoEntrega`, `uuid`, `NegocioService`, `PedidoRepository`, `SeccionHeroInicio`, `.actualAdmin`, `org.springframework.transaction.annotation.Transactional`, `jakarta.persistence.Entity`, `ItemPedido`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1476923076923077 - nodes in this community are weakly interconnected._
- **Why does `Negocio` connect `NegocioService` to `SeccionZonas.tsx`, `uuid`, `CulturaPublicacion`, `AlcanceCatalogoTests`, `AdminPedidoTests.java`, `.actualizar`, `ZonaTuristicaTests.java`, `.actualAdmin`, `org.junit.jupiter.api.Test`, `.actualizarTextosInicio`, `org.springframework.transaction.annotation.Transactional`, `IaAsistenteService.java`, `SeccionNegocios.tsx`, `CurrentUserService`, `jakarta.persistence.Entity`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.050314465408805034 - nodes in this community are weakly interconnected._