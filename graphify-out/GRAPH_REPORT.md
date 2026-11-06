# Graph Report - Proyecto Edwin  (2026-11-06)

## Corpus Check
- 179 files · ~105,583 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 13, .properties 3, .cmd 2)

## Summary
- 1575 nodes · 4615 edges · 76 communities (48 shown, 28 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 249 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `57677945`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SecurityConfig.java
- uuid
- [slug]/page.tsx
- frontend/package.json
- PedidoService
- ZonaTuristica
- CulturaPublicacion
- NegocioService
- NegocioRepository
- app/layout.tsx
- NegocioServiceTests
- org.springframework.web.bind.annotation.GetMapping
- ZonaTuristicaTests.java
- app/page.tsx
- Categoria
- abrir-admin/page.tsx
- .actualizarTextosInicio
- SeccionPedidos.tsx
- NegocioService
- Producto
- org.springframework.transaction.annotation.Transactional
- SeccionNegocios.tsx
- SeccionNegocios.tsx
- buscar/page.tsx
- EditorGaleria
- CarritoContext.tsx
- SeccionNegocios
- app/negocios/page.tsx
- .emparejarNegocios
- ItemPedido
- SeccionZonas.tsx
- ZonaTuristicaService
- PedidoService.java
- list
- template.sh
- PedidoDtos.java
- .actual
- SeccionTextosInicio
- CatalogoService
- AdminPedidoTests.java
- CatalogoController
- SeccionHeroInicio
- SeccionHeroInicio
- maps.ts
- env.ts
- UsuarioService
- org.junit.jupiter.api.Test
- .actualAdmin
- org.junit.jupiter.api.Test
- ConfigTexto
- page.test.tsx
- IaAsistenteService.java
- .actual
- geocodificar.ts
- admin/negocios/page.tsx
- NegocioResponse
- .metricasVendedor
- EditorGaleria
- ItemPedido
- WhatsappService
- ubicacion.ts
- ConfigService
- MetodoPago
- SeccionZonas.tsx
- dependencies
- NegocioGaleriaTests
- PedidoDtos
- AlcanceCatalogoTests
- scripts
- IconoCategoria.tsx
- eslint
- ZonaTuristicaRepository

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
10. `NegocioService` - 40 edges

## Surprising Connections (you probably didn't know these)
- `guardar()` --indirect_call--> `fecha()`  [INFERRED]
  ReplonConecta/frontend/src/app/admin/SeccionCultura.tsx → ReplonConecta/frontend/src/lib/format.ts
- `subirArchivo()` --calls--> `subirImagen()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/SeccionZonas.tsx → ReplonConecta/frontend/src/lib/subirImagen.ts
- `enlaceLugar()` --calls--> `enlaceGoogleMaps()`  [EXTRACTED]
  ReplonConecta/frontend/src/lib/turismo.ts → ReplonConecta/frontend/src/lib/maps.ts
- `ValorSesion` --references--> `Usuario`  [EXTRACTED]
  ReplonConecta/frontend/src/context/SesionContext.tsx → ReplonConecta/frontend/src/lib/tipos.ts
- `NegocioDetalleResponse` --references--> `ProductoResponse`  [EXTRACTED]
  ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/dto/NegocioDtos.java → ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/dto/ProductoDtos.java

## Import Cycles
- None detected.

## Communities (76 total, 28 thin omitted)

### Community 0 - "SecurityConfig.java"
Cohesion: 0.06
Nodes (66): next, AdminLayout(), MenuPanel(), SECCIONES, HeroMetrica(), MetricaSecundaria(), PaginaResumen(), PaginaUsuarios() (+58 more)

### Community 1 - "uuid"
Cohesion: 0.06
Nodes (6): CorsConfig, JwtAuthoritiesConfig, JwtDecoderConfig, SecurityConfig, ErrorResponse, GlobalExceptionHandler

### Community 2 - "[slug]/page.tsx"
Cohesion: 0.14
Nodes (22): BuscarPagina(), Busqueda(), ControlZoom, ListaNegocios(), DIAS_HORARIO, Ficha(), FichaNegocio(), Horario() (+14 more)

### Community 3 - "frontend/package.json"
Cohesion: 0.12
Nodes (22): jsdom, tailwindcss, @tailwindcss/postcss, @testing-library/dom, @types/google.maps, @types/node, @types/react, @types/react-dom (+14 more)

### Community 4 - "PedidoService"
Cohesion: 0.12
Nodes (7): PedidoController, CambiarEstadoRequest, LineaResponse, PedidoDetalleResponse, PedidoResponse, PedidoService, WhatsappService

### Community 7 - "CulturaPublicacion"
Cohesion: 0.07
Nodes (4): Producto, UnidadProducto, KILO, LIBRA

### Community 9 - "NegocioRepository"
Cohesion: 0.12
Nodes (7): DireccionRepository, NegocioRepository, PedidoRepository, ProductoRepository, AdminService, CatalogoService, SlugService

### Community 10 - "app/layout.tsx"
Cohesion: 0.10
Nodes (23): nextConfig, fraunces, manrope, metadata, plexMono, RootLayout(), viewport, BarraNavegacion() (+15 more)

### Community 14 - "app/page.tsx"
Cohesion: 0.09
Nodes (25): ControlZoom, FONDO_EMPRENDER, FONDO_MOTIVO, Inicio(), MOTIVO_TRAZO, RAZONES, SliderTurismo(), CATEGORIAS_BUSQUEDA (+17 more)

### Community 15 - "Categoria"
Cohesion: 0.09
Nodes (7): CulturaDtos, PublicacionRequest, PublicacionResponse, CulturaPublicacion, CulturaPublicacionRepository, CulturaService, CulturaServiceTests

### Community 16 - "abrir-admin/page.tsx"
Cohesion: 0.83
Nodes (3): AbrirAdmin(), b64u(), firmar()

### Community 19 - "NegocioService"
Cohesion: 0.15
Nodes (6): NegocioController, NegocioDetalleResponse, NegocioUpdateRequest, RegistroNegocioRequest, NegocioService, TypeReference<List<String>>

### Community 20 - "Producto"
Cohesion: 0.30
Nodes (12): encuadrar(), iconoDe(), mapaBase(), MapaMini(), MapaNegocios(), MapaSelector(), Marcador, NegocioMapa (+4 more)

### Community 21 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.16
Nodes (6): ProductoController, ProductoDtos, ProductoRequest, ProductoResponse, CategoriaRepository, ProductoService

### Community 22 - "SeccionNegocios.tsx"
Cohesion: 0.08
Nodes (71): react, CampoUrlImagen(), PaginaContenido(), Resultado, UbicacionEditada, PaginaPedidos(), ALCANCE, buscarCategoria() (+63 more)

### Community 25 - "EditorGaleria"
Cohesion: 0.57
Nodes (7): EditorGaleria(), agregarPorUrl(), guardar(), lleno(), mover(), quitar(), subirArchivo()

### Community 26 - "CarritoContext.tsx"
Cohesion: 0.38
Nodes (6): Carrito, ContextoCarrito, ResultadoAgregar, ValorCarrito, LineaCarrito, Producto

### Community 28 - "SeccionNegocios"
Cohesion: 0.17
Nodes (18): Cultura(), metadata, esFoto(), fechaCorta(), FeedCultura(), iniciales(), GaleriaCultura(), LightboxGaleria() (+10 more)

### Community 29 - "app/negocios/page.tsx"
Cohesion: 0.21
Nodes (6): PerfilRequest, UsuarioController, AdminActualizarRequest, UsuarioDtos, UsuarioResponse, UsuarioService

### Community 30 - ".emparejarNegocios"
Cohesion: 0.10
Nodes (27): FILTROS, NegociosConFiltro(), PaginaNegocios(), desactivar(), aNumero(), cuerpoFotoProducto(), FiltroNegocios, SeccionNegocios() (+19 more)

### Community 31 - "ItemPedido"
Cohesion: 0.24
Nodes (13): FichaMapa(), AsistenteIaChat(), Mensaje, soloDigitos(), TarjetaNegocioIa(), urlGoogleMaps(), VideoFab(), StoreCard() (+5 more)

### Community 32 - "SeccionZonas.tsx"
Cohesion: 0.07
Nodes (6): Rol, ADMIN, COMPRADOR, VENDEDOR, Usuario, UsuarioRepository

### Community 33 - "ZonaTuristicaService"
Cohesion: 0.24
Nodes (5): ZonaTuristicaController, ZonaRequest, ZonaResponse, ZonaTuristicaService, TypeReference<List<String>>

### Community 34 - "PedidoService.java"
Cohesion: 0.15
Nodes (3): MetodoEntrega, DOMICILIO, RECOGER_EN_TIENDA

### Community 35 - "list"
Cohesion: 0.23
Nodes (5): IaController, ChatResponse, IaDtos, NegocioIa, IaAsistenteService

### Community 36 - "template.sh"
Cohesion: 0.17
Nodes (3): ResultadoBusquedaResponse, BusquedaService, BusquedaServiceTests

### Community 38 - ".actual"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 39 - "SeccionTextosInicio"
Cohesion: 0.60
Nodes (4): SeccionTextosInicio(), cerrar(), guardar(), valor()

### Community 40 - "CatalogoService"
Cohesion: 0.13
Nodes (8): CatalogoController, CategoriaRequest, CatalogoDtos, CategoriaResponse, DireccionRequest, MetricasAdminResponse, MetricasDtos, MetricasVendedorResponse

### Community 42 - "CatalogoController"
Cohesion: 0.12
Nodes (15): paths, key, sync, value, services, buildFilter, dockerContext, dockerfilePath (+7 more)

### Community 43 - "SeccionHeroInicio"
Cohesion: 0.18
Nodes (14): subirArchivo(), SeccionHeroInicio(), agregarPorUrl(), guardar(), lleno(), mover(), quitar(), subirArchivo() (+6 more)

### Community 44 - "SeccionHeroInicio"
Cohesion: 0.13
Nodes (7): EstadoPedido, CANCELADO, EN_CAMINO, EN_PREPARACION, ENTREGADO, PEDIDO_RECIBIDO, RECHAZADO

### Community 45 - "maps.ts"
Cohesion: 0.36
Nodes (8): direccionDe(), enlaceComoLlegar(), enlaceGoogleMaps(), enlaceRutaDesde(), enlaceVerEnGoogleMaps(), iconoMarcador(), MotivoFalloMapas, pinSvg()

### Community 46 - "env.ts"
Cohesion: 0.21
Nodes (10): GET(), reversa(), VIEWBOX, API_URL, CENTRO_REPELON, GOOGLE_MAPS_API_KEY, mapasGoogleConfigurado, SUPABASE_ANON_KEY (+2 more)

### Community 48 - "org.junit.jupiter.api.Test"
Cohesion: 0.21
Nodes (11): devDependencies, husky@^9.1.7, lint-staged@^17.6.0, prettier@^3.9.10, scripts, prepare, test, typecheck (+3 more)

### Community 49 - ".actualAdmin"
Cohesion: 0.15
Nodes (5): AdminController, CulturaController, NegocioAdminResponse, NegocioAdminToggleRequest, NegocioDtos

### Community 53 - "page.test.tsx"
Cohesion: 0.17
Nodes (7): @testing-library/react, vitest, @testing-library/react@^16.3.3, vitest@^5.0.3, { apiMock }, YUCA, ResultadoBusqueda

### Community 56 - "geocodificar.ts"
Cohesion: 0.25
Nodes (10): Cache, conCoordenadas(), ConDireccion, consultaDe(), consultar(), guardarCache(), leerCache(), Pendiente (+2 more)

### Community 57 - "admin/negocios/page.tsx"
Cohesion: 0.29
Nodes (5): metadata, PASOS, PROMESAS, REQUISITOS, SECTORES

### Community 64 - "ubicacion.ts"
Cohesion: 0.32
Nodes (7): VentanaLugar(), CENTRO, Guardado, guardar(), leerGuardado(), OrigenRuta, useUbicacion()

### Community 65 - "ConfigService"
Cohesion: 0.25
Nodes (3): ZonaDtos, ConfigService, TypeReference<List<String>>

### Community 66 - "MetodoPago"
Cohesion: 0.25
Nodes (5): MetodoPago, DAVIPLATA, EFECTIVO_CONTRA_ENTREGA, NEQUI, TRANSFERENCIA_BANCARIA

### Community 67 - "SeccionZonas.tsx"
Cohesion: 0.15
Nodes (15): EditorUbicacion(), moverPin(), traducirPin(), ubicarActual(), aNumero(), buscarZona(), SeccionZonas(), cerrarVentana() (+7 more)

### Community 68 - "dependencies"
Cohesion: 0.18
Nodes (11): leaflet, react-dom, @supabase/supabase-js, @types/leaflet, dependencies, leaflet@^1.9.4, next@16.3.8, react@19.2.8 (+3 more)

### Community 70 - "PedidoDtos"
Cohesion: 0.42
Nodes (4): CrearPedidoRequest, LineaRequest, PedidoDtos, AdminPedidoTests

### Community 72 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, typecheck

### Community 73 - "IconoCategoria.tsx"
Cohesion: 0.67
Nodes (3): dibujo(), IconoCategoria(), TRAZO

### Community 74 - "eslint"
Cohesion: 0.33
Nodes (5): eslint, eslint-config-next, eslintConfig, eslint@^9, eslint-config-next@16.3.8

## Knowledge Gaps
- **18 isolated node(s):** `DOMICILIO`, `RECOGER_EN_TIENDA`, `CANCELADO`, `EN_CAMINO`, `EN_PREPARACION` (+13 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 429 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Usuario` connect `SeccionZonas.tsx` to `PedidoService`, `uuid`, `NegocioService`, `NegocioRepository`, `org.springframework.web.bind.annotation.GetMapping`, `ZonaTuristicaTests.java`, `.actualizarTextosInicio`, `NegocioService`, `org.springframework.transaction.annotation.Transactional`, `jakarta.persistence.Entity`, `app/negocios/page.tsx`, `PedidoService.java`, `template.sh`, `PedidoDtos.java`, `AdminPedidoTests.java`, `UsuarioService`, `.actualAdmin`, `.actual`, `NegocioResponse`, `NegocioGaleriaTests`, `PedidoDtos`, `AlcanceCatalogoTests`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `DOMICILIO`, `RECOGER_EN_TIENDA`, `CANCELADO` to the rest of the system?**
  _18 weakly-connected nodes found - possible missing edges._
- **Should `SecurityConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.05742574257425743 - nodes in this community are weakly interconnected._
- **Why does `Negocio` connect `NegocioService` to `SeccionZonas.tsx`, `PedidoService.java`, `list`, `template.sh`, `uuid`, `CulturaPublicacion`, `AlcanceCatalogoTests`, `AdminPedidoTests.java`, `NegocioRepository`, `ZonaTuristicaTests.java`, `.actualizarTextosInicio`, `org.junit.jupiter.api.Test`, `NegocioService`, `org.springframework.transaction.annotation.Transactional`, `IaAsistenteService.java`, `SeccionNegocios.tsx`, `NegocioResponse`, `jakarta.persistence.Entity`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `uuid` be split into smaller, more focused modules?**
  _Cohesion score 0.05658381808566896 - nodes in this community are weakly interconnected._
- **Why does `Pedido` connect `ZonaTuristicaTests.java` to `SeccionZonas.tsx`, `MetodoPago`, `PedidoService.java`, `PedidoService`, `uuid`, `NegocioService`, `NegocioRepository`, `SeccionHeroInicio`, `jakarta.persistence.Entity`, `ItemPedido`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14015151515151514 - nodes in this community are weakly interconnected._