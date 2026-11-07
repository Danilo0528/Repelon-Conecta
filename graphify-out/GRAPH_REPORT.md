# Graph Report - Proyecto Edwin  (2026-11-06)

## Corpus Check
- 206 files · ~102,420 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 21 file(s) not represented in the graph (top: (none) 14, .properties 3, .cmd 2)

## Summary
- 1757 nodes · 5088 edges · 78 communities (54 shown, 24 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 276 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6a9b178e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- apiConSesion
- JwtDecoderConfig.java
- useInicio.ts
- dependencies
- useNegociosAdmin.ts
- ZonaTuristica
- ZonaTuristicaService
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
- PedidoService
- SeccionPedidos.tsx
- SeccionNegocios.tsx
- .actualizarTextosInicio
- SeccionHeroInicio.tsx
- org.springframework.transaction.annotation.Transactional
- jakarta.persistence.Entity
- SeccionNegocios
- app/negocios/page.tsx
- Cargando
- react
- SeccionZonas.tsx
- org.junit.jupiter.api.Test
- PedidoServiceTests
- next
- BusquedaServiceTests.java
- PedidoDtos.java
- .actual
- NegocioRepository
- tabla.ts
- AdminPedidoTests.java
- CatalogoController
- AdminCuentaTests
- SeccionHeroInicio
- buscar/page.tsx
- ui.tsx
- NegocioService
- org.junit.jupiter.api.Test
- CatalogoService
- org.junit.jupiter.api.Test
- ui.tsx
- [slug]/page.tsx
- SeccionHeroInicio
- SeccionCultura.tsx
- app/page.tsx
- admin/negocios/page.tsx
- uuid
- .metricasVendedor
- EditorGaleria
- ItemPedido
- WhatsappService
- env.ts
- devDependencies
- SeccionZonas.tsx
- IaAsistenteService
- frontend/package.json
- geocodificar.ts
- @tailwindcss/postcss
- scripts
- @types/react
- eslint
- typescript
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
- `desactivar()` --calls--> `apiConSesion()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/SeccionCategorias.tsx → ReplonConecta/frontend/src/lib/api.ts
- `eliminar()` --calls--> `apiConSesion()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/useNegociosAdmin.ts → ReplonConecta/frontend/src/lib/api.ts
- `NegociosTabla()` --calls--> `cambiarEstado()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/NegociosTabla.tsx → ReplonConecta/frontend/src/app/admin/useNegociosAdmin.ts
- `guardar()` --indirect_call--> `fecha()`  [INFERRED]
  ReplonConecta/frontend/src/app/admin/SeccionCultura.tsx → ReplonConecta/frontend/src/lib/format.ts
- `FormEditarNegocio()` --calls--> `crearProducto()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/FormEditarNegocio.tsx → ReplonConecta/frontend/src/app/admin/useNegociosAdmin.ts

## Import Cycles
- None detected.

## Communities (78 total, 24 thin omitted)

### Community 0 - "apiConSesion"
Cohesion: 0.13
Nodes (26): HeroMetrica(), MetricaSecundaria(), PaginaResumen(), DetallePedido(), MisPedidos(), ETIQUETA_SIGUIENTE, FormularioProducto(), GestionNegocio() (+18 more)

### Community 1 - "JwtDecoderConfig.java"
Cohesion: 0.06
Nodes (6): CorsConfig, JwtAuthoritiesConfig, JwtDecoderConfig, SecurityConfig, ErrorResponse, GlobalExceptionHandler

### Community 2 - "useInicio.ts"
Cohesion: 0.19
Nodes (14): ControlZoom, useInicio(), creditoImagen(), CREDITOS_IMAGENES, conCoordenadas(), CLAVE_CREDITOS_HERO, CLAVE_IMAGENES_HERO, ClaveTextoInicio (+6 more)

### Community 3 - "dependencies"
Cohesion: 0.20
Nodes (10): leaflet, react-dom, @types/leaflet, dependencies, leaflet@^1.9.4, next@16.3.8, react@19.2.8, react-dom@19.2.8 (+2 more)

### Community 4 - "useNegociosAdmin.ts"
Cohesion: 0.13
Nodes (26): cuerpoFotoProducto(), cuerpoNegocio(), FiltroNegocios, FORM_VACIO, formDesdeDetalle(), FormNegocio, FormProducto, PRODUCTO_VACIO (+18 more)

### Community 6 - "ZonaTuristicaService"
Cohesion: 0.12
Nodes (8): ZonaDtos, ZonaRequest, ZonaResponse, Galeria, Galeria, ZonaTuristicaService, TypeReference<List<String>>, TypeReference<List<String>>

### Community 9 - "PedidoService"
Cohesion: 0.24
Nodes (3): MetricasAdminResponse, MetricasDtos, MetricasVendedorResponse

### Community 10 - "VentanaLugar.tsx"
Cohesion: 0.18
Nodes (15): FONDO_EMPRENDER, FONDO_MOTIVO, MOTIVO_TRAZO, RAZONES, SeccionTurismo(), VentanaLugar(), direccionDe(), enlaceGoogleMaps() (+7 more)

### Community 11 - ".actualizar"
Cohesion: 0.10
Nodes (8): NegocioDetalleResponse, NegocioUpdateRequest, RegistroNegocioRequest, TypeReference<List<String>>, TypeReference<List<String>>, WhatsappService, NegocioGaleriaTests, NegocioServiceTests

### Community 12 - "org.springframework.web.bind.annotation.GetMapping"
Cohesion: 0.18
Nodes (5): BusquedaController, CatalogoController, CulturaController, IaController, ZonaTuristicaController

### Community 13 - "ZonaTuristicaTests.java"
Cohesion: 0.05
Nodes (9): MetodoEntrega, DOMICILIO, RECOGER_EN_TIENDA, MetodoPago, DAVIPLATA, EFECTIVO_CONTRA_ENTREGA, NEQUI, TRANSFERENCIA_BANCARIA (+1 more)

### Community 14 - "app/layout.tsx"
Cohesion: 0.11
Nodes (21): fraunces, manrope, metadata, plexMono, RootLayout(), viewport, BarraNavegacion(), ENLACES (+13 more)

### Community 15 - "Categoria"
Cohesion: 0.08
Nodes (7): CulturaDtos, PublicacionRequest, PublicacionResponse, CulturaPublicacion, CulturaPublicacionRepository, CulturaService, CulturaServiceTests

### Community 16 - "with"
Cohesion: 0.07
Nodes (34): concurrency, cancel-in-progress, group, env, name, runs-on, steps, timeout-minutes (+26 more)

### Community 19 - "generate-specs.mjs"
Cohesion: 0.07
Nodes (28): changed, untracked, bases, candidates, env, javaBin(), javaVersion(), matches (+20 more)

### Community 20 - "Mapa.tsx"
Cohesion: 0.21
Nodes (17): encuadrar(), iconoDe(), mapaBase(), MapaMini(), MapaNegocios(), MapaSelector(), Marcador, NegocioMapa (+9 more)

### Community 21 - "PedidoService"
Cohesion: 0.16
Nodes (6): AdminController, PedidoController, LineaResponse, PedidoDetalleResponse, PedidoResponse, PedidoService

### Community 22 - "SeccionPedidos.tsx"
Cohesion: 0.14
Nodes (36): NegociosTabla(), PaginaPedidos(), ALCANCE, buscarCategoria(), COLUMNAS_CATEGORIAS, SeccionCategorias(), cerrar(), crear() (+28 more)

### Community 24 - ".actualizarTextosInicio"
Cohesion: 0.14
Nodes (6): InicioController, ConfigTextoRepository, ConfigService, TypeReference<List<String>>, TypeReference<List<String>>, ConfigTextosTests

### Community 25 - "SeccionHeroInicio.tsx"
Cohesion: 0.16
Nodes (18): @supabase/supabase-js, EditorGaleria(), agregarPorUrl(), cambiarCredito(), guardar(), lleno(), mover(), quitar() (+10 more)

### Community 26 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.11
Nodes (7): ProductoController, CambiarEstadoRequest, ProductoDtos, ProductoRequest, ProductoResponse, ApiException, ProductoService

### Community 28 - "SeccionNegocios"
Cohesion: 0.16
Nodes (19): react, Cultura(), metadata, esFoto(), fechaCorta(), FeedCultura(), iniciales(), GaleriaCultura() (+11 more)

### Community 29 - "app/negocios/page.tsx"
Cohesion: 0.14
Nodes (7): PerfilRequest, UsuarioController, AdminActualizarRequest, UsuarioDtos, UsuarioResponse, UsuarioRepository, UsuarioService

### Community 30 - "Cargando"
Cohesion: 0.11
Nodes (23): AdminLayout(), MenuPanel(), SECCIONES, FILTROS, NegociosConFiltro(), PaginaNegocios(), Entrar(), FormularioEntrar() (+15 more)

### Community 31 - "react"
Cohesion: 0.16
Nodes (25): FichaMapa(), ListaNegocios(), AsistenteIaChat(), Mensaje, soloDigitos(), TarjetaNegocioIa(), urlGoogleMaps(), VideoFab() (+17 more)

### Community 32 - "SeccionZonas.tsx"
Cohesion: 0.09
Nodes (5): Rol, ADMIN, COMPRADOR, VENDEDOR, Usuario

### Community 34 - "PedidoServiceTests"
Cohesion: 0.25
Nodes (5): CrearPedidoRequest, LineaRequest, PedidoDtos, AdminPedidoTests, PedidoServiceTests

### Community 35 - "next"
Cohesion: 0.22
Nodes (4): next, AbrirAdmin(), b64u(), firmar()

### Community 36 - "BusquedaServiceTests.java"
Cohesion: 0.09
Nodes (6): Alcance, BusquedaDtos, ResultadoBusquedaResponse, UnidadProducto, KILO, LIBRA

### Community 38 - ".actual"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 39 - "NegocioRepository"
Cohesion: 0.11
Nodes (8): NegocioAdminResponse, NegocioAdminToggleRequest, NegocioDtos, NegocioRepository, PedidoRepository, ProductoRepository, AdminService, SlugService

### Community 40 - "tabla.ts"
Cohesion: 0.27
Nodes (9): ColumnaOrden, Direccion, filtrarYOrdenar(), normalizar(), Pagina, paginar(), COLUMNAS, Fila (+1 more)

### Community 42 - "CatalogoController"
Cohesion: 0.12
Nodes (15): paths, key, sync, value, services, buildFilter, dockerContext, dockerfilePath (+7 more)

### Community 44 - "SeccionHeroInicio"
Cohesion: 0.13
Nodes (7): EstadoPedido, CANCELADO, EN_CAMINO, EN_PREPARACION, ENTREGADO, PEDIDO_RECIBIDO, RECHAZADO

### Community 45 - "buscar/page.tsx"
Cohesion: 0.12
Nodes (17): BuscarPagina(), Busqueda(), ControlZoom, { apiMock }, YUCA, SeccionHero(), dibujo(), IconoCategoria() (+9 more)

### Community 46 - "ui.tsx"
Cohesion: 0.14
Nodes (26): CampoUrlImagen(), EditorLogoNegocio(), EditorProductos(), EditorUbicacion(), moverPin(), traducirPin(), ubicarActual(), Resultado (+18 more)

### Community 47 - "NegocioService"
Cohesion: 0.12
Nodes (4): NegocioController, NegocioResponse, CurrentUserService, NegocioService

### Community 48 - "org.junit.jupiter.api.Test"
Cohesion: 0.15
Nodes (15): devDependencies, husky@^9.1.7, lint-staged@^17.6.0, prettier@^3.9.10, scripts, docs:check, docs:check:rules, docs:gen (+7 more)

### Community 49 - "CatalogoService"
Cohesion: 0.13
Nodes (7): CategoriaRequest, CatalogoDtos, CategoriaResponse, DireccionRequest, DireccionResponse, DireccionRepository, CatalogoService

### Community 50 - "org.junit.jupiter.api.Test"
Cohesion: 0.14
Nodes (3): BusquedaService, AlcanceCatalogoTests, BusquedaServiceTests

### Community 51 - "ui.tsx"
Cohesion: 0.13
Nodes (25): CarritoPagina(), Campo(), Checkout(), OPCIONES_PAGO, CLASE_BOTON_AZUL, CLASE_BOTON_AZUL_ANCHO, CLASE_BOTON_AZUL_CONTORNO_ANCHO, Carrito (+17 more)

### Community 53 - "[slug]/page.tsx"
Cohesion: 0.12
Nodes (17): @testing-library/react, vitest, nextConfig, vitest@^5.0.3, DIAS_HORARIO, Ficha(), FichaNegocio(), Horario() (+9 more)

### Community 54 - "SeccionHeroInicio"
Cohesion: 0.20
Nodes (13): PaginaContenido(), SeccionHeroInicio(), agregarPorUrl(), cambiarCredito(), guardar(), lleno(), mover(), quitar() (+5 more)

### Community 55 - "SeccionCultura.tsx"
Cohesion: 0.21
Nodes (15): buscarPublicacion(), COLUMNAS_CULTURA, fechaCorta(), hoy(), medioValido(), porFecha(), SeccionCultura(), cerrarVentana() (+7 more)

### Community 56 - "app/page.tsx"
Cohesion: 0.38
Nodes (6): SeccionComercios(), SeccionFondo(), SeccionMapa(), SeccionRazones(), InicioState, Inicio()

### Community 57 - "admin/negocios/page.tsx"
Cohesion: 0.29
Nodes (5): metadata, PASOS, PROMESAS, REQUISITOS, SECTORES

### Community 64 - "env.ts"
Cohesion: 0.21
Nodes (10): GET(), reversa(), VIEWBOX, CENTRO_REPELON, CENTRO, Guardado, guardar(), leerGuardado() (+2 more)

### Community 65 - "devDependencies"
Cohesion: 0.17
Nodes (12): dependency-cruiser, jsdom, tailwindcss, @testing-library/dom, typedoc-plugin-markdown, devDependencies, dependency-cruiser@^18.7.2, jsdom@^30.1.2 (+4 more)

### Community 66 - "SeccionZonas.tsx"
Cohesion: 0.21
Nodes (13): aNumero(), buscarZona(), COLUMNAS_ZONAS, MOTIVOS, SeccionZonas(), cerrarVentana(), coordenadasValidas(), eliminar() (+5 more)

### Community 67 - "IaAsistenteService"
Cohesion: 0.25
Nodes (4): ChatResponse, IaDtos, NegocioIa, IaAsistenteService

### Community 69 - "frontend/package.json"
Cohesion: 0.20
Nodes (9): typedoc, @types/google.maps, @types/node, typedoc@^0.28.20, @types/google.maps@^3.66.5, @types/node@^24.19.1, name, private (+1 more)

### Community 70 - "geocodificar.ts"
Cohesion: 0.29
Nodes (9): Cache, ConDireccion, consultaDe(), consultar(), guardarCache(), leerCache(), Pendiente, Punto (+1 more)

### Community 72 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, docs:check:rules, docs:gen, lint, start, test (+1 more)

### Community 74 - "eslint"
Cohesion: 0.33
Nodes (5): eslint, eslint-config-next, eslintConfig, eslint@^9, eslint-config-next@16.3.8

## Knowledge Gaps
- **18 isolated node(s):** `ADMIN`, `COMPRADOR`, `VENDEDOR`, `CANCELADO`, `EN_CAMINO` (+13 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 477 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Negocio` connect `NegocioService` to `org.junit.jupiter.api.Test`, `IaAsistenteService`, `BusquedaServiceTests.java`, `org.springframework.transaction.annotation.Transactional`, `PedidoService.java`, `CulturaPublicacion`, `NegocioRepository`, `AdminPedidoTests.java`, `.actualizar`, `ZonaTuristicaTests.java`, `NegocioService`, `.actualizarTextosInicio`, `org.junit.jupiter.api.Test`, `uuid`, `jakarta.persistence.Entity`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `ADMIN`, `COMPRADOR`, `VENDEDOR` to the rest of the system?**
  _18 weakly-connected nodes found - possible missing edges._
- **Should `apiConSesion` be split into smaller, more focused modules?**
  _Cohesion score 0.12944523470839261 - nodes in this community are weakly interconnected._
- **Why does `Pedido` connect `ZonaTuristicaTests.java` to `SeccionZonas.tsx`, `PedidoService.java`, `NegocioRepository`, `NegocioService`, `SeccionHeroInicio`, `PedidoService`, `uuid`, `jakarta.persistence.Entity`, `ItemPedido`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `JwtDecoderConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.05875706214689266 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `[slug]/page.tsx` to `frontend/package.json`, `tabla.ts`, `buscar/page.tsx`, `generate-specs.mjs`, `SeccionNegocios`, `react`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `useNegociosAdmin.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13054187192118227 - nodes in this community are weakly interconnected._