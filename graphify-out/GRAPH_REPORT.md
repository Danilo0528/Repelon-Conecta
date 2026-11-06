# Graph Report - Proyecto Edwin  (2026-11-06)

## Corpus Check
- 176 files · ~105,423 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 13, .properties 3, .cmd 2)

## Summary
- 1571 nodes · 4596 edges · 74 communities (49 shown, 25 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 249 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `725808d7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SecurityConfig.java
- uuid
- [slug]/page.tsx
- app/page.tsx
- Negocio
- ZonaTuristica
- PedidoDtos.java
- CulturaPublicacion
- NegocioService
- CurrentUserService
- AdminController.java
- .actualizar
- org.springframework.web.bind.annotation.GetMapping
- ZonaTuristicaTests.java
- app/page.tsx
- Categoria
- next
- .actualizarTextosInicio
- SeccionPedidos.tsx
- perfil/page.tsx
- Producto
- .actualizar
- PedidoService
- SeccionNegocios.tsx
- buscar/page.tsx
- SeccionNegocios.tsx
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
- SeccionCategorias.tsx
- CatalogoService
- AdminPedidoTests.java
- CatalogoController
- services
- SeccionHeroInicio
- maps.ts
- ZonaTuristicaTests
- UsuarioService
- org.junit.jupiter.api.Test
- AlcanceCatalogoTests.java
- org.junit.jupiter.api.Test
- list
- ui.tsx
- IaAsistenteService.java
- .actual
- geocodificar.ts
- admin/negocios/page.tsx
- .guardarDireccion
- .metricasVendedor
- EditorGaleria
- ItemPedido
- WhatsappService
- ubicacion.ts
- tabla.ts
- MetodoPago
- SeccionZonas.tsx
- PedidoResponse
- AdminCategoriaTests
- inicio.ts
- AlcanceCatalogoTests
- Rol
- IconoCategoria.tsx

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
- `desactivar()` --calls--> `apiConSesion()`  [EXTRACTED]
  ReplonConecta/frontend/src/app/admin/SeccionCategorias.tsx → ReplonConecta/frontend/src/lib/api.ts
- `NegocioServiceTests` --references--> `NegocioService`  [EXTRACTED]
  ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/service/NegocioServiceTests.java → ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/service/NegocioService.java
- `NegocioDetalleResponse` --references--> `ProductoResponse`  [EXTRACTED]
  ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/dto/NegocioDtos.java → ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/dto/ProductoDtos.java
- `NegocioGaleriaTests` --references--> `UsuarioRepository`  [EXTRACTED]
  ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/service/NegocioGaleriaTests.java → ReplonConecta/ReplonConecta/src/main/java/com/repelonconecta/RepelonConecta/repository/UsuarioRepository.java

## Import Cycles
- None detected.

## Communities (74 total, 25 thin omitted)

### Community 0 - "SecurityConfig.java"
Cohesion: 0.11
Nodes (34): AdminLayout(), MenuPanel(), SECCIONES, HeroMetrica(), MetricaSecundaria(), PaginaResumen(), CarritoPagina(), Campo() (+26 more)

### Community 1 - "uuid"
Cohesion: 0.06
Nodes (3): SecurityConfig, ErrorResponse, GlobalExceptionHandler

### Community 2 - "[slug]/page.tsx"
Cohesion: 0.13
Nodes (18): BuscarPagina(), Busqueda(), ControlZoom, { apiMock }, YUCA, DIAS_HORARIO, Ficha(), FichaNegocio() (+10 more)

### Community 3 - "app/page.tsx"
Cohesion: 0.05
Nodes (47): eslint, eslint-config-next, jsdom, leaflet, react-dom, @supabase/supabase-js, tailwindcss, @tailwindcss/postcss (+39 more)

### Community 4 - "Negocio"
Cohesion: 0.19
Nodes (9): PedidoController, CambiarEstadoRequest, CrearPedidoRequest, LineaRequest, LineaResponse, PedidoDetalleResponse, PedidoDtos, PedidoService (+1 more)

### Community 5 - "ZonaTuristica"
Cohesion: 0.06
Nodes (6): ZonaRequest, ZonaResponse, ZonaTuristica, TypeReference<List<String>>, ZonaTuristicaService, TypeReference<List<String>>

### Community 6 - "PedidoDtos.java"
Cohesion: 0.14
Nodes (3): CulturaDtos, ProductoDtos, ZonaDtos

### Community 7 - "CulturaPublicacion"
Cohesion: 0.07
Nodes (4): Producto, UnidadProducto, KILO, LIBRA

### Community 9 - "CurrentUserService"
Cohesion: 0.07
Nodes (17): NegocioController, MetricasAdminResponse, MetricasDtos, MetricasVendedorResponse, NegocioResponse, CategoriaRepository, DireccionRepository, NegocioRepository (+9 more)

### Community 10 - "AdminController.java"
Cohesion: 0.14
Nodes (16): fraunces, manrope, metadata, plexMono, RootLayout(), viewport, Blobs(), PieConecta() (+8 more)

### Community 11 - ".actualizar"
Cohesion: 0.10
Nodes (7): NegocioDetalleResponse, NegocioUpdateRequest, RegistroNegocioRequest, TypeReference<List<String>>, WhatsappService, NegocioGaleriaTests, NegocioServiceTests

### Community 12 - "org.springframework.web.bind.annotation.GetMapping"
Cohesion: 0.15
Nodes (7): AdminController, BusquedaController, CulturaController, IaController, InicioController, ProductoController, ZonaTuristicaController

### Community 13 - "ZonaTuristicaTests.java"
Cohesion: 0.05
Nodes (4): MetodoEntrega, DOMICILIO, RECOGER_EN_TIENDA, Pedido

### Community 14 - "app/page.tsx"
Cohesion: 0.15
Nodes (16): ControlZoom, FONDO_EMPRENDER, FONDO_MOTIVO, Inicio(), MOTIVO_TRAZO, RAZONES, SliderTurismo(), creditoImagen() (+8 more)

### Community 15 - "Categoria"
Cohesion: 0.09
Nodes (6): PublicacionRequest, PublicacionResponse, CulturaPublicacion, CulturaPublicacionRepository, CulturaService, CulturaServiceTests

### Community 16 - "next"
Cohesion: 0.12
Nodes (14): next, nextConfig, AbrirAdmin(), b64u(), firmar(), BarraNavegacion(), ENLACES, BuscadorNav() (+6 more)

### Community 19 - "perfil/page.tsx"
Cohesion: 0.31
Nodes (8): DatosPerfil(), Direcciones(), agregar(), eliminar(), recargar(), PanelRol(), Perfil(), Direccion

### Community 20 - "Producto"
Cohesion: 0.30
Nodes (12): encuadrar(), iconoDe(), mapaBase(), MapaMini(), MapaNegocios(), MapaSelector(), Marcador, NegocioMapa (+4 more)

### Community 22 - "PedidoService"
Cohesion: 0.15
Nodes (23): PaginaPedidos(), ANULABLES, buscarPedido(), COLOR_ESTADO, COLUMNAS_PEDIDOS, ESTADOS, SeccionPedidos(), buscarUsuario() (+15 more)

### Community 25 - "SeccionNegocios.tsx"
Cohesion: 0.12
Nodes (27): CampoUrlImagen(), EditorGaleria(), agregarPorUrl(), guardar(), lleno(), mover(), quitar(), subirArchivo() (+19 more)

### Community 26 - "tipos.ts"
Cohesion: 0.14
Nodes (19): ETIQUETA_SIGUIENTE, FormularioProducto(), SIGUIENTE, Carrito, ContextoCarrito, ResultadoAgregar, ValorCarrito, ETIQUETA_ENTREGA (+11 more)

### Community 28 - "SeccionNegocios"
Cohesion: 0.18
Nodes (18): react, Cultura(), metadata, esFoto(), fechaCorta(), FeedCultura(), iniciales(), GaleriaCultura() (+10 more)

### Community 29 - "app/negocios/page.tsx"
Cohesion: 0.24
Nodes (4): PerfilRequest, UsuarioController, UsuarioResponse, UsuarioService

### Community 30 - ".emparejarNegocios"
Cohesion: 0.14
Nodes (18): aNumero(), cuerpoFotoProducto(), SeccionNegocios(), abrirCrear(), abrirEditar(), actualizarFotoProducto(), aplicarLogo(), cargarDetalle() (+10 more)

### Community 31 - "ItemPedido"
Cohesion: 0.12
Nodes (25): ListaNegocios(), FichaMapa(), AsistenteIaChat(), Mensaje, soloDigitos(), TarjetaNegocioIa(), urlGoogleMaps(), VideoFab() (+17 more)

### Community 33 - "EditorUbicacion"
Cohesion: 0.47
Nodes (4): EditorUbicacion(), moverPin(), traducirPin(), ubicarActual()

### Community 34 - "tipos.ts"
Cohesion: 0.21
Nodes (15): buscarPublicacion(), COLUMNAS_CULTURA, fechaCorta(), hoy(), medioValido(), porFecha(), SeccionCultura(), cerrarVentana() (+7 more)

### Community 35 - "list"
Cohesion: 0.21
Nodes (4): ChatResponse, IaDtos, NegocioIa, IaAsistenteService

### Community 36 - "template.sh"
Cohesion: 0.17
Nodes (3): ResultadoBusquedaResponse, BusquedaService, BusquedaServiceTests

### Community 38 - ".actual"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 39 - "SeccionCategorias.tsx"
Cohesion: 0.17
Nodes (16): PaginaContenido(), ALCANCE, buscarCategoria(), COLUMNAS_CATEGORIAS, SeccionCategorias(), cerrar(), crear(), desactivar() (+8 more)

### Community 40 - "CatalogoService"
Cohesion: 0.18
Nodes (5): CatalogoController, CategoriaRequest, CatalogoDtos, CategoriaResponse, DireccionRequest

### Community 42 - "CatalogoController"
Cohesion: 0.12
Nodes (15): paths, key, sync, value, services, buildFilter, dockerContext, dockerfilePath (+7 more)

### Community 43 - "services"
Cohesion: 0.39
Nodes (7): SeccionHeroInicio(), agregarPorUrl(), guardar(), lleno(), mover(), quitar(), subirArchivo()

### Community 44 - "SeccionHeroInicio"
Cohesion: 0.12
Nodes (7): EstadoPedido, CANCELADO, EN_CAMINO, EN_PREPARACION, ENTREGADO, PEDIDO_RECIBIDO, RECHAZADO

### Community 45 - "maps.ts"
Cohesion: 0.24
Nodes (10): VentanaLugar(), GOOGLE_MAPS_API_KEY, mapasGoogleConfigurado, direccionDe(), enlaceGoogleMaps(), enlaceRutaDesde(), iconoMarcador(), MotivoFalloMapas (+2 more)

### Community 48 - "org.junit.jupiter.api.Test"
Cohesion: 0.21
Nodes (11): devDependencies, husky@^9.1.7, lint-staged@^17.6.0, prettier@^3.9.10, scripts, prepare, test, typecheck (+3 more)

### Community 49 - "AlcanceCatalogoTests.java"
Cohesion: 0.12
Nodes (5): NegocioAdminResponse, NegocioAdminToggleRequest, NegocioDtos, AdminActualizarRequest, UsuarioDtos

### Community 53 - "ui.tsx"
Cohesion: 0.11
Nodes (14): @testing-library/react, vitest, FILTROS, NegociosConFiltro(), PaginaNegocios(), FiltroNegocios, writeText, FOTOS (+6 more)

### Community 54 - "IaAsistenteService.java"
Cohesion: 0.10
Nodes (4): Alcance, BusquedaDtos, ConfigTextoRepository, ConfigService

### Community 56 - "geocodificar.ts"
Cohesion: 0.29
Nodes (9): Cache, ConDireccion, consultaDe(), consultar(), guardarCache(), leerCache(), Pendiente, Punto (+1 more)

### Community 57 - "admin/negocios/page.tsx"
Cohesion: 0.29
Nodes (5): metadata, PASOS, PROMESAS, REQUISITOS, SECTORES

### Community 64 - "ubicacion.ts"
Cohesion: 0.21
Nodes (10): GET(), reversa(), VIEWBOX, CENTRO_REPELON, CENTRO, Guardado, guardar(), leerGuardado() (+2 more)

### Community 65 - "tabla.ts"
Cohesion: 0.25
Nodes (12): ColumnaOrden, Direccion, filtrarYOrdenar(), normalizar(), Pagina, paginar(), COLUMNAS, Fila (+4 more)

### Community 66 - "MetodoPago"
Cohesion: 0.22
Nodes (5): MetodoPago, DAVIPLATA, EFECTIVO_CONTRA_ENTREGA, NEQUI, TRANSFERENCIA_BANCARIA

### Community 67 - "SeccionZonas.tsx"
Cohesion: 0.19
Nodes (15): aNumero(), buscarZona(), COLUMNAS_ZONAS, MOTIVOS, SeccionZonas(), cerrarVentana(), coordenadasValidas(), eliminar() (+7 more)

### Community 70 - "inicio.ts"
Cohesion: 0.29
Nodes (6): CLAVE_IMAGENES_HERO, ClaveTextoInicio, IMAGENES_HERO_POR_DEFECTO, imagenesInicio(), TEXTO_INICIO, textoInicio()

### Community 72 - "Rol"
Cohesion: 0.33
Nodes (4): Rol, ADMIN, COMPRADOR, VENDEDOR

### Community 73 - "IconoCategoria.tsx"
Cohesion: 0.67
Nodes (3): dibujo(), IconoCategoria(), TRAZO

## Knowledge Gaps
- **18 isolated node(s):** `DOMICILIO`, `RECOGER_EN_TIENDA`, `DAVIPLATA`, `EFECTIVO_CONTRA_ENTREGA`, `NEQUI` (+13 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 431 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Usuario` connect `SeccionZonas.tsx` to `Negocio`, `NegocioService`, `CurrentUserService`, `.actualizar`, `org.springframework.web.bind.annotation.GetMapping`, `ZonaTuristicaTests.java`, `.actualizarTextosInicio`, `.actualizar`, `jakarta.persistence.Entity`, `app/negocios/page.tsx`, `template.sh`, `PedidoDtos.java`, `AdminPedidoTests.java`, `UsuarioService`, `AlcanceCatalogoTests.java`, `list`, `IaAsistenteService.java`, `.actual`, `.guardarDireccion`, `AlcanceCatalogoTests`, `Rol`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `DOMICILIO`, `RECOGER_EN_TIENDA`, `DAVIPLATA` to the rest of the system?**
  _18 weakly-connected nodes found - possible missing edges._
- **Should `SecurityConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.10621942697414395 - nodes in this community are weakly interconnected._
- **Why does `Negocio` connect `NegocioService` to `SeccionZonas.tsx`, `list`, `template.sh`, `CulturaPublicacion`, `AlcanceCatalogoTests`, `AdminPedidoTests.java`, `CurrentUserService`, `.actualizar`, `ZonaTuristicaTests.java`, `AlcanceCatalogoTests.java`, `org.junit.jupiter.api.Test`, `list`, `.actualizar`, `IaAsistenteService.java`, `SeccionNegocios.tsx`, `jakarta.persistence.Entity`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `uuid` be split into smaller, more focused modules?**
  _Cohesion score 0.05858585858585859 - nodes in this community are weakly interconnected._
- **Why does `Pedido` connect `ZonaTuristicaTests.java` to `SeccionZonas.tsx`, `MetodoPago`, `PedidoResponse`, `Negocio`, `NegocioService`, `CurrentUserService`, `SeccionHeroInicio`, `list`, `jakarta.persistence.Entity`, `ItemPedido`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13227513227513227 - nodes in this community are weakly interconnected._