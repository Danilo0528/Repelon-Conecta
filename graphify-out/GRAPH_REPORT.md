# Graph Report - Proyecto Edwin  (2026-11-06)

## Corpus Check
- 197 files · ~109,644 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 13, .properties 3, .cmd 2)

## Summary
- 1659 nodes · 4927 edges · 71 communities (49 shown, 22 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 267 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3a1764ee`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- apiConSesion
- JwtDecoderConfig.java
- useInicio.ts
- frontend/package.json
- EditorProductos.tsx
- ZonaTuristica
- CulturaPublicacion
- NegocioService
- NegocioRepository
- app/page.tsx
- org.springframework.transaction.annotation.Transactional
- org.springframework.web.bind.annotation.GetMapping
- ZonaTuristicaTests.java
- PedidoResponse
- Categoria
- abrir-admin/page.tsx
- .actualizarTextosInicio
- SeccionPedidos.tsx
- useNegociosAdmin
- Mapa.tsx
- PedidoDetalleResponse
- ui-admin.tsx
- SeccionNegocios.tsx
- .actualizarTextosInicio
- EditorGaleria
- VentanaLugar.tsx
- jakarta.persistence.Entity
- SeccionNegocios
- app/negocios/page.tsx
- useSesion
- react
- SeccionZonas.tsx
- ConfigTexto
- WhatsappService
- app/layout.tsx
- PedidoDtos.java
- .actual
- .actual
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
- ZonaTuristicaTests
- tipos.ts
- IaController.java
- AdminCategoriaTests
- buscar/page.tsx
- admin/negocios/page.tsx
- uuid
- .metricasVendedor
- EditorGaleria
- ItemPedido
- WhatsappService
- env.ts
- SeccionTextosInicio
- MetodoPago
- SeccionZonas.tsx
- EditorUbicacion
- admin/negocios/page.tsx

## God Nodes (most connected - your core abstractions)
1. `Negocio` - 91 edges
2. `Pedido` - 64 edges
3. `Producto` - 60 edges
4. `Usuario` - 57 edges
5. `react` - 52 edges
6. `NegocioService` - 45 edges
7. `CurrentUserService` - 44 edges
8. `apiConSesion()` - 41 edges
9. `useDatos()` - 40 edges
10. `Aviso()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `FormEditarNegocio()` --calls--> `crearProducto()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/FormEditarNegocio.tsx → ReplonConecta/frontend/src/app/admin/useNegociosAdmin.ts
- `NegociosTabla()` --calls--> `cambiarEstado()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/NegociosTabla.tsx → ReplonConecta/frontend/src/app/admin/useNegociosAdmin.ts
- `eliminar()` --calls--> `apiConSesion()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/useNegociosAdmin.ts → ReplonConecta/frontend/src/lib/api.ts
- `desactivar()` --calls--> `apiConSesion()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/SeccionCategorias.tsx → ReplonConecta/frontend/src/lib/api.ts
- `guardar()` --indirect_call--> `fecha()`  [INFERRED]
  ReplonConecta/frontend/src/app/admin/SeccionCultura.tsx → ReplonConecta/frontend/src/lib/format.ts

## Import Cycles
- None detected.

## Communities (71 total, 22 thin omitted)

### Community 0 - "apiConSesion"
Cohesion: 0.14
Nodes (29): HeroMetrica(), MetricaSecundaria(), PaginaResumen(), Campo(), Checkout(), DetallePedido(), MisPedidos(), ETIQUETA_SIGUIENTE (+21 more)

### Community 1 - "JwtDecoderConfig.java"
Cohesion: 0.06
Nodes (6): CorsConfig, JwtAuthoritiesConfig, JwtDecoderConfig, SecurityConfig, ErrorResponse, GlobalExceptionHandler

### Community 2 - "useInicio.ts"
Cohesion: 0.12
Nodes (25): ControlZoom, useInicio(), api(), tokenActual(), creditoImagen(), CREDITOS_IMAGENES, Cache, conCoordenadas() (+17 more)

### Community 3 - "frontend/package.json"
Cohesion: 0.05
Nodes (49): eslint, eslint-config-next, jsdom, leaflet, react-dom, @supabase/supabase-js, tailwindcss, @tailwindcss/postcss (+41 more)

### Community 4 - "EditorProductos.tsx"
Cohesion: 0.13
Nodes (28): CampoUrlImagen(), EditorLogoNegocio(), EditorProductos(), Resultado, UbicacionEditada, Campo, FormDatosNegocio(), FormEditarNegocio() (+20 more)

### Community 5 - "ZonaTuristica"
Cohesion: 0.06
Nodes (8): ZonaDtos, ZonaRequest, ZonaResponse, ZonaTuristica, Galeria, ZonaTuristicaService, TypeReference<List<String>>, TypeReference<List<String>>

### Community 9 - "NegocioRepository"
Cohesion: 0.10
Nodes (11): MetricasAdminResponse, MetricasDtos, MetricasVendedorResponse, NegocioAdminResponse, NegocioAdminToggleRequest, DireccionRepository, NegocioRepository, PedidoRepository (+3 more)

### Community 10 - "app/page.tsx"
Cohesion: 0.38
Nodes (6): SeccionComercios(), SeccionFondo(), SeccionMapa(), SeccionRazones(), InicioState, Inicio()

### Community 11 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.06
Nodes (16): ProductoController, NegocioDetalleResponse, NegocioResponse, NegocioUpdateRequest, RegistroNegocioRequest, ProductoDtos, ProductoRequest, ProductoResponse (+8 more)

### Community 12 - "org.springframework.web.bind.annotation.GetMapping"
Cohesion: 0.20
Nodes (3): BusquedaController, InicioController, NegocioController

### Community 13 - "ZonaTuristicaTests.java"
Cohesion: 0.06
Nodes (4): MetodoEntrega, DOMICILIO, RECOGER_EN_TIENDA, Pedido

### Community 15 - "Categoria"
Cohesion: 0.09
Nodes (6): CulturaDtos, PublicacionRequest, PublicacionResponse, CulturaPublicacion, CulturaService, CulturaServiceTests

### Community 16 - "abrir-admin/page.tsx"
Cohesion: 0.83
Nodes (3): AbrirAdmin(), b64u(), firmar()

### Community 19 - "useNegociosAdmin"
Cohesion: 0.18
Nodes (17): formDesdeDetalle(), useNegociosAdmin(), abrirCrear(), abrirEditar(), actualizarFotoProducto(), aplicarLogo(), cambiarEstado(), cargarDetalle() (+9 more)

### Community 20 - "Mapa.tsx"
Cohesion: 0.21
Nodes (17): encuadrar(), iconoDe(), mapaBase(), MapaMini(), MapaNegocios(), MapaSelector(), Marcador, NegocioMapa (+9 more)

### Community 21 - "PedidoDetalleResponse"
Cohesion: 0.23
Nodes (6): PedidoController, CambiarEstadoRequest, LineaResponse, PedidoDetalleResponse, PedidoDtos, PedidoService

### Community 22 - "ui-admin.tsx"
Cohesion: 0.11
Nodes (44): NegociosTabla(), PaginaPedidos(), ALCANCE, buscarCategoria(), COLUMNAS_CATEGORIAS, SeccionCategorias(), cerrar(), crear() (+36 more)

### Community 23 - "SeccionNegocios.tsx"
Cohesion: 0.08
Nodes (3): Categoria, CategoriaRepository, AlcanceCatalogoTests

### Community 24 - ".actualizarTextosInicio"
Cohesion: 0.20
Nodes (4): ConfigService, TypeReference<List<String>>, TypeReference<List<String>>, ConfigTextosTests

### Community 25 - "EditorGaleria"
Cohesion: 0.50
Nodes (8): EditorGaleria(), agregarPorUrl(), cambiarCredito(), guardar(), lleno(), mover(), quitar(), subirArchivo()

### Community 26 - "VentanaLugar.tsx"
Cohesion: 0.17
Nodes (14): FONDO_EMPRENDER, FONDO_MOTIVO, MOTIVO_TRAZO, RAZONES, SeccionTurismo(), VentanaLugar(), SliderTurismo(), enlaceGoogleMaps() (+6 more)

### Community 27 - "jakarta.persistence.Entity"
Cohesion: 0.18
Nodes (5): BusquedaDtos, ResultadoBusquedaResponse, UnidadProducto, KILO, LIBRA

### Community 28 - "SeccionNegocios"
Cohesion: 0.17
Nodes (18): Cultura(), metadata, esFoto(), fechaCorta(), FeedCultura(), iniciales(), GaleriaCultura(), LightboxGaleria() (+10 more)

### Community 29 - "app/negocios/page.tsx"
Cohesion: 0.14
Nodes (7): AdminController, PerfilRequest, UsuarioController, AdminActualizarRequest, UsuarioDtos, UsuarioResponse, UsuarioService

### Community 30 - "useSesion"
Cohesion: 0.09
Nodes (25): AdminLayout(), MenuPanel(), SECCIONES, Entrar(), FormularioEntrar(), DatosPerfil(), Direcciones(), agregar() (+17 more)

### Community 31 - "react"
Cohesion: 0.15
Nodes (28): react, FichaMapa(), ListaNegocios(), DIAS_HORARIO, Ficha(), FichaNegocio(), Horario(), Mensaje (+20 more)

### Community 32 - "SeccionZonas.tsx"
Cohesion: 0.07
Nodes (6): NegocioDtos, Rol, ADMIN, COMPRADOR, VENDEDOR, Usuario

### Community 35 - "app/layout.tsx"
Cohesion: 0.07
Nodes (30): next, nextConfig, CarritoPagina(), fraunces, manrope, metadata, plexMono, RootLayout() (+22 more)

### Community 38 - ".actual"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 40 - "CatalogoService"
Cohesion: 0.21
Nodes (5): CatalogoController, CategoriaRequest, CatalogoDtos, CategoriaResponse, DireccionRequest

### Community 41 - "AdminPedidoTests.java"
Cohesion: 0.18
Nodes (3): SeedData, UsuarioRepository, ZonaTuristicaRepository

### Community 42 - "CatalogoController"
Cohesion: 0.12
Nodes (15): paths, key, sync, value, services, buildFilter, dockerContext, dockerfilePath (+7 more)

### Community 43 - "SeccionHeroInicio"
Cohesion: 0.36
Nodes (8): SeccionHeroInicio(), agregarPorUrl(), cambiarCredito(), guardar(), lleno(), mover(), quitar(), subirArchivo()

### Community 44 - "SeccionHeroInicio"
Cohesion: 0.12
Nodes (7): EstadoPedido, CANCELADO, EN_CAMINO, EN_PREPARACION, ENTREGADO, PEDIDO_RECIBIDO, RECHAZADO

### Community 45 - "AdminPedidoTests"
Cohesion: 0.47
Nodes (3): CrearPedidoRequest, LineaRequest, AdminPedidoTests

### Community 46 - "SeccionCultura"
Cohesion: 0.14
Nodes (22): PaginaContenido(), buscarPublicacion(), COLUMNAS_CULTURA, fechaCorta(), hoy(), medioValido(), porFecha(), SeccionCultura() (+14 more)

### Community 48 - "org.junit.jupiter.api.Test"
Cohesion: 0.21
Nodes (11): devDependencies, husky@^9.1.7, lint-staged@^17.6.0, prettier@^3.9.10, scripts, prepare, test, typecheck (+3 more)

### Community 49 - "CurrentUserService"
Cohesion: 0.17
Nodes (3): CulturaController, ZonaTuristicaController, CurrentUserService

### Community 50 - "org.junit.jupiter.api.Test"
Cohesion: 0.14
Nodes (3): BusquedaService, BusquedaServiceTests, IaAsistenteServiceTests

### Community 53 - "tipos.ts"
Cohesion: 0.16
Nodes (17): OPCIONES_PAGO, CLASE_BOTON_AZUL_ANCHO, CLASE_BOTON_AZUL_CONTORNO_ANCHO, CLASE_BOTON_VERDE, CLASE_ESTADO, ETIQUETA_ENTREGA, ETIQUETA_ESTADO, Direccion (+9 more)

### Community 54 - "IaController.java"
Cohesion: 0.24
Nodes (5): IaController, ChatResponse, IaDtos, NegocioIa, IaAsistenteService

### Community 56 - "buscar/page.tsx"
Cohesion: 0.12
Nodes (17): BuscarPagina(), Busqueda(), ControlZoom, { apiMock }, YUCA, SeccionHero(), dibujo(), IconoCategoria() (+9 more)

### Community 57 - "admin/negocios/page.tsx"
Cohesion: 0.29
Nodes (5): metadata, PASOS, PROMESAS, REQUISITOS, SECTORES

### Community 64 - "env.ts"
Cohesion: 0.14
Nodes (16): GET(), reversa(), VIEWBOX, API_URL, CENTRO_REPELON, GOOGLE_MAPS_API_KEY, mapasGoogleConfigurado, SUPABASE_ANON_KEY (+8 more)

### Community 65 - "SeccionTextosInicio"
Cohesion: 0.32
Nodes (6): CAMPOS, SeccionTextosInicio(), cerrar(), guardar(), valor(), TARJETA

### Community 66 - "MetodoPago"
Cohesion: 0.25
Nodes (5): MetodoPago, DAVIPLATA, EFECTIVO_CONTRA_ENTREGA, NEQUI, TRANSFERENCIA_BANCARIA

### Community 67 - "SeccionZonas.tsx"
Cohesion: 0.20
Nodes (14): aNumero(), buscarZona(), COLUMNAS_ZONAS, MOTIVOS, SeccionZonas(), cerrarVentana(), coordenadasValidas(), eliminar() (+6 more)

### Community 68 - "EditorUbicacion"
Cohesion: 0.47
Nodes (4): EditorUbicacion(), moverPin(), traducirPin(), ubicarActual()

### Community 69 - "admin/negocios/page.tsx"
Cohesion: 0.60
Nodes (4): FILTROS, NegociosConFiltro(), PaginaNegocios(), SeccionNegocios()

## Knowledge Gaps
- **18 isolated node(s):** `ADMIN`, `COMPRADOR`, `VENDEDOR`, `DOMICILIO`, `RECOGER_EN_TIENDA` (+13 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 433 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Negocio` connect `NegocioService` to `SeccionZonas.tsx`, `org.springframework.transaction.annotation.Transactional`, `Usuario`, `CulturaPublicacion`, `AdminPedidoTests.java`, `NegocioRepository`, `org.springframework.transaction.annotation.Transactional`, `ZonaTuristicaTests.java`, `.actualizarTextosInicio`, `org.junit.jupiter.api.Test`, `IaController.java`, `SeccionNegocios.tsx`, `uuid`, `jakarta.persistence.Entity`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `ADMIN`, `COMPRADOR`, `VENDEDOR` to the rest of the system?**
  _18 weakly-connected nodes found - possible missing edges._
- **Should `apiConSesion` be split into smaller, more focused modules?**
  _Cohesion score 0.14396456256921372 - nodes in this community are weakly interconnected._
- **Why does `Usuario` connect `SeccionZonas.tsx` to `org.springframework.transaction.annotation.Transactional`, `PedidoDtos.java`, `.actual`, `AdminPedidoTests.java`, `NegocioRepository`, `org.springframework.transaction.annotation.Transactional`, `org.springframework.web.bind.annotation.GetMapping`, `ZonaTuristicaTests.java`, `AdminPedidoTests`, `UsuarioService`, `CurrentUserService`, `.actualizarTextosInicio`, `org.junit.jupiter.api.Test`, `PedidoDetalleResponse`, `SeccionNegocios.tsx`, `uuid`, `jakarta.persistence.Entity`, `app/negocios/page.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `JwtDecoderConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.05792349726775956 - nodes in this community are weakly interconnected._
- **Why does `Pedido` connect `ZonaTuristicaTests.java` to `SeccionZonas.tsx`, `MetodoPago`, `org.springframework.transaction.annotation.Transactional`, `NegocioService`, `NegocioRepository`, `SeccionHeroInicio`, `AdminPedidoTests`, `PedidoResponse`, `PedidoDetalleResponse`, `uuid`, `jakarta.persistence.Entity`, `ItemPedido`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `useInicio.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12413793103448276 - nodes in this community are weakly interconnected._