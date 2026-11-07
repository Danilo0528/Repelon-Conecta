# Especificaciones funcionales

> Generado desde los tests por `npm run docs:gen`. No editar a mano.
> Cada test es la especificación ejecutable; este archivo solo las indexa.

Total: **115** tests (35 frontend, 80 backend).

## Frontend

### `ReplonConecta/frontend/src/app/admin/tabla.test.ts`

- recorta, pasa a minúsculas y quita tildes
- sin texto ni campo devuelve una copia sin mutar la original
- filtra sin importar mayúsculas ni tildes
- ordena números como números, no como texto
- invierte con dirección desc
- ordena texto con collation española
- trata null como texto vacío
- ignora un campo de orden desconocido
- recorta a la página pedida
- corrige una página fuera de rango
- con lista vacía devuelve 0–0 pero una página
- evita división por cero usando una fila por página

### `ReplonConecta/frontend/src/app/buscar/page.test.tsx`

- al escribir consulta llama a /api/buscar con la q y pinta el resultado
- el chip de categoría agrega el parámetro categoria a la llamada
- sin resultados muestra el mensaje amigable

### `ReplonConecta/frontend/src/components/BotonNumero.test.tsx`

- no pinta nada si el negocio no tiene teléfono
- oculta el número hasta que piden mostrarlo
- limpia el formato del teléfono para el enlace tel:
- copia el número al portapapeles y lo confirma

### `ReplonConecta/frontend/src/components/LightboxGaleria.test.tsx`

- muestra la foto seleccionada y el contador
- avanza con el botón Siguiente
- retrocede con el botón Anterior (con vuelta)
- cierra con el botón Cerrar
- cierra con Escape
- muestra el crédito cuando la foto lo tiene

### `ReplonConecta/frontend/src/components/SliderTurismo.test.tsx`

- pasa a la siguiente foto mientras el cursor está encima

### `ReplonConecta/frontend/src/components/ui.test.tsx`

- sin URL muestra el placeholder de sin foto
- si la URL se cae, cambia al placeholder en vez de dejar la imagen rota
- si cambia la foto vuelve a intentar con la nueva

### `ReplonConecta/frontend/src/lib/compras.test.ts`

- con COMPRAS_ACTIVAS=false, /carrito, /checkout y /pedidos redirigen al inicio

### `ReplonConecta/frontend/src/lib/imagenes.test.ts`

- reconoce el oficio por el nombre
- si no reconoce el oficio usa la tienda genérica
- sin logo cae en la foto del oficio
- con logo usa el logo (absoluto o ruta local)
- un logo que no es URL (texto suelto) no se pinta como imagen

## Backend

### `ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/RepelonConectaApplicationTests.java`

- contextLoads

### `ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/controller/AdminCategoriaTests.java`

- crearListarYDesactivarComoAdmin
- sinRolAdminNoLista
- sinSesionNoSeCrea

### `ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/controller/BusquedaControllerTests.java`

- buscaSinSesionYNegocioEnLaMismaRespuesta
- consultaVaciaRespondeElCatalogoDelAlcance

### `ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/controller/ZonaTuristicaTests.java`

- publicoListaLasZonasDelSeedSinSesion
- adminCreaEditaYBorra
- coordenadasIncompletasSeRechazan
- adminGuardaHastaCuatroImagenesYRechazaUnaQuinta
- sinRolAdminNoCrea
- sinSesionNoSeCrea
- nombreVacioSeRechaza

### `ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/service/AdminCuentaTests.java`

- listarTodosTraeCuentasYExigeAdmin
- sinRolAdminNoSeLista
- cambiaRolDeOtroSinTocarElActivo
- desactivaUnaCuenta
- elAdminNoSeTocaASiMismo
- usuarioInexistenteEs404
- sinSesionNoHayLista

### `ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/service/AdminPedidoTests.java`

- El admin ve el pedido global y cancelarlo devuelve el stock
- sinRolAdminNoHayListadoGlobal
- unCompradorNoAnulaPedidosAjenos

### `ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/service/AlcanceCatalogoTests.java`

- laSemillaSoloTraeLasTresFamilias
- todoProductoDelCatalogoTieneUnidad
- elListadoPublicoOcultaLosRubrosFueraDeAlcance

### `ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/service/BusquedaServiceTests.java`

- encuentraYucaConUnidadYNegocio
- ignoraNumerosYUnidadesDeLaConsulta
- todosLosTokensTienenQueAparecer
- noDevuelveRubrosFueraDeAlcance
- categoriaFueraDelAlcanceDevuelveVacio
- barrioAcotaLosResultados
- consultaVaciaDevuelveTodoElAlcance
- semillaTraeLasUnidadesCorrectas
- excluyeNegociosNoAprobados
- tokensQuitanNumerosYPalabrasVacias

### `ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/service/ConfigTextosTests.java`

- guardaLeeYRestauraPorDefecto
- claveFueraDeLaListaBlancaEs400
- sinRolAdminNoGuarda
- cuerpoVacioEs400
- valorDemasiadoLargoEs400
- listarSoloDevuelveClavesConocidas
- guardaLeeYRestauraLasImagenesDelHero
- imagenesDelHeroRechazanJsonRoto
- imagenesDelHeroRechazanEsquemasQueElNavegadorNoCarga
- imagenesDelHeroNoPasanDeDiez

### `ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/service/CulturaServiceTests.java`

- crearRecortaYConvierteCamposVaciosEnNulo
- elFeedOrdenaPorFechaMasRecientePrimero
- actualizarCambiaLosCamposYConservaElId
- eliminarBorraLaPublicacion
- actualizarOEliminarUnaPublicacionInexistenteDevuelve404
- laFotoAceptaUrlORutaPeroRechazaOtraCosa
- elVideoAceptaUrlOIdDeYouTubePeroRechazaTextoLibre

### `ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/service/IaAsistenteServiceTests.java`

- encuentraElNegocioQueElTextoMenciona
- noLeImportanLasTildesNiLasMayusculas
- conDosNombresEncoladosPrefiereElMasLargo
- cuandoNadaCoincideNoHayTarjetas
- noPasaDeTresTarjetas
- textoVacioONuloNoDevuelveNada
- sinCandidatosNoDevuelveNada
- unNegocioSinNombreNoSeConsidera

### `ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/service/NegocioGaleriaTests.java`

- guardaLaGaleriaEnOrdenYLaDevuelveEnElDetalle
- listaVaciaBorraTodasLasFotos
- sinImagenesNoTocaLaGaleria
- recortaQuitaHuecosYRepetidas
- losCreditosSiguenASuFotoCuandoSeDescartaUnaRepetida
- rellenaConVaciosCuandoFaltanCreditos
- aceptaRutaRelativaPeroRechazaOtrosEsquemas
- elDuenoDeOtroNegocioNoPuedeCambiarla
- negocioSinGaleriaDevuelveListaVacia

### `ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/service/NegocioServiceTests.java`

- registrarHaceVendedorAlCompradorYDejaElNegocioVisible
- buscarCombinaTextoBarrioYAbierto
- actualizarSoloCambiaLosCamposInformados
- actualizarRechazaCoordenadasIncompletasOFueraDeRango
- actualizarRechazaDejarElTelefonoEnBlanco
- unNegocioPendienteSoloLoVenSuDuenoYElAdmin
- miNegocioYElInterruptorDeAbierto
- sinSesionNoSePuedeRegistrarUnNegocio

### `ReplonConecta/ReplonConecta/src/test/java/com/repelonconecta/RepelonConecta/service/PedidoServiceTests.java`

- Un pedido no puede mezclar productos de dos negocios
- El comprador no puede cancelar un pedido que ya esta en camino
