# Graph Report - Proyecto Edwin  (2026-11-06)

## Corpus Check
- 197 files · ~106,943 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 13, .properties 3, .cmd 2)

## Summary
- 1616 nodes · 4813 edges · 68 communities (51 shown, 17 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 262 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `45f64733`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- apiConSesion
- JwtDecoderConfig.java
- [slug]/page.tsx
- frontend/package.json
- EditorProductos.tsx
- ZonaTuristica
- CulturaPublicacion
- NegocioService
- PedidoRepository
- next
- org.springframework.transaction.annotation.Transactional
- org.springframework.web.bind.annotation.GetMapping
- ZonaTuristicaTests.java
- org.springframework.web.bind.annotation.GetMapping
- Categoria
- abrir-admin/page.tsx
- .actualizarTextosInicio
- SeccionPedidos.tsx
- useNegociosAdmin.ts
- Mapa.tsx
- PedidoDetalleResponse
- ui-admin.tsx
- SeccionNegocios.tsx
- .actualizarTextosInicio
- EditorGaleria
- dependencies
- SeccionNegocios
- app/negocios/page.tsx
- useSesion
- ItemPedido
- SeccionZonas.tsx
- vitest
- PedidoService.java
- app/layout.tsx
- ProductoRepository
- PedidoDtos.java
- .actual
- scripts
- CatalogoService
- AdminPedidoTests.java
- CatalogoController
- SeccionHeroInicio
- SeccionHeroInicio
- AdminPedidoTests
- SeccionCultura
- UsuarioService
- org.junit.jupiter.api.Test
- CurrentUserService
- org.junit.jupiter.api.Test
- eslint
- tipos.ts
- IaAsistenteService.java
- tabla.ts
- buscar/page.tsx
- admin/negocios/page.tsx
- NegocioRepository
- .metricasVendedor
- EditorGaleria
- ItemPedido
- WhatsappService
- supabase.ts
- SeccionTextosInicio
- MetodoPago
- SeccionZonas.tsx

## God Nodes (most connected - your core abstractions)
1. `Negocio` - 86 edges
2. `Usuario` - 70 edges
3. `Pedido` - 64 edges
4. `Producto` - 58 edges
5. `react` - 52 edges
6. `CurrentUserService` - 44 edges
7. `Categoria` - 42 edges
8. `apiConSesion()` - 41 edges
9. `NegocioService` - 40 edges
10. `useDatos()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `desactivar()` --calls--> `apiConSesion()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/SeccionCategorias.tsx → ReplonConecta/frontend/src/lib/api.ts
- `eliminar()` --calls--> `apiConSesion()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/useNegociosAdmin.ts → ReplonConecta/frontend/src/lib/api.ts
- `guardar()` --indirect_call--> `fecha()`  [INFERRED]
  ReplonConecta/frontend/src/app/admin/SeccionCultura.tsx → ReplonConecta/frontend/src/lib/format.ts
- `NegociosTabla()` --calls--> `cambiarEstado()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/NegociosTabla.tsx → ReplonConecta/frontend/src/app/admin/useNegociosAdmin.ts
- `FichaMapa()` --calls--> `enlaceComoLlegar()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/_inicio/FichaMapa.tsx → ReplonConecta/frontend/src/lib/maps.ts

## Import Cycles
- None detected.

## Communities (68 total, 17 thin omitted)

### Community 0 - "apiConSesion"
Cohesion: 0.13
Nodes (28): HeroMetrica(), MetricaSecundaria(), PaginaResumen(), CarritoPagina(), Checkout(), Entrar(), FormularioEntrar(), DetallePedido() (+20 more)

### Community 1 - "JwtDecoderConfig.java"
Cohesion: 0.06
Nodes (6): CorsConfig, JwtAuthoritiesConfig, JwtDecoderConfig, SecurityConfig, ErrorResponse, GlobalExceptionHandler

### Community 2 - "[slug]/page.tsx"
Cohesion: 0.13
Nodes (17): DIAS_HORARIO, Ficha(), FichaNegocio(), Horario(), BotonNumero(), writeText, GaleriaNegocio(), Carrito (+9 more)

### Community 3 - "frontend/package.json"
Cohesion: 0.12
Nodes (22): jsdom, tailwindcss, @tailwindcss/postcss, @testing-library/dom, @types/google.maps, @types/node, @types/react, @types/react-dom (+14 more)

### Community 4 - "EditorProductos.tsx"
Cohesion: 0.15
Nodes (24): CampoUrlImagen(), EditorLogoNegocio(), EditorProductos(), Resultado, UbicacionEditada, Campo, FormDatosNegocio(), CAMPOS (+16 more)

### Community 5 - "ZonaTuristica"
Cohesion: 0.07
Nodes (6): ZonaDtos, ZonaRequest, ZonaResponse, ZonaTuristica, ZonaTuristicaService, TypeReference<List<String>>

### Community 7 - "CulturaPublicacion"
Cohesion: 0.08
Nodes (4): Producto, UnidadProducto, KILO, LIBRA

### Community 10 - "next"
Cohesion: 0.14
Nodes (17): next, SeccionComercios(), SeccionFondo(), SeccionHero(), SeccionMapa(), SeccionRazones(), ControlZoom, InicioState (+9 more)

### Community 11 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.05
Nodes (16): ProductoController, NegocioDetalleResponse, NegocioDtos, NegocioResponse, NegocioUpdateRequest, RegistroNegocioRequest, ProductoDtos, ProductoRequest (+8 more)

### Community 12 - "org.springframework.web.bind.annotation.GetMapping"
Cohesion: 0.18
Nodes (4): BusquedaController, CulturaController, IaController, ZonaTuristicaController

### Community 15 - "Categoria"
Cohesion: 0.09
Nodes (7): CulturaDtos, PublicacionRequest, PublicacionResponse, CulturaPublicacion, CulturaPublicacionRepository, CulturaService, CulturaServiceTests

### Community 16 - "abrir-admin/page.tsx"
Cohesion: 0.83
Nodes (3): AbrirAdmin(), b64u(), firmar()

### Community 19 - "useNegociosAdmin.ts"
Cohesion: 0.11
Nodes (35): FormEditarNegocio(), aNumero(), cuerpoFotoProducto(), cuerpoNegocio(), FiltroNegocios, FORM_VACIO, formDesdeDetalle(), FormNegocio (+27 more)

### Community 20 - "Mapa.tsx"
Cohesion: 0.07
Nodes (42): GET(), reversa(), VIEWBOX, FONDO_EMPRENDER, FONDO_MOTIVO, MOTIVO_TRAZO, RAZONES, SeccionTurismo() (+34 more)

### Community 21 - "PedidoDetalleResponse"
Cohesion: 0.24
Nodes (5): PedidoController, CambiarEstadoRequest, LineaResponse, PedidoDetalleResponse, PedidoDtos

### Community 22 - "ui-admin.tsx"
Cohesion: 0.14
Nodes (36): NegociosTabla(), PaginaPedidos(), ALCANCE, buscarCategoria(), COLUMNAS_CATEGORIAS, SeccionCategorias(), cerrar(), crear() (+28 more)

### Community 23 - "SeccionNegocios.tsx"
Cohesion: 0.08
Nodes (3): Categoria, CategoriaRepository, AlcanceCatalogoTests

### Community 24 - ".actualizarTextosInicio"
Cohesion: 0.10
Nodes (6): InicioController, ConfigTexto, ConfigTextoRepository, ConfigService, TypeReference<List<String>>, ConfigTextosTests

### Community 25 - "EditorGaleria"
Cohesion: 0.57
Nodes (7): EditorGaleria(), agregarPorUrl(), guardar(), lleno(), mover(), quitar(), subirArchivo()

### Community 26 - "dependencies"
Cohesion: 0.22
Nodes (9): leaflet, react-dom, @types/leaflet, dependencies, leaflet@^1.9.4, next@16.3.8, react@19.2.8, react-dom@19.2.8 (+1 more)

### Community 28 - "SeccionNegocios"
Cohesion: 0.17
Nodes (18): Cultura(), metadata, esFoto(), fechaCorta(), FeedCultura(), iniciales(), GaleriaCultura(), LightboxGaleria() (+10 more)

### Community 29 - "app/negocios/page.tsx"
Cohesion: 0.24
Nodes (4): PerfilRequest, UsuarioController, UsuarioResponse, UsuarioService

### Community 30 - "useSesion"
Cohesion: 0.11
Nodes (21): nextConfig, AdminLayout(), MenuPanel(), SECCIONES, DatosPerfil(), Direcciones(), agregar(), eliminar() (+13 more)

### Community 31 - "ItemPedido"
Cohesion: 0.16
Nodes (20): FichaMapa(), ListaNegocios(), Mensaje, soloDigitos(), TarjetaNegocioIa(), urlGoogleMaps(), StoreCard(), Chip() (+12 more)

### Community 32 - "SeccionZonas.tsx"
Cohesion: 0.07
Nodes (8): AdminActualizarRequest, UsuarioDtos, Rol, ADMIN, COMPRADOR, VENDEDOR, Usuario, UsuarioRepository

### Community 33 - "vitest"
Cohesion: 0.29
Nodes (4): @testing-library/react, vitest, @testing-library/react@^16.3.3, vitest@^5.0.3

### Community 34 - "PedidoService.java"
Cohesion: 0.15
Nodes (3): MetodoEntrega, DOMICILIO, RECOGER_EN_TIENDA

### Community 35 - "app/layout.tsx"
Cohesion: 0.10
Nodes (24): fraunces, manrope, metadata, plexMono, RootLayout(), viewport, AsistenteIaChat(), VideoFab() (+16 more)

### Community 36 - "ProductoRepository"
Cohesion: 0.15
Nodes (4): BusquedaDtos, ResultadoBusquedaResponse, ProductoRepository, BusquedaService

### Community 37 - "PedidoDtos.java"
Cohesion: 0.07
Nodes (7): CatalogoDtos, DireccionRequest, DireccionResponse, MetricasDtos, Direccion, DireccionRepository, CatalogoService

### Community 38 - ".actual"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 39 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, typecheck

### Community 40 - "CatalogoService"
Cohesion: 0.24
Nodes (3): CatalogoController, CategoriaRequest, CategoriaResponse

### Community 42 - "CatalogoController"
Cohesion: 0.12
Nodes (15): paths, key, sync, value, services, buildFilter, dockerContext, dockerfilePath (+7 more)

### Community 43 - "SeccionHeroInicio"
Cohesion: 0.39
Nodes (7): SeccionHeroInicio(), agregarPorUrl(), guardar(), lleno(), mover(), quitar(), subirArchivo()

### Community 44 - "SeccionHeroInicio"
Cohesion: 0.12
Nodes (7): EstadoPedido, CANCELADO, EN_CAMINO, EN_PREPARACION, ENTREGADO, PEDIDO_RECIBIDO, RECHAZADO

### Community 45 - "AdminPedidoTests"
Cohesion: 0.57
Nodes (3): CrearPedidoRequest, LineaRequest, AdminPedidoTests

### Community 46 - "SeccionCultura"
Cohesion: 0.14
Nodes (22): PaginaContenido(), buscarPublicacion(), COLUMNAS_CULTURA, fechaCorta(), hoy(), medioValido(), porFecha(), SeccionCultura() (+14 more)

### Community 48 - "org.junit.jupiter.api.Test"
Cohesion: 0.21
Nodes (11): devDependencies, husky@^9.1.7, lint-staged@^17.6.0, prettier@^3.9.10, scripts, prepare, test, typecheck (+3 more)

### Community 49 - "CurrentUserService"
Cohesion: 0.16
Nodes (7): AdminController, NegocioAdminResponse, NegocioAdminToggleRequest, PedidoRepository, AdminService, CurrentUserService, PedidoService

### Community 50 - "org.junit.jupiter.api.Test"
Cohesion: 0.12
Nodes (3): ZonaTuristicaTests, BusquedaServiceTests, IaAsistenteServiceTests

### Community 51 - "eslint"
Cohesion: 0.33
Nodes (5): eslint, eslint-config-next, eslintConfig, eslint@^9, eslint-config-next@16.3.8

### Community 53 - "tipos.ts"
Cohesion: 0.13
Nodes (23): react, Campo(), OPCIONES_PAGO, ETIQUETA_SIGUIENTE, SIGUIENTE, dibujo(), IconoCategoria(), TRAZO (+15 more)

### Community 54 - "IaAsistenteService.java"
Cohesion: 0.11
Nodes (5): Alcance, ChatResponse, IaDtos, NegocioIa, IaAsistenteService

### Community 55 - "tabla.ts"
Cohesion: 0.27
Nodes (9): ColumnaOrden, Direccion, filtrarYOrdenar(), normalizar(), Pagina, paginar(), COLUMNAS, Fila (+1 more)

### Community 56 - "buscar/page.tsx"
Cohesion: 0.11
Nodes (18): BuscarPagina(), Busqueda(), ControlZoom, { apiMock }, YUCA, CATEGORIAS_BUSQUEDA, PISTA_SIN_PRODUCTOS, SLUGS_ALCANCE (+10 more)

### Community 57 - "admin/negocios/page.tsx"
Cohesion: 0.29
Nodes (5): metadata, PASOS, PROMESAS, REQUISITOS, SECTORES

### Community 64 - "supabase.ts"
Cohesion: 0.40
Nodes (4): @supabase/supabase-js, @supabase/supabase-js@^2.117.2, SUPABASE_ANON_KEY, SUPABASE_URL

### Community 65 - "SeccionTextosInicio"
Cohesion: 0.60
Nodes (4): SeccionTextosInicio(), cerrar(), guardar(), valor()

### Community 66 - "MetodoPago"
Cohesion: 0.22
Nodes (5): MetodoPago, DAVIPLATA, EFECTIVO_CONTRA_ENTREGA, NEQUI, TRANSFERENCIA_BANCARIA

### Community 67 - "SeccionZonas.tsx"
Cohesion: 0.15
Nodes (16): EditorUbicacion(), moverPin(), traducirPin(), ubicarActual(), aNumero(), buscarZona(), COLUMNAS_ZONAS, MOTIVOS (+8 more)

## Knowledge Gaps
- **18 isolated node(s):** `ADMIN`, `COMPRADOR`, `VENDEDOR`, `DOMICILIO`, `RECOGER_EN_TIENDA` (+13 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 421 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Usuario` connect `SeccionZonas.tsx` to `PedidoService.java`, `PedidoDtos.java`, `NegocioService`, `AdminPedidoTests.java`, `org.springframework.transaction.annotation.Transactional`, `org.springframework.web.bind.annotation.GetMapping`, `ZonaTuristicaTests.java`, `AdminPedidoTests`, `UsuarioService`, `CurrentUserService`, `.actualizarTextosInicio`, `org.junit.jupiter.api.Test`, `SeccionNegocios.tsx`, `NegocioRepository`, `jakarta.persistence.Entity`, `app/negocios/page.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `ADMIN`, `COMPRADOR`, `VENDEDOR` to the rest of the system?**
  _18 weakly-connected nodes found - possible missing edges._
- **Should `apiConSesion` be split into smaller, more focused modules?**
  _Cohesion score 0.13008130081300814 - nodes in this community are weakly interconnected._
- **Why does `Negocio` connect `NegocioService` to `SeccionZonas.tsx`, `PedidoService.java`, `ProductoRepository`, `CulturaPublicacion`, `AdminPedidoTests.java`, `org.springframework.transaction.annotation.Transactional`, `ZonaTuristicaTests.java`, `CurrentUserService`, `org.junit.jupiter.api.Test`, `.actualizarTextosInicio`, `IaAsistenteService.java`, `SeccionNegocios.tsx`, `NegocioRepository`, `jakarta.persistence.Entity`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `JwtDecoderConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.05711263881544157 - nodes in this community are weakly interconnected._
- **Why does `react` connect `tipos.ts` to `apiConSesion`, `[slug]/page.tsx`, `frontend/package.json`, `EditorProductos.tsx`, `SeccionZonas.tsx`, `app/layout.tsx`, `next`, `SeccionCultura`, `abrir-admin/page.tsx`, `useNegociosAdmin.ts`, `Mapa.tsx`, `ui-admin.tsx`, `buscar/page.tsx`, `dependencies`, `SeccionNegocios`, `useSesion`, `ItemPedido`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._