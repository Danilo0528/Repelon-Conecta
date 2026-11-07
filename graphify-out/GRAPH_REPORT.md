# Graph Report - Proyecto Edwin  (2026-11-06)

## Corpus Check
- 205 files · ~101,198 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 13, .properties 3, .cmd 2)

## Summary
- 1738 nodes · 5059 edges · 74 communities (49 shown, 25 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 276 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2f374b18`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- tipos.ts
- JwtDecoderConfig.java
- useInicio.ts
- dependencies
- useNegociosAdmin.ts
- ZonaTuristica
- NegocioDtos.java
- CulturaPublicacion
- NegocioService
- PedidoService
- VentanaLugar.tsx
- .actualizar
- org.springframework.web.bind.annotation.GetMapping
- ZonaTuristicaTests.java
- app/layout.tsx
- Categoria
- with
- .actualizarTextosInicio
- ZonaTuristicaTests.java
- generate-specs.mjs
- Mapa.tsx
- .crear
- SeccionCultura.tsx
- SeccionNegocios.tsx
- .actualizarTextosInicio
- SeccionHeroInicio.tsx
- org.springframework.transaction.annotation.Transactional
- SeccionNegocios
- app/negocios/page.tsx
- NegocioServiceTests
- react
- SeccionZonas.tsx
- ConfigTexto
- WhatsappService
- abrir-admin/page.tsx
- org.springframework.transaction.annotation.Transactional
- PedidoDtos.java
- .actual
- .actualAdmin
- tabla.ts
- AdminPedidoTests.java
- CatalogoController
- AdminCuentaTests
- SeccionHeroInicio
- vitest
- ui.tsx
- NegocioService
- org.junit.jupiter.api.Test
- CatalogoService
- org.junit.jupiter.api.Test
- CarritoContext.tsx
- [slug]/page.tsx
- PedidoResponse
- route.ts
- app/page.tsx
- admin/negocios/page.tsx
- list
- .metricasVendedor
- EditorGaleria
- ItemPedido
- WhatsappService
- env.ts
- frontend/package.json
- MetodoPago
- scripts
- UnidadProducto
- eslint
- check-docs.mjs
- MetodoEntrega
- @types/react-dom

## God Nodes (most connected - your core abstractions)
1. `Negocio` - 91 edges
2. `Pedido` - 64 edges
3. `Producto` - 59 edges
4. `Usuario` - 54 edges
5. `react` - 52 edges
6. `NegocioService` - 45 edges
7. `CurrentUserService` - 44 edges
8. `apiConSesion()` - 41 edges
9. `useDatos()` - 40 edges
10. `Aviso()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `NegociosTabla()` --calls--> `cambiarEstado()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/NegociosTabla.tsx → ReplonConecta/frontend/src/app/admin/useNegociosAdmin.ts
- `AdminPedidoTests` --references--> `PedidoService`  [EXTRACTED]
  ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/service/AdminPedidoTests.java → ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/service/PedidoService.java
- `PedidoServiceTests` --references--> `PedidoService`  [EXTRACTED]
  ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/service/PedidoServiceTests.java → ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/service/PedidoService.java
- `SeccionHeroInicio()` --calls--> `api()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/SeccionHeroInicio.tsx → ReplonConecta/frontend/src/lib/api.ts
- `SeccionTextosInicio()` --calls--> `api()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/SeccionTextosInicio.tsx → ReplonConecta/frontend/src/lib/api.ts

## Import Cycles
- None detected.

## Communities (74 total, 25 thin omitted)

### Community 0 - "tipos.ts"
Cohesion: 0.06
Nodes (65): next, AdminLayout(), MenuPanel(), SECCIONES, HeroMetrica(), MetricaSecundaria(), PaginaResumen(), desactivar() (+57 more)

### Community 1 - "JwtDecoderConfig.java"
Cohesion: 0.06
Nodes (6): CorsConfig, JwtAuthoritiesConfig, JwtDecoderConfig, SecurityConfig, ErrorResponse, GlobalExceptionHandler

### Community 2 - "useInicio.ts"
Cohesion: 0.13
Nodes (22): ControlZoom, useInicio(), creditoImagen(), Cache, conCoordenadas(), ConDireccion, consultaDe(), consultar() (+14 more)

### Community 3 - "dependencies"
Cohesion: 0.18
Nodes (11): leaflet, react-dom, @supabase/supabase-js, @types/leaflet, dependencies, leaflet@^1.9.4, next@16.3.8, react@19.2.8 (+3 more)

### Community 4 - "useNegociosAdmin.ts"
Cohesion: 0.14
Nodes (27): aNumero(), cuerpoFotoProducto(), cuerpoNegocio(), FiltroNegocios, FORM_VACIO, formDesdeDetalle(), FormNegocio, FormProducto (+19 more)

### Community 9 - "PedidoService"
Cohesion: 0.16
Nodes (5): MetricasAdminResponse, MetricasDtos, MetricasVendedorResponse, PedidoRepository, PedidoService

### Community 10 - "VentanaLugar.tsx"
Cohesion: 0.17
Nodes (15): FONDO_EMPRENDER, FONDO_MOTIVO, MOTIVO_TRAZO, RAZONES, SeccionTurismo(), VentanaLugar(), SliderTurismo(), direccionDe() (+7 more)

### Community 11 - ".actualizar"
Cohesion: 0.13
Nodes (6): NegocioDetalleResponse, NegocioUpdateRequest, RegistroNegocioRequest, TypeReference<List<String>>, TypeReference<List<String>>, NegocioGaleriaTests

### Community 12 - "org.springframework.web.bind.annotation.GetMapping"
Cohesion: 0.26
Nodes (3): BusquedaController, IaController, InicioController

### Community 14 - "app/layout.tsx"
Cohesion: 0.09
Nodes (24): nextConfig, fraunces, manrope, metadata, plexMono, RootLayout(), viewport, BarraNavegacion() (+16 more)

### Community 15 - "Categoria"
Cohesion: 0.09
Nodes (7): CulturaController, CulturaDtos, PublicacionRequest, PublicacionResponse, CulturaPublicacion, CulturaService, CulturaServiceTests

### Community 16 - "with"
Cohesion: 0.07
Nodes (28): concurrency, cancel-in-progress, group, env, name, runs-on, steps, timeout-minutes (+20 more)

### Community 18 - "ZonaTuristicaTests.java"
Cohesion: 0.08
Nodes (3): AdminCategoriaTests, BusquedaControllerTests, ZonaTuristicaTests

### Community 19 - "generate-specs.mjs"
Cohesion: 0.13
Nodes (15): backend, backendFiles, frontend, frontendFiles, lines, outFile, relative(), root (+7 more)

### Community 20 - "Mapa.tsx"
Cohesion: 0.15
Nodes (22): encuadrar(), iconoDe(), mapaBase(), MapaMini(), MapaNegocios(), MapaSelector(), Marcador, NegocioMapa (+14 more)

### Community 21 - ".crear"
Cohesion: 0.20
Nodes (7): CambiarEstadoRequest, CrearPedidoRequest, LineaRequest, LineaResponse, PedidoDetalleResponse, PedidoDtos, AdminPedidoTests

### Community 22 - "SeccionCultura.tsx"
Cohesion: 0.08
Nodes (67): PaginaContenido(), NegociosTabla(), PaginaPedidos(), ALCANCE, buscarCategoria(), COLUMNAS_CATEGORIAS, SeccionCategorias(), cerrar() (+59 more)

### Community 25 - "SeccionHeroInicio.tsx"
Cohesion: 0.13
Nodes (24): EditorGaleria(), agregarPorUrl(), cambiarCredito(), guardar(), lleno(), mover(), quitar(), subirArchivo() (+16 more)

### Community 26 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.06
Nodes (16): ProductoController, ZonaTuristicaController, ProductoDtos, ProductoRequest, ProductoResponse, ZonaRequest, ZonaResponse, ApiException (+8 more)

### Community 28 - "SeccionNegocios"
Cohesion: 0.17
Nodes (18): Cultura(), metadata, esFoto(), fechaCorta(), FeedCultura(), iniciales(), GaleriaCultura(), LightboxGaleria() (+10 more)

### Community 29 - "app/negocios/page.tsx"
Cohesion: 0.24
Nodes (4): PerfilRequest, UsuarioController, UsuarioResponse, UsuarioService

### Community 31 - "react"
Cohesion: 0.23
Nodes (17): FichaMapa(), AsistenteIaChat(), Mensaje, soloDigitos(), TarjetaNegocioIa(), urlGoogleMaps(), VideoFab(), StoreCard() (+9 more)

### Community 32 - "SeccionZonas.tsx"
Cohesion: 0.09
Nodes (5): Rol, ADMIN, COMPRADOR, VENDEDOR, Usuario

### Community 35 - "abrir-admin/page.tsx"
Cohesion: 0.83
Nodes (3): AbrirAdmin(), b64u(), firmar()

### Community 36 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.07
Nodes (6): Alcance, ChatResponse, IaDtos, NegocioIa, ConfigService, IaAsistenteService

### Community 38 - ".actual"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 39 - ".actualAdmin"
Cohesion: 0.13
Nodes (5): AdminController, NegocioAdminResponse, NegocioAdminToggleRequest, AdminActualizarRequest, AdminService

### Community 40 - "tabla.ts"
Cohesion: 0.29
Nodes (8): Direccion, filtrarYOrdenar(), normalizar(), Pagina, paginar(), COLUMNAS, Fila, FILAS

### Community 42 - "CatalogoController"
Cohesion: 0.12
Nodes (15): paths, key, sync, value, services, buildFilter, dockerContext, dockerfilePath (+7 more)

### Community 44 - "SeccionHeroInicio"
Cohesion: 0.13
Nodes (7): EstadoPedido, CANCELADO, EN_CAMINO, EN_PREPARACION, ENTREGADO, PEDIDO_RECIBIDO, RECHAZADO

### Community 45 - "vitest"
Cohesion: 0.20
Nodes (7): @testing-library/react, vitest, @testing-library/react@^16.3.3, vitest@^5.0.3, { apiMock }, YUCA, writeText

### Community 46 - "ui.tsx"
Cohesion: 0.11
Nodes (34): react, CampoUrlImagen(), EditorLogoNegocio(), EditorProductos(), EditorUbicacion(), moverPin(), traducirPin(), ubicarActual() (+26 more)

### Community 47 - "NegocioService"
Cohesion: 0.10
Nodes (6): NegocioController, PedidoController, NegocioResponse, CurrentUserService, NegocioService, SlugService

### Community 48 - "org.junit.jupiter.api.Test"
Cohesion: 0.15
Nodes (15): devDependencies, husky@^9.1.7, lint-staged@^17.6.0, prettier@^3.9.10, scripts, docs:check, docs:check:rules, docs:gen (+7 more)

### Community 49 - "CatalogoService"
Cohesion: 0.15
Nodes (7): CatalogoController, CategoriaRequest, CatalogoDtos, CategoriaResponse, DireccionRequest, DireccionResponse, CatalogoService

### Community 50 - "org.junit.jupiter.api.Test"
Cohesion: 0.11
Nodes (4): BusquedaService, AlcanceCatalogoTests, BusquedaServiceTests, IaAsistenteServiceTests

### Community 51 - "CarritoContext.tsx"
Cohesion: 0.38
Nodes (6): Carrito, ContextoCarrito, ResultadoAgregar, ValorCarrito, LineaCarrito, Producto

### Community 53 - "[slug]/page.tsx"
Cohesion: 0.12
Nodes (23): BuscarPagina(), Busqueda(), ControlZoom, ListaNegocios(), DIAS_HORARIO, Ficha(), FichaNegocio(), Horario() (+15 more)

### Community 55 - "route.ts"
Cohesion: 0.67
Nodes (3): GET(), reversa(), VIEWBOX

### Community 56 - "app/page.tsx"
Cohesion: 0.19
Nodes (13): SeccionComercios(), SeccionFondo(), SeccionHero(), SeccionMapa(), SeccionRazones(), InicioState, Inicio(), dibujo() (+5 more)

### Community 57 - "admin/negocios/page.tsx"
Cohesion: 0.29
Nodes (5): metadata, PASOS, PROMESAS, REQUISITOS, SECTORES

### Community 58 - "list"
Cohesion: 0.13
Nodes (9): NegocioDtos, UsuarioDtos, CategoriaRepository, CulturaPublicacionRepository, DireccionRepository, NegocioRepository, ProductoRepository, UsuarioRepository (+1 more)

### Community 64 - "env.ts"
Cohesion: 0.38
Nodes (6): CENTRO, Guardado, guardar(), leerGuardado(), OrigenRuta, useUbicacion()

### Community 65 - "frontend/package.json"
Cohesion: 0.11
Nodes (26): dependency-cruiser, jsdom, tailwindcss, @tailwindcss/postcss, @testing-library/dom, typedoc, typedoc-plugin-markdown, @types/google.maps (+18 more)

### Community 66 - "MetodoPago"
Cohesion: 0.29
Nodes (5): MetodoPago, DAVIPLATA, EFECTIVO_CONTRA_ENTREGA, NEQUI, TRANSFERENCIA_BANCARIA

### Community 72 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, docs:check:rules, docs:gen, lint, start, test (+1 more)

### Community 73 - "UnidadProducto"
Cohesion: 0.22
Nodes (5): BusquedaDtos, ResultadoBusquedaResponse, UnidadProducto, KILO, LIBRA

### Community 74 - "eslint"
Cohesion: 0.33
Nodes (5): eslint, eslint-config-next, eslintConfig, eslint@^9, eslint-config-next@16.3.8

### Community 76 - "MetodoEntrega"
Cohesion: 0.40
Nodes (3): MetodoEntrega, DOMICILIO, RECOGER_EN_TIENDA

## Knowledge Gaps
- **18 isolated node(s):** `ADMIN`, `COMPRADOR`, `VENDEDOR`, `CANCELADO`, `EN_CAMINO` (+13 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 470 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Negocio` connect `NegocioService` to `org.springframework.transaction.annotation.Transactional`, `org.springframework.transaction.annotation.Transactional`, `CulturaPublicacion`, `.actualAdmin`, `AdminPedidoTests.java`, `.actualizar`, `ZonaTuristicaTests.java`, `NegocioService`, `.actualizarTextosInicio`, `org.junit.jupiter.api.Test`, `list`, `jakarta.persistence.Entity`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `ADMIN`, `COMPRADOR`, `VENDEDOR` to the rest of the system?**
  _18 weakly-connected nodes found - possible missing edges._
- **Should `tipos.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05970790378006873 - nodes in this community are weakly interconnected._
- **Why does `react` connect `ui.tsx` to `tipos.ts`, `frontend/package.json`, `useInicio.ts`, `dependencies`, `useNegociosAdmin.ts`, `abrir-admin/page.tsx`, `env.ts`, `VentanaLugar.tsx`, `vitest`, `app/layout.tsx`, `CarritoContext.tsx`, `Mapa.tsx`, `[slug]/page.tsx`, `SeccionCultura.tsx`, `SeccionNegocios`, `react`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `JwtDecoderConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.05875706214689266 - nodes in this community are weakly interconnected._
- **Why does `Pedido` connect `ZonaTuristicaTests.java` to `SeccionZonas.tsx`, `MetodoPago`, `WhatsappService`, `org.springframework.transaction.annotation.Transactional`, `.actualAdmin`, `NegocioService`, `PedidoService`, `SeccionHeroInicio`, `MetodoEntrega`, `.crear`, `PedidoResponse`, `list`, `jakarta.persistence.Entity`, `ItemPedido`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `useInicio.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._