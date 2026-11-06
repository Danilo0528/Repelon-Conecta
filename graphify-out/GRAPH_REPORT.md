# Graph Report - Proyecto Edwin  (2026-11-06)

## Corpus Check
- 214 files · ~141,468 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 12, .properties 3, .cmd 2)

## Summary
- 1733 nodes · 4550 edges · 109 communities (84 shown, 25 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 211 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `32c82d92`
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
- CurrentUserService
- package.json
- org.springframework.transaction.annotation.Transactional
- .actualVendedorOAdmin
- admin/negocios/page.tsx
- MetodoPago
- .metricasVendedor
- EditorGaleria
- fondo-emprender/page.tsx
- WhatsappService
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- MetodoEntrega
- RepelonConectaApplication.java
- interface
- interface
- interface
- hitl-loop.template.sh
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- interface
- block-dangerous-git.sh
- postcss.config.mjs
- com.repelonconecta:RepelonConecta

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
- `SeedData` --references--> `ZonaTuristicaRepository`  [EXTRACTED]
  ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/config/SeedData.java → ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/repository/ZonaTuristicaRepository.java
- `ZonaTuristicaRepository` --references--> `ZonaTuristica`  [EXTRACTED]
  ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/repository/ZonaTuristicaRepository.java → ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/entity/ZonaTuristica.java
- `ZonaTuristicaService` --references--> `ZonaTuristicaRepository`  [EXTRACTED]
  ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/service/ZonaTuristicaService.java → ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/repository/ZonaTuristicaRepository.java
- `BusquedaController` --references--> `BusquedaService`  [EXTRACTED]
  ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/controller/BusquedaController.java → ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/service/BusquedaService.java

## Import Cycles
- None detected.

## Communities (109 total, 25 thin omitted)

### Community 0 - "SecurityConfig.java"
Cohesion: 0.06
Nodes (3): SecurityConfig, ErrorResponse, GlobalExceptionHandler

### Community 1 - "uuid"
Cohesion: 0.08
Nodes (4): Alcance, BusquedaDtos, ProductoDtos, ZonaTuristicaRepository

### Community 2 - "frontend/package.json"
Cohesion: 0.05
Nodes (47): eslint, eslint-config-next, jsdom, leaflet, react-dom, @supabase/supabase-js, tailwindcss, @tailwindcss/postcss (+39 more)

### Community 3 - "app/page.tsx"
Cohesion: 0.07
Nodes (39): ControlZoom, FONDO_EMPRENDER, FONDO_MOTIVO, Inicio(), MOTIVO_TRAZO, RAZONES, VentanaLugar(), dibujo() (+31 more)

### Community 5 - "ZonaTuristica"
Cohesion: 0.07
Nodes (5): ZonaRequest, ZonaResponse, ZonaTuristica, ZonaTuristicaService, TypeReference<List<String>>

### Community 6 - "useDatos"
Cohesion: 0.14
Nodes (27): HeroMetrica(), MetricaSecundaria(), PaginaResumen(), CarritoPagina(), DetallePedido(), MisPedidos(), ETIQUETA_SIGUIENTE, FormularioProducto() (+19 more)

### Community 7 - "CulturaPublicacion"
Cohesion: 0.10
Nodes (6): CulturaDtos, PublicacionRequest, PublicacionResponse, CulturaPublicacion, CulturaPublicacionRepository, CulturaService

### Community 8 - "NegocioService"
Cohesion: 0.12
Nodes (9): CategoriaRepository, DireccionRepository, NegocioRepository, PedidoRepository, ProductoRepository, CatalogoService, NegocioService, ProductoService (+1 more)

### Community 9 - "Usuario"
Cohesion: 0.08
Nodes (6): Rol, ADMIN, COMPRADOR, VENDEDOR, Usuario, UsuarioRepository

### Community 10 - "AdminController.java"
Cohesion: 0.18
Nodes (4): BusquedaController, IaController, InicioController, ProductoController

### Community 11 - "ui.tsx"
Cohesion: 0.11
Nodes (24): react, AdminLayout(), MenuPanel(), SECCIONES, Entrar(), FormularioEntrar(), DatosPerfil(), Direcciones() (+16 more)

### Community 13 - "ZonaTuristicaTests.java"
Cohesion: 0.13
Nodes (3): AdminCategoriaTests, BusquedaControllerTests, RepelonConectaApplicationTests

### Community 14 - "app/layout.tsx"
Cohesion: 0.11
Nodes (22): fraunces, manrope, metadata, plexMono, RootLayout(), viewport, BarraNavegacion(), ENLACES (+14 more)

### Community 17 - ".actualizarTextosInicio"
Cohesion: 0.13
Nodes (5): ConfigTexto, ConfigTextoRepository, ConfigService, TypeReference<List<String>>, ConfigTextosTests

### Community 18 - "SeccionPedidos.tsx"
Cohesion: 0.17
Nodes (24): PaginaPedidos(), ALCANCE, SeccionCategorias(), cerrar(), crear(), ANULABLES, COLOR_ESTADO, ESTADOS (+16 more)

### Community 19 - "Mapa.tsx"
Cohesion: 0.13
Nodes (26): GET(), reversa(), VIEWBOX, encuadrar(), iconoDe(), mapaBase(), MapaMini(), MapaNegocios() (+18 more)

### Community 20 - "Producto"
Cohesion: 0.07
Nodes (4): Producto, UnidadProducto, KILO, LIBRA

### Community 21 - ".actualizar"
Cohesion: 0.19
Nodes (5): NegocioDetalleResponse, NegocioUpdateRequest, RegistroNegocioRequest, TypeReference<List<String>>, NegocioGaleriaTests

### Community 22 - "PedidoService"
Cohesion: 0.17
Nodes (8): CambiarEstadoRequest, CrearPedidoRequest, LineaRequest, LineaResponse, PedidoDetalleResponse, PedidoDtos, PedidoService, AdminPedidoTests

### Community 23 - "SeccionNegocios.tsx"
Cohesion: 0.16
Nodes (17): CampoUrlImagen(), Resultado, UbicacionEditada, FORM_VACIO, FormNegocio, CAMPOS, BTN_PRIMARIO, BTN_SECUNDARIO (+9 more)

### Community 24 - "buscar/page.tsx"
Cohesion: 0.12
Nodes (14): @testing-library/react, vitest, BuscarPagina(), Busqueda(), ControlZoom, { apiMock }, YUCA, writeText (+6 more)

### Community 25 - "FeedCultura.tsx"
Cohesion: 0.17
Nodes (18): Cultura(), metadata, esFoto(), fechaCorta(), FeedCultura(), iniciales(), GaleriaCultura(), LightboxGaleria() (+10 more)

### Community 26 - "[slug]/page.tsx"
Cohesion: 0.12
Nodes (12): next, nextConfig, DIAS_HORARIO, Ficha(), FichaNegocio(), Horario(), BotonNumero(), GaleriaNegocio() (+4 more)

### Community 28 - "SeccionNegocios"
Cohesion: 0.13
Nodes (19): desactivar(), aNumero(), cuerpoFotoProducto(), SeccionNegocios(), abrirCrear(), abrirEditar(), actualizarFotoProducto(), aplicarLogo() (+11 more)

### Community 29 - "app/negocios/page.tsx"
Cohesion: 0.19
Nodes (17): ListaNegocios(), FichaMapa(), AsistenteIaChat(), Mensaje, soloDigitos(), TarjetaNegocioIa(), urlGoogleMaps(), VideoFab() (+9 more)

### Community 30 - ".emparejarNegocios"
Cohesion: 0.15
Nodes (5): ChatResponse, IaDtos, NegocioIa, IaAsistenteService, IaAsistenteServiceTests

### Community 32 - "SeccionZonas.tsx"
Cohesion: 0.16
Nodes (16): EditorUbicacion(), moverPin(), traducirPin(), ubicarActual(), aNumero(), MOTIVOS, SeccionZonas(), cerrarVentana() (+8 more)

### Community 33 - "SeccionCultura.tsx"
Cohesion: 0.18
Nodes (18): fechaCorta(), hoy(), medioValido(), porFecha(), SeccionCultura(), cerrarVentana(), eliminar(), guardar() (+10 more)

### Community 34 - "tipos.ts"
Cohesion: 0.15
Nodes (17): Campo(), Checkout(), OPCIONES_PAGO, Carrito, ContextoCarrito, ResultadoAgregar, useCarrito(), ValorCarrito (+9 more)

### Community 35 - "AdminController"
Cohesion: 0.17
Nodes (7): AdminController, NegocioAdminResponse, NegocioAdminToggleRequest, NegocioDtos, AdminActualizarRequest, UsuarioDtos, AdminService

### Community 36 - "template.sh"
Cohesion: 0.23
Nodes (17): ask(), ask_secret(), banner(), _clear(), _existing(), finish(), note(), open_url() (+9 more)

### Community 39 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 40 - ".buscar"
Cohesion: 0.18
Nodes (3): ResultadoBusquedaResponse, BusquedaService, BusquedaServiceTests

### Community 42 - "CatalogoController"
Cohesion: 0.15
Nodes (7): CatalogoController, CategoriaRequest, CatalogoDtos, CategoriaResponse, DireccionRequest, MetricasAdminResponse, MetricasDtos

### Community 43 - "services"
Cohesion: 0.12
Nodes (15): paths, key, sync, value, services, buildFilter, dockerContext, dockerfilePath (+7 more)

### Community 44 - "SeccionHeroInicio"
Cohesion: 0.21
Nodes (12): PaginaContenido(), SeccionHeroInicio(), agregarPorUrl(), guardar(), lleno(), mover(), quitar(), subirArchivo() (+4 more)

### Community 45 - "EstadoPedido"
Cohesion: 0.12
Nodes (7): EstadoPedido, CANCELADO, EN_CAMINO, EN_PREPARACION, ENTREGADO, PEDIDO_RECIBIDO, RECHAZADO

### Community 47 - "UsuarioService"
Cohesion: 0.30
Nodes (4): PerfilRequest, UsuarioController, UsuarioResponse, UsuarioService

### Community 50 - "api.ts"
Cohesion: 0.23
Nodes (10): api(), apiJson(), ErrorApi, Opciones, tokenActual(), API_URL, SUPABASE_ANON_KEY, SUPABASE_BUCKET (+2 more)

### Community 52 - "CurrentUserService"
Cohesion: 0.26
Nodes (4): CulturaController, PedidoController, ZonaTuristicaController, CurrentUserService

### Community 53 - "package.json"
Cohesion: 0.21
Nodes (11): devDependencies, husky@^9.1.7, lint-staged@^17.6.0, prettier@^3.9.10, scripts, prepare, test, typecheck (+3 more)

### Community 57 - "admin/negocios/page.tsx"
Cohesion: 0.28
Nodes (7): AbrirAdmin(), b64u(), firmar(), FILTROS, NegociosConFiltro(), PaginaNegocios(), FiltroNegocios

### Community 58 - "MetodoPago"
Cohesion: 0.22
Nodes (5): MetodoPago, DAVIPLATA, EFECTIVO_CONTRA_ENTREGA, NEQUI, TRANSFERENCIA_BANCARIA

### Community 60 - "EditorGaleria"
Cohesion: 0.57
Nodes (7): EditorGaleria(), agregarPorUrl(), guardar(), lleno(), mover(), quitar(), subirArchivo()

### Community 61 - "fondo-emprender/page.tsx"
Cohesion: 0.29
Nodes (5): metadata, PASOS, PROMESAS, REQUISITOS, SECTORES

### Community 63 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 64 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 65 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 66 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 67 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 68 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 69 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 70 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 71 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 72 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 73 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 74 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 75 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 76 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 77 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 78 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 79 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 80 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 81 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 82 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 83 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 84 - "interface"
Cohesion: 0.33
Nodes (5): interface, display_name, short_description, policy, allow_implicit_invocation

### Community 86 - "MetodoEntrega"
Cohesion: 0.33
Nodes (3): MetodoEntrega, DOMICILIO, RECOGER_EN_TIENDA

### Community 88 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 89 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 90 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 91 - "hitl-loop.template.sh"
Cohesion: 0.83
Nodes (3): capture(), hitl-loop.template.sh script, step()

### Community 92 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 93 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 94 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 95 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 96 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 97 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 98 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 99 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 100 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 101 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 102 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

### Community 103 - "interface"
Cohesion: 0.50
Nodes (3): interface, display_name, short_description

## Knowledge Gaps
- **18 isolated node(s):** `com.repelonconecta:RepelonConecta`, `KILO`, `LIBRA`, `CANCELADO`, `EN_CAMINO` (+13 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 539 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Negocio` connect `Negocio` to `uuid`, `AdminController`, `.actual`, `NegocioService`, `Usuario`, `Pedido`, `SeedData.java`, `Categoria`, `Producto`, `.actualizar`, `jakarta.persistence.Entity`, `.emparejarNegocios`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `com.repelonconecta:RepelonConecta`, `KILO`, `LIBRA` to the rest of the system?**
  _18 weakly-connected nodes found - possible missing edges._
- **Should `SecurityConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.05589225589225589 - nodes in this community are weakly interconnected._
- **Why does `Usuario` connect `Usuario` to `uuid`, `Negocio`, `NegocioService`, `AdminController.java`, `Pedido`, `Categoria`, `Direccion`, `.actualizar`, `PedidoService`, `jakarta.persistence.Entity`, `AdminController`, `.actual`, `AdminPedidoTests.java`, `SeedData.java`, `UsuarioService`, `org.springframework.web.bind.annotation.GetMapping`, `AdminCuentaTests`, `CurrentUserService`, `.actualVendedorOAdmin`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `uuid` be split into smaller, more focused modules?**
  _Cohesion score 0.07918367346938776 - nodes in this community are weakly interconnected._
- **Why does `Pedido` connect `Pedido` to `uuid`, `Negocio`, `NegocioService`, `Usuario`, `EstadoPedido`, `MetodoEntrega`, `org.springframework.transaction.annotation.Transactional`, `PedidoService`, `MetodoPago`, `jakarta.persistence.Entity`, `ItemPedido`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05442176870748299 - nodes in this community are weakly interconnected._