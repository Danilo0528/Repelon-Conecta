# Graph Report - Proyecto Edwin  (2026-11-06)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1514 nodes · 4349 edges · 64 communities (42 shown, 22 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 211 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8fe34b9d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SecurityConfig.java
- uuid
- frontend/package.json
- app/page.tsx
- Negocio
- ZonaTuristica
- useDatos
- CulturaPublicacion
- NegocioService
- Usuario
- AdminController.java
- ui.tsx
- Pedido
- ZonaTuristicaTests.java
- app/layout.tsx
- Categoria
- Direccion
- .actualizarTextosInicio
- SeccionPedidos.tsx
- Mapa.tsx
- Producto
- .actualizar
- PedidoService
- SeccionNegocios.tsx
- buscar/page.tsx
- FeedCultura.tsx
- [slug]/page.tsx
- SeccionNegocios
- app/negocios/page.tsx
- .emparejarNegocios
- ItemPedido
- SeccionZonas.tsx
- SeccionCultura.tsx
- tipos.ts
- AdminController
- template.sh
- PedidoDtos.java
- .actual
- compilerOptions
- .buscar
- AdminPedidoTests.java
- CatalogoController
- services
- SeccionHeroInicio
- EstadoPedido
- SeedData.java
- UsuarioService
- org.junit.jupiter.api.Test
- org.springframework.web.bind.annotation.GetMapping
- api.ts
- AdminCuentaTests
- package.json
- org.springframework.transaction.annotation.Transactional
- .actualVendedorOAdmin
- mvnw
- admin/negocios/page.tsx
- MetodoPago
- .metricasVendedor
- EditorGaleria
- WhatsappService

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
- `ValorCarrito` --references--> `Producto`  [EXTRACTED]
  ReplonConecta/frontend/src/context/CarritoContext.tsx → ReplonConecta/frontend/src/lib/tipos.ts
- `guardar()` --indirect_call--> `fecha()`  [INFERRED]
  ReplonConecta/frontend/src/app/admin/SeccionCultura.tsx → ReplonConecta/frontend/src/lib/format.ts
- `NegocioDetalleResponse` --references--> `ProductoResponse`  [EXTRACTED]
  ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/dto/NegocioDtos.java → ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/dto/ProductoDtos.java
- `NegocioGaleriaTests` --references--> `UsuarioRepository`  [EXTRACTED]
  ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/service/NegocioGaleriaTests.java → ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/repository/UsuarioRepository.java
- `NegocioGaleriaTests` --references--> `NegocioService`  [EXTRACTED]
  ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/service/NegocioGaleriaTests.java → ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/service/NegocioService.java

## Import Cycles
- None detected.

## Communities (64 total, 22 thin omitted)

### Community 0 - "SecurityConfig.java"
Cohesion: 0.10
Nodes (43): FILTROS, NegociosConFiltro(), PaginaNegocios(), HeroMetrica(), MetricaSecundaria(), PaginaResumen(), FiltroNegocios, CarritoPagina() (+35 more)

### Community 1 - "uuid"
Cohesion: 0.06
Nodes (3): SecurityConfig, ErrorResponse, GlobalExceptionHandler

### Community 2 - "frontend/package.json"
Cohesion: 0.07
Nodes (33): react, @testing-library/react, vitest, BuscarPagina(), Busqueda(), ControlZoom, { apiMock }, YUCA (+25 more)

### Community 3 - "app/page.tsx"
Cohesion: 0.05
Nodes (47): eslint, eslint-config-next, jsdom, leaflet, react-dom, @supabase/supabase-js, tailwindcss, @tailwindcss/postcss (+39 more)

### Community 4 - "Negocio"
Cohesion: 0.08
Nodes (14): CambiarEstadoRequest, CrearPedidoRequest, LineaRequest, LineaResponse, PedidoDetalleResponse, PedidoDtos, PedidoResponse, MetodoPago (+6 more)

### Community 5 - "ZonaTuristica"
Cohesion: 0.07
Nodes (6): ZonaDtos, ZonaRequest, ZonaResponse, ZonaTuristica, ZonaTuristicaService, TypeReference<List<String>>

### Community 6 - "useDatos"
Cohesion: 0.10
Nodes (5): Alcance, CulturaDtos, ProductoDtos, CulturaPublicacionRepository, ZonaTuristicaRepository

### Community 9 - "Usuario"
Cohesion: 0.12
Nodes (10): NegocioDtos, CategoriaRepository, DireccionRepository, NegocioRepository, PedidoRepository, ProductoRepository, UsuarioRepository, AdminService (+2 more)

### Community 10 - "AdminController.java"
Cohesion: 0.09
Nodes (27): fraunces, manrope, metadata, plexMono, RootLayout(), viewport, BarraNavegacion(), ENLACES (+19 more)

### Community 11 - "ui.tsx"
Cohesion: 0.12
Nodes (6): NegocioDetalleResponse, NegocioUpdateRequest, RegistroNegocioRequest, TypeReference<List<String>>, WhatsappService, NegocioGaleriaTests

### Community 12 - "Pedido"
Cohesion: 0.19
Nodes (5): BusquedaController, CulturaController, IaController, ZonaTuristicaController, UsuarioDtos

### Community 14 - "app/layout.tsx"
Cohesion: 0.10
Nodes (29): ControlZoom, FONDO_EMPRENDER, FONDO_MOTIVO, Inicio(), MOTIVO_TRAZO, RAZONES, VentanaLugar(), dibujo() (+21 more)

### Community 15 - "Categoria"
Cohesion: 0.11
Nodes (4): PublicacionRequest, PublicacionResponse, CulturaPublicacion, CulturaService

### Community 16 - "Direccion"
Cohesion: 0.12
Nodes (5): NegocioController, PedidoController, NegocioResponse, CurrentUserService, NegocioService

### Community 17 - ".actualizarTextosInicio"
Cohesion: 0.13
Nodes (5): Rol, ADMIN, COMPRADOR, VENDEDOR, RepelonConectaApplicationTests

### Community 19 - "Mapa.tsx"
Cohesion: 0.12
Nodes (19): AdminLayout(), MenuPanel(), SECCIONES, Entrar(), FormularioEntrar(), Registro(), Cifra(), FormularioNegocio() (+11 more)

### Community 20 - "Producto"
Cohesion: 0.13
Nodes (26): GET(), reversa(), VIEWBOX, encuadrar(), iconoDe(), mapaBase(), MapaMini(), MapaNegocios() (+18 more)

### Community 21 - ".actualizar"
Cohesion: 0.18
Nodes (4): ProductoController, ProductoRequest, ProductoResponse, ProductoService

### Community 22 - "PedidoService"
Cohesion: 0.18
Nodes (23): PaginaPedidos(), ALCANCE, SeccionCategorias(), cerrar(), crear(), ANULABLES, COLOR_ESTADO, ESTADOS (+15 more)

### Community 24 - "buscar/page.tsx"
Cohesion: 0.15
Nodes (3): ConfigTexto, ConfigTextoRepository, ConfigTextosTests

### Community 25 - "FeedCultura.tsx"
Cohesion: 0.16
Nodes (17): CampoUrlImagen(), Resultado, UbicacionEditada, FORM_VACIO, FormNegocio, CAMPOS, BTN_PRIMARIO, BTN_SECUNDARIO (+9 more)

### Community 26 - "[slug]/page.tsx"
Cohesion: 0.12
Nodes (13): next, nextConfig, AbrirAdmin(), b64u(), firmar(), DatosPerfil(), Direcciones(), agregar() (+5 more)

### Community 28 - "SeccionNegocios"
Cohesion: 0.19
Nodes (17): Cultura(), metadata, esFoto(), fechaCorta(), FeedCultura(), iniciales(), GaleriaCultura(), LightboxGaleria() (+9 more)

### Community 29 - "app/negocios/page.tsx"
Cohesion: 0.17
Nodes (6): AdminController, PerfilRequest, UsuarioController, AdminActualizarRequest, UsuarioResponse, UsuarioService

### Community 30 - ".emparejarNegocios"
Cohesion: 0.13
Nodes (19): desactivar(), aNumero(), cuerpoFotoProducto(), SeccionNegocios(), abrirCrear(), abrirEditar(), actualizarFotoProducto(), aplicarLogo() (+11 more)

### Community 31 - "ItemPedido"
Cohesion: 0.19
Nodes (17): ListaNegocios(), FichaMapa(), AsistenteIaChat(), Mensaje, soloDigitos(), TarjetaNegocioIa(), urlGoogleMaps(), VideoFab() (+9 more)

### Community 33 - "SeccionCultura.tsx"
Cohesion: 0.16
Nodes (16): EditorUbicacion(), moverPin(), traducirPin(), ubicarActual(), aNumero(), MOTIVOS, SeccionZonas(), cerrarVentana() (+8 more)

### Community 34 - "tipos.ts"
Cohesion: 0.18
Nodes (18): fechaCorta(), hoy(), medioValido(), porFecha(), SeccionCultura(), cerrarVentana(), eliminar(), guardar() (+10 more)

### Community 35 - "AdminController"
Cohesion: 0.13
Nodes (4): ChatResponse, IaDtos, NegocioIa, IaAsistenteService

### Community 38 - ".actual"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 39 - "compilerOptions"
Cohesion: 0.14
Nodes (5): BusquedaDtos, ResultadoBusquedaResponse, UnidadProducto, KILO, LIBRA

### Community 40 - ".buscar"
Cohesion: 0.17
Nodes (5): CatalogoController, CategoriaRequest, CatalogoDtos, CategoriaResponse, DireccionRequest

### Community 42 - "CatalogoController"
Cohesion: 0.12
Nodes (15): paths, key, sync, value, services, buildFilter, dockerContext, dockerfilePath (+7 more)

### Community 43 - "services"
Cohesion: 0.21
Nodes (12): PaginaContenido(), SeccionHeroInicio(), agregarPorUrl(), guardar(), lleno(), mover(), quitar(), subirArchivo() (+4 more)

### Community 44 - "SeccionHeroInicio"
Cohesion: 0.12
Nodes (7): EstadoPedido, CANCELADO, EN_CAMINO, EN_PREPARACION, ENTREGADO, PEDIDO_RECIBIDO, RECHAZADO

### Community 45 - "EstadoPedido"
Cohesion: 0.19
Nodes (3): MetricasAdminResponse, MetricasDtos, MetricasVendedorResponse

### Community 46 - "SeedData.java"
Cohesion: 0.23
Nodes (10): api(), apiJson(), ErrorApi, Opciones, tokenActual(), API_URL, SUPABASE_ANON_KEY, SUPABASE_BUCKET (+2 more)

### Community 48 - "org.junit.jupiter.api.Test"
Cohesion: 0.21
Nodes (11): devDependencies, husky@^9.1.7, lint-staged@^17.6.0, prettier@^3.9.10, scripts, prepare, test, typecheck (+3 more)

### Community 54 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.25
Nodes (3): InicioController, ConfigService, TypeReference<List<String>>

### Community 56 - "mvnw"
Cohesion: 0.57
Nodes (7): EditorGaleria(), agregarPorUrl(), guardar(), lleno(), mover(), quitar(), subirArchivo()

### Community 57 - "admin/negocios/page.tsx"
Cohesion: 0.29
Nodes (5): metadata, PASOS, PROMESAS, REQUISITOS, SECTORES

### Community 58 - "MetodoPago"
Cohesion: 0.33
Nodes (3): MetodoEntrega, DOMICILIO, RECOGER_EN_TIENDA

## Knowledge Gaps
- **18 isolated node(s):** `ADMIN`, `COMPRADOR`, `VENDEDOR`, `KILO`, `LIBRA` (+13 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 423 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Usuario` connect `SeccionZonas.tsx` to `Negocio`, `useDatos`, `NegocioService`, `Usuario`, `ui.tsx`, `Pedido`, `ZonaTuristicaTests.java`, `Direccion`, `.actualizarTextosInicio`, `.actualizar`, `SeccionNegocios.tsx`, `jakarta.persistence.Entity`, `app/negocios/page.tsx`, `template.sh`, `PedidoDtos.java`, `compilerOptions`, `.buscar`, `AdminPedidoTests.java`, `UsuarioService`, `package.json`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `ADMIN`, `COMPRADOR`, `VENDEDOR` to the rest of the system?**
  _18 weakly-connected nodes found - possible missing edges._
- **Should `SecurityConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.09739866908650938 - nodes in this community are weakly interconnected._
- **Why does `Negocio` connect `NegocioService` to `SeccionZonas.tsx`, `AdminController`, `template.sh`, `useDatos`, `CulturaPublicacion`, `compilerOptions`, `AdminPedidoTests.java`, `Usuario`, `ui.tsx`, `ZonaTuristicaTests.java`, `Direccion`, `org.springframework.web.bind.annotation.GetMapping`, `api.ts`, `.actualizar`, `SeccionNegocios.tsx`, `jakarta.persistence.Entity`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `uuid` be split into smaller, more focused modules?**
  _Cohesion score 0.057329462989840346 - nodes in this community are weakly interconnected._
- **Why does `Pedido` connect `ZonaTuristicaTests.java` to `SeccionZonas.tsx`, `Negocio`, `useDatos`, `CulturaPublicacion`, `NegocioService`, `Usuario`, `.buscar`, `SeccionHeroInicio`, `MetodoPago`, `jakarta.persistence.Entity`, `fondo-emprender/page.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07239819004524888 - nodes in this community are weakly interconnected._