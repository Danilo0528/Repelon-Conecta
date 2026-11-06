# Graph Report - Proyecto Edwin  (2026-11-06)

## Corpus Check
- 174 files · ~104,299 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 13, .properties 3, .cmd 2)

## Summary
- 1539 nodes · 4441 edges · 70 communities (49 shown, 21 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 216 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `09b48344`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SecurityConfig.java
- uuid
- frontend/package.json
- app/page.tsx
- Negocio
- ZonaTuristica
- PedidoDtos.java
- CulturaPublicacion
- NegocioService
- CurrentUserService
- AdminController.java
- ui.tsx
- Pedido
- ZonaTuristicaTests.java
- app/layout.tsx
- Categoria
- NegocioController
- .actualizarTextosInicio
- SeccionPedidos.tsx
- Mapa.tsx
- Producto
- .actualizar
- PedidoService
- SeccionNegocios.tsx
- buscar/page.tsx
- FeedCultura.tsx
- tipos.ts
- SeccionNegocios
- app/negocios/page.tsx
- .emparejarNegocios
- ItemPedido
- SeccionZonas.tsx
- EditorUbicacion
- tipos.ts
- list
- template.sh
- PedidoDtos.java
- .actual
- BusquedaController.java
- CatalogoService
- AdminPedidoTests.java
- CatalogoController
- services
- SeccionHeroInicio
- EstadoPedido
- SeedData.java
- UsuarioService
- org.junit.jupiter.api.Test
- org.springframework.web.bind.annotation.GetMapping
- org.junit.jupiter.api.Test
- PedidoRepository
- page.test.tsx
- IaAsistenteService.java
- .actual
- mvnw
- admin/negocios/page.tsx
- .actualAdmin
- .metricasVendedor
- EditorGaleria
- ItemPedido
- WhatsappService
- ubicacion.ts
- tabla.ts
- WhatsappService
- cerrarVentana
- PedidoResponse
- admin/negocios/page.tsx

## God Nodes (most connected - your core abstractions)
1. `Negocio` - 86 edges
2. `Usuario` - 70 edges
3. `Pedido` - 64 edges
4. `Producto` - 58 edges
5. `react` - 46 edges
6. `CurrentUserService` - 44 edges
7. `Categoria` - 42 edges
8. `SeccionNegocios()` - 41 edges
9. `apiConSesion()` - 41 edges
10. `useDatos()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `guardar()` --indirect_call--> `fecha()`  [INFERRED]
  ReplonConecta/frontend/src/app/admin/SeccionCultura.tsx → ReplonConecta/frontend/src/lib/format.ts
- `PaginaContenido()` --calls--> `SeccionCategorias()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/contenido/page.tsx → ReplonConecta/frontend/src/app/admin/SeccionCategorias.tsx
- `SeccionCategorias()` --calls--> `VentanaAdmin()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/SeccionCategorias.tsx → ReplonConecta/frontend/src/app/admin/ui-admin.tsx
- `SeccionCategorias()` --calls--> `apiConSesion()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/SeccionCategorias.tsx → ReplonConecta/frontend/src/lib/api.ts
- `SeccionCategorias()` --calls--> `useDatos()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/SeccionCategorias.tsx → ReplonConecta/frontend/src/lib/useDatos.ts

## Import Cycles
- None detected.

## Communities (70 total, 21 thin omitted)

### Community 0 - "SecurityConfig.java"
Cohesion: 0.10
Nodes (40): HeroMetrica(), MetricaSecundaria(), PaginaResumen(), CarritoPagina(), Campo(), Checkout(), OPCIONES_PAGO, DetallePedido() (+32 more)

### Community 1 - "uuid"
Cohesion: 0.06
Nodes (3): SecurityConfig, ErrorResponse, GlobalExceptionHandler

### Community 2 - "frontend/package.json"
Cohesion: 0.10
Nodes (23): next, nextConfig, BuscarPagina(), Busqueda(), ControlZoom, DIAS_HORARIO, Ficha(), FichaNegocio() (+15 more)

### Community 3 - "app/page.tsx"
Cohesion: 0.05
Nodes (47): eslint, eslint-config-next, jsdom, leaflet, react-dom, @supabase/supabase-js, tailwindcss, @tailwindcss/postcss (+39 more)

### Community 4 - "Negocio"
Cohesion: 0.17
Nodes (9): PedidoController, CambiarEstadoRequest, CrearPedidoRequest, LineaRequest, LineaResponse, PedidoDetalleResponse, PedidoDtos, PedidoService (+1 more)

### Community 5 - "ZonaTuristica"
Cohesion: 0.07
Nodes (6): ZonaTuristicaController, ZonaRequest, ZonaResponse, ZonaTuristica, ZonaTuristicaService, TypeReference<List<String>>

### Community 6 - "PedidoDtos.java"
Cohesion: 0.14
Nodes (3): CulturaDtos, ProductoDtos, ZonaDtos

### Community 7 - "CulturaPublicacion"
Cohesion: 0.07
Nodes (4): Producto, UnidadProducto, KILO, LIBRA

### Community 9 - "CurrentUserService"
Cohesion: 0.19
Nodes (9): CategoriaRepository, NegocioRepository, ProductoRepository, UsuarioRepository, AdminService, CurrentUserService, NegocioService, ProductoService (+1 more)

### Community 10 - "AdminController.java"
Cohesion: 0.10
Nodes (23): fraunces, manrope, metadata, plexMono, RootLayout(), viewport, BarraNavegacion(), ENLACES (+15 more)

### Community 11 - "ui.tsx"
Cohesion: 0.20
Nodes (5): NegocioDetalleResponse, NegocioUpdateRequest, RegistroNegocioRequest, TypeReference<List<String>>, NegocioGaleriaTests

### Community 13 - "ZonaTuristicaTests.java"
Cohesion: 0.05
Nodes (9): MetodoEntrega, DOMICILIO, RECOGER_EN_TIENDA, MetodoPago, DAVIPLATA, EFECTIVO_CONTRA_ENTREGA, NEQUI, TRANSFERENCIA_BANCARIA (+1 more)

### Community 14 - "app/layout.tsx"
Cohesion: 0.09
Nodes (32): ControlZoom, FONDO_EMPRENDER, FONDO_MOTIVO, Inicio(), MOTIVO_TRAZO, RAZONES, VentanaLugar(), dibujo() (+24 more)

### Community 15 - "Categoria"
Cohesion: 0.11
Nodes (5): PublicacionRequest, PublicacionResponse, CulturaPublicacion, CulturaPublicacionRepository, CulturaService

### Community 17 - ".actualizarTextosInicio"
Cohesion: 0.14
Nodes (5): Rol, ADMIN, COMPRADOR, VENDEDOR, RepelonConectaApplicationTests

### Community 19 - "Mapa.tsx"
Cohesion: 0.11
Nodes (22): react, AbrirAdmin(), b64u(), firmar(), AdminLayout(), MenuPanel(), SECCIONES, Entrar() (+14 more)

### Community 20 - "Producto"
Cohesion: 0.19
Nodes (17): encuadrar(), iconoDe(), mapaBase(), MapaMini(), MapaNegocios(), MapaSelector(), Marcador, NegocioMapa (+9 more)

### Community 21 - ".actualizar"
Cohesion: 0.17
Nodes (3): ProductoController, ProductoRequest, ProductoResponse

### Community 22 - "PedidoService"
Cohesion: 0.12
Nodes (41): PaginaPedidos(), ALCANCE, buscarCategoria(), COLUMNAS_CATEGORIAS, SeccionCategorias(), cerrar(), crear(), ANULABLES (+33 more)

### Community 24 - "buscar/page.tsx"
Cohesion: 0.14
Nodes (3): ConfigTexto, ConfigTextoRepository, ConfigTextosTests

### Community 25 - "FeedCultura.tsx"
Cohesion: 0.20
Nodes (14): CampoUrlImagen(), Resultado, UbicacionEditada, FORM_VACIO, FormNegocio, CAMPOS, BTN_PRIMARIO, BTN_SECUNDARIO (+6 more)

### Community 26 - "tipos.ts"
Cohesion: 0.14
Nodes (18): AsistenteIaChat(), Mensaje, soloDigitos(), TarjetaNegocioIa(), urlGoogleMaps(), VideoFab(), Carrito, ContextoCarrito (+10 more)

### Community 28 - "SeccionNegocios"
Cohesion: 0.17
Nodes (18): Cultura(), metadata, esFoto(), fechaCorta(), FeedCultura(), iniciales(), GaleriaCultura(), LightboxGaleria() (+10 more)

### Community 29 - "app/negocios/page.tsx"
Cohesion: 0.24
Nodes (4): PerfilRequest, UsuarioController, UsuarioResponse, UsuarioService

### Community 30 - ".emparejarNegocios"
Cohesion: 0.13
Nodes (19): desactivar(), aNumero(), cuerpoFotoProducto(), SeccionNegocios(), abrirCrear(), abrirEditar(), actualizarFotoProducto(), aplicarLogo() (+11 more)

### Community 31 - "ItemPedido"
Cohesion: 0.25
Nodes (12): ListaNegocios(), FichaMapa(), StoreCard(), Chip(), InsigniaAbierto(), CATEGORIAS_BUSQUEDA, enAlcance(), PISTA_SIN_PRODUCTOS (+4 more)

### Community 33 - "EditorUbicacion"
Cohesion: 0.47
Nodes (4): EditorUbicacion(), moverPin(), traducirPin(), ubicarActual()

### Community 34 - "tipos.ts"
Cohesion: 0.20
Nodes (16): buscarPublicacion(), COLUMNAS_CULTURA, fechaCorta(), hoy(), medioValido(), porFecha(), SeccionCultura(), cerrarVentana() (+8 more)

### Community 35 - "list"
Cohesion: 0.23
Nodes (5): IaController, ChatResponse, IaDtos, NegocioIa, IaAsistenteService

### Community 36 - "template.sh"
Cohesion: 0.13
Nodes (3): BusquedaService, AlcanceCatalogoTests, BusquedaServiceTests

### Community 38 - ".actual"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 39 - "BusquedaController.java"
Cohesion: 0.32
Nodes (3): BusquedaController, BusquedaDtos, ResultadoBusquedaResponse

### Community 40 - "CatalogoService"
Cohesion: 0.16
Nodes (5): CatalogoDtos, CategoriaResponse, DireccionRequest, DireccionResponse, CatalogoService

### Community 42 - "CatalogoController"
Cohesion: 0.12
Nodes (15): paths, key, sync, value, services, buildFilter, dockerContext, dockerfilePath (+7 more)

### Community 43 - "services"
Cohesion: 0.21
Nodes (12): PaginaContenido(), SeccionHeroInicio(), agregarPorUrl(), guardar(), lleno(), mover(), quitar(), subirArchivo() (+4 more)

### Community 44 - "SeccionHeroInicio"
Cohesion: 0.09
Nodes (7): EstadoPedido, CANCELADO, EN_CAMINO, EN_PREPARACION, ENTREGADO, PEDIDO_RECIBIDO, RECHAZADO

### Community 45 - "EstadoPedido"
Cohesion: 0.18
Nodes (3): MetricasAdminResponse, MetricasDtos, MetricasVendedorResponse

### Community 46 - "SeedData.java"
Cohesion: 0.17
Nodes (15): subirArchivo(), api(), apiJson(), ErrorApi, Opciones, tokenActual(), API_URL, SUPABASE_ANON_KEY (+7 more)

### Community 48 - "org.junit.jupiter.api.Test"
Cohesion: 0.21
Nodes (11): devDependencies, husky@^9.1.7, lint-staged@^17.6.0, prettier@^3.9.10, scripts, prepare, test, typecheck (+3 more)

### Community 49 - "org.springframework.web.bind.annotation.GetMapping"
Cohesion: 0.25
Nodes (4): AdminController, NegocioAdminResponse, NegocioAdminToggleRequest, AdminActualizarRequest

### Community 53 - "page.test.tsx"
Cohesion: 0.14
Nodes (8): @testing-library/react, vitest, { apiMock }, YUCA, BotonNumero(), writeText, CLASE_BOTON_NEUTRO, ResultadoBusqueda

### Community 54 - "IaAsistenteService.java"
Cohesion: 0.11
Nodes (3): Alcance, InicioController, ConfigService

### Community 56 - "mvnw"
Cohesion: 0.57
Nodes (7): EditorGaleria(), agregarPorUrl(), guardar(), lleno(), mover(), quitar(), subirArchivo()

### Community 57 - "admin/negocios/page.tsx"
Cohesion: 0.29
Nodes (5): metadata, PASOS, PROMESAS, REQUISITOS, SECTORES

### Community 58 - ".actualAdmin"
Cohesion: 0.28
Nodes (3): CatalogoController, CategoriaRequest, CulturaController

### Community 64 - "ubicacion.ts"
Cohesion: 0.21
Nodes (10): GET(), reversa(), VIEWBOX, CENTRO_REPELON, CENTRO, Guardado, guardar(), leerGuardado() (+2 more)

### Community 65 - "tabla.ts"
Cohesion: 0.29
Nodes (8): Direccion, filtrarYOrdenar(), normalizar(), Pagina, paginar(), COLUMNAS, Fila, FILAS

### Community 67 - "cerrarVentana"
Cohesion: 0.33
Nodes (6): cerrarVentana(), coordenadasValidas(), eliminar(), guardar(), limpiar(), nuevaZona()

### Community 69 - "admin/negocios/page.tsx"
Cohesion: 0.50
Nodes (4): FILTROS, NegociosConFiltro(), PaginaNegocios(), FiltroNegocios

## Knowledge Gaps
- **18 isolated node(s):** `ADMIN`, `COMPRADOR`, `VENDEDOR`, `KILO`, `LIBRA` (+13 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 432 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Usuario` connect `SeccionZonas.tsx` to `Negocio`, `NegocioService`, `CurrentUserService`, `ui.tsx`, `Pedido`, `ZonaTuristicaTests.java`, `NegocioController`, `.actualizarTextosInicio`, `.actualizar`, `jakarta.persistence.Entity`, `app/negocios/page.tsx`, `template.sh`, `PedidoDtos.java`, `CatalogoService`, `AdminPedidoTests.java`, `SeccionHeroInicio`, `EstadoPedido`, `UsuarioService`, `PedidoRepository`, `IaAsistenteService.java`, `.actual`, `.actualAdmin`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `ADMIN`, `COMPRADOR`, `VENDEDOR` to the rest of the system?**
  _18 weakly-connected nodes found - possible missing edges._
- **Should `SecurityConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.10405323653962492 - nodes in this community are weakly interconnected._
- **Why does `Pedido` connect `ZonaTuristicaTests.java` to `SeccionZonas.tsx`, `PedidoResponse`, `Negocio`, `NegocioService`, `SeccionHeroInicio`, `PedidoRepository`, `.actualizar`, `jakarta.persistence.Entity`, `ItemPedido`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `uuid` be split into smaller, more focused modules?**
  _Cohesion score 0.055218855218855216 - nodes in this community are weakly interconnected._
- **Why does `Negocio` connect `NegocioService` to `SeccionZonas.tsx`, `template.sh`, `CulturaPublicacion`, `AdminPedidoTests.java`, `CurrentUserService`, `ui.tsx`, `SeccionHeroInicio`, `ZonaTuristicaTests.java`, `NegocioController`, `org.springframework.web.bind.annotation.GetMapping`, `org.junit.jupiter.api.Test`, `PedidoRepository`, `.actualizarTextosInicio`, `.actualizar`, `IaAsistenteService.java`, `SeccionNegocios.tsx`, `jakarta.persistence.Entity`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0953058321479374 - nodes in this community are weakly interconnected._